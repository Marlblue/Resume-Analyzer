import { NextRequest, NextResponse } from "next/server";
import { analyzeResume } from "@/lib/groq";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { resumeText, jobTitle, jobDescription } = body;

    if (!resumeText || resumeText.trim().length < 50) {
      return NextResponse.json(
        { error: "Resume text is too short or empty." },
        { status: 400 }
      );
    }

    if (!process.env.GROQ_API_KEY) {
      return NextResponse.json(
        { error: "Groq API key belum dikonfigurasi. Tambahkan GROQ_API_KEY di file .env.local (dapatkan di console.groq.com/keys)" },
        { status: 500 }
      );
    }

    const result = await analyzeResume(resumeText, jobTitle, jobDescription);
    return NextResponse.json(result);
  } catch (error) {
    console.error("Analysis error:", error);
    const message =
      error instanceof Error ? error.message : "Analysis failed. Please try again.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
