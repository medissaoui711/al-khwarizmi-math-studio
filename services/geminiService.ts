import { GoogleGenAI, Type } from "@google/genai";
import { MathResponse } from "../types";

// Initialize the Gemini Client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// System instruction to guide the model's behavior
const SYSTEM_INSTRUCTION = `
You are "Al-Khwarizmi", an expert AI mathematics tutor designed for Arabic-speaking students.
Your capabilities include:
1. Solving complex mathematical problems step-by-step.
2. explaining concepts in clear, academic Arabic.
3. generating LaTeX for mathematical expressions.
4. preparing data for 2D function plots when requested.

Output Format:
You must ALWAYS respond in valid JSON format matching the specific schema provided.

Guidelines:
- If the user asks to "plot" or "graph" a function, you MUST provide 'chartData' with at least 20-50 points in the range [-10, 10] unless specified otherwise.
- Use standard LaTeX for math formulas.
- If the user asks for Arabic notation specifically, explain that standard LaTeX is used for rendering but provide the variable mappings (e.g., x -> س).
- Keep the 'text' response helpful, encouraging, and educational.
- If the query is not math-related, politely steer the conversation back to math in Arabic.
`;

export const sendMessageToGemini = async (
  prompt: string,
  history: { role: string; parts: { text: string }[] }[] = []
): Promise<MathResponse> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [
        ...history,
        { role: "user", parts: [{ text: prompt }] }
      ],
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            text: {
              type: Type.STRING,
              description: "The explanation and answer in Arabic.",
            },
            latex: {
              type: Type.STRING,
              description: "The main mathematical expression or equation in LaTeX format (without $ delimiters).",
            },
            chartData: {
              type: Type.ARRAY,
              description: "Optional. Generate this ONLY if the user asks to plot or graph a function.",
              items: {
                type: Type.OBJECT,
                properties: {
                  x: { type: Type.NUMBER },
                  y: { type: Type.NUMBER },
                },
                required: ["x", "y"],
              },
            },
            chartLabel: {
              type: Type.STRING,
              description: "Label for the chart (e.g., f(x) = x^2).",
            },
            relatedTopics: {
              type: Type.ARRAY,
              description: "3 short related mathematical topics in Arabic to explore next.",
              items: { type: Type.STRING },
            },
          },
          required: ["text"],
        },
      },
    });

    if (response.text) {
      return JSON.parse(response.text) as MathResponse;
    }

    throw new Error("Empty response from model");
  } catch (error) {
    console.error("Gemini API Error:", error);
    return {
      text: "عذراً، حدث خطأ أثناء معالجة طلبك. يرجى المحاولة مرة أخرى.",
      isError: true,
    } as any;
  }
};