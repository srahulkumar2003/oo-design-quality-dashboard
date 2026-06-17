import { useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import gsap from 'gsap';
import {
  Activity,
  BarChart3,
  BookOpen,
  Boxes,
  Code2,
  Database,
  Download,
  ExternalLink,
  FileText,
  GitBranch,
  Github,
  Layers3,
  Lightbulb,
  Network,
  Rocket,
  ServerCog,
  ShieldCheck,
  TrendingUp,
  Upload
} from 'lucide-react';
import { FileUpload } from './components/FileUpload';
import { MetricsTable } from './components/MetricsTable';
import { SuggestionPanel } from './components/SuggestionPanel';
import { ChartsPanel } from './components/ChartsPanel';
import { ThreeBackground } from './components/ThreeBackground';
import { AnalysisResult, ClassMetrics } from './types/metrics';
import { MetricsCalculator } from './utils/metricsCalculator';

const demoClasses: ClassMetrics[] = [
  {
    className: 'DesignQualityAnalyzer',
    filePath: 'src/analyzer/DesignQualityAnalyzer.java',
    WMC: 18,
    RFC: 28,
    CBO: 8,
    LCOM: 0.34,
    DIT: 2,
    designScore: 73,
    riskLevel: 'Moderate',
    grade: 'B',
    suggestion: 'Primary focus: reduce responsibility surface and keep analysis orchestration separate from scoring logic.',
    issues: ['Large response surface detected (RFC: 28).'],
    strengths: ['Complexity is under control (WMC: 18).', 'Coupling level is acceptable (CBO: 8).', 'Inheritance depth is manageable (DIT: 2).'],
    evidence: ['RFC shows many possible method responses, which increases testing effort.'],
    refactorBacklog: ['Move report formatting into a separate ReportBuilder class.', 'Keep metric extraction and grading as separate services.']
  },
  {
    className: 'MetricsExtractionService',
    filePath: 'src/metrics/MetricsExtractionService.java',
    WMC: 26,
    RFC: 42,
    CBO: 14,
    LCOM: 0.62,
    DIT: 2,
    designScore: 48,
    riskLevel: 'Critical',
    grade: 'D',
    suggestion: 'Primary focus: improve cohesion by splitting unrelated responsibilities into smaller classes.',
    issues: ['High weighted complexity detected (WMC: 26).', 'Large response surface detected (RFC: 42).', 'High class coupling detected (CBO: 14).', 'Low cohesion detected (LCOM: 0.62).'],
    strengths: ['Inheritance depth is manageable (DIT: 2).'],
    evidence: ['WMC contributed strongly because the class has many methods or decision branches.', 'CBO shows multiple external dependencies and possible maintenance risk.', 'LCOM indicates methods and data may not be strongly related.'],
    refactorBacklog: ['Create a high-priority refactoring ticket before adding new features to this class.', 'Extract AST traversal into JavaParserAdapter.', 'Introduce interfaces for metric collectors.', 'Create independent collectors for WMC, RFC, CBO, LCOM, and DIT.']
  },
  {
    className: 'SuggestionEngine',
    filePath: 'src/suggestions/SuggestionEngine.java',
    WMC: 12,
    RFC: 18,
    CBO: 5,
    LCOM: 0.21,
    DIT: 1,
    designScore: 88,
    riskLevel: 'Low',
    grade: 'A',
    suggestion: 'Class design is healthy. Keep monitoring design score during future commits.',
    issues: [],
    strengths: ['Complexity is under control (WMC: 12).', 'Response surface is focused (RFC: 18).', 'Coupling level is acceptable (CBO: 5).', 'Cohesion is healthy (LCOM: 0.21).', 'Inheritance depth is manageable (DIT: 1).'],
    evidence: [],
    refactorBacklog: ['Add feedback loop support so accepted and rejected suggestions can improve future templates.']
  },
  {
    className: 'QualityGateController',
    filePath: 'src/api/QualityGateController.java',
    WMC: 9,
    RFC: 14,
    CBO: 6,
    LCOM: 0.18,
    DIT: 2,
    designScore: 91,
    riskLevel: 'Low',
    grade: 'A',
    suggestion: 'Class design is healthy. Keep monitoring design score during future commits.',
    issues: [],
    strengths: ['Complexity is under control (WMC: 9).', 'Response surface is focused (RFC: 14).', 'Cohesion is healthy (LCOM: 0.18).', 'Inheritance depth is manageable (DIT: 2).'],
    evidence: [],
    refactorBacklog: ['Expose this class as a CI quality gate endpoint for pull request checks.']
  }
];

const projectHighlights = [
  {
    title: 'Research-backed problem',
    body: 'Early academic and small software projects often have low cohesion, high coupling, and large classes. The dashboard makes those design risks visible before they become maintenance problems.',
    icon: BookOpen
  },
  {
    title: 'Metric-driven grading',
    body: 'Uses WMC, RFC, CBO, LCOM, and DIT with a weighted score model inspired by the presentation. Every class receives a grade, risk level, and diagnosis.',
    icon: BarChart3
  },
  {
    title: 'Actionable suggestions',
    body: 'Generates practical refactoring guidance such as Extract Class, Extract Method, Dependency Injection, and composition over deep inheritance.',
    icon: Lightbulb
  },
  {
    title: 'DevOps-ready quality gate',
    body: 'The project now includes Docker, GitHub Actions, build validation, and a plan to fail pull requests when design quality drops.',
    icon: ServerCog
  }
];

const toolLinks = [
  ['GSAP', 'Used for hero entrance animation', 'https://gsap.com/'],
  ['Three.js', 'Used for animated WebGL dashboard background', 'https://threejs.org/'],
  ['Framer Motion', 'Used for React page transitions and cards', 'https://motion.dev/'],
  ['Tailwind CSS', 'Used for fast responsive UI styling', 'https://tailwindcss.com/'],
  ['Spline', 'Recommended for future 3D architecture scene', 'https://spline.design/'],
  ['Anime.js', 'Optional lightweight micro-interactions', 'https://animejs.com/'],
  ['Lenis', 'Optional smooth scroll upgrade', 'https://lenis.dev/'],
  ['shadcn/ui', 'Recommended if adding production components', 'https://ui.shadcn.com/']
];

const devopsItems = [
  {
    title: 'GitHub Actions CI',
    body: 'Runs npm ci, TypeScript build, and Vite production build on every push or pull request.',
    icon: GitBranch
  },
  {
    title: 'Dockerized frontend',
    body: 'Multi-stage Dockerfile builds the React app and serves it through Nginx.',
    icon: Boxes
  },
  {
    title: 'Infrastructure plan',
    body: 'Can deploy static UI on Netlify/Vercel/S3 CloudFront and connect future analyzer APIs to Render, Railway, or AWS ECS.',
    icon: Network
  },
  {
    title: 'Quality gate roadmap',
    body: 'Next backend step: upload a Java project, store results, track score per commit, and block risky pull requests.',
    icon: ShieldCheck
  }
];


const buildAnalysisResult = (metrics: ClassMetrics[]): AnalysisResult => {
  const averageDesignScore = Math.round(metrics.reduce((sum, metric) => sum + metric.designScore, 0) / metrics.length);
  const averageGrade =
    averageDesignScore >= 85 ? 'A' :
    averageDesignScore >= 70 ? 'B' :
    averageDesignScore >= 50 ? 'C' : 'D';

  return {
    classes: metrics,
    summary: {
      totalClasses: metrics.length,
      averageGrade,
      averageDesignScore,
      criticalIssues: metrics.reduce((sum, metric) => sum + metric.issues.length, 0),
      suggestions: metrics.reduce((sum, metric) => sum + metric.refactorBacklog.length, 0),
      highRiskClasses: metrics.filter((metric) => metric.riskLevel === 'High' || metric.riskLevel === 'Critical').length
    }
  };
};

function App() {
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult>(() => buildAnalysisResult(demoClasses));
  const [selectedClass, setSelectedClass] = useState<ClassMetrics | null>(demoClasses[0]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [activeTab, setActiveTab] = useState<'table' | 'charts'>('table');
  const [isDemoMode, setIsDemoMode] = useState(true);
  const heroRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!heroRef.current) return;

    const context = gsap.context(() => {
      gsap.fromTo(
        '.hero-animate',
        { y: 26, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, stagger: 0.1, ease: 'power3.out' }
      );
    }, heroRef);

    return () => context.revert();
  }, []);

  const handleFilesSelected = useCallback(async (files: File[]) => {
    if (files.length === 0) {
      const demoResult = buildAnalysisResult(demoClasses);
      setAnalysisResult(demoResult);
      setSelectedClass(demoClasses[0]);
      setIsDemoMode(true);
      return;
    }

    setIsAnalyzing(true);

    try {
      const metrics: ClassMetrics[] = [];

      for (const file of files) {
        const content = await file.text();
        metrics.push(MetricsCalculator.calculateMetrics(content, file.name));
      }

      const result = buildAnalysisResult(metrics);
      setAnalysisResult(result);
      setSelectedClass(metrics[0] || null);
      setIsDemoMode(false);
    } catch (error) {
      console.error('Analysis failed:', error);
    } finally {
      setIsAnalyzing(false);
    }
  }, []);

  const handleClassSelect = useCallback((classMetrics: ClassMetrics) => {
    setSelectedClass(classMetrics);
  }, []);

  const downloadReport = () => {
    const blob = new Blob([JSON.stringify(analysisResult, null, 2)], {
      type: 'application/json'
    });
    const href = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = href;
    anchor.download = 'oo-design-quality-report.json';
    anchor.click();
    URL.revokeObjectURL(href);
  };

  const setDemoDashboard = () => {
    const demoResult = buildAnalysisResult(demoClasses);
    setAnalysisResult(demoResult);
    setSelectedClass(demoClasses[0]);
    setIsDemoMode(true);
  };

  const summaryCards = [
    { icon: FileText, value: analysisResult.summary.totalClasses, label: 'Classes' },
    { icon: TrendingUp, value: analysisResult.summary.averageGrade, label: 'Average Grade' },
    { icon: Activity, value: analysisResult.summary.averageDesignScore, label: 'Avg Score' },
    { icon: Upload, value: analysisResult.summary.criticalIssues, label: 'Issues Found' },
    { icon: Lightbulb, value: analysisResult.summary.suggestions, label: 'Suggestions' }
  ];

  const infrastructureLayers = [
    { icon: Code2, title: 'Frontend', body: 'React + TypeScript + Vite + Tailwind with Framer Motion, GSAP, and Three.js.' },
    { icon: Database, title: 'Future backend', body: 'Spring Boot or Node API for project upload, metric history, and report persistence.' },
    { icon: Layers3, title: 'Cloud path', body: 'Static frontend on Netlify/Vercel/S3. API on Render/Railway/AWS ECS. Reports in MySQL/PostgreSQL.' }
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <header className="sticky top-0 z-40 border-b border-white/10 bg-slate-950/80 backdrop-blur-xl">
        <div className="mx-auto flex h-18 max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <a href="#top" className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-cyan-300 text-slate-950 shadow-lg shadow-cyan-500/20">
              <BarChart3 className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-base font-bold sm:text-lg">OO Design Quality Dashboard</h1>
              <p className="text-xs text-slate-400">CIET 2026 research project</p>
            </div>
          </a>

          <nav className="hidden items-center gap-6 text-sm text-slate-300 md:flex">
            <a href="#dashboard" className="transition hover:text-cyan-200">Dashboard</a>
            <a href="#assets" className="transition hover:text-cyan-200">PPT & Certificate</a>
            <a href="#devops" className="transition hover:text-cyan-200">DevOps</a>
            <a href="#profiles" className="transition hover:text-cyan-200">Profiles</a>
          </nav>

          <div className="flex items-center gap-2">
            <a
              href="https://github.com/srahulkumar2003"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-white/10 px-4 py-2 text-sm text-slate-200 transition hover:border-cyan-300/50 hover:text-cyan-100"
            >
              <Github className="h-4 w-4" />
              GitHub
            </a>
            <a
              href="https://in.linkedin.com/in/samboju-rahul-kumar-8464a5255"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden items-center gap-2 rounded-full border border-white/10 px-4 py-2 text-sm text-slate-200 transition hover:border-cyan-300/50 hover:text-cyan-100 sm:inline-flex"
            >
              <ExternalLink className="h-4 w-4" />
              LinkedIn
            </a>
          </div>
        </div>
      </header>

      <main id="top">
        <section ref={heroRef} className="relative overflow-hidden">
          <ThreeBackground />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(14,165,233,0.32),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(249,115,22,0.22),transparent_30%)]" />
          <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
            <div className="grid gap-12 lg:grid-cols-[1.08fr_0.92fr] lg:items-center">
              <div>
                <motion.div className="hero-animate mb-5 inline-flex items-center gap-2 rounded-full border border-cyan-300/30 bg-cyan-300/10 px-4 py-2 text-sm text-cyan-100">
                  <ShieldCheck className="h-4 w-4" />
                  Certificate of Presentation · CIET 2026
                </motion.div>
                <h2 className="hero-animate max-w-4xl text-4xl font-black tracking-tight text-white sm:text-6xl">
                  Intelligent dashboard for Object-Oriented Design Quality Analysis
                </h2>
                <p className="hero-animate mt-6 max-w-2xl text-lg leading-8 text-slate-300">
                  A research-backed project based on your CIET 2026 paper. It analyzes Java classes, grades design quality, explains metric evidence, and recommends refactoring actions for maintainable software.
                </p>

                <div className="hero-animate mt-8 flex flex-col gap-3 sm:flex-row">
                  <a
                    href="#dashboard"
                    className="inline-flex items-center justify-center gap-2 rounded-full bg-cyan-300 px-6 py-3 font-semibold text-slate-950 shadow-xl shadow-cyan-500/20 transition hover:bg-cyan-200"
                  >
                    <Activity className="h-5 w-5" />
                    Open dashboard
                  </a>
                  <button
                    onClick={setDemoDashboard}
                    className="inline-flex items-center justify-center gap-2 rounded-full border border-white/10 px-6 py-3 font-semibold text-white transition hover:border-cyan-300/50 hover:bg-white/5"
                  >
                    <Rocket className="h-5 w-5" />
                    Load demo analysis
                  </button>
                </div>

                <div className="hero-animate mt-10 grid max-w-2xl grid-cols-2 gap-4 sm:grid-cols-4">
                  {[
                    ['5', 'OO Metrics'],
                    ['100', 'Score Model'],
                    ['CI/CD', 'DevOps Ready'],
                    ['2026', 'Conference']
                  ].map(([value, label]) => (
                    <div key={label} className="rounded-2xl border border-white/10 bg-white/[0.06] p-4 backdrop-blur">
                      <div className="text-2xl font-black text-white">{value}</div>
                      <div className="mt-1 text-xs uppercase tracking-[0.2em] text-slate-400">{label}</div>
                    </div>
                  ))}
                </div>
              </div>

              <motion.div
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.35, duration: 0.6 }}
                className="rounded-[2rem] border border-white/10 bg-white/[0.06] p-5 shadow-2xl shadow-black/30 backdrop-blur-xl"
              >
                <div className="rounded-[1.5rem] border border-white/10 bg-slate-950/70 p-5">
                  <div className="mb-5 flex items-center justify-between">
                    <div>
                      <p className="text-sm text-slate-400">Research project</p>
                      <h3 className="text-xl font-bold text-white">Quality Gate Overview</h3>
                    </div>
                    <span className="rounded-full bg-emerald-400/15 px-3 py-1 text-xs font-semibold text-emerald-200 ring-1 ring-emerald-300/30">
                      Live demo
                    </span>
                  </div>

                  <div className="space-y-4">
                    {demoClasses.map((item) => (
                      <div key={item.className} className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                        <div className="flex items-center justify-between gap-4">
                          <div>
                            <p className="font-semibold text-white">{item.className}</p>
                            <p className="text-xs text-slate-500">{item.riskLevel} risk</p>
                          </div>
                          <div className="text-right">
                            <p className="text-2xl font-black text-cyan-200">{item.designScore}</p>
                            <p className="text-xs text-slate-500">Grade {item.grade}</p>
                          </div>
                        </div>
                        <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/10">
                          <div className="h-full rounded-full bg-cyan-300" style={{ width: `${item.designScore}%` }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {projectHighlights.map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.07 }}
                className="rounded-3xl border border-white/10 bg-white/[0.05] p-6"
              >
                <item.icon className="mb-5 h-8 w-8 text-cyan-300" />
                <h3 className="text-lg font-bold text-white">{item.title}</h3>
                <p className="mt-3 text-sm leading-6 text-slate-400">{item.body}</p>
              </motion.div>
            ))}
          </div>
        </section>

        <section id="dashboard" className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <div className="mb-8 flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
            <div>
              <p className="mb-2 text-sm font-semibold uppercase tracking-[0.24em] text-cyan-300">Analyzer</p>
              <h2 className="text-3xl font-black text-white sm:text-4xl">Upload code and inspect design quality</h2>
              <p className="mt-3 max-w-3xl text-slate-400">
                {isDemoMode
                  ? 'Demo data is loaded from the research concept. Upload your own Java files to replace it.'
                  : 'Your uploaded Java classes are being used for the dashboard results.'}
              </p>
            </div>
            <button
              onClick={downloadReport}
              className="inline-flex items-center justify-center gap-2 rounded-full border border-white/10 px-5 py-3 text-sm font-semibold text-white transition hover:border-cyan-300/50 hover:bg-white/5"
            >
              <Download className="h-4 w-4" />
              Export JSON report
            </button>
          </div>

          <div className="mb-8">
            <FileUpload onFilesSelected={handleFilesSelected} isAnalyzing={isAnalyzing} />
          </div>

          <AnimatePresence>
            {isAnalyzing && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="mb-8 rounded-3xl border border-cyan-300/20 bg-cyan-300/10 p-8 text-center"
              >
                <div className="inline-flex items-center space-x-3">
                  <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-cyan-300" />
                  <span className="text-lg font-medium text-cyan-100">Analyzing Java files...</span>
                </div>
                <p className="mt-2 text-slate-400">Calculating OO metrics and generating refactoring suggestions.</p>
              </motion.div>
            )}
          </AnimatePresence>

          {!isAnalyzing && (
            <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
              <div className="grid grid-cols-1 gap-5 md:grid-cols-5">
                {summaryCards.map(({ icon: Icon, value, label }) => (
                  <div key={label} className="rounded-3xl border border-white/10 bg-white/[0.05] p-5">
                    <Icon className="mb-4 h-7 w-7 text-cyan-300" />
                    <p className="text-3xl font-black text-white">{value}</p>
                    <p className="mt-1 text-sm text-slate-400">{label}</p>
                  </div>
                ))}
              </div>

              <div className="border-b border-white/10">
                <nav className="-mb-px flex gap-8">
                  {[
                    ['table', 'Detailed Analysis'],
                    ['charts', 'Visual Analytics']
                  ].map(([tab, label]) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab as 'table' | 'charts')}
                      className={`border-b-2 px-1 py-3 text-sm font-semibold transition ${
                        activeTab === tab
                          ? 'border-cyan-300 text-cyan-200'
                          : 'border-transparent text-slate-500 hover:text-slate-300'
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </nav>
              </div>

              <AnimatePresence mode="wait">
                {activeTab === 'table' ? (
                  <motion.div
                    key="table"
                    initial={{ opacity: 0, x: -18 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 18 }}
                    className="grid grid-cols-1 gap-8 lg:grid-cols-3"
                  >
                    <div className="lg:col-span-2">
                      <MetricsTable
                        metrics={analysisResult.classes}
                        onClassSelect={handleClassSelect}
                        selectedClass={selectedClass}
                      />
                    </div>
                    <SuggestionPanel selectedClass={selectedClass} />
                  </motion.div>
                ) : (
                  <motion.div
                    key="charts"
                    initial={{ opacity: 0, x: 18 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -18 }}
                  >
                    <ChartsPanel metrics={analysisResult.classes} />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}
        </section>

        <section id="assets" className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <div className="mb-8">
            <p className="mb-2 text-sm font-semibold uppercase tracking-[0.24em] text-cyan-300">Research assets</p>
            <h2 className="text-3xl font-black text-white sm:text-4xl">PPT and certificate added inside the project</h2>
            <p className="mt-3 max-w-3xl text-slate-400">
              The uploaded presentation and certificate are now stored in <span className="font-mono text-cyan-200">public/research</span>, so they ship with the project.
            </p>
          </div>

          <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
            <div className="rounded-3xl border border-white/10 bg-white/[0.05] p-6">
              <div className="flex h-full flex-col justify-between">
                <div>
                  <FileText className="mb-5 h-9 w-9 text-cyan-300" />
                  <h3 className="text-2xl font-bold text-white">Conference presentation</h3>
                  <p className="mt-3 text-sm leading-6 text-slate-400">
                    Title: An Intelligent Dashboard for Object-Oriented Design Quality Analysis and AI-Powered Suggestions.
                  </p>
                  <div className="mt-5 space-y-3 text-sm text-slate-300">
                    <p><span className="text-slate-500">Conference:</span> International Conference on Cognitive Informatics Engineering and Technology 2026</p>
                    <p><span className="text-slate-500">Author:</span> S. Rahul Kumar, KLEF, Vaddeswaram, AP</p>
                    <p><span className="text-slate-500">Project use:</span> Problem statement, metrics, grading model, architecture, evaluation, future work.</p>
                  </div>
                </div>
                <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                  <a
                    href="/research/research1.pptx"
                    download
                    className="inline-flex items-center justify-center gap-2 rounded-full bg-cyan-300 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-200"
                  >
                    <Download className="h-4 w-4" />
                    Download PPT
                  </a>
                  <a
                    href="/research/research1.pptx"
                    className="inline-flex items-center justify-center gap-2 rounded-full border border-white/10 px-5 py-3 text-sm font-semibold text-white transition hover:border-cyan-300/50"
                  >
                    <ExternalLink className="h-4 w-4" />
                    Open asset
                  </a>
                </div>
              </div>
            </div>

            <div className="overflow-hidden rounded-3xl border border-white/10 bg-white/[0.05] p-3">
              <img
                src="/research/certificate-presentation.png"
                alt="Certificate of presentation for the CIET 2026 research paper"
                className="max-h-[620px] w-full rounded-[1.25rem] object-contain"
              />
            </div>
          </div>
        </section>

        <section id="devops" className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <div className="mb-8">
            <p className="mb-2 text-sm font-semibold uppercase tracking-[0.24em] text-cyan-300">DevOps and infrastructure</p>
            <h2 className="text-3xl font-black text-white sm:text-4xl">DevOps and Infrastructure Roadmap</h2>
            <p className="mt-3 max-w-3xl text-slate-400">
              The project includes Docker, CI workflow, and a future quality-gate plan for tracking object-oriented design metrics across commits.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {devopsItems.map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.07 }}
                className="rounded-3xl border border-white/10 bg-white/[0.05] p-6"
              >
                <item.icon className="mb-5 h-8 w-8 text-orange-300" />
                <h3 className="text-lg font-bold text-white">{item.title}</h3>
                <p className="mt-3 text-sm leading-6 text-slate-400">{item.body}</p>
              </motion.div>
            ))}
          </div>

          <div className="mt-8 grid gap-6 lg:grid-cols-3">
            {infrastructureLayers.map(({ icon: Icon, title, body }) => (
              <div key={title} className="rounded-3xl border border-white/10 bg-slate-900/60 p-6">
                <Icon className="mb-5 h-8 w-8 text-cyan-300" />
                <h3 className="text-xl font-bold text-white">{title}</h3>
                <p className="mt-3 text-sm leading-6 text-slate-400">{body}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <div className="mb-8">
            <p className="mb-2 text-sm font-semibold uppercase tracking-[0.24em] text-cyan-300">Modern UI stack</p>
            <h2 className="text-3xl font-black text-white sm:text-4xl">Animation and UX tools mapped to the project</h2>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {toolLinks.map(([name, purpose, url]) => (
              <a
                key={name}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="group rounded-3xl border border-white/10 bg-white/[0.05] p-5 transition hover:-translate-y-1 hover:border-cyan-300/40 hover:bg-white/[0.08]"
              >
                <div className="mb-4 flex items-center justify-between">
                  <span className="font-bold text-white">{name}</span>
                  <ExternalLink className="h-4 w-4 text-slate-500 transition group-hover:text-cyan-300" />
                </div>
                <p className="text-sm leading-6 text-slate-400">{purpose}</p>
              </a>
            ))}
          </div>
        </section>

        <section id="profiles" className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <div className="rounded-3xl border border-white/10 bg-white/[0.05] p-6">
            <Github className="mb-5 h-9 w-9 text-cyan-300" />
            <h2 className="text-3xl font-black text-white">Profiles</h2>
            <p className="mt-3 text-sm leading-6 text-slate-400">
              Connect the project with your public developer and professional profiles so visitors can review your work, research assets, and career background.
            </p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <a
                href="https://github.com/srahulkumar2003"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-cyan-300 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-200"
              >
                <Github className="h-4 w-4" />
                GitHub profile
              </a>
              <a
                href="https://in.linkedin.com/in/samboju-rahul-kumar-8464a5255"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-white/10 px-5 py-3 text-sm font-semibold text-white transition hover:border-cyan-300/50"
              >
                <ExternalLink className="h-4 w-4" />
                LinkedIn profile
              </a>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-white/10 py-10">
        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-4 px-4 text-sm text-slate-500 sm:px-6 md:flex-row lg:px-8">
          <p>Built by S. Rahul Kumar as a research-backed OO design quality analysis project.</p>
          <p>React · TypeScript · Tailwind · GSAP · Three.js</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
