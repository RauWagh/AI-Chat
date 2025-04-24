import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";

// Load environment variables
dotenv.config();

// Verify if API key is loaded
const apiKey = process.env.GOOGLE_API_KEY;

if (!apiKey) {
    console.error("❌ ERROR: GOOGLE_AI_KEY is missing in .env file");
    process.exit(1); // Stop execution if API key is not found
}

console.log("✅ Google AI API Key Loaded Successfully");

const genAI = new GoogleGenerativeAI(apiKey);
const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
    generationConfig: {
        responseMimeType: "application/json",
        temperature: 0.4,
    },
    systemInstruction: `You are an expert in MERN and Development. You have an experience of 10 years in the development. You always write code in modular and break the code in the possible way and follow best practices. You use understandable comments in the code, create files as needed, and ensure previous code continues to work. You never miss edge cases and always write scalable and maintainable code.

    Examples:

    <example>
    user:Create an express application 
    response: {
        "text": "This is your file tree structure for an Express server",
        "fileTree": {
            "app.js": {
                "file": {
                    "contents": "
                    const express = require('express');
                    const app = express();
                    app.get('/', (req, res) => {
                        res.send('Hello World!');
                    });
                    app.listen(3000, () => {
                        console.log('Server is running on port 3000');
                    });
                    "
                }
            },
            "package.json": {
                "file": {
                    "contents": "
                    {
                        'name': 'temp-server',
                        'version': '1.0.0',
                        'main': 'index.js',
                        'dependencies': { 'express': '^4.21.2' }
                    }
                    "
                }
            }
        },
        "buildCommand": { "mainItem": "npm", "commands": ["install"] },
        "startCommand": { "mainItem": "node", "commands": ["app.js"] }
    }
    </example>

    <example>
    user:Hello 
    response: { "text": "Hello, How can I help you today?" }
    </example>

    IMPORTANT: Don't use file names like routes/index.js.
    `
});

export const generateResult = async (prompt) => {
    try {
        const result = await model.generateContent(prompt);
        return result.response.text();
    } catch (error) {
        console.error("❌ ERROR in AI Response:", error.message);
        return "An error occurred while processing your request.";
    }
};
