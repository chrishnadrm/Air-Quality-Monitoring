import React, { useMemo } from 'react';
import Chart from 'react-apexcharts';
import { WeatherData, ChartTabType } from '../types';
import { LineChart, Filter } from 'lucide-react';

interface ChartSectionProps {
  history: WeatherData[];
  activeTab: ChartTabType;
  onTabChange: (tab: ChartTabType) => void;
}

export const ChartSection: React.FC<ChartSectionProps> = ({
  history,
  activeTab,
  onTabChange
}) => {
  const categories = useMemo(() => {
    return history.map(d => d.time);
  }, [history]);

  const { series, colors } = useMemo(() => {
    if (activeTab === 'all') {
      return {
        series: [
          { name: 'Suhu DHT (°C)', data: history.map(d => d.temp) },
          { name: 'Kelembaban (%)', data: history.map(d => d.hum) },
          { name: 'Tekanan (hPa)', data: history.map(d => d.press) },
          { name: 'Suhu BMP (°C)', data: history.map(d => d.bmptemp) },
          { name: 'Gas CO (PPM)', data: history.map(d => d.co) }
        ],
        colors: ['#f59e0b', '#3b82f6', '#10b981', '#6366f1', '#06b6d4']
      };
    } else if (activeTab === 'temp') {
      return {
        series: [{ name: 'Suhu DHT (°C)', data: history.map(d => d.temp) }],
        colors: ['#f59e0b']
      };
    } else if (activeTab === 'hum') {
      return {
        series: [{ name: 'Kelembaban (%)', data: history.map(d => d.hum) }],
        colors: ['#3b82f6']
      };
    } else if (activeTab === 'press') {
      return {
        series: [{ name: 'Tekanan Udara (hPa)', data: history.map(d => d.press) }],
        colors: ['#10b981']
      };
    } else if (activeTab === 'bmptemp') {
      return {
        series: [{ name: 'Suhu BMP (°C)', data: history.map(d => d.bmptemp) }],
        colors: ['#6366f1']
      };
    } else {
      return {
        series: [{ name: 'Gas CO (PPM)', data: history.map(d => d.co) }],
        colors: ['#06b6d4']
      };
    }
  }, [history, activeTab]);

  const chartOptions: ApexCharts.ApexOptions = useMemo(() => ({
    chart: {
      type: 'area',
      height: 380,
      fontFamily: 'Plus Jakarta Sans, sans-serif',
      toolbar: {
        show: true,
        tools: {
          download: true,
          selection: true,
          zoom: true,
          zoomin: true,
          zoomout: true,
          pan: true,
          reset: true
        }
      },
      background: 'transparent',
      animations: {
        enabled: true,
        easing: 'easeinout',
        speed: 800,
        dynamicAnimation: {
          enabled: true,
          speed: 400
        }
      }
    },
    theme: { mode: 'light' },
    stroke: { curve: 'smooth', width: 2.5 },
    fill: {
      type: 'gradient',
      gradient: {
        shade: 'light',
        type: 'vertical',
        opacityFrom: 0.35,
        opacityTo: 0.03,
      }
    },
    dataLabels: { enabled: false },
    xaxis: {
      categories: categories,
      labels: {
        style: { colors: '#64748b', fontSize: '11px', fontWeight: 500 }
      },
      axisBorder: { color: '#e2e8f0' },
      axisTicks: { color: '#e2e8f0' }
    },
    yaxis: {
      labels: {
        style: { colors: '#64748b', fontSize: '11px', fontWeight: 500 },
        formatter: (val: number) => (typeof val === 'number' ? val.toFixed(2) : '')
      }
    },
    grid: {
      borderColor: '#f1f5f9',
      strokeDashArray: 4
    },
    colors: colors,
    tooltip: {
      theme: 'light',
      style: { fontSize: '12px', fontFamily: 'Plus Jakarta Sans' },
      x: { show: true },
      y: {
        formatter: (val: number) => (typeof val === 'number' ? val.toFixed(2) : '0.00')
      },
      marker: { show: true }
    },
    legend: {
      position: 'top',
      horizontalAlign: 'right',
      fontSize: '12px',
      fontFamily: 'Plus Jakarta Sans',
      labels: { colors: '#334155' },
      markers: { size: 6 }
    }
  }), [categories, colors]);

  const tabs: { id: ChartTabType; label: string }[] = [
    { id: 'all', label: 'Semua Parameter' },
    { id: 'temp', label: 'Suhu DHT' },
    { id: 'hum', label: 'Kelembaban' },
    { id: 'press', label: 'Tekanan' },
    { id: 'bmptemp', label: 'Suhu BMP' },
    { id: 'co', label: 'Gas CO' }
  ];

  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-sm w-full">
      
      {/* Header Toolbar & Tabs */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-100">
        <div>
          <h2 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
            <LineChart className="w-5 h-5 text-blue-600" />
            Grafik Histori Parameter Sensor
          </h2>
          <p className="text-xs text-slate-500 mt-0.5 font-medium">
            Pantau tren perubahan suhu, kelembaban, tekanan, suhu BMP, dan CO secara realtime
          </p>
        </div>

        {/* Parameter Filter Tabs */}
        <div className="flex flex-wrap items-center gap-1 bg-slate-100/80 p-1.5 rounded-xl border border-slate-200/60 text-xs font-semibold">
          <span className="hidden sm:inline-flex items-center gap-1 text-slate-400 px-2">
            <Filter className="w-3.5 h-3.5" />
          </span>
          {tabs.map((t) => {
            const isActive = activeTab === t.id;
            return (
              <button
                key={t.id}
                onClick={() => onTabChange(t.id)}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-xs font-bold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                }`}
              >
                {t.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* ApexCharts Canvas */}
      <div className="w-full min-h-[380px]">
        {history.length > 0 ? (
          <Chart options={chartOptions} series={series} type="area" height={380} />
        ) : (
          <div className="h-[380px] flex flex-col items-center justify-center text-slate-400 text-sm">
            <span>Belum ada data histori untuk ditampilkan</span>
          </div>
        )}
      </div>

    </div>
  );
};
