"use client";

import { useState, useCallback } from "react";
import Masthead from "@/components/Masthead";
import UploadZone from "@/components/UploadZone";
import LoadingState from "@/components/LoadingState";
import ResultsDisplay from "@/components/ResultsDisplay";
import Toast from "@/components/Toast";
import type { AnalysisResult } from "@/lib/types";
import { generateReportHTML } from "@/lib/report";

type AppState = "idle" | "preview" | "analyzing" | "results" | "error";

export default function Home() {
  const [state, setState] = useState<AppState>("idle");
  const [resumeText, setResumeText] = useState("");
  const [fileName, setFileName] = useState("");
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState("");
  const [toast, setToast] = useState<string | null>(null);

  // Job match fields
  const [jobTitle, setJobTitle] = useState("");
  const [jobDescription, setJobDescription] = useState("");

  const handleFileSelect = useCallback(async (file: File) => {
    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/parse", { method: "POST", body: formData });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to parse file");
      }

      setResumeText(data.text);
      setFileName(data.fileName);
      setState("preview");
      setResult(null);
      setError("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to parse file");
      setState("error");
    }
  }, []);

  const handleAnalyze = useCallback(async () => {
    if (!resumeText) return;

    setState("analyzing");
    setError("");

    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resumeText, jobTitle, jobDescription }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Analysis failed");
      }

      setResult(data);
      setState("results");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Analysis failed");
      setState("error");
    }
  }, [resumeText, jobTitle, jobDescription]);

  const handleCopy = useCallback(async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setToast("Tersalin ke clipboard");
    } catch {
      setToast("Gagal menyalin");
    }
  }, []);

  const handleExport = useCallback(() => {
    if (!result) return;

    const html = generateReportHTML(result);
    
    // Gunakan iframe tersembunyi agar URL tidak about:blank saat print/save PDF
    const iframe = document.createElement("iframe");
    iframe.style.position = "absolute";
    iframe.style.left = "-10000px";
    iframe.style.top = "-10000px";
    iframe.style.width = "100%";
    iframe.style.height = "100%";
    iframe.style.border = "none";
    document.body.appendChild(iframe);

    const doc = iframe.contentWindow?.document;
    if (doc) {
      doc.open();
      doc.write(html);
      doc.close();

      setTimeout(() => {
        // Simpan title asli dan ubah sementara untuk nama file PDF
        const originalTitle = document.title;
        const safeFileName = fileName ? fileName.replace(/\.[^/.]+$/, "") : "Resume";
        document.title = `Analysis_${safeFileName}`;

        iframe.contentWindow?.focus();
        iframe.contentWindow?.print();

        // Kembalikan title asli setelah dialog print ditutup
        document.title = originalTitle;

        setTimeout(() => {
          document.body.removeChild(iframe);
        }, 1000);
      }, 500);
    }
  }, [result, fileName]);

  const handleReset = useCallback(() => {
    setState("idle");
    setResumeText("");
    setFileName("");
    setResult(null);
    setError("");
    setJobTitle("");
    setJobDescription("");
  }, []);

  return (
    <>
      <Masthead />

      <main className="container" style={{ paddingTop: "var(--space-xl)", paddingBottom: "var(--space-2xl)" }}>
        {/* ─── HERO / IDLE ─── */}
        {state === "idle" && (
          <div className="fade-in">
            <h1 style={{ marginBottom: "var(--space-md)" }}>
              Analyze<br />Your Resume
            </h1>
            <p style={{ marginBottom: "var(--space-xl)", maxWidth: "50ch" }}>
              Upload your CV and get a comprehensive ATS compatibility score,
              section-by-section review, keyword analysis, and AI-powered rewrite
              suggestions.
            </p>
            <hr className="thick" />
            <div style={{ marginTop: "var(--space-lg)" }}>
              <UploadZone onFileSelect={handleFileSelect} />
            </div>
          </div>
        )}

        {/* ─── PREVIEW ─── */}
        {state === "preview" && (
          <div className="fade-in">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", flexWrap: "wrap", gap: "1rem" }}>
              <h2 style={{ margin: 0 }}>{fileName}</h2>
              <button className="btn" onClick={handleReset} id="btn-reset">
                Upload Lain
              </button>
            </div>

            <hr />

            <div className="raw-preview" id="raw-preview">
              {resumeText}
            </div>

            <hr />

            {/* Job Match Input */}
            <div style={{ marginTop: "var(--space-lg)" }}>
              <h3 style={{ marginBottom: "var(--space-sm)" }}>
                Job Matching
                <span className="text-subtle" style={{ fontFamily: "var(--font-mono)", fontSize: "0.7rem", marginLeft: "1rem", fontWeight: 400, letterSpacing: "0.1em" }}>
                  OPSIONAL
                </span>
              </h3>
              <p className="text-muted" style={{ marginBottom: "var(--space-md)", fontSize: "0.95rem" }}>
                Masukkan job title atau paste job description untuk mendapatkan skor kecocokan dan analisis skill gap.
              </p>

              <input
                type="text"
                className="input-field"
                placeholder="Job title, contoh: Frontend Developer"
                value={jobTitle}
                onChange={(e) => setJobTitle(e.target.value)}
                id="job-title-input"
              />

              <textarea
                className="input-field mt-md"
                placeholder="Paste job description di sini..."
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                rows={5}
                id="job-description-input"
              />
            </div>

            <hr />

            <div style={{ marginTop: "var(--space-lg)" }}>
              <button className="btn btn-accent" onClick={handleAnalyze} id="btn-analyze">
                Analisis Resume
              </button>
            </div>
          </div>
        )}

        {/* ─── LOADING ─── */}
        {state === "analyzing" && <LoadingState />}

        {/* ─── ERROR ─── */}
        {state === "error" && (
          <div className="fade-in">
            <h2 className="text-accent">Terjadi Kesalahan</h2>
            <p className="narrative">{error}</p>
            {error.toLowerCase().includes("kuota") || error.toLowerCase().includes("quota") ? (
              <p className="narrative text-subtle" style={{ fontSize: "0.9rem", marginTop: "0.5rem" }}>
                API Gemini memiliki batas penggunaan gratis. Tunggu beberapa menit lalu coba lagi, atau gunakan API key berbayar.
              </p>
            ) : null}
            <hr />
            <div className="btn-group mt-md">
              {resumeText && (
                <button className="btn btn-accent" onClick={() => { setState("preview"); setError(""); }} id="btn-retry-analyze">
                  Coba Analisis Lagi
                </button>
              )}
              <button className="btn" onClick={handleReset} id="btn-retry">
                Upload Ulang
              </button>
            </div>
          </div>
        )}

        {/* ─── RESULTS ─── */}
        {state === "results" && result && (
          <div className="fade-in">
            <div className="results-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", flexWrap: "wrap", gap: "1rem" }}>
              <h2 style={{ margin: 0 }}>
                Hasil Analisis
                <span className="text-subtle mono" style={{ fontSize: "0.7rem", marginLeft: "1rem", letterSpacing: "0.1em" }}>
                  {fileName}
                </span>
              </h2>
              <div className="btn-group">
                <button className="btn" onClick={handleExport} id="btn-export">
                  Print / Save as PDF
                </button>
                <button
                  className="btn"
                  onClick={() => {
                    const allSuggestions = result.rewriteSuggestions
                      .map((r) => `[${r.section}]\nSebelum: ${r.before}\nSesudah: ${r.after}`)
                      .join("\n\n");
                    handleCopy(allSuggestions);
                  }}
                  id="btn-copy-all"
                >
                  Copy Semua Saran
                </button>
                <button className="btn" onClick={handleReset} id="btn-new">
                  Analisis Baru
                </button>
              </div>
            </div>

            <hr className="thick" />

            <ResultsDisplay result={result} onCopy={handleCopy} />
          </div>
        )}
      </main>

      {/* ─── FOOTER ─── */}
      <footer className="footer">
        <div className="container">
          <p className="footer-text">
            Resume Analyzer — Powered by AI · No data stored
          </p>
        </div>
      </footer>

      {/* ─── TOAST ─── */}
      {toast && <Toast message={toast} onClose={() => setToast(null)} />}
    </>
  );
}
