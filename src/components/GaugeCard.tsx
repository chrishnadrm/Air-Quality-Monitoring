import React from 'react';
import { LucideIcon } from 'lucide-react';

interface GaugeCardProps {
  title: string;
  subtitle: string;
  value: number;
  unit: string;
  min?: number;
  max?: number;
  decimals?: number;
  icon: LucideIcon;
  strokeColor: string;
  badgeBg: string;
  iconColor: string;
  gaugePercent: number; // 0 to 1
  statsLabel?: string;
  trendText?: string;
}

export const GaugeCard: React.FC<GaugeCardProps> = ({
  title,
  subtitle,
  value,
  unit,
  decimals = 2,
  icon: Icon,
  strokeColor,
  badgeBg,
  iconColor,
  gaugePercent,
  statsLabel,
  trendText
}) => {
  const circumference = 251.32; // 2 * PI * 40
  const clampedPercent = Math.max(0, Math.min(1, gaugePercent));
  const dashOffset = circumference - (clampedPercent * circumference);

  const formattedValue = typeof value === 'number' && !isNaN(value)
    ? value.toFixed(decimals)
    : '0.0';

  return (
    <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-sm hover:shadow-md hover:border-slate-300 transition-all duration-300 flex flex-col items-center justify-between group">
      
      {/* Top Label & Icon */}
      <div className="w-full flex justify-between items-center mb-2">
        <div className="flex items-center gap-2">
          <div className={`p-1.5 rounded-lg ${badgeBg}`}>
            <Icon className={`w-4 h-4 ${iconColor}`} />
          </div>
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">{title}</h3>
            {trendText && <span className="text-[10px] text-slate-400 font-medium">{trendText}</span>}
          </div>
        </div>
      </div>

      {/* Circular SVG Gauge */}
      <div className="relative w-36 h-36 my-2 flex items-center justify-center">
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
          {/* Background Ring */}
          <circle
            cx="50"
            cy="50"
            r="40"
            stroke="#f1f5f9"
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
          <span className="text-2xl font-extrabold text-slate-900 tracking-tight leading-none group-hover:scale-105 transition-transform">
            {formattedValue}
          </span>
          <span className="text-xs font-semibold text-slate-500 mt-1">{unit}</span>
        </div>
      </div>

      {/* Subtitle / Sensor Name */}
      <div className="w-full text-center mt-1 pt-2 border-t border-slate-100">
        <p className="text-[11px] font-medium text-slate-500">{subtitle}</p>
        {statsLabel && <p className="text-[10px] font-semibold text-slate-400 mt-0.5">{statsLabel}</p>}
      </div>

    </div>
  );
};
