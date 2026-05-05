import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    const fileName = file.name.toLowerCase();
    console.log(`Parsing file: ${file.name} (${file.size} bytes)`);
    const buffer = Buffer.from(await file.arrayBuffer());
    console.log("Buffer created successfully");

    if (fileName.endsWith(".pdf")) {
      try {
        console.log("Starting PDF parse...");
        const { PDFParse } = await import("pdf-parse");
        console.log("PDFParse class loaded");
        const parser = new PDFParse({ data: buffer });
        console.log("Parser instance created");
        const result = await parser.getText();
        console.log("Text extraction successful");
        await parser.destroy();
        return NextResponse.json({ text: result.text, fileName: file.name });
      } catch (err) {
        console.error("PDF parse specific error:", err);
        return NextResponse.json(
          { error: `Failed to parse PDF: ${err instanceof Error ? err.message : String(err)}` },
          { status: 500 }
        );
      }
    }

    if (fileName.endsWith(".docx")) {
      try {
        console.log("Starting DOCX parse...");
        const mammoth = await import("mammoth");
        const result = await mammoth.extractRawText({ buffer });
        console.log("DOCX extraction successful");
        return NextResponse.json({ text: result.value, fileName: file.name });
      } catch (err) {
        console.error("DOCX parse specific error:", err);
        return NextResponse.json(
          { error: `Failed to parse DOCX: ${err instanceof Error ? err.message : String(err)}` },
          { status: 500 }
        );
      }
    }

    return NextResponse.json(
      { error: "Unsupported file type. Please upload PDF or DOCX." },
      { status: 400 }
    );
  } catch (error) {
    console.error("Global parse error:", error);
    return NextResponse.json(
      { error: `Failed to parse file: ${error instanceof Error ? error.message : String(error)}` },
      { status: 500 }
    );
  }
}
