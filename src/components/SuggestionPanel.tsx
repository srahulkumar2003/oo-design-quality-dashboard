import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Lightbulb,
  AlertTriangle,
  CheckCircle,
  BookOpen,
  ArrowRight,
  Target,
  TrendingUp,
  ClipboardList,
  ShieldCheck
} from 'lucide-react';
import { ClassMetrics } from '../types/metrics';

interface SuggestionPanelProps {
  selectedClass: ClassMetrics | null;
}

export const SuggestionPanel: React.FC<SuggestionPanelProps> = ({ selectedClass }) => {
  const getRefactoringTips = (metrics: ClassMetrics) => {
    const tips = [...metrics.refactorBacklog];

    if (tips.length === 0) {
      tips.push('Keep this class in the CI quality gate and monitor score changes per commit.');
      tips.push('Add unit tests around public methods to protect future refactoring.');
    }

    return tips;
  };

  return (
    <AnimatePresence>
      {selectedClass ? (
        <motion.div
          initial={{ opacity: 0, x: 60 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 60 }}
          className="overflow-hidden rounded-3xl border border-white/10 bg-slate-950/80 shadow-2xl shadow-black/20 backdrop-blur"
        >
          <div className="bg-gradient-to-r from-cyan-400/20 via-blue-500/15 to-orange-400/10 px-6 py-5">
            <div className="flex items-center space-x-3">
              <div className="rounded-2xl bg-cyan-300/10 p-3 text-cyan-200 ring-1 ring-cyan-300/30">
                <Lightbulb className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">{selectedClass.className}</h3>
                <p className="text-sm text-slate-300">Evidence-backed refactoring suggestions</p>
              </div>
            </div>
          </div>

          <div className="space-y-6 p-6">
            <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.04] p-4">
              <div className="flex items-center space-x-3">
                <div className={`flex h-14 w-14 items-center justify-center rounded-2xl text-2xl font-bold ${
                  selectedClass.grade === 'A' ? 'bg-emerald-400/15 text-emerald-200' :
                  selectedClass.grade === 'B' ? 'bg-sky-400/15 text-sky-200' :
                  selectedClass.grade === 'C' ? 'bg-amber-400/15 text-amber-200' :
                  'bg-rose-400/15 text-rose-200'
                }`}>
                  {selectedClass.grade}
                </div>
                <div>
                  <p className="font-medium text-white">Design Quality Score</p>
                  <p className="text-sm text-slate-400">{selectedClass.designScore}/100 · {selectedClass.riskLevel} risk</p>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border-l-4 border-cyan-300 bg-cyan-300/10 p-4">
              <div className="flex items-start space-x-3">
                <Target className="mt-0.5 h-5 w-5 text-cyan-200" />
                <div>
                  <h4 className="font-medium text-cyan-100">Primary recommendation</h4>
                  <p className="mt-1 text-sm text-cyan-50/80">{selectedClass.suggestion}</p>
                </div>
              </div>
            </div>

            {selectedClass.issues.length > 0 && (
              <div>
                <div className="mb-3 flex items-center space-x-2">
                  <AlertTriangle className="h-5 w-5 text-rose-300" />
                  <h4 className="font-medium text-white">Design issues</h4>
                </div>
                <div className="space-y-2">
                  {selectedClass.issues.map((issue, index) => (
                    <motion.div
                      key={issue}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.06 }}
                      className="rounded-2xl border border-rose-300/20 bg-rose-400/10 p-3"
                    >
                      <p className="text-sm text-rose-100">{issue}</p>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {selectedClass.strengths.length > 0 && (
              <div>
                <div className="mb-3 flex items-center space-x-2">
                  <CheckCircle className="h-5 w-5 text-emerald-300" />
                  <h4 className="font-medium text-white">Design strengths</h4>
                </div>
                <div className="space-y-2">
                  {selectedClass.strengths.slice(0, 3).map((strength, index) => (
                    <motion.div
                      key={strength}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.06 }}
                      className="rounded-2xl border border-emerald-300/20 bg-emerald-400/10 p-3"
                    >
                      <p className="text-sm text-emerald-100">{strength}</p>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            <div>
              <div className="mb-3 flex items-center space-x-2">
                <ClipboardList className="h-5 w-5 text-orange-300" />
                <h4 className="font-medium text-white">Refactoring backlog</h4>
              </div>
              <div className="space-y-3">
                {getRefactoringTips(selectedClass).map((tip, index) => (
                  <motion.div
                    key={tip}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.06 }}
                    className="rounded-2xl border border-white/10 bg-white/[0.04] p-4"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <p className="text-sm text-slate-200">{tip}</p>
                      <ArrowRight className="mt-1 h-4 w-4 flex-shrink-0 text-cyan-300" />
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {selectedClass.evidence.length > 0 && (
              <div>
                <div className="mb-3 flex items-center space-x-2">
                  <BookOpen className="h-5 w-5 text-sky-300" />
                  <h4 className="font-medium text-white">Evidence</h4>
                </div>
                <div className="space-y-2">
                  {selectedClass.evidence.map((item) => (
                    <p key={item} className="rounded-2xl bg-white/[0.03] p-3 text-sm text-slate-300">
                      {item}
                    </p>
                  ))}
                </div>
              </div>
            )}

            <div>
              <div className="mb-3 flex items-center space-x-2">
                <TrendingUp className="h-5 w-5 text-indigo-300" />
                <h4 className="font-medium text-white">Metrics breakdown</h4>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {[
                  ['WMC', selectedClass.WMC, 'Target ≤ 10'],
                  ['RFC', selectedClass.RFC, 'Target ≤ 15'],
                  ['CBO', selectedClass.CBO, 'Target ≤ 5'],
                  ['LCOM', selectedClass.LCOM, 'Target ≤ 0.2'],
                  ['DIT', selectedClass.DIT, 'Target ≤ 3']
                ].map(([label, value, target]) => (
                  <div key={label} className="rounded-2xl border border-white/10 bg-white/[0.04] p-3">
                    <div className="text-2xl font-bold text-white">{value}</div>
                    <div className="text-xs text-slate-400">{label}</div>
                    <div className="mt-1 text-xs text-slate-500">{target}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-cyan-300/20 bg-cyan-300/10 p-4">
              <div className="flex gap-3">
                <ShieldCheck className="mt-0.5 h-5 w-5 text-cyan-200" />
                <p className="text-sm text-cyan-50/80">
                  CI/CD idea: fail pull requests when score drops below 50 or when high-risk classes increase.
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="rounded-3xl border border-dashed border-white/15 bg-white/[0.04] p-12 text-center"
        >
          <Lightbulb className="mx-auto mb-4 h-12 w-12 text-slate-500" />
          <h3 className="mb-2 text-lg font-medium text-slate-200">Select a class</h3>
          <p className="text-slate-500">
            Click any row in the table to view detailed suggestions and evidence.
          </p>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
