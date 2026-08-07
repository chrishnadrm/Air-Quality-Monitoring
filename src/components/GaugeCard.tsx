import React from 'react';
import { LucideIcon } from 'lucide-react';

interface GaugeCardProps {
  title: string;
  value: number;
  unit: string;
  decimals?: number;
  icon: LucideIcon;
  strokeColor: string;
  badgeBg: string;
  iconColor: string;
  gaugePercent: number; // 0 to 1
  isDark?: boolean;
}

export const GaugeCard: React.FC<GaugeCardProps> = ({
  title,
  value,
  unit,
  decimals = 2,
  icon: Icon,
  strokeColor,
  badgeBg,
  iconColor,
  gaugePercent,
  isDark = false
}) => {
  const circumference = 251.32; // 2 * PI * 40
  const clampedPercent = Math.max(0, Math.min(1, gaugePercent));
  const dashOffset = circumference - (clampedPercent * circumference);

  const formattedValue = typeof value === 'number' && !isNaN(value)
    ? value.toFixed(decimals)
    : '0.00';

  return (
    <div className={`rounded-2xl p-5 border transition-all duration-300 flex flex-col items-center justify-center group ${
      isDark 
        ? 'bg-slate-800/90 border-slate-700/80 shadow-md hover:border-slate-600' 
        : 'bg-white border-slate-200/90 shadow-xs hover:shadow-md hover:border-slate-300'
    }`}>
      
      {/* Top Label & Icon */}
      <div className="w-full flex items-center justify-center gap-2 mb-3">
        <div className={`p-1.5 rounded-lg ${badgeBg}`}>
          <Icon className={`w-4 h-4 ${iconColor}`} />
        </div>
        <h3 className={`text-xs font-bold uppercase tracking-wider ${isDark ? 'text-slate-200' : 'text-slate-700'}`}>
          {title}
        </h3>
      </div>

      {/* Circular SVG Gauge */}
      <div className="relative w-36 h-36 my-1 flex items-center justify-center">
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
          {/* Background Ring */}
          <circle
            cx="50"
            cy="50"
            r="40"
            stroke={isDark ? '#334155' : '#f1f5f9'}
            strokeWidth="8"
            fill="transparent"
          />
          {/* Animated Value Ring */}
          <circle
            cx="50"
            cy="50"
            r="40"
            stroke={strokeColor}
            strokeWidth="8"
            strokeDasharray={circumference}
            strokeDashoffset={dashOffset}
            strokeLinecap="round"
            fill="transparent"
            className="transition-all duration-700 ease-out"
          />
        </svg>

        {/* Center Text Value */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <span className={`text-2xl font-extrabold tracking-tight leading-none group-hover:scale-105 transition-transform ${
            isDark ? 'text-white' : 'text-slate-900'
          }`}>
            {formattedValue}
          </span>
          <span className={`text-xs font-semibold mt-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            {unit}
          </span>
        </div>
      </div>

    </div>
  );
};

