import React from 'react';
import { CloudSun, Clock, Database, Trash2, Settings, Code, RefreshCw, CheckCircle2, AlertCircle, Smartphone, Sun, Moon } from 'lucide-react';

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
  isDark: boolean;
  onToggleTheme: () => void;
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
  onToggleMockMode,
  isDark,
  onToggleTheme
}) => {
  return (
    <header className={`sticky top-0 z-40 w-full backdrop-blur-md border-b transition-colors px-4 lg:px-8 py-3.5 mb-6 ${
      isDark 
        ? 'bg-slate-900/90 border-slate-800 text-slate-100 shadow-md' 
        : 'bg-white/90 border-slate-200/80 text-slate-800 shadow-xs'
    }`}>
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Title & Subtitle */}
        <div className="flex items-center gap-3.5 w-full md:w-auto justify-between md:justify-start">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-gradient-to-br from-blue-500 to-indigo-600 text-white rounded-xl shadow-md shadow-blue-500/20">
              <CloudSun className="w-6 h-6 stroke-[2.2]" />
            </div>
            <div>
              <h1 className={`text-lg font-extrabold tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
                Air Quality Station Monitoring
              </h1>
              <p className={`text-xs font-normal mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                dashboard monitoring kualitas udara
              </p>
            </div>
          </div>

          {/* Quick Code & Settings Buttons for Mobile */}
          <div className="flex items-center gap-1.5 md:hidden">
            <button
              onClick={onToggleTheme}
              title="Ganti Tema (Gelap / Terang)"
              className={`p-2 rounded-lg transition-colors ${
                isDark ? 'bg-slate-800 text-amber-400 hover:bg-slate-700' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
            <button
              onClick={onOpenSettingsModal}
              title="Pengaturan URL"
              className={`p-2 rounded-lg transition-colors ${
                isDark ? 'bg-slate-800 text-slate-300 hover:bg-slate-700' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <Settings className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Status Indicators & Action Buttons */}
        <div className="flex flex-wrap items-center gap-2 text-xs w-full md:w-auto justify-end">
          
          {/* Connection Status */}
          <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border font-medium ${
            isConnected
              ? (isDark ? 'bg-emerald-950/40 border-emerald-800/60 text-emerald-300' : 'bg-emerald-50 border-emerald-200 text-emerald-800')
              : (isDark ? 'bg-rose-950/40 border-rose-800/60 text-rose-300' : 'bg-rose-50 border-rose-200 text-rose-800')
          }`}>
            <span className={`w-2.5 h-2.5 rounded-full ${
              isConnected 
                ? 'bg-emerald-500 animate-pulse shadow-sm shadow-emerald-500/50' 
                : 'bg-rose-500 shadow-sm shadow-rose-500/50'
            }`} />
            <span>{isConnected ? 'Terhubung' : 'Terputus'}</span>
          </div>

          {/* Theme Toggle Button */}
          <button
            onClick={onToggleTheme}
            className={`hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-lg border font-medium transition-all ${
              isDark 
                ? 'bg-slate-800 hover:bg-slate-700 border-slate-700 text-amber-300' 
                : 'bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-700'
            }`}
            title="Ganti Tema Gelap / Terang"
          >
            {isDark ? (
              <>
                <Sun className="w-3.5 h-3.5 text-amber-400" />
                <span>Terang</span>
              </>
            ) : (
              <>
                <Moon className="w-3.5 h-3.5 text-slate-600" />
                <span>Gelap</span>
              </>
            )}
          </button>

          {/* Last Update Time */}
          <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border font-medium ${
            isDark ? 'bg-slate-800/80 border-slate-700 text-slate-300' : 'bg-slate-100/80 border-slate-200 text-slate-700'
          }`}>
            <Clock className="w-3.5 h-3.5 text-blue-500" />
            <span>Update: <strong className={isDark ? 'text-white' : 'text-slate-900'}>{lastUpdate || '--:--:--'}</strong></span>
          </div>

          {/* Total Data Count */}
          <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border font-medium ${
            isDark ? 'bg-slate-800/80 border-slate-700 text-slate-300' : 'bg-slate-100/80 border-slate-200 text-slate-700'
          }`}>
            <Database className="w-3.5 h-3.5 text-indigo-500" />
            <span>Data: <strong className={isDark ? 'text-white' : 'text-slate-900'}>{totalRows}</strong></span>
          </div>

          {/* Manual Refresh Button */}
          <button
            onClick={onRefreshManual}
            disabled={isRefreshing}
            title="Refresh Data Sekarang"
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border font-semibold transition-all active:scale-95 disabled:opacity-50 ${
              isDark 
                ? 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700' 
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200'
            }`}
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-blue-500' : ''}`} />
            <span className="hidden sm:inline">Refresh</span>
          </button>

          {/* Mode Switcher Badge (Real Google Sheet vs Mock Mode) */}
          <button
            onClick={onToggleMockMode}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-semibold transition-all ${
              useMockData 
                ? (isDark ? 'bg-amber-950/60 text-amber-300 border-amber-800 hover:bg-amber-900/80' : 'bg-amber-50 text-amber-800 border-amber-300 hover:bg-amber-100')
                : (isDark ? 'bg-emerald-950/60 text-emerald-300 border-emerald-800 hover:bg-emerald-900/80' : 'bg-emerald-50 text-emerald-800 border-emerald-300 hover:bg-emerald-100')
            }`}
            title="Klik untuk beralih antara Data Google Sheet Asli dan Mode Simulasi"
          >
            {useMockData ? (
              <>
                <AlertCircle className="w-3.5 h-3.5 text-amber-500" />
                <span>Simulasi</span>
              </>
            ) : (
              <>
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                <span>Live Sheet</span>
              </>
            )}
          </button>

          {/* Settings & Script Buttons (Desktop) */}
          <div className="hidden md:flex items-center gap-1.5">
            <button
              onClick={onOpenSettingsModal}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border font-semibold transition-all ${
                isDark 
                  ? 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700' 
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200'
              }`}
              title="Atur URL Google Apps Script"
            >
              <Settings className="w-3.5 h-3.5" />
              <span>URL API</span>
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
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border transition-all font-semibold ${
              isDark
                ? 'bg-rose-950/50 text-rose-300 border-rose-800 hover:bg-rose-900'
                : 'bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-600 hover:text-white hover:border-rose-600'
            }`}
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Hapus Data</span>
          </button>

        </div>
      </div>
    </header>
  );
};

