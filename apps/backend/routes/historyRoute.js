import express from 'express';
import { getCareerHistory, deleteCareerHistory, getChatHistory, deleteChatHistory, getAllHistory, } from '../controllers/historyController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Get history for the authenticated user
router.get('/career', protect, getCareerHistory); // return career advice history
router.delete('/career/:id', protect, deleteCareerHistory); // delete career advice history

router.get('/chat', protect, getChatHistory); // return user chat history
router.delete('/chat/:id', protect, deleteChatHistory); // delete user chat history

router.get('/all', protect, getAllHistory); // return (chat + career advice) history

export default router;
