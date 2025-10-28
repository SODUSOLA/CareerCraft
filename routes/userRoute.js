import express from 'express';
import {protect} from '../middleware/authMiddleware.js';
import { registerUser, loginUser, getUserProfile, updateUserProfile, forgotPassword, resetPassword, changePassword } from '../controllers/userController.js';
import { validateRequest, registerSchema, loginSchema, forgotPasswordSchema, resetPasswordSchema, changePasswordSchema } from '../middleware/validationMiddleware.js';
const router = express.Router();


// POST /api/users
router.post('/register', validateRequest(registerSchema), registerUser);
router.post('/login', validateRequest(loginSchema), loginUser);
router.post('/forgot-password', validateRequest(forgotPasswordSchema), forgotPassword);
router.post('/reset-password', validateRequest(resetPasswordSchema), resetPassword);
router.put('/change-password', protect, validateRequest(changePasswordSchema), changePassword);
router.get('/me', protect, getUserProfile);
router.put('/me', protect, updateUserProfile);

export default router;
