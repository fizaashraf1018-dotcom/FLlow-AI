import express from "express";
import path from "path";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "10mb" }));

// Helper to get Gemini AI client lazily
function getGeminiClient() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not configured.");
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
}

// --- AI Endpoints ---

// 1. AI Assignment Evaluation
app.post("/api/ai/evaluate-assignment", async (req, res) => {
  try {
    const { title, instructions, submissionText, studentName, rubric } = req.body;
    if (!submissionText) {
      return res.status(400).json({ error: "Submission text is required." });
    }

    const ai = getGeminiClient();
    const prompt = `
You are Flow AI, an expert educational AI evaluation assistant.
Evaluate the following student submission for the assignment "${title || "General Assignment"}".

Student Name: ${studentName || "Student"}
Assignment Instructions: ${instructions || "Complete the task as specified."}
Rubric/Criteria: ${rubric || "Clarity, Accuracy, Structure, Depth of Understanding"}
Student Submission Content:
${submissionText}

Please provide a fair, constructive, and detailed evaluation in JSON format with:
- scoreOutof100 (number 0 to 100)
- letterGrade (e.g. A+, A, B, C, D, F)
- summary (2-3 concise encouraging sentences)
- strengths (array of strings, key positive points)
- improvements (array of strings, areas that need work)
- actionableTips (array of concrete next steps for the student)
`;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            scoreOutof100: { type: Type.NUMBER },
            letterGrade: { type: Type.STRING },
            summary: { type: Type.STRING },
            strengths: { type: Type.ARRAY, items: { type: Type.STRING } },
            improvements: { type: Type.ARRAY, items: { type: Type.STRING } },
            actionableTips: { type: Type.ARRAY, items: { type: Type.STRING } },
          },
          required: ["scoreOutof100", "letterGrade", "summary", "strengths", "improvements", "actionableTips"],
        },
      },
    });

    const result = JSON.parse(response.text || "{}");
    return res.json(result);
  } catch (error: any) {
    return res.status(500).json({
      error: error.message || "Failed to evaluate assignment.",
      fallback: {
        scoreOutof100: 85,
        letterGrade: "A-",
        summary: "Solid work submitted with good structure and clear understanding of core principles.",
        strengths: ["Clear logical structure", "Good formatting and key points addressed"],
        improvements: ["Could provide more real-world examples", "Deepen analysis in concluding section"],
        actionableTips: ["Review lesson notes for advanced concepts", "Elaborate on practical use-cases next time"],
      },
    });
  }
});

// 2. AI Quiz Evaluation
app.post("/api/ai/evaluate-quiz", async (req, res) => {
  try {
    const { quizTitle, questions, studentName } = req.body;
    const ai = getGeminiClient();

    const prompt = `
You are Flow AI's Quiz Grading & Learning Analytics Engine.
Analyze the following student quiz response for "${quizTitle || "Quiz"}".

Student Name: ${studentName || "Student"}
Questions and Answers:
${JSON.stringify(questions, null, 2)}

Provide detailed analysis in JSON with:
- overallFeedback (encouraging & analytical string)
- feedbackPerQuestion: array of objects with:
  - questionId (string/number matching input)
  - isCorrect (boolean)
  - explanation (why the correct answer is correct and guidance)
  - studyTip (short targeted recommendation)
- recommendedTopics (array of strings for further review)
`;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            overallFeedback: { type: Type.STRING },
            feedbackPerQuestion: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  questionId: { type: Type.STRING },
                  isCorrect: { type: Type.BOOLEAN },
                  explanation: { type: Type.STRING },
                  studyTip: { type: Type.STRING },
                },
                required: ["questionId", "isCorrect", "explanation", "studyTip"],
              },
            },
            recommendedTopics: { type: Type.ARRAY, items: { type: Type.STRING } },
          },
          required: ["overallFeedback", "feedbackPerQuestion", "recommendedTopics"],
        },
      },
    });

    const result = JSON.parse(response.text || "{}");
    return res.json(result);
  } catch (error: any) {
    return res.status(500).json({
      error: error.message || "Failed to evaluate quiz.",
      fallback: {
        overallFeedback: "Great effort on the quiz! Review the missed concepts to master the topic.",
        feedbackPerQuestion: [],
        recommendedTopics: ["Core Foundations", "Practical Applications"],
      },
    });
  }
});

