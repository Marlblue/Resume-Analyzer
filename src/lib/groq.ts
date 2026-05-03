import Groq from "groq-sdk";
import type { AnalysisResult } from "./types";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY || "",
});

// Models to try in order on Groq (fallback chain)
const MODELS = [
  "llama-3.3-70b-versatile",
  "llama-3.1-8b-instant",
];

/** Maximum resume text length to send to the AI (chars) */
const MAX_RESUME_LENGTH = 30_000;

export async function analyzeResume(
  resumeText: string,
  jobTitle?: string,
  jobDescription?: string
): Promise<AnalysisResult> {
  // Truncate extremely long resumes to avoid token limits
  const trimmedText = resumeText.length > MAX_RESUME_LENGTH
    ? resumeText.slice(0, MAX_RESUME_LENGTH) + "\n\n[...teks dipotong karena terlalu panjang]"
    : resumeText;

  const jobContext = jobTitle || jobDescription
    ? `\n\nJob Context:\nJob Title: ${jobTitle || "Not specified"}\nJob Description: ${jobDescription || "Not provided"}`
    : "";

  const prompt = `You are an expert ATS (Applicant Tracking System) resume analyzer. Analyze the following resume text and provide a comprehensive evaluation.

Resume Text:
---
${trimmedText}
---
${jobContext}

Respond ONLY with valid JSON in this exact format (no markdown, no code fences):
{
  "atsScore": {
    "overall": <number 0-100>,
    "breakdown": [
      { "category": "Formatting & Structure", "score": <number>, "maxScore": 20 },
      { "category": "Keyword Optimization", "score": <number>, "maxScore": 20 },
      { "category": "Experience Quality", "score": <number>, "maxScore": 25 },
      { "category": "Skills Relevance", "score": <number>, "maxScore": 15 },
      { "category": "Education & Certs", "score": <number>, "maxScore": 10 },
      { "category": "Overall Impact", "score": <number>, "maxScore": 10 }
    ],
    "narrative": "<A 2-3 paragraph narrative explanation of the overall score, written in a natural editorial tone. Do not use bullet points. Write in Indonesian language.>"
  },
  "sectionAnalysis": [
    {
      "section": "<section name e.g. Summary, Experience, Education, Skills>",
      "rating": "<strong|moderate|weak>",
      "analysis": "<1-2 paragraph detailed analysis of this section written in editorial style. In Indonesian language.>"
    }
  ],
  "keywords": {
    "present": ["<keywords found in the resume>"],
    "missing": ["<important keywords missing from the resume${jobTitle ? " for the role of " + jobTitle : ""}>"]
  },
  "rewriteSuggestions": [
    {
      "section": "<section name>",
      "before": "<exact text from the resume that could be improved>",
      "after": "<improved version of the text>"
    }
  ]${
    jobTitle || jobDescription
      ? `,
  "jobMatch": {
    "score": <number 0-100>,
    "verdict": "<one sentence verdict about job fit, in Indonesian>",
    "skillGaps": ["<skills the candidate lacks for this specific role>"]
  }`
      : `,
  "jobMatch": null`
  }
}

Ensure all analysis sections cover: Summary/Objective, Experience, Education, and Skills at minimum.
Provide at least 3 rewrite suggestions.
For keywords, list at least 5 present and 5 missing keywords.
Write narratives and analysis in Indonesian language.`;

  for (const modelName of MODELS) {
    try {
      console.log(`[Groq] Trying model: ${modelName}`);

      const completion = await groq.chat.completions.create({
        model: modelName,
        messages: [
          {
            role: "system",
            content: "You are an expert ATS resume analyzer. You MUST respond with valid JSON only. No markdown, no code fences, no explanations outside the JSON.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        temperature: 0.3,
        max_tokens: 4096,
      });

      const text = completion.choices[0]?.message?.content || "";

      // Clean any markdown fences that might be present
      const cleaned = text
        .replace(/```json\s*/g, "")
        .replace(/```\s*/g, "")
        .trim();

      try {
        return JSON.parse(cleaned) as AnalysisResult;
      } catch {
        console.error(`[Groq] Failed to parse JSON from ${modelName}:`, cleaned.substring(0, 200));
        // If this isn't the last model, try the next one instead of throwing immediately
        if (modelName !== MODELS[MODELS.length - 1]) {
          console.log(`[Groq] Retrying with next model due to parse failure...`);
          continue;
        }
        throw new Error("Gagal memproses respons AI. Silakan coba lagi.");
      }
    } catch (error) {
      const errMsg = error instanceof Error ? error.message : String(error);

      if (errMsg.includes("rate_limit") || errMsg.includes("429")) {
        console.log(`[Groq] Rate limited on ${modelName}, trying next model...`);
        continue;
      }

      throw error;
    }
  }

  throw new Error(
    "Semua model sedang tidak tersedia. Silakan coba lagi dalam beberapa menit."
  );
}
