export interface KeywordMatchItem {
  keyword: string;
  category: 'Hard Skill' | 'Tool & Tech' | 'Soft Skill' | 'Domain Knowledge';
  matched: boolean;
  frequencyInJd: number;
}

export interface LinterWarningItem {
  id: string;
  type: 'critical' | 'warning' | 'info';
  title: string;
  description: string;
  recommendation: string;
}

export interface ScoreBreakdown {
  keywordMatchScore: number; // 0 - 100
  experienceScore: number;   // 0 - 100
  formatParseabilityScore: number; // 0 - 100
  actionVerbScore: number;   // 0 - 100
}

export interface AtsAnalysisResult {
  overallScore: number; // 0 - 100
  breakdown: ScoreBreakdown;
  matchedKeywords: KeywordMatchItem[];
  missingKeywords: KeywordMatchItem[];
  linterWarnings: LinterWarningItem[];
  jobTitleMatched: boolean;
  analyzedAt: string;
}

export interface JobDescriptionInput {
  jobTitle: string;
  companyName?: string;
  descriptionText: string;
}
