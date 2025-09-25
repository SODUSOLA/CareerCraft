import { GoogleGenerativeAI } from "@google/generative-ai";

const geminiApiKey = process.env.GEMINI_API_KEY;

// Initialize Gemini client
const genAI = new GoogleGenerativeAI(geminiApiKey);

/**
 * Generate structured career advice using Gemini.
 * @param {string} query - Takes in user career-related question
 * @returns {Promise<{ text: string }>} - returns AI response
 */


export async function generateCareerAdvice(query) {
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

        const prompt = `
        You are a career counselor. For the following query, provide:
        - An **overview** of the career
        - The **pros and cons**
        - **Possible career roles** someone can pursue

        **Make it clear and structured**

        Query: ${query}
        `;

        const response = await model.generateContent(prompt);

        return {
        text: response.response.text(),
        };
    } catch (error) {
        console.error("AI Service Error:", error);
        throw new Error("Failed to generate career advice");
    }
}
