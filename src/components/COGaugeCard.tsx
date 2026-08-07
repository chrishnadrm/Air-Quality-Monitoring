import React from 'react';
import { Wind, ShieldCheck, AlertTriangle, Flame } from 'lucide-react';

interface COGaugeCardProps {
  coValue: number;
}

export const COGaugeCard: React.FC<COGaugeCardProps> = ({ coValue }) => {
  const value = typeof coValue === 'number' && !isNaN(coValue) ? coValue : 0;
  const circumference = 251.32; // 2 * PI * 40
  const maxCo = 100;
  const percent = Math.max(0, Math.min(1, value / maxCo));
  const dashOffset = circumference - (percent * circumference);

  // Status computation
  let status: 'AMAN' | 'SEDANG' | 'BAHAYA' = 'AMAN';
  let badgeStyle = 'bg-emerald-50 text-emerald-700 border-emerald-200';
  let cardBorderStyle = 'border-l-4 border-l-emerald-500 border-slate-200/90';
  let gaugeColor = '#06b6d4';
  let StatusIcon = ShieldCheck;

  if (value >= 35) {
    status = 'BAHAYA';
    badgeStyle = 'bg-rose-100 text-rose-800 border-rose-300 animate-pulse font-extrabold';
    cardBorderStyle = 'border-l-4 border-l-rose-500 border-rose-200 bg-rose-50/20';
    gaugeColor = '#e11d48';
    StatusIcon = Flame;
  } else if (value >= 9) {
    status = 'SEDANG';
    badgeStyle = 'bg-amber-50 text-amber-800 border-amber-300 font-bold';
    cardBorderStyle = 'border-l-4 border-l-amber-500 border-slate-200/90';
    gaugeColor = '#f59e0b';
    StatusIcon = AlertTriangle;
  }

  return (
    <div className={`bg-white rounded-2xl p-5 border shadow-sm hover:shadow-md transition-all duration-300 flex flex-col items-center justify-between group ${cardBorderStyle}`}>
      
      {/* Top Label & Icon */}
      <div className="w-full flex justify-between items-center mb-2">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-cyan-50 text-cyan-600">
            <Wind className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">GAS CO</h3>
            <span className="text-[10px] text-slate-400 font-medium">MQ-7 Carbon Monoxide</span>
          </div>
        </div>
      </div>

      {/* Circular SVG Gauge */}
      <div className="relative w-36 h-36 my-2 flex items-center justify-center">
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
          <circle
            cx="50"
            cy="50"
            r="40"
            stroke="#f1f5f9"
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
          <span className="text-2xl font-extrabold text-slate-900 tracking-tight leading-none group-hover:scale-105 transition-transform">
            {value.toFixed(2)}
          </span>
          <span className="text-xs font-semibold text-slate-500 mt-1">PPM</span>
        </div>
      </div>

      {/* Dynamic Status Badge */}
      <div className="w-full mt-1 pt-2 border-t border-slate-100">
        <div className={`w-full py-1.5 px-3 rounded-xl border text-center text-xs tracking-wider flex items-center justify-center gap-1.5 ${badgeStyle}`}>
          <StatusIcon className="w-3.5 h-3.5" />
          <span>STATUS: {status}</span>
        </div>
      </div>

    </div>
  );
};
