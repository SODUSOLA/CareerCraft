import { PrismaClient } from "@prisma/client";
import { generateCareerAdvice, generateChatResponse } from "../services/aiService.js";
import redisClient from "../config/redis.js";

const prisma = new PrismaClient();
const INACTIVITY_LIMIT = 10 * 60 * 1000; // 10 minutes timeout

// Triggers "advisor" mode only for explicit career guidance requests
function isCareerQuery(text) {
    const lower = text.toLowerCase();
    
    const careerTriggers = [
        "career advice",
        "give me career",
        "how to become",
        "what should i study to become",
        "career path for",
        "what is required to be",
        "skills needed for",
        "guide me to become",
        "how can i become",
        "how do i get into"
    ];

    return careerTriggers.some(phrase => lower.includes(phrase));
}

// Main chat controller
export const handleChat = async (req, res) => {
    const sessionIdFromParams = req.params?.sessionId;
    const sessionIdFromBody = req.body?.sessionId;
    const sessionId = sessionIdFromParams || sessionIdFromBody;

    const { message } = req.body;
    const userId = req.user?.id || null; // get userId if logged in

    if (!message) {
        return res.status(400).json({ message: "message is required" });
    }

    try {
        let session;

        // If no sessionId → create new
        if (!sessionId) {
            session = await prisma.chatSession.create({
                data: { 
                    userId, // link session to the user
                    isActive: true, 
                    lastActivity: new Date() 
                },
            });
        } else {
            // Try to find session
            session = await prisma.chatSession.findUnique({ where: { id: sessionId } });

            // If not found, create it (fallback)
            if (!session) {
                session = await prisma.chatSession.create({
                    data: { 
                        id: sessionId, 
                        userId, // link session to the user
                        isActive: true, 
                        lastActivity: new Date() 
                    },
                });
            }
        }

        // Handle inactivity
        if (!session.isActive || Date.now() - session.lastActivity.getTime() > INACTIVITY_LIMIT) {
            session = await prisma.chatSession.update({
                where: { id: session.id },
                data: { isActive: true, lastActivity: new Date() },
            });
        }

        // Try to get previous chat history from Redis cache first
        const redisKey = `chat:session:${session.id}`;
        let previousMessages = [];

        const cachedMessages = await redisClient.get(redisKey);
        if (cachedMessages) {
            previousMessages = JSON.parse(cachedMessages);
        } else {
            previousMessages = await prisma.chatMessage.findMany({
                where: { sessionId: session.id },
                orderBy: { createdAt: "asc" },
            });
            // Cache for 10 minutes
            await redisClient.set(redisKey, JSON.stringify(previousMessages), { EX: 600 });
        }

        // Decide type
        const useCareerAdvice = isCareerQuery(message);

        const aiResponse = useCareerAdvice
            ? await generateCareerAdvice(message)
            : await generateChatResponse(message, previousMessages);

        const responseText =
            aiResponse?.markdown ||
            aiResponse?.text ||
            (typeof aiResponse === "string" ? aiResponse : "No response generated.");

        // Save chat
        await prisma.chatMessage.create({
            data: {
                sessionId: session.id,
                userMessage: message,
                botResponse: responseText,
            },
        });

        // Update Redis cache
        previousMessages.push({ userMessage: message, botResponse: responseText });
        await redisClient.set(redisKey, JSON.stringify(previousMessages), { EX: 600 });


        // Update session activity
        await prisma.chatSession.update({
            where: { id: session.id },
            data: { lastActivity: new Date() },
        });

        res.json({
            sessionId: session.id,
            type: useCareerAdvice ? "career_advice" : "chat",
            tone: useCareerAdvice ? "structured & advisory" : "friendly & conversational",
            response: responseText,
        });

    } catch (err) {
        console.error("Chat error:", err);
        res.status(500).json({ message: "Chat error", error: err.message });
    }
};
