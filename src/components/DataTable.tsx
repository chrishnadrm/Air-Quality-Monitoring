import React, { useState, useMemo } from 'react';
import { WeatherData } from '../types';
import { Table, Search, Download, ArrowUpDown, ShieldCheck, AlertTriangle, Flame } from 'lucide-react';

interface DataTableProps {
  history: WeatherData[];
}

export const DataTable: React.FC<DataTableProps> = ({ history }) => {
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
    link.setAttribute('download', `Weather_Station_Data_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-sm w-full">
      
      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
            <Table className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-extrabold text-slate-900">Tabel Histori Log Sensor</h2>
            <p className="text-xs text-slate-500 font-medium">Rekaman data terbaru dari ESP32 Weather Station</p>
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
              className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            />
          </div>

          {/* Sort Button */}
          <button
            onClick={() => setSortAsc(!sortAsc)}
            className="p-2 text-slate-600 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-xl text-xs font-semibold flex items-center gap-1 transition-all"
            title="Urutkan Waktu"
          >
            <ArrowUpDown className="w-3.5 h-3.5" />
          </button>

          {/* Export CSV */}
          <button
            onClick={handleExportCSV}
            disabled={!history.length}
            className="px-3 py-1.5 bg-emerald-50 text-emerald-700 hover:bg-emerald-600 hover:text-white border border-emerald-200 hover:border-emerald-600 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all shadow-2xs disabled:opacity-50"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Export CSV</span>
          </button>
        </div>
      </div>

      {/* Table Container */}
      <div className="overflow-x-auto rounded-xl border border-slate-200 max-h-[380px] overflow-y-auto">
        <table className="w-full text-left text-xs text-slate-700">
          <thead className="bg-slate-100/90 sticky top-0 z-10 text-slate-700 uppercase tracking-wider font-extrabold border-b border-slate-200">
            <tr>
              <th className="px-4 py-3">Waktu</th>
              <th className="px-4 py-3 text-amber-700">Suhu DHT (°C)</th>
              <th className="px-4 py-3 text-blue-700">Kelembaban (%)</th>
              <th className="px-4 py-3 text-emerald-700">Tekanan (hPa)</th>
              <th className="px-4 py-3 text-indigo-700">Suhu BMP (°C)</th>
              <th className="px-4 py-3 text-cyan-700">Gas CO (PPM)</th>
              <th className="px-4 py-3 text-center">Status CO</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-medium">
            {filteredData.length > 0 ? (
              filteredData.map((row, idx) => {
                let statusBadge = (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                    <ShieldCheck className="w-3 h-3" /> Aman
                  </span>
                );

                if (row.co >= 35) {
                  statusBadge = (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-extrabold bg-rose-100 text-rose-800 border border-rose-300">
                      <Flame className="w-3 h-3" /> Bahaya
                    </span>
                  );
                } else if (row.co >= 9) {
                  statusBadge = (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-300">
                      <AlertTriangle className="w-3 h-3" /> Sedang
                    </span>
                  );
                }

                return (
                  <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-4 py-2.5 font-bold text-slate-900 whitespace-nowrap">{row.time}</td>
                    <td className="px-4 py-2.5 text-amber-800 font-semibold">{row.temp.toFixed(2)}°C</td>
                    <td className="px-4 py-2.5 text-blue-800 font-semibold">{row.hum.toFixed(2)}%</td>
                    <td className="px-4 py-2.5 text-emerald-800 font-semibold">{row.press.toFixed(2)} hPa</td>
                    <td className="px-4 py-2.5 text-indigo-800 font-semibold">{row.bmptemp.toFixed(2)}°C</td>
                    <td className="px-4 py-2.5 text-cyan-800 font-semibold">{row.co.toFixed(2)} PPM</td>
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
