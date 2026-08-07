import React from 'react';
import { CloudSun, Clock, Database, Trash2, Settings, Code, RefreshCw, CheckCircle2, AlertCircle, Smartphone } from 'lucide-react';

interface HeaderProps {
  isConnected: boolean;
  lastUpdate: string;
  totalRows: number;
  scriptUrl: string;
  isRefreshing: boolean;
  onRefreshManual: () => void;
  onOpenDeleteModal: () => void;
  onOpenSettingsModal: () => void;
  onOpenCodeModal: () => void;
  onOpenInstallModal: () => void;
  useMockData: boolean;
  onToggleMockMode: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  isConnected,
  lastUpdate,
  totalRows,
  isRefreshing,
  onRefreshManual,
  onOpenDeleteModal,
  onOpenSettingsModal,
  onOpenCodeModal,
  onOpenInstallModal,
  useMockData,
  onToggleMockMode
}) => {
  return (
    <header className="sticky top-0 z-40 w-full bg-white/80 backdrop-blur-md border-b border-slate-200/80 shadow-xs px-4 lg:px-8 py-3.5 mb-6">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Title & Subtitle */}
        <div className="flex items-center gap-3.5 w-full md:w-auto justify-between md:justify-start">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-gradient-to-br from-blue-500 to-indigo-600 text-white rounded-xl shadow-md shadow-blue-500/20">
              <CloudSun className="w-6 h-6 stroke-[2.2]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-extrabold tracking-tight text-slate-900">Weather Station Monitoring</h1>
                <span className="hidden sm:inline-block px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-blue-700 bg-blue-50 border border-blue-200/60 rounded-full">
                  ESP32 & Google Sheets
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium">Dashboard Monitoring Cuaca Realtime - Tema Terang Modern</p>
            </div>
          </div>

          {/* Quick Code & Settings Buttons for Mobile */}
          <div className="flex items-center gap-1.5 md:hidden">
            <button
              onClick={onOpenSettingsModal}
              title="Pengaturan URL"
              className="p-2 text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
            >
              <Settings className="w-4 h-4" />
            </button>
            <button
              onClick={onOpenCodeModal}
              title="Kode Script"
              className="p-2 text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
            >
              <Code className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Status Indicators & Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5 text-xs w-full md:w-auto justify-end">
          
          {/* Connection Status */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-100/80 border border-slate-200/80 text-slate-700 font-medium">
            <span className={`w-2.5 h-2.5 rounded-full ${isConnected ? 'bg-emerald-500 animate-pulse shadow-sm shadow-emerald-500/50' : 'bg-amber-500'}`} />
            <span>{isConnected ? 'Terhubung' : 'Menghubungkan...'}</span>
          </div>

          {/* Last Update Time */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-100/80 border border-slate-200/80 text-slate-700 font-medium">
            <Clock className="w-3.5 h-3.5 text-blue-600" />
            <span>Update: <strong className="text-slate-900 font-semibold">{lastUpdate || '--:--:--'}</strong></span>
          </div>

          {/* Total Data Count */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-100/80 border border-slate-200/80 text-slate-700 font-medium">
            <Database className="w-3.5 h-3.5 text-indigo-600" />
            <span>Data: <strong className="text-slate-900 font-semibold">{totalRows}</strong></span>
          </div>

          {/* Manual Refresh Button */}
          <button
            onClick={onRefreshManual}
            disabled={isRefreshing}
            title="Refresh Data Sekarang"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 font-semibold transition-all active:scale-95 disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-blue-600' : ''}`} />
            <span className="hidden sm:inline">Refresh</span>
          </button>

          {/* Mode Switcher Badge (Real Google Sheet vs Mock Mode) */}
          <button
            onClick={onToggleMockMode}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-semibold transition-all ${
              useMockData 
                ? 'bg-amber-50 text-amber-800 border-amber-300 hover:bg-amber-100' 
                : 'bg-emerald-50 text-emerald-800 border-emerald-300 hover:bg-emerald-100'
            }`}
            title="Klik untuk beralih antara Data Google Sheet Asli dan Mode Simulasi"
          >
            {useMockData ? (
              <>
                <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
                <span>Simulasi Mode</span>
              </>
            ) : (
              <>
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Live Sheet</span>
              </>
            )}
          </button>

          {/* Settings & Script Buttons (Desktop) */}
          <div className="hidden md:flex items-center gap-2">
            <button
              onClick={onOpenSettingsModal}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 font-semibold transition-all"
              title="Atur URL Google Apps Script"
            >
              <Settings className="w-3.5 h-3.5" />
              <span>URL API</span>
            </button>

            <button
              onClick={onOpenCodeModal}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200/80 font-semibold transition-all"
              title="Lihat Kode Google Apps Script (kode.gs)"
            >
              <Code className="w-3.5 h-3.5" />
              <span>Kode GS</span>
            </button>
          </div>

          {/* Install PWA App Button */}
          <button
            onClick={onOpenInstallModal}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold transition-all shadow-sm shadow-blue-500/20 active:scale-95"
            title="Install Aplikasi di Smartphone HP"
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span className="inline">Install App</span>
          </button>

          {/* Delete Database Button */}
          <button
            onClick={onOpenDeleteModal}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-50 text-rose-700 hover:bg-rose-600 hover:text-white border border-rose-200 hover:border-rose-600 transition-all font-semibold shadow-2xs"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Hapus Database</span>
          </button>

        </div>
      </div>
    </header>
  );
};
