import express from "express";
import { getCareerAdvice } from "../controllers/careerController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// POST /api/career/query
router.post("/query", protect, getCareerAdvice);

export default router;
