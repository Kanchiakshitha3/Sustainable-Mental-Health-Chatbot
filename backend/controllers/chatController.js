const { GoogleGenerativeAI } = require('@google/generative-ai');

const handleChat = async (req, res) => {
    try {
        const { message, history, language } = req.body;

        if (!message) {
            return res.status(400).json({ error: 'Message is required' });
        }

        // Initialize Gemini via the new genai sdk, wait actually let's use standard @google/generative-ai
        // Just in case @google/genai syntax is not perfectly known, I'll use a fetch approach if it fails, or I can just use the generic SDK.
        // wait, I ran `npm install @google/genai` earlier. I should use `@google/genai` syntax.
        // Actually to be completely safe and avoid version/SDK issues, since API endpoints are simple, I'll just use GoogleGenerativeAI from '@google/generative-ai' that I will install.
        // Let's use standard @google/generative-ai
        const ai = new (require('@google/generative-ai').GoogleGenerativeAI)(process.env.GEMINI_API_KEY);
        const systemPrompt = `You are an AI Mental Health Chatbot. Your goal is to provide emotional support, empathy, and active listening.
You must detect the user's emotion and respond naturally and empathetically.
CRITICAL RULES:
1. DO NOT give medical diagnosis or provide clinical advice.
2. If the user indicates they are in crisis, encourage them to contact a mental health professional or an emergency hotline immediately.
3. The user is currently communicating in ${language || 'their language'}. You MUST respond in the EXACT SAME LANGUAGE as their input (English, Telugu, or Hindi).
4. Keep responses concise, comforting, and conversational.`;

        const model = ai.getGenerativeModel({ 
            model: "gemini-2.5-flash",
            systemInstruction: systemPrompt
        });
        
        // Gemini API strictly requires history to begin with a "user" message.
        // If the frontend sends an initial "bot" greeting, we must strip it.
        let safeHistory = history || [];
        while (safeHistory.length > 0 && safeHistory[0].role === 'model') {
            safeHistory.shift();
        }

        const chat = model.startChat({
            history: safeHistory
        });

        const result = await chat.sendMessage(message);
        const responseText = result.response.text();

        res.json({ response: responseText });
    } catch (error) {
        console.error('Error in chat processing:', error);
        res.status(500).json({ error: 'Failed to process chat message.' });
    }
};

module.exports = { handleChat };
