import { PrismaClient } from '@prisma/client';
import { generateCareerAdvice } from "../services/aiService.js";

const prisma = new PrismaClient();

export const getCareerAdvice = async (req, res) => {
    const { query } = req.body;
    const userId = req.user?.id; // Get userId from authenticated user

    if (!query) {
        return res.status(400).json({ message: "Query is required" });
    }

    try {
        const redisKey = `career:query:${query.toLowerCase()}`;
        let aiResponse;

        // Try cache first
        const cachedResponse = await redisClient.get(redisKey);
        if (cachedResponse) {
            aiResponse = JSON.parse(cachedResponse);
            console.log("Career advice served from Redis cache");
        } else {
            // Otherwise generate and cache
            aiResponse = await generateCareerAdvice(query);
            await redisClient.set(redisKey, JSON.stringify(aiResponse), { EX: 3600 }); // cache 1 hour
            console.log("Career advice generated and cached");
        }
        // Save query & response in DB
        const log = await prisma.careerLog.create({
            data: {
                userId: userId || null,
                query,
                response: aiResponse,
            },
        });

        res.status(200).json({
            message: "Career advice generated",
            advice: aiResponse,
            logId: log.id,
        });
    } catch (error) {
        console.error("Career advice error:", error);
        res.status(500).json({
            message: "Error generating advice",
            error: error.message,
        });
    }
};
