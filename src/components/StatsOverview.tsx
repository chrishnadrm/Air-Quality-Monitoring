import React from 'react';
import { WeatherData } from '../types';
import { Thermometer, Droplets, Gauge as GaugeIcon, Flame, Activity } from 'lucide-react';

interface StatsOverviewProps {
  history: WeatherData[];
  latest: WeatherData | null;
}

export const StatsOverview: React.FC<StatsOverviewProps> = ({ history, latest }) => {
  if (!history || history.length === 0 || !latest) return null;

  const calculateStats = (key: keyof WeatherData) => {
    const vals = history
      .map(d => typeof d[key] === 'number' ? (d[key] as number) : 0)
      .filter(v => !isNaN(v));
      
    if (vals.length === 0) return { min: 0, max: 0, avg: 0 };
    const min = Math.min(...vals);
    const max = Math.max(...vals);
    const avg = vals.reduce((a, b) => a + b, 0) / vals.length;
    return { min, max, avg };
  };

  const tempStats = calculateStats('temp');
  const humStats = calculateStats('hum');
  const pressStats = calculateStats('press');
  const bmpStats = calculateStats('bmptemp');
  const coStats = calculateStats('co');

  return (
    <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-xs">
      <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-blue-50 text-blue-600 rounded-lg">
            <Activity className="w-4 h-4" />
          </div>
          <h2 className="text-sm font-bold text-slate-800">Ringkasan Statistik Sensor (Histori)</h2>
        </div>
        <span className="text-xs text-slate-400 font-medium">Berdasarkan {history.length} entri data</span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        
        {/* Suhu DHT */}
        <div className="bg-slate-50/80 rounded-xl p-3 border border-slate-200/60 flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-slate-500 font-semibold mb-1">
            <span className="flex items-center gap-1"><Thermometer className="w-3.5 h-3.5 text-amber-500" /> Suhu DHT</span>
            <span className="text-amber-600 font-bold">{latest.temp.toFixed(2)}°C</span>
          </div>
          <div className="flex justify-between items-end text-[11px] text-slate-600 pt-1 border-t border-slate-200/50">
            <span>Min: <strong className="text-slate-800">{tempStats.min.toFixed(2)}°</strong></span>
            <span>Rata: <strong className="text-slate-800">{tempStats.avg.toFixed(2)}°</strong></span>
            <span>Max: <strong className="text-slate-800">{tempStats.max.toFixed(2)}°</strong></span>
          </div>
        </div>

        {/* Kelembaban */}
        <div className="bg-slate-50/80 rounded-xl p-3 border border-slate-200/60 flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-slate-500 font-semibold mb-1">
            <span className="flex items-center gap-1"><Droplets className="w-3.5 h-3.5 text-blue-500" /> Kelembaban</span>
            <span className="text-blue-600 font-bold">{latest.hum.toFixed(2)}%</span>
          </div>
          <div className="flex justify-between items-end text-[11px] text-slate-600 pt-1 border-t border-slate-200/50">
            <span>Min: <strong className="text-slate-800">{humStats.min.toFixed(2)}%</strong></span>
            <span>Rata: <strong className="text-slate-800">{humStats.avg.toFixed(2)}%</strong></span>
            <span>Max: <strong className="text-slate-800">{humStats.max.toFixed(2)}%</strong></span>
          </div>
        </div>

        {/* Tekanan Udara */}
        <div className="bg-slate-50/80 rounded-xl p-3 border border-slate-200/60 flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-slate-500 font-semibold mb-1">
            <span className="flex items-center gap-1"><GaugeIcon className="w-3.5 h-3.5 text-emerald-500" /> Tekanan</span>
            <span className="text-emerald-600 font-bold">{latest.press.toFixed(2)} hPa</span>
          </div>
          <div className="flex justify-between items-end text-[11px] text-slate-600 pt-1 border-t border-slate-200/50">
            <span>Min: <strong className="text-slate-800">{pressStats.min.toFixed(2)}</strong></span>
            <span>Rata: <strong className="text-slate-800">{pressStats.avg.toFixed(2)}</strong></span>
            <span>Max: <strong className="text-slate-800">{pressStats.max.toFixed(2)}</strong></span>
          </div>
        </div>

        {/* Suhu BMP */}
        <div className="bg-slate-50/80 rounded-xl p-3 border border-slate-200/60 flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-slate-500 font-semibold mb-1">
            <span className="flex items-center gap-1"><Thermometer className="w-3.5 h-3.5 text-indigo-500" /> Suhu BMP</span>
            <span className="text-indigo-600 font-bold">{latest.bmptemp.toFixed(2)}°C</span>
          </div>
          <div className="flex justify-between items-end text-[11px] text-slate-600 pt-1 border-t border-slate-200/50">
            <span>Min: <strong className="text-slate-800">{bmpStats.min.toFixed(2)}°</strong></span>
            <span>Rata: <strong className="text-slate-800">{bmpStats.avg.toFixed(2)}°</strong></span>
            <span>Max: <strong className="text-slate-800">{bmpStats.max.toFixed(2)}°</strong></span>
          </div>
        </div>

        {/* Gas CO */}
        <div className="bg-slate-50/80 rounded-xl p-3 border border-slate-200/60 flex flex-col justify-between col-span-2 sm:col-span-1">
          <div className="flex items-center justify-between text-xs text-slate-500 font-semibold mb-1">
            <span className="flex items-center gap-1"><Flame className="w-3.5 h-3.5 text-cyan-500" /> Gas CO</span>
            <span className="text-cyan-600 font-bold">{latest.co.toFixed(2)} PPM</span>
          </div>
          <div className="flex justify-between items-end text-[11px] text-slate-600 pt-1 border-t border-slate-200/50">
            <span>Min: <strong className="text-slate-800">{coStats.min.toFixed(2)}</strong></span>
            <span>Rata: <strong className="text-slate-800">{coStats.avg.toFixed(2)}</strong></span>
            <span>Max: <strong className="text-slate-800">{coStats.max.toFixed(2)}</strong></span>
          </div>
        </div>

      </div>
    </div>
  );
};
