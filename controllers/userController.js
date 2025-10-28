import bcrypt from 'bcryptjs';
import generateToken from '../utils/tokenGenerator.js';
import pkg from '@prisma/client';
import { sendWelcomeEmail, sendResetCodeEmail } from '../services/emailService.js';

const { PrismaClient } = pkg;
const prisma = new PrismaClient();

//-------------------------
// POST /api/users/register
//-------------------------
export const registerUser = async (req, res) => {
    const { username, email, password } = req.body;
    try {
        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) return res.status(400).json({ message: 'User already exists' });

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await prisma.user.create({
        data: { username, email, password: hashedPassword },
        });

        const token = generateToken(newUser.id);

        // Send welcome email
        try {
            await sendWelcomeEmail(email, username);
        } catch (emailError) {
            console.error('Failed to send welcome email:', emailError);
            // Don't fail registration if email fails
        }

        res.status(201).json({
        message: 'User registered successfully',
        user: { 
            id: newUser.id, 
            username: newUser.username, 
            email: newUser.email 
        },
        token,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

//-----------------------
// POST /api/users/login
//-----------------------
export const loginUser = async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: 'Please provide email and password' });

    try {
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) return res.status(400).json({ message: 'Invalid email' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: 'Invalid password' });

        const token = generateToken(user.id);

        res.status(200).json({
        message: 'Login successful',
        user: { 
            id: user.id, 
            username: user.username, 
            email: user.email 
        },
        token,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

//-------------------
// GET /api/users/me
//-------------------
export const getUserProfile = async (req, res) => {
  try {
        const user = await prisma.user.findUnique({
        where: { id: req.user.id },
        select: { id: true, username: true, email: true },
        });

        if (!user) return res.status(404).json({ message: 'User not found' });

        res.json(user);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

//--------------------
// PUT /api/users/me
//--------------------
export const updateUserProfile = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        const updatedData = { username, email };

        if (password) updatedData.password = await bcrypt.hash(password, 10);

        const updatedUser = await prisma.user.update({
        where: { id: req.user.id },
        data: updatedData,
        select: { 
            id: true, 
            username: true, 
            email: true 
        },
        });

        res.json(updatedUser);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

//---------------------------
// POST /api/users/forgot-password
//---------------------------
export const forgotPassword = async (req, res) => {
    const { email } = req.body;
    try {
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) return res.status(404).json({ message: 'User not found' });

        // Generate 6-digit reset code
        const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
        const resetTokenExpiry = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

        await prisma.user.update({
            where: { id: user.id },
            data: { resetToken: resetCode, resetTokenExpiry },
        });

        // Send reset code email
        try {
            await sendResetCodeEmail(email, resetCode);
        } catch (emailError) {
            console.error('Failed to send reset code email:', emailError);
            return res.status(500).json({ message: 'Failed to send reset email' });
        }

        res.json({ message: 'Reset code sent to your email' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

//---------------------------
// POST /api/users/reset-password
//---------------------------
export const resetPassword = async (req, res) => {
    const { email, resetCode, newPassword } = req.body;
    try {
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) return res.status(404).json({ message: 'User not found' });

        if (!user.resetToken || user.resetToken !== resetCode) {
            return res.status(400).json({ message: 'Invalid reset code' });
        }

        if (!user.resetTokenExpiry || user.resetTokenExpiry < new Date()) {
            return res.status(400).json({ message: 'Reset code expired' });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);

        await prisma.user.update({
            where: { id: user.id },
            data: {
                password: hashedPassword,
                resetToken: null,
                resetTokenExpiry: null,
            },
        });

        res.json({ message: 'Password reset successfully. Please log in again.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

//---------------------------
// PUT /api/users/change-password
//---------------------------
export const changePassword = async (req, res) => {
    const { oldPassword, newPassword } = req.body;
    try {
        const user = await prisma.user.findUnique({ where: { id: req.user.id } });
        if (!user) return res.status(404).json({ message: 'User not found' });

        const isMatch = await bcrypt.compare(oldPassword, user.password);
        if (!isMatch) return res.status(400).json({ message: 'Old password is incorrect' });

        const hashedPassword = await bcrypt.hash(newPassword, 10);

        await prisma.user.update({
            where: { id: req.user.id },
            data: { password: hashedPassword },
        });

        res.json({ message: 'Password changed successfully. Please log in again' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};
