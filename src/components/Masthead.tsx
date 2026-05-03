"use client";

import { useTheme } from "./ThemeProvider";

export default function Masthead() {
  const { theme, toggleTheme } = useTheme();

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <header className="masthead">
      <div className="masthead-inner">
        <span className="masthead-title">Resume Analyzer</span>
        <span className="masthead-date">{today}</span>
        <button
          className="theme-toggle"
          onClick={toggleTheme}
          aria-label="Toggle theme"
          id="theme-toggle"
        >
          {theme === "light" ? "Dark" : "Light"}
        </button>
      </div>
    </header>
  );
}
