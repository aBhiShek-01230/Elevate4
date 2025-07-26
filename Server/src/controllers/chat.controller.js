import {asyncHandler} from "../utils/asyncHandler.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from '@google/generative-ai'
import { SYSTEM_PROMPT } from "../utils/prompt.js"
import { SYSTEM_PROMPT2 } from "../utils/prompt2.js"
import fs from "fs";

const API_KEY = "AIzaSyChUawC7EMkfFfjXGL_ijmuaiKDDIvqi-s";
const MODEL_NAME = "gemini-2.0-flash"; // or "gemini-1.5-flash"

async function analyzeImage(imagePath = null) {
  const genAI = new GoogleGenerativeAI(API_KEY);
  const model = genAI.getGenerativeModel({
    model: MODEL_NAME,
    generationConfig: {
      temperature: 0.9,
      topK: 1,
      topP: 1,
      maxOutputTokens: 1000,
    },
    safetySettings: [
      {
        category: HarmCategory.HARM_CATEGORY_HARASSMENT,
        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
      },
    ],
  });

  let parts = [];

  if (imagePath) {
    const imageBuffer = fs.readFileSync(imagePath);
    const base64Image = imageBuffer.toString("base64");

    parts.push({
      inlineData: {
        mimeType: "image/png",
        data: base64Image,
      },
    });
  }

  parts.push({
    text: "You work as an AI-powered canvas assistant on the Elevate platform. You will receive an image that may contain a visual scene, diagram, or handwritten/digital content on a canvas. Your task: If the image contains a problem (e.g., math, code, or logical question), solve it directly and give a concise explanation (2–4 sentences). Do not describe the image—just focus on solving the problem. If there is no identifiable problem, then briefly summarize what the image shows in a clear and crisp manner (1–3 sentences), without using phrases like: In this picture, Here's my analysis of the image, The image contains, The image shows, Guidelines: Focus on clarity and brevity. Use bullet points for multi-step solutions, if needed. If the image is unclear or doesn’t contain anything meaningful, say so politely and briefly."
  });

  const result = await model.generateContent({ contents: [{ role: "user", parts }] });
  return result.response.text();
}

const processImage = asyncHandler(async (req, res) => {
  try {
    const imagePath = req.file?.path
    const base64Image = fs.readFileSync(imagePath, { encoding: "base64" });
    const response = await analyzeImage(imagePath);
    res.json({ response });
  } catch (error) {
    console.error('Error in chat endpoint:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

async function runChat(userInput, history = [], imagePath = null) {
  const genAI = new GoogleGenerativeAI(API_KEY);
  const model = genAI.getGenerativeModel({ model: MODEL_NAME });

  const generationConfig = {
    temperature: 0.9,
    topK: 1,
    topP: 1,
    maxOutputTokens: 1000,
  };

  const safetySettings = [
    {
      category: HarmCategory.HARM_CATEGORY_HARASSMENT,
      threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    },
  ];

  const chat = model.startChat({
    generationConfig,
    safetySettings,
    history, // Use full history here
  });



  const result = await chat.sendMessage(userInput);
  const response = result.response;
  return response.text();
}

function formatExamples(examples = []) {
  if (!examples.length) return "";

  return examples
    .map((ex, idx) => {
      return `Example ${idx + 1}:\nInput: ${ex.input}\nOutput: ${ex.output}\nExplanation: ${ex.explanation || 'No explanation.'}`;
    })
    .join("\n\n");
}


const sendReply = asyncHandler(async (req, res) => {
  try {
    const { userInput, history = [],question,language,sourceCode } = req.body;

    const formattedExamples = formatExamples(question?.examples); 

    const formatted = question  ? SYSTEM_PROMPT2 + "\n\n" +  "Problem: " + question.name + "\n\n" + "Description: " + question.description + "\n\n" + "Examples : " + formattedExamples + "\n\n" + "Constraints: " + question.constraints + "\n\n" + "language: "+language + "\n\n" + "user code: "+sourceCode :SYSTEM_PROMPT




    if (!userInput) {
      return res.status(400).json({ error: 'Invalid request body' });
    }

    // Insert system prompt at the beginning if not already present
    const updatedHistory = [...history];

    const hasSystemPrompt = updatedHistory.some(msg => msg.role === 'system');
    if (!hasSystemPrompt) {
      updatedHistory.unshift({
        role: 'user',
        parts: [{ text: formatted }],
      });
    }

    const response = await runChat(userInput, updatedHistory);

    res.json({ response });
  } catch (error) {
    console.error('Error in chat endpoint:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});



export {
  sendReply,
  processImage
}