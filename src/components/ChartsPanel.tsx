import React from 'react';
import { Bar, Doughnut, Radar } from 'react-chartjs-2';
import { motion } from 'framer-motion';
import { ClassMetrics } from '../types/metrics';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  RadialLinearScale,
  PointElement,
  LineElement,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  RadialLinearScale,
  PointElement,
  LineElement
);

interface ChartsPanelProps {
  metrics: ClassMetrics[];
}

export const ChartsPanel: React.FC<ChartsPanelProps> = ({ metrics }) => {
  const gradeDistribution = metrics.reduce((acc, metric) => {
    acc[metric.grade] = (acc[metric.grade] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const gradeData = {
    labels: ['A', 'B', 'C', 'D'],
    datasets: [
      {
        label: 'Number of Classes',
        data: [
          gradeDistribution.A || 0,
          gradeDistribution.B || 0,
          gradeDistribution.C || 0,
          gradeDistribution.D || 0,
        ],
        backgroundColor: [
          'rgba(16, 185, 129, 0.72)',
          'rgba(14, 165, 233, 0.72)',
          'rgba(245, 158, 11, 0.72)',
          'rgba(244, 63, 94, 0.72)',
        ],
        borderColor: [
          'rgba(16, 185, 129, 1)',
          'rgba(14, 165, 233, 1)',
          'rgba(245, 158, 11, 1)',
          'rgba(244, 63, 94, 1)',
        ],
        borderWidth: 2,
      },
    ],
  };

  const metricsData = {
    labels: metrics.map((metric) => metric.className),
    datasets: [
      {
        label: 'WMC',
        data: metrics.map((metric) => metric.WMC),
        backgroundColor: 'rgba(14, 165, 233, 0.55)',
        borderColor: 'rgba(14, 165, 233, 1)',
        borderWidth: 1,
      },
      {
        label: 'RFC',
        data: metrics.map((metric) => metric.RFC),
        backgroundColor: 'rgba(168, 85, 247, 0.55)',
        borderColor: 'rgba(168, 85, 247, 1)',
        borderWidth: 1,
      },
      {
        label: 'CBO',
        data: metrics.map((metric) => metric.CBO),
        backgroundColor: 'rgba(245, 158, 11, 0.55)',
        borderColor: 'rgba(245, 158, 11, 1)',
        borderWidth: 1,
      },
    ],
  };

  const radarData = metrics.length > 0 ? {
    labels: ['WMC', 'RFC', 'CBO', 'LCOM', 'DIT'],
    datasets: metrics.slice(0, 3).map((metric, index) => ({
      label: metric.className,
      data: [
        Math.min((metric.WMC / 30) * 100, 100),
        Math.min((metric.RFC / 40) * 100, 100),
        Math.min((metric.CBO / 15) * 100, 100),
        metric.LCOM * 100,
        Math.min((metric.DIT / 8) * 100, 100),
      ],
      backgroundColor: [
        'rgba(14, 165, 233, 0.18)',
        'rgba(168, 85, 247, 0.18)',
        'rgba(245, 158, 11, 0.18)',
      ][index],
      borderColor: [
        'rgba(14, 165, 233, 1)',
        'rgba(168, 85, 247, 1)',
        'rgba(245, 158, 11, 1)',
      ][index],
      pointBackgroundColor: [
        'rgba(14, 165, 233, 1)',
        'rgba(168, 85, 247, 1)',
        'rgba(245, 158, 11, 1)',
      ][index],
      pointBorderColor: '#0f172a',
      pointHoverBackgroundColor: '#0f172a',
    })),
  } : null;

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    color: '#cbd5e1',
    plugins: {
      legend: {
        position: 'top' as const,
        labels: { color: '#cbd5e1' }
      },
    },
    scales: {
      x: {
        ticks: { color: '#94a3b8' },
        grid: { color: 'rgba(148, 163, 184, 0.12)' }
      },
      y: {
        beginAtZero: true,
        ticks: { color: '#94a3b8' },
        grid: { color: 'rgba(148, 163, 184, 0.12)' }
      },
    },
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: { color: '#cbd5e1' }
      },
    },
  };

  const radarOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      r: {
        angleLines: { color: 'rgba(148, 163, 184, 0.22)' },
        grid: { color: 'rgba(148, 163, 184, 0.18)' },
        pointLabels: { color: '#cbd5e1' },
        ticks: { color: '#94a3b8', backdropColor: 'transparent' },
        suggestedMin: 0,
        suggestedMax: 100
      }
    },
    plugins: {
      legend: {
        position: 'top' as const,
        labels: { color: '#cbd5e1' }
      },
    },
  };

  if (metrics.length === 0) {
    return (
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {[1, 2, 3, 4].map((item) => (
          <div key={item} className="rounded-3xl border border-white/10 bg-white/[0.04] p-6">
            <div className="animate-pulse">
              <div className="mb-4 h-4 w-1/3 rounded bg-white/10" />
              <div className="h-32 rounded bg-white/[0.06]" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  const averageScore = Math.round(metrics.reduce((sum, metric) => sum + metric.designScore, 0) / metrics.length);

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-3xl border border-white/10 bg-slate-950/70 p-6 shadow-2xl shadow-black/20"
      >
        <h3 className="mb-4 text-lg font-semibold text-white">Grade distribution</h3>
        <div className="h-72">
          <Doughnut data={gradeData} options={doughnutOptions} />
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.08 }}
        className="rounded-3xl border border-white/10 bg-slate-950/70 p-6 shadow-2xl shadow-black/20"
      >
        <h3 className="mb-4 text-lg font-semibold text-white">Metrics comparison</h3>
        <div className="h-72">
          <Bar data={metricsData} options={chartOptions} />
        </div>
      </motion.div>

      {radarData && (
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.16 }}
          className="rounded-3xl border border-white/10 bg-slate-950/70 p-6 shadow-2xl shadow-black/20 md:col-span-2"
        >
          <h3 className="mb-4 text-lg font-semibold text-white">Design quality radar</h3>
          <div className="h-80">
            <Radar data={radarData} options={radarOptions} />
          </div>
        </motion.div>
      )}

      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.24 }}
        className="rounded-3xl border border-white/10 bg-slate-950/70 p-6 shadow-2xl shadow-black/20 md:col-span-2"
      >
        <h3 className="mb-4 text-lg font-semibold text-white">Summary statistics</h3>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-5">
          {[
            ['Total Classes', metrics.length],
            ['Avg Score', averageScore],
            ['Healthy', metrics.filter((metric) => metric.grade === 'A' || metric.grade === 'B').length],
            ['Issues', metrics.reduce((sum, metric) => sum + metric.issues.length, 0)],
            ['High Risk', metrics.filter((metric) => metric.riskLevel === 'High' || metric.riskLevel === 'Critical').length],
          ].map(([label, value]) => (
            <div key={label} className="rounded-2xl border border-white/10 bg-white/[0.04] p-4 text-center">
              <div className="text-2xl font-bold text-white">{value}</div>
              <div className="mt-1 text-sm text-slate-400">{label}</div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};
