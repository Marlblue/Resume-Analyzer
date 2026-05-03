export interface AnalysisResult {
  atsScore: {
    overall: number;
    breakdown: {
      category: string;
      score: number;
      maxScore: number;
    }[];
    narrative: string;
  };
  sectionAnalysis: {
    section: string;
    rating: "strong" | "moderate" | "weak";
    analysis: string;
  }[];
  keywords: {
    present: string[];
    missing: string[];
  };
  rewriteSuggestions: {
    section: string;
    before: string;
    after: string;
  }[];
  jobMatch: {
    score: number;
    verdict: string;
    skillGaps: string[];
  } | null;
}

export interface AnalyzeRequest {
  resumeText: string;
  jobTitle?: string;
  jobDescription?: string;
}
