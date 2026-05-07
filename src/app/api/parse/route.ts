import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    const fileName = file.name.toLowerCase();
    const buffer = Buffer.from(await file.arrayBuffer());

    if (fileName.endsWith(".pdf")) {
      // Dynamic imports: worker MUST be imported before pdf-parse
      // to polyfill DOMMatrix for serverless environments (Vercel)
      // @ts-expect-error -- pdf-parse v2 types not in @types/pdf-parse
      const { CanvasFactory } = await import("pdf-parse/worker");
      // @ts-expect-error -- pdf-parse v2 types not in @types/pdf-parse
      const { PDFParse } = await import("pdf-parse");
      const parser = new PDFParse({ data: buffer, CanvasFactory });
      const result = await parser.getText();
      await parser.destroy();
      return NextResponse.json({ text: result.text, fileName: file.name });
    }

    if (fileName.endsWith(".docx")) {
      const mammoth = await import("mammoth");
      const result = await mammoth.extractRawText({ buffer });
      return NextResponse.json({ text: result.value, fileName: file.name });
    }

    return NextResponse.json(
      { error: "Unsupported file type. Please upload PDF or DOCX." },
      { status: 400 }
    );
  } catch (error) {
    console.error("Parse error:", error);
    return NextResponse.json(
      { error: "Failed to parse file. Please try again." },
      { status: 500 }
    );
  }
}
