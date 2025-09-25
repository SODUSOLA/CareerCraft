import express from "express";
import pkg from "@prisma/client";
import { generateCareerAdvice } from "../services/aiService.js";

const { PrismaClient } = pkg;
const prisma = new PrismaClient();
const router = express.Router();

// POST /api/careers/query
router.post("/query", async (req, res) => {
    const { userId, query } = req.body;

    if (!query) {
        return res.status(400).json({ message: "Query is required" });
    }

    try {
        // Get AI response
        const aiResponse = await generateCareerAdvice(query);

        // Save query & response in DB
        const log = await prisma.careerLog.create({
        data: {
            userId: userId || null,
            query,
            response: aiResponse.text || JSON.stringify(aiResponse),
        },
        });

        res.status(200).json({
        message: "Career advice generated",
        advice: aiResponse.text,
        logId: log.id,
        });
    } catch (error) {
        console.error("Career advice error:", error);
        res.status(500).json({
        message: "Error generating advice",
        error: error.message,
        });
    }
});

export default router;
