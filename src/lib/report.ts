import type { AnalysisResult } from "./types";

export function generateReportHTML(result: AnalysisResult): string {
  const getScoreColor = (score: number) => {
    if (score >= 75) return "#2D5016";
    if (score >= 50) return "#8B6914";
    return "#8B1A1A";
  };

  return `<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <title>Resume Analysis Report</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700;900&family=IBM+Plex+Mono:wght@400;600&family=Inter:wght@300;400;500&display=swap');
    
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: 'Inter', sans-serif;
      color: #1A1A1A;
      line-height: 1.7;
      max-width: 800px;
      margin: 0 auto;
      padding: 3rem 2rem;
    }
    h1, h2, h3 {
      font-family: 'Playfair Display', serif;
      line-height: 1.2;
    }
    h1 { font-size: 2.5rem; font-weight: 900; letter-spacing: -0.03em; }
    h2 { font-size: 1.5rem; font-weight: 700; margin: 2rem 0 1rem; }
    h3 { font-size: 1.15rem; margin: 1.5rem 0 0.5rem; }
    hr { border: none; height: 1px; background: #D4D0C8; margin: 2rem 0; }
    hr.thick { height: 2px; background: #1A1A1A; }
    p { margin-bottom: 0.75rem; color: #6B6B6B; }
    .mono { font-family: 'IBM Plex Mono', monospace; }
    .score { font-family: 'IBM Plex Mono', monospace; font-size: 6rem; font-weight: 700; line-height: 1; letter-spacing: -0.04em; }
    .label { font-family: 'IBM Plex Mono', monospace; font-size: 0.7rem; letter-spacing: 0.15em; text-transform: uppercase; color: #999; }
    .row { display: flex; justify-content: space-between; padding: 0.5rem 0; border-bottom: 1px solid #D4D0C8; }
    .row:last-child { border-bottom: none; }
    .row-label { color: #6B6B6B; }
    .row-value { font-family: 'IBM Plex Mono', monospace; font-weight: 600; }
    .accent { color: #8B1A1A; font-style: italic; }
    .success { color: #2D5016; }
    .columns { display: grid; grid-template-columns: 1fr 1fr; gap: 2rem; }
    .keyword { font-family: 'IBM Plex Mono', monospace; font-size: 0.85rem; padding: 0.2rem 0; }
    blockquote {
      font-family: 'Playfair Display', serif;
      font-style: italic;
      font-size: 1.05rem;
      padding-left: 1.5rem;
      border-left: 2px solid #D4D0C8;
      margin: 0.5rem 0 1.5rem;
      color: #6B6B6B;
    }
    blockquote.after { color: #1A1A1A; border-left-color: #8B1A1A; }
    .gap-list { list-style: none; padding-left: 1.5rem; }
    .gap-list li { position: relative; padding: 0.2rem 0; color: #6B6B6B; }
    .gap-list li::before { content: '—'; position: absolute; left: -1.5rem; color: #999; }
    .header { text-align: center; padding-bottom: 2rem; border-bottom: 2px solid #1A1A1A; margin-bottom: 2rem; }
    .date { font-family: 'IBM Plex Mono', monospace; font-size: 0.75rem; color: #999; letter-spacing: 0.1em; }
    @media print { body { padding: 1rem; } }
  </style>
</head>
<body>
  <div class="header">
    <p class="label">Resume Analysis Report</p>
    <h1>Resume Analyzer</h1>
    <p class="date">${new Date().toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}</p>
  </div>

  <p class="label">ATS Compatibility Score</p>
  <div class="score" style="color: ${getScoreColor(result.atsScore.overall)}">${result.atsScore.overall}</div>
  
  <hr class="thick" style="margin-top: 2rem;">
  
  ${result.atsScore.breakdown
    .map(
      (b) => `<div class="row"><span class="row-label">${b.category}</span><span class="row-value">${b.score} / ${b.maxScore}</span></div>`
    )
    .join("")}
  
  <hr>
  
  ${result.atsScore.narrative
    .split("\n")
    .map((p) => `<p>${p}</p>`)
    .join("")}
  
  <hr class="thick">
  
  <h2>Section Analysis</h2>
  ${result.sectionAnalysis
    .map(
      (s) => `
    <h3>${s.section}${s.rating === "weak" ? ' <span class="accent">— Perlu Perbaikan</span>' : ""}${s.rating === "strong" ? ' <span class="success" style="font-style:italic">— Kuat</span>' : ""}</h3>
    ${s.analysis
      .split("\n")
      .map((p) => `<p>${p}</p>`)
      .join("")}
    <hr>
  `
    )
    .join("")}
  
  <hr class="thick">
  
  <h2>Keyword Analysis</h2>
  <div class="columns">
    <div>
      <p class="label">Ditemukan</p>
      ${result.keywords.present.map((k) => `<div class="keyword success">${k}</div>`).join("")}
    </div>
    <div>
      <p class="label" style="color:#8B1A1A">Kurang</p>
      ${result.keywords.missing.map((k) => `<div class="keyword accent">${k}</div>`).join("")}
    </div>
  </div>
  
  <hr class="thick">
  
  <h2>Rewrite Suggestions</h2>
  ${result.rewriteSuggestions
    .map(
      (r) => `
    <h3>${r.section}</h3>
    <p class="label">Sebelum —</p>
    <blockquote>${r.before}</blockquote>
    <p class="label">Sesudah —</p>
    <blockquote class="after">${r.after}</blockquote>
    <hr>
  `
    )
    .join("")}
  
  ${
    result.jobMatch
      ? `
  <hr class="thick">
  <p class="label">Job Match Score</p>
  <div class="score" style="font-size:4rem; color: ${getScoreColor(result.jobMatch.score)}">${result.jobMatch.score}</div>
  <p style="margin-top:1rem">${result.jobMatch.verdict}</p>
  ${
    result.jobMatch.skillGaps.length > 0
      ? `<h3>Skill Gap</h3><ul class="gap-list">${result.jobMatch.skillGaps.map((g) => `<li>${g}</li>`).join("")}</ul>`
      : ""
  }
  `
      : ""
  }
  
  <hr class="thick" style="margin-top:3rem">
  <p class="date" style="text-align:center; margin-top:1rem">Generated by Resume Analyzer</p>
</body>
</html>`;
}
