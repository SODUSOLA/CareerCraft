import { GoogleGenerativeAI } from "@google/generative-ai";
import redisClient from '../config/redis.js';

const geminiApiKey = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(geminiApiKey);

// Generate structured career advice (CareerCraft Query 2.0 format)
export async function generateCareerAdvice(query) {
    try {
        // Check Redis cache first
        const cacheKey = `career_query:${query.toLowerCase().trim()}`;
        const cached = await redisClient.get(cacheKey);
        if (cached) {
            console.log('Cache hit for query:', query);
            return JSON.parse(cached);
        }

        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

        const prompt = `
You are CareerCraft AI, a professional career counselor. Provide career advice in VALID JSON format only.

For the query: "${query}"

Return a JSON object with exactly these keys:
{
    "overview": "Brief 2-3 sentence overview of the career field",
    "pros": ["List", "of", "3-5", "key", "advantages"],
    "cons": ["List", "of", "3-5", "key", "challenges"],
    "career_paths": ["List", "of", "3-5", "specific", "job", "roles"],
    "recommended_skills": ["List", "of", "5-8", "key", "skills", "to", "learn"],
    "learning_resources": ["List", "of", "3-5", "recommended", "courses/books/platforms"]
}

IMPORTANT: Return ONLY valid JSON, no markdown, no explanations, no extra text.
        `;

        const result = await model.generateContent(prompt);
        const responseText = result.response.text().trim();

        // Clean up response (remove potential markdown code blocks)
        let jsonText = responseText;
        if (jsonText.startsWith('```json')) {
            jsonText = jsonText.replace(/```json\s*/, '').replace(/```\s*$/, '');
        } else if (jsonText.startsWith('```')) {
            jsonText = jsonText.replace(/```\s*/, '').replace(/```\s*$/, '');
        }

        const structuredResponse = JSON.parse(jsonText);

        // Cache the result for 24 hours
        await redisClient.setEx(cacheKey, 86400, JSON.stringify(structuredResponse));

        return structuredResponse;
    } catch (error) {
        console.error("AI Service Error (CareerAdvice):", error);
        throw new Error("Error generating career advice");
    }
}
// Generate conversational chat response (short, adaptive tone)
export async function generateChatResponse(message, chatHistory = []) {
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

        const conversationContext = chatHistory
            .map(msg => `${msg.role === "user" ? "User" : "AI"}: ${msg.content}`)
            .join("\n");

        const prompt = `
You are CareerCraft Chat — a friendly, concise assistant helping users with career-related conversations.

Rules:
- Keep responses **short (2–5 sentences)**
- Be **natural and conversational**
- Use a friendly but informative tone
- Reference the chat history to keep context if available.

Conversation so far:
${conversationContext}

User: ${message}
        `;

        const chat = await model.generateContent(prompt);
        const text = chat.response.text();

        return { markdown: text };
    } catch (error) {
        console.error("AI Service Error (Chat):", error);
        throw new Error("Error generating chat response");
    }
}
