"use client";

import type { AnalysisResult } from "@/lib/types";

interface ResultsDisplayProps {
  result: AnalysisResult;
  onCopy: (text: string) => void;
}

export default function ResultsDisplay({ result, onCopy }: ResultsDisplayProps) {
  const getScoreColor = (score: number) => {
    if (score >= 75) return "text-success";
    if (score >= 50) return "text-warning";
    return "text-error";
  };



  return (
    <div className="fade-in">
      {/* ─── ATS SCORE ─── */}
      <section className="score-section" id="ats-score">
        <div className="score-label">ATS Compatibility Score</div>
        <div className={`score-jumbo ${getScoreColor(result.atsScore.overall)}`}>
          {result.atsScore.overall}
        </div>

        <hr className="thick" style={{ marginTop: "3rem" }} />

        {/* Breakdown rows */}
        <div className="mt-md fade-in fade-in-delay-1">
          {result.atsScore.breakdown.map((item, i) => (
            <div className="score-row" key={i}>
              <span className="score-row-label">{item.category}</span>
              <span className="score-row-value">
                {item.score} / {item.maxScore}
              </span>
            </div>
          ))}
        </div>

        <hr />

        {/* Narrative */}
        <div className="narrative fade-in fade-in-delay-2">
          {result.atsScore.narrative.split("\n").map((para, i) => (
            <p key={i} style={{ marginBottom: "1rem" }}>
              {para}
            </p>
          ))}
        </div>
      </section>

      <hr className="thick" />

      {/* ─── SECTION ANALYSIS ─── */}
      <section id="section-analysis">
        <h2>Section Analysis</h2>
        {result.sectionAnalysis.map((sec, i) => (
          <article className="article-section fade-in" key={i} style={{ animationDelay: `${i * 0.1}s` }}>
            <h3>
              {sec.section}
              {sec.rating === "weak" && (
                <span className="section-flag" style={{ marginLeft: "1rem", fontSize: "0.85em" }}>
                  — Perlu Perbaikan
                </span>
              )}
              {sec.rating === "strong" && (
                <span className="text-success" style={{ marginLeft: "1rem", fontSize: "0.85em", fontStyle: "italic" }}>
                  — Kuat
                </span>
              )}
            </h3>
            <div className="narrative">
              {sec.analysis.split("\n").map((para, j) => (
                <p key={j} style={{ marginBottom: "0.75rem" }}>
                  {para}
                </p>
              ))}
            </div>
            {i < result.sectionAnalysis.length - 1 && <hr />}
          </article>
        ))}
      </section>

      <hr className="thick" />

      {/* ─── KEYWORDS ─── */}
      <section id="keywords">
        <h2>Keyword Analysis</h2>
        <div className="two-columns mt-md">
          <div>
            <h3 className="mb-sm" style={{ fontSize: "1rem" }}>
              <span className="mono score-label">Ditemukan</span>
            </h3>
            <ul className="keyword-list">
              {result.keywords.present.map((kw, i) => (
                <li key={i} className="keyword-present">
                  {kw}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="mb-sm" style={{ fontSize: "1rem" }}>
              <span className="mono score-label text-accent">Kurang</span>
            </h3>
            <ul className="keyword-list">
              {result.keywords.missing.map((kw, i) => (
                <li key={i} className="keyword-missing">
                  {kw}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <hr className="thick" />

      {/* ─── REWRITE SUGGESTIONS ─── */}
      <section id="rewrite">
        <h2>Rewrite Suggestions</h2>
        {result.rewriteSuggestions.map((rw, i) => (
          <div className="rewrite-block fade-in" key={i} style={{ animationDelay: `${i * 0.15}s` }}>
            <h3 style={{ marginBottom: "1rem" }}>{rw.section}</h3>

            <div className="rewrite-label">Sebelum —</div>
            <blockquote className="rewrite-quote">{rw.before}</blockquote>

            <div className="rewrite-label">Sesudah —</div>
            <blockquote className="rewrite-quote after">{rw.after}</blockquote>

            <button
              className="btn mt-sm"
              onClick={() => onCopy(rw.after)}
              style={{ fontSize: "0.7rem" }}
            >
              Copy Saran
            </button>
          </div>
        ))}
      </section>

      {/* ─── JOB MATCH ─── */}
      {result.jobMatch && (
        <>
          <hr className="thick" />
          <section id="job-match">
            <div className="score-label">Job Match Score</div>
            <div className={`score-jumbo ${getScoreColor(result.jobMatch.score)}`} style={{ fontSize: "clamp(4rem, 12vw, 8rem)" }}>
              {result.jobMatch.score}
            </div>

            <p className="verdict mt-md">{result.jobMatch.verdict}</p>

            {result.jobMatch.skillGaps.length > 0 && (
              <div className="mt-md">
                <h3 className="mb-sm">Skill Gap</h3>
                <ul className="skill-gap-list">
                  {result.jobMatch.skillGaps.map((gap, i) => (
                    <li key={i}>{gap}</li>
                  ))}
                </ul>
              </div>
            )}
          </section>
        </>
      )}
    </div>
  );
}
