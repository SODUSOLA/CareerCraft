import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { handleChat } from '../controllers/chatController.js';

const router = express.Router();

// route for chatbot interactions
router.post('/', protect, handleChat); // Start new chat
router.post('/:sessionId', protect, handleChat); // Continue previous chat

export default router;