// 3. AI Study & Productivity Assistant Chat
app.post("/api/ai/study-assistant", async (req, res) => {
  try {
    const { messages, context } = req.body;
    const ai = getGeminiClient();

    const systemInstruction = `
You are Flow AI, a warm, intelligent, and highly capable learning, productivity & workspace assistant.
User Role: ${context?.role || "Student/User"}
Current Context: ${JSON.stringify(context || {})}

Guidelines:
- Give clear, helpful, encouraging, and structured responses.
- Format text with clear bullet points, clean markdown, and action steps.
- Offer 2-3 relevant follow-up prompt suggestions at the end of your response inside a JSON or markdown fence if appropriate, but primarily answer the user directly.
`;

    // Extract conversation history
    const contents = (messages || []).map((m: any) => ({
      role: m.role === "assistant" || m.role === "model" ? "model" : "user",
      parts: [{ text: m.content || m.text }],
    }));

    if (contents.length === 0) {
      contents.push({ role: "user", parts: [{ text: "Hello! How can Flow AI help me today?" }] });
    }

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents,
      config: {
        systemInstruction,
      },
    });

    return res.json({
      reply: response.text,
    });
  } catch (error: any) {
    return res.status(500).json({
      reply: "I'm experiencing a brief connectivity hiccup, but here is a quick study tip: Break your tasks into 25-minute Pomodoro focus blocks and review key definitions after each block!",
    });
  }
});

// 4. AI Smart Search & Summarizer for Notes & Files
app.post("/api/ai/smart-search", async (req, res) => {
  try {
    const { query, items } = req.body;
    const ai = getGeminiClient();

    const prompt = `
You are Flow AI's Intelligent Document & Notes Search Engine.
Search Query: "${query}"

Available Notes & Documents:
${JSON.stringify(items, null, 2)}

Provide a structured JSON output:
- summary: (A 2-3 sentence smart synthesis answering the query based on the documents)
- matchedIds: (Array of item IDs that are most relevant)
- directAnswer: (Clear answer to the query with key takeaways)
- keyKeywords: (Array of 3-5 relevant keywords)
`;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            summary: { type: Type.STRING },
            matchedIds: { type: Type.ARRAY, items: { type: Type.STRING } },
            directAnswer: { type: Type.STRING },
            keyKeywords: { type: Type.ARRAY, items: { type: Type.STRING } },
          },
          required: ["summary", "matchedIds", "directAnswer", "keyKeywords"],
        },
      },
    });

    const result = JSON.parse(response.text || "{}");
    return res.json(result);
  } catch (error: any) {
    return res.status(500).json({
      summary: `Search results for "${req.body.query}" across available study notes and files.`,
      matchedIds: (req.body.items || []).slice(0, 2).map((i: any) => i.id),
      directAnswer: "Found relevant materials in your workspace notes.",
      keyKeywords: ["Notes", "Study Material", "Flow AI"],
    });
  }
});

// 5. AI Study Planner / Schedule Generator
app.post("/api/ai/study-planner", async (req, res) => {
  try {
    const { goal, timeframeDays, role, subjectsOrProjects } = req.body;
    const ai = getGeminiClient();

    const prompt = `
You are Flow AI's Personal Study & Productivity Planner.
Generate a structured ${timeframeDays || 7}-day roadmap/schedule for:
Role: ${role || "Student"}
Goal: "${goal || "Prepare for upcoming exams & complete tasks"}"
Subjects/Projects: ${JSON.stringify(subjectsOrProjects || ["General Revision", "Assignments"])}

Output JSON:
- planTitle: string
- totalHoursPerDay: number
- schedule: array of objects:
  - dayNumber: number (1 to timeframeDays)
  - title: string
  - focusArea: string
  - tasks: array of strings (action items)
  - estimatedMinutes: number
- expertTip: string
`;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            planTitle: { type: Type.STRING },
            totalHoursPerDay: { type: Type.NUMBER },
            schedule: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  dayNumber: { type: Type.NUMBER },
                  title: { type: Type.STRING },
                  focusArea: { type: Type.STRING },
                  tasks: { type: Type.ARRAY, items: { type: Type.STRING } },
                  estimatedMinutes: { type: Type.NUMBER },
                },
                required: ["dayNumber", "title", "focusArea", "tasks", "estimatedMinutes"],
              },
            },
            expertTip: { type: Type.STRING },
          },
          required: ["planTitle", "totalHoursPerDay", "schedule", "expertTip"],
        },
      },
    });

    const result = JSON.parse(response.text || "{}");
    return res.json(result);
  } catch (error: any) {
    return res.status(500).json({
      planTitle: "7-Day Accelerated Study Plan",
      totalHoursPerDay: 3,
      schedule: [
        {
          dayNumber: 1,
          title: "Foundation Review",
          focusArea: "Core Concepts",
          tasks: ["Read Chapter 1 Notes", "Attempt Practice Questions"],
          estimatedMinutes: 120,
        },
      ],
      expertTip: "Stay consistent and take a 5-minute breather between intense study sessions!",
    });
  }
});

// Serve frontend in dev / prod
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {});
}

startServer();
