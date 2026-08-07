import React from 'react';
import { Wind, ShieldCheck, AlertTriangle, Flame } from 'lucide-react';

interface COGaugeCardProps {
  coValue: number;
  isDark?: boolean;
}

export const COGaugeCard: React.FC<COGaugeCardProps> = ({ coValue, isDark = false }) => {
  const value = typeof coValue === 'number' && !isNaN(coValue) ? coValue : 0;
  const circumference = 251.32; // 2 * PI * 40
  const maxCo = 100;
  const percent = Math.max(0, Math.min(1, value / maxCo));
  const dashOffset = circumference - (percent * circumference);

  // Status computation
  let status: 'AMAN' | 'SEDANG' | 'BAHAYA' = 'AMAN';
  let badgeStyle = isDark 
    ? 'bg-emerald-950/60 text-emerald-400 border-emerald-800' 
    : 'bg-emerald-50 text-emerald-700 border-emerald-200';
  let cardBorderStyle = isDark
    ? 'border-l-4 border-l-emerald-500 border-slate-700/80 bg-slate-800/90'
    : 'border-l-4 border-l-emerald-500 border-slate-200/90 bg-white';
  let gaugeColor = '#06b6d4';
  let StatusIcon = ShieldCheck;

  if (value >= 35) {
    status = 'BAHAYA';
    badgeStyle = isDark
      ? 'bg-rose-950/80 text-rose-300 border-rose-800 animate-pulse font-extrabold'
      : 'bg-rose-100 text-rose-800 border-rose-300 animate-pulse font-extrabold';
    cardBorderStyle = isDark
      ? 'border-l-4 border-l-rose-500 border-rose-800 bg-rose-950/20'
      : 'border-l-4 border-l-rose-500 border-rose-200 bg-rose-50/20';
    gaugeColor = '#e11d48';
    StatusIcon = Flame;
  } else if (value >= 9) {
    status = 'SEDANG';
    badgeStyle = isDark
      ? 'bg-amber-950/80 text-amber-300 border-amber-800 font-bold'
      : 'bg-amber-50 text-amber-800 border-amber-300 font-bold';
    cardBorderStyle = isDark
      ? 'border-l-4 border-l-amber-500 border-slate-700/80 bg-slate-800/90'
      : 'border-l-4 border-l-amber-500 border-slate-200/90 bg-white';
    gaugeColor = '#f59e0b';
    StatusIcon = AlertTriangle;
  }

  return (
    <div className={`rounded-2xl p-5 border shadow-xs hover:shadow-md transition-all duration-300 flex flex-col items-center justify-between group ${cardBorderStyle}`}>
      
      {/* Top Label & Icon */}
      <div className="w-full flex justify-center items-center gap-2 mb-2">
        <div className="p-1.5 rounded-lg bg-cyan-50 dark:bg-cyan-950/60 text-cyan-600 dark:text-cyan-400">
          <Wind className="w-4 h-4" />
        </div>
        <h3 className={`text-xs font-bold uppercase tracking-wider ${isDark ? 'text-slate-200' : 'text-slate-700'}`}>
          GAS CO
        </h3>
      </div>

      {/* Circular SVG Gauge */}
      <div className="relative w-36 h-36 my-1 flex items-center justify-center">
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
          <circle
            cx="50"
            cy="50"
            r="40"
            stroke={isDark ? '#334155' : '#f1f5f9'}
            strokeWidth="8"
            fill="transparent"
          />
          <circle
            cx="50"
            cy="50"
            r="40"
            stroke={gaugeColor}
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
            {value.toFixed(2)}
          </span>
          <span className={`text-xs font-semibold mt-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            PPM
          </span>
        </div>
      </div>

      {/* Dynamic Status Badge */}
      <div className="w-full mt-2 pt-2 border-t border-slate-100 dark:border-slate-700/60">
        <div className={`w-full py-1.5 px-3 rounded-xl border text-center text-xs tracking-wider flex items-center justify-center gap-1.5 ${badgeStyle}`}>
          <StatusIcon className="w-3.5 h-3.5" />
          <span>STATUS: {status}</span>
        </div>
      </div>

    </div>
  );
};

