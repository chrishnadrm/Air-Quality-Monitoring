import React, { useState, useMemo } from 'react';
import { WeatherData } from '../types';
import { Table, Search, Download, ArrowUpDown, ShieldCheck, AlertTriangle, Flame } from 'lucide-react';

interface DataTableProps {
  history: WeatherData[];
  isDark?: boolean;
}

export const DataTable: React.FC<DataTableProps> = ({ history, isDark = false }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortAsc, setSortAsc] = useState(false); // latest first by default

  const filteredData = useMemo(() => {
    let list = [...history];

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      list = list.filter(item => 
        item.time.toLowerCase().includes(term) ||
        item.temp.toString().includes(term) ||
        item.hum.toString().includes(term) ||
        item.press.toString().includes(term) ||
        item.bmptemp.toString().includes(term) ||
        item.co.toString().includes(term)
      );
    }

    if (sortAsc) {
      return list;
    } else {
      return list.reverse();
    }
  }, [history, searchTerm, sortAsc]);

  const handleExportCSV = () => {
    if (!history || history.length === 0) return;

    const headers = ['Waktu', 'Suhu DHT (°C)', 'Kelembaban (%)', 'Tekanan (hPa)', 'Suhu BMP (°C)', 'Gas CO (PPM)'];
    const rows = history.map(d => [
      d.time,
      d.temp,
      d.hum,
      d.press,
      d.bmptemp,
      d.co
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Air_Quality_Data_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className={`rounded-2xl p-6 border w-full transition-colors ${
      isDark ? 'bg-slate-800/90 border-slate-700/80 shadow-md' : 'bg-white border-slate-200/90 shadow-xs'
    }`}>
      
      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 rounded-lg">
            <Table className="w-5 h-5" />
          </div>
          <div>
            <h2 className={`text-base font-extrabold ${isDark ? 'text-white' : 'text-slate-900'}`}>Tabel Histori Log Sensor</h2>
            <p className={`text-xs font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Rekaman data terbaru dari sensor kualitas udara</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Search Field */}
          <div className="relative flex-1 sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Cari waktu / nilai..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`w-full pl-9 pr-3 py-1.5 border rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 ${
                isDark ? 'bg-slate-900 border-slate-700 text-slate-200 placeholder-slate-500' : 'bg-slate-50 border-slate-200 text-slate-800'
              }`}
            />
          </div>

          {/* Sort Button */}
          <button
            onClick={() => setSortAsc(!sortAsc)}
            className={`p-2 border rounded-xl text-xs font-semibold flex items-center gap-1 transition-all ${
              isDark ? 'text-slate-300 bg-slate-900 hover:bg-slate-700 border-slate-700' : 'text-slate-600 bg-slate-100 hover:bg-slate-200 border-slate-200'
            }`}
            title="Urutkan Waktu"
          >
            <ArrowUpDown className="w-3.5 h-3.5" />
          </button>

          {/* Export CSV */}
          <button
            onClick={handleExportCSV}
            disabled={!history.length}
            className={`px-3 py-1.5 border rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all shadow-2xs disabled:opacity-50 ${
              isDark
                ? 'bg-emerald-950/60 text-emerald-300 border-emerald-800 hover:bg-emerald-900'
                : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-600 hover:text-white border-emerald-200 hover:border-emerald-600'
            }`}
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Export CSV</span>
          </button>
        </div>
      </div>

      {/* Table Container */}
      <div className={`overflow-x-auto rounded-xl border max-h-[380px] overflow-y-auto ${
        isDark ? 'border-slate-700' : 'border-slate-200'
      }`}>
        <table className={`w-full text-left text-xs ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
          <thead className={`sticky top-0 z-10 uppercase tracking-wider font-extrabold border-b ${
            isDark ? 'bg-slate-900 text-slate-300 border-slate-700' : 'bg-slate-100/90 text-slate-700 border-slate-200'
          }`}>
            <tr>
              <th className="px-4 py-3">Waktu</th>
              <th className="px-4 py-3 text-amber-500">Suhu DHT (°C)</th>
              <th className="px-4 py-3 text-blue-500">Kelembaban (%)</th>
              <th className="px-4 py-3 text-emerald-500">Tekanan (hPa)</th>
              <th className="px-4 py-3 text-indigo-500">Suhu BMP (°C)</th>
              <th className="px-4 py-3 text-cyan-500">Gas CO (PPM)</th>
              <th className="px-4 py-3 text-center">Status CO</th>
            </tr>
          </thead>
          <tbody className={`divide-y font-medium ${isDark ? 'divide-slate-700/60' : 'divide-slate-100'}`}>
            {filteredData.length > 0 ? (
              filteredData.map((row, idx) => {
                let statusBadge = (
                  <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold border ${
                    isDark ? 'bg-emerald-950/60 text-emerald-300 border-emerald-800' : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                  }`}>
                    <ShieldCheck className="w-3 h-3" /> Aman
                  </span>
                );

                if (row.co >= 35) {
                  statusBadge = (
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-extrabold border ${
                      isDark ? 'bg-rose-950/80 text-rose-300 border-rose-800' : 'bg-rose-100 text-rose-800 border-rose-300'
                    }`}>
                      <Flame className="w-3 h-3" /> Bahaya
                    </span>
                  );
                } else if (row.co >= 9) {
                  statusBadge = (
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold border ${
                      isDark ? 'bg-amber-950/80 text-amber-300 border-amber-800' : 'bg-amber-50 text-amber-800 border-amber-300'
                    }`}>
                      <AlertTriangle className="w-3 h-3" /> Sedang
                    </span>
                  );
                }

                return (
                  <tr key={idx} className={`transition-colors ${isDark ? 'hover:bg-slate-700/40' : 'hover:bg-slate-50/80'}`}>
                    <td className={`px-4 py-2.5 font-bold whitespace-nowrap ${isDark ? 'text-white' : 'text-slate-900'}`}>{row.time}</td>
                    <td className="px-4 py-2.5 text-amber-500 font-semibold">{row.temp.toFixed(2)}°C</td>
                    <td className="px-4 py-2.5 text-blue-500 font-semibold">{row.hum.toFixed(2)}%</td>
                    <td className="px-4 py-2.5 text-emerald-500 font-semibold">{row.press.toFixed(2)} hPa</td>
                    <td className="px-4 py-2.5 text-indigo-500 font-semibold">{row.bmptemp.toFixed(2)}°C</td>
                    <td className="px-4 py-2.5 text-cyan-500 font-semibold">{row.co.toFixed(2)} PPM</td>
                    <td className="px-4 py-2.5 text-center whitespace-nowrap">{statusBadge}</td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-slate-400 font-medium">
                  {searchTerm ? 'Tidak ada data yang sesuai dengan pencarian' : 'Belum ada data di database'}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

    </div>
  );
};
