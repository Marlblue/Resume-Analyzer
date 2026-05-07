"use client";

import { useState, useEffect } from "react";

const stages = [
  "Mengekstrak teks dokumen...",
  "Mengevaluasi format ATS...",
  "Menganalisis keyword industri...",
  "Menyusun saran perbaikan AI...",
];

export default function LoadingState() {
  const [stageIndex, setStageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setStageIndex((prev) => (prev + 1) % stages.length);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="container" style={{ padding: "8rem 2rem", textAlign: "center" }}>
      <p className="loading-text">{stages[stageIndex]}</p>
      <div className="progress-bar mt-md" style={{ maxWidth: "300px", margin: "2rem auto 0" }}>
        <div
          className="progress-bar-fill"
          style={{
            width: `${((stageIndex + 1) / stages.length) * 100}%`,
          }}
        />
      </div>
    </div>
  );
}
