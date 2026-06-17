export type DesignGrade = 'A' | 'B' | 'C' | 'D';
export type RiskLevel = 'Low' | 'Moderate' | 'High' | 'Critical';

export interface ClassMetrics {
  className: string;
  filePath?: string;
  WMC: number; // Weighted Methods per Class
  RFC: number; // Response for Class
  CBO: number; // Coupling Between Objects
  LCOM: number; // Lack of Cohesion of Methods
  DIT: number; // Depth of Inheritance Tree
  designScore: number;
  riskLevel: RiskLevel;
  grade: DesignGrade;
  suggestion: string;
  issues: string[];
  strengths: string[];
  evidence: string[];
  refactorBacklog: string[];
}

export interface AnalysisResult {
  classes: ClassMetrics[];
  summary: {
    totalClasses: number;
    averageGrade: string;
    averageDesignScore: number;
    criticalIssues: number;
    suggestions: number;
    highRiskClasses: number;
  };
}
