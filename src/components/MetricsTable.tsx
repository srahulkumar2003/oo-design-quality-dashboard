import React from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, CheckCircle, Info, TrendingUp, Gauge } from 'lucide-react';
import { ClassMetrics } from '../types/metrics';

interface MetricsTableProps {
  metrics: ClassMetrics[];
  onClassSelect: (metrics: ClassMetrics) => void;
  selectedClass?: ClassMetrics | null;
}

export const MetricsTable: React.FC<MetricsTableProps> = ({
  metrics,
  onClassSelect,
  selectedClass
}) => {
  const getGradeColor = (grade: string) => {
    switch (grade) {
      case 'A': return 'text-emerald-200 bg-emerald-400/15 ring-emerald-300/30';
      case 'B': return 'text-sky-200 bg-sky-400/15 ring-sky-300/30';
      case 'C': return 'text-amber-200 bg-amber-400/15 ring-amber-300/30';
      case 'D': return 'text-rose-200 bg-rose-400/15 ring-rose-300/30';
      default: return 'text-slate-200 bg-slate-400/15 ring-slate-300/30';
    }
  };

  const getMetricStatus = (value: number, thresholds: { good: number; warning: number }) => {
    if (value <= thresholds.good) return { icon: CheckCircle, color: 'text-emerald-300' };
    if (value <= thresholds.warning) return { icon: Info, color: 'text-amber-300' };
    return { icon: AlertTriangle, color: 'text-rose-300' };
  };

  return (
    <div className="overflow-hidden rounded-3xl border border-white/10 bg-slate-950/70 shadow-2xl shadow-black/20 backdrop-blur">
      <div className="border-b border-white/10 bg-white/[0.04] px-6 py-5">
        <div className="flex items-center gap-3">
          <Gauge className="h-5 w-5 text-cyan-300" />
          <div>
            <h2 className="text-lg font-semibold text-white">Class-level analysis results</h2>
            <p className="mt-1 text-sm text-slate-400">
              Select a class to view evidence, risk level, and refactoring guidance.
            </p>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[920px]">
          <thead className="border-b border-white/10 bg-white/[0.03]">
            <tr>
              {['Class', 'Score', 'WMC', 'RFC', 'CBO', 'LCOM', 'DIT', 'Grade', 'Risk'].map((heading) => (
                <th
                  key={heading}
                  className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-[0.18em] text-slate-400"
                >
                  {heading}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-white/10">
            {metrics.map((classMetrics, index) => {
              const wmcStatus = getMetricStatus(classMetrics.WMC, { good: 10, warning: 20 });
              const rfcStatus = getMetricStatus(classMetrics.RFC, { good: 15, warning: 25 });
              const cboStatus = getMetricStatus(classMetrics.CBO, { good: 5, warning: 10 });
              const lcomStatus = getMetricStatus(classMetrics.LCOM * 100, { good: 20, warning: 60 });
              const ditStatus = getMetricStatus(classMetrics.DIT, { good: 3, warning: 5 });

              return (
                <motion.tr
                  key={`${classMetrics.className}-${index}`}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.06 }}
                  className={`cursor-pointer transition hover:bg-cyan-400/5 ${
                    selectedClass?.className === classMetrics.className ? 'bg-cyan-400/10' : ''
                  }`}
                  onClick={() => onClassSelect(classMetrics)}
                >
                  <td className="px-6 py-4">
                    <div className="text-sm font-semibold text-white">{classMetrics.className}</div>
                    {classMetrics.filePath && (
                      <div className="mt-1 text-xs text-slate-500">{classMetrics.filePath}</div>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="h-2 w-28 overflow-hidden rounded-full bg-white/10">
                      <div
                        className="h-full rounded-full bg-cyan-300"
                        style={{ width: `${classMetrics.designScore}%` }}
                      />
                    </div>
                    <div className="mt-1 text-xs font-semibold text-slate-300">{classMetrics.designScore}/100</div>
                  </td>
                  {[
                    { value: classMetrics.WMC, status: wmcStatus },
                    { value: classMetrics.RFC, status: rfcStatus },
                    { value: classMetrics.CBO, status: cboStatus },
                    { value: classMetrics.LCOM, status: lcomStatus },
                    { value: classMetrics.DIT, status: ditStatus }
                  ].map((item, metricIndex) => (
                    <td className="px-6 py-4" key={metricIndex}>
                      <div className="flex items-center gap-2 text-sm text-slate-200">
                        <span className="font-medium">{item.value}</span>
                        <item.status.icon className={`h-4 w-4 ${item.status.color}`} />
                      </div>
                    </td>
                  ))}
                  <td className="px-6 py-4">
                    <span className={`inline-flex rounded-full px-3 py-1 text-xs font-bold ring-1 ${getGradeColor(classMetrics.grade)}`}>
                      Grade {classMetrics.grade}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      {classMetrics.issues.length > 0 ? (
                        <span className="inline-flex items-center rounded-full bg-rose-400/15 px-2 py-1 text-xs font-medium text-rose-200 ring-1 ring-rose-300/30">
                          {classMetrics.issues.length} issues
                        </span>
                      ) : (
                        <span className="inline-flex items-center rounded-full bg-emerald-400/15 px-2 py-1 text-xs font-medium text-emerald-200 ring-1 ring-emerald-300/30">
                          Healthy
                        </span>
                      )}
                      {classMetrics.strengths.length > 0 && (
                        <span className="inline-flex items-center rounded-full bg-cyan-400/15 px-2 py-1 text-xs font-medium text-cyan-200 ring-1 ring-cyan-300/30">
                          <TrendingUp className="mr-1 h-3 w-3" />
                          {classMetrics.strengths.length}
                        </span>
                      )}
                    </div>
                    <div className="mt-1 text-xs text-slate-500">{classMetrics.riskLevel}</div>
                  </td>
                </motion.tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
