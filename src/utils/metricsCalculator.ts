import { ClassMetrics, DesignGrade, RiskLevel } from '../types/metrics';

export class MetricsCalculator {
  static calculateMetrics(javaCode: string, fileName: string): ClassMetrics {
    const className = this.extractClassName(javaCode) || fileName.replace(/\.java$/i, '');

    const methodMatches = javaCode.match(
      /(public|private|protected)\s+(static\s+)?[\w<>\[\], ?]+\s+\w+\s*\([^)]*\)\s*\{/g
    ) || [];

    const branchMatches = javaCode.match(/\b(if|for|while|case|catch|switch|&&|\|\|)\b/g) || [];
    const WMC = Math.max(methodMatches.length, 1) + branchMatches.length;

    const methodCallMatches = javaCode.match(/\b\w+\s*\.\s*\w+\s*\(/g) || [];
    const localCallMatches = javaCode.match(/\b\w+\s*\(/g) || [];
    const RFC = Math.min(WMC + methodCallMatches.length + Math.floor(localCallMatches.length / 4), 120);

    const importMatches = javaCode.match(/import\s+[\w.*]+;/g) || [];
    const constructorMatches = javaCode.match(/new\s+[A-Z]\w+\s*\(/g) || [];
    const injectedFields = javaCode.match(/(private|protected|public)\s+(final\s+)?[A-Z]\w+[<\w, ?]*\s+\w+/g) || [];
    const CBO = Math.min(new Set([...importMatches, ...constructorMatches, ...injectedFields]).size, 60);

    const fieldMatches = javaCode.match(/(private|protected|public)\s+(static\s+)?(final\s+)?[\w<>\[\], ?]+\s+\w+\s*(=|;)/g) || [];
    const methodToFieldRatio = fieldMatches.length > 0
      ? Math.min(fieldMatches.length / Math.max(methodMatches.length, 1), 1)
      : 0;
    const LCOM = Math.round(methodToFieldRatio * 100) / 100;

    const extendsMatch = javaCode.match(/extends\s+\w+/);
    const implementsMatch = javaCode.match(/implements\s+[\w,\s]+/);
    const DIT = 1 + (extendsMatch ? 1 : 0) + (implementsMatch ? 1 : 0);

    const designScore = this.calculateDesignScore(WMC, RFC, CBO, LCOM, DIT);
    const grade = this.calculateGrade(designScore);
    const riskLevel = this.calculateRiskLevel(designScore);
    const { suggestion, issues, strengths, evidence, refactorBacklog } =
      this.generateAdvice(WMC, RFC, CBO, LCOM, DIT, designScore);

    return {
      className,
      filePath: fileName,
      WMC,
      RFC,
      CBO,
      LCOM,
      DIT,
      designScore,
      riskLevel,
      grade,
      suggestion,
      issues,
      strengths,
      evidence,
      refactorBacklog
    };
  }

  private static extractClassName(javaCode: string): string | null {
    const classMatch = javaCode.match(/\b(class|interface|enum)\s+(\w+)/);
    return classMatch ? classMatch[2] : null;
  }

  private static metricScore(value: number, good: number, warning: number, critical: number): number {
    if (value <= good) return 100;
    if (value <= warning) return 80;
    if (value <= critical) return 55;
    return 30;
  }

  private static calculateDesignScore(WMC: number, RFC: number, CBO: number, LCOM: number, DIT: number): number {
    const wmcScore = this.metricScore(WMC, 10, 20, 30);
    const rfcScore = this.metricScore(RFC, 15, 25, 40);
    const cboScore = this.metricScore(CBO, 5, 10, 15);
    const lcomScore = LCOM <= 0.2 ? 100 : LCOM <= 0.4 ? 80 : LCOM <= 0.6 ? 55 : 30;
    const ditScore = this.metricScore(DIT, 3, 5, 7);

    return Math.round(
      wmcScore * 0.25 +
      rfcScore * 0.20 +
      cboScore * 0.20 +
      lcomScore * 0.25 +
      ditScore * 0.10
    );
  }

  private static calculateGrade(score: number): DesignGrade {
    if (score >= 85) return 'A';
    if (score >= 70) return 'B';
    if (score >= 50) return 'C';
    return 'D';
  }

  private static calculateRiskLevel(score: number): RiskLevel {
    if (score >= 85) return 'Low';
    if (score >= 70) return 'Moderate';
    if (score >= 50) return 'High';
    return 'Critical';
  }

  private static generateAdvice(WMC: number, RFC: number, CBO: number, LCOM: number, DIT: number, designScore: number) {
    const issues: string[] = [];
    const strengths: string[] = [];
    const evidence: string[] = [];
    const refactorBacklog: string[] = [];

    if (WMC > 20) {
      issues.push(`High weighted complexity detected (WMC: ${WMC}).`);
      evidence.push(`WMC contributed strongly because the class has many methods or decision branches.`);
      refactorBacklog.push('Extract long methods and isolate complex conditional flows.');
    } else {
      strengths.push(`Complexity is under control (WMC: ${WMC}).`);
    }

    if (RFC > 25) {
      issues.push(`Large response surface detected (RFC: ${RFC}).`);
      evidence.push(`RFC shows many possible method responses, which increases testing effort.`);
      refactorBacklog.push('Apply Single Responsibility Principle and reduce public interaction surface.');
    } else {
      strengths.push(`Response surface is focused (RFC: ${RFC}).`);
    }

    if (CBO > 10) {
      issues.push(`High class coupling detected (CBO: ${CBO}).`);
      evidence.push(`CBO shows multiple external dependencies and possible maintenance risk.`);
      refactorBacklog.push('Introduce interfaces, dependency injection, or a service layer to decouple dependencies.');
    } else {
      strengths.push(`Coupling level is acceptable (CBO: ${CBO}).`);
    }

    if (LCOM > 0.6) {
      issues.push(`Low cohesion detected (LCOM: ${LCOM}).`);
      evidence.push(`LCOM indicates methods and data may not be strongly related.`);
      refactorBacklog.push('Extract cohesive groups of fields and methods into smaller classes.');
    } else {
      strengths.push(`Cohesion is healthy (LCOM: ${LCOM}).`);
    }

    if (DIT > 5) {
      issues.push(`Deep inheritance tree detected (DIT: ${DIT}).`);
      evidence.push(`DIT suggests inheritance depth can make behavior harder to understand.`);
      refactorBacklog.push('Prefer composition over inheritance where possible.');
    } else {
      strengths.push(`Inheritance depth is manageable (DIT: ${DIT}).`);
    }

    let suggestion = 'Class design is healthy. Keep monitoring design score during future commits.';

    if (issues.length > 0) {
      if (LCOM > 0.6) {
        suggestion = 'Primary focus: improve cohesion by splitting unrelated responsibilities into smaller classes.';
      } else if (CBO > 10) {
        suggestion = 'Primary focus: reduce coupling using interfaces, dependency injection, and clearer module boundaries.';
      } else if (WMC > 20) {
        suggestion = 'Primary focus: reduce class and method complexity through Extract Method and Extract Class refactoring.';
      } else if (RFC > 25) {
        suggestion = 'Primary focus: reduce responsibility surface and keep the class focused on one business purpose.';
      }
    }

    if (designScore < 50) {
      refactorBacklog.unshift('Create a high-priority refactoring ticket before adding new features to this class.');
    }

    return { suggestion, issues, strengths, evidence, refactorBacklog };
  }
}
