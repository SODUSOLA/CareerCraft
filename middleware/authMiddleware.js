import jwt from 'jsonwebtoken';

import pkg from '@prisma/client';
const { PrismaClient } = pkg;
const prisma = new PrismaClient();


export const protect = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
        token = req.headers.authorization.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        console.log('Decoded JWT payload:', decoded);

        // Lookup user by ID from decoded token
        const user = await prisma.user.findUnique({
            where: { id: decoded.id },
        });

        if (!user) {
            return res.status(401).json({ message: 'User not found' });
        }

        // Attach user to request (without password)
        req.user = {
            id: user.id,
            username: user.username,
            email: user.email,
        };

        next();
        } catch (err) {
        console.error(err);
        res.status(401).json({ message: 'Not authorized, token failed' });
        }
    } else {
        res.status(401).json({ message: 'Not authorized, no token' });
    }
};
