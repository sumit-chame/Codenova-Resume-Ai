import React from 'react';
import { motion } from 'framer-motion';
import { Badge } from '../ui/Badge';

export interface AtsScoreGaugeProps {
  score: number;
  size?: number;
}

export const AtsScoreGauge: React.FC<AtsScoreGaugeProps> = ({ score, size = 180 }) => {
  const strokeWidth = 14;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  let strokeColor = '#10b981'; // Emerald (>90%)
  let statusBadgeVariant: 'success' | 'warning' | 'danger' = 'success';
  let statusText = 'Excellent Match';

  if (score < 75) {
    strokeColor = '#f43f5e'; // Rose (<75%)
    statusBadgeVariant = 'danger';
    statusText = 'Needs Optimization';
  } else if (score < 90) {
    strokeColor = '#f59e0b'; // Amber (75-89%)
    statusBadgeVariant = 'warning';
    statusText = 'Good Match';
  }

  return (
    <div className="flex flex-col items-center justify-center space-y-3">
      <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
        <svg className="w-full h-full transform -rotate-90">
          {/* Track Circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="#1e293b"
            strokeWidth={strokeWidth}
            fill="transparent"
          />
          {/* Animated Progress Circle */}
          <motion.circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={strokeColor}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 1, ease: 'easeOut' }}
            strokeLinecap="round"
            fill="transparent"
          />
        </svg>

        <div className="absolute flex flex-col items-center justify-center text-center">
          <motion.span
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="text-4xl font-black text-slate-100"
          >
            {score}%
          </motion.span>
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">
            ATS Score
          </span>
        </div>
      </div>

      <Badge variant={statusBadgeVariant} size="md">
        {statusText}
      </Badge>
    </div>
  );
};
