import bcrypt from 'bcryptjs';
import generateToken from '../utils/tokenGenerator.js';
import pkg from '@prisma/client';

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

        res.status(201).json({
        message: 'User registered successfully',
        user: { id: newUser.id, username: newUser.username, email: newUser.email },
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
        user: { id: user.id, username: user.username, email: user.email },
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
        select: { id: true, username: true, email: true },
        });

        res.json(updatedUser);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};
