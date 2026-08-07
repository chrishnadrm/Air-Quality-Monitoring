import React, { useState, useEffect, useCallback, useRef } from 'react';
import { WeatherData, ChartTabType } from './types';
import {
  fetchWeatherStationData,
  clearDatabaseApi,
  generateMockData,
  DEFAULT_SCRIPT_URL
} from './services/api';
import { Header } from './components/Header';
import { GaugeCard } from './components/GaugeCard';
import { COGaugeCard } from './components/COGaugeCard';
import { ChartSection } from './components/ChartSection';
import { DataTable } from './components/DataTable';
import { UrlSettingsModal } from './components/UrlSettingsModal';
import { DeleteConfirmModal } from './components/DeleteConfirmModal';
import { AppsScriptCodeModal } from './components/AppsScriptCodeModal';
import { InstallPwaModal } from './components/InstallPwaModal';
import { Thermometer, Droplets, Gauge as GaugeIcon, ThermometerSun, AlertCircle, ExternalLink, Code } from 'lucide-react';

export default function App() {
  // Theme State
  const [isDark, setIsDark] = useState<boolean>(() => {
    return localStorage.getItem('ws_theme') === 'dark';
  });

  const toggleTheme = () => {
    setIsDark(prev => {
      const next = !prev;
      localStorage.setItem('ws_theme', next ? 'dark' : 'light');
      return next;
    });
  };

  // Config & URL State
  const [scriptUrl, setScriptUrl] = useState<string>(() => {
    return localStorage.getItem('ws_script_url') || DEFAULT_SCRIPT_URL;
  });

  // Data & Realtime State
  const [historyData, setHistoryData] = useState<WeatherData[]>([]);
  const [latestData, setLatestData] = useState<WeatherData | null>(null);
  const [totalRows, setTotalRows] = useState<number>(0);
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [lastUpdate, setLastUpdate] = useState<string>('');
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [useMockData, setUseMockData] = useState<boolean>(false);
  const [fetchErrorMsg, setFetchErrorMsg] = useState<string | null>(null);

  // Connection tracking ref (tracks last time new data was received)
  const lastDataTimeRef = useRef<string | null>(null);
  const lastDataChangeTimestampRef = useRef<number>(Date.now());

  // Tab & Modal States
  const [activeChartTab, setActiveChartTab] = useState<ChartTabType>('all');
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState<boolean>(false);
  const [isCodeModalOpen, setIsCodeModalOpen] = useState<boolean>(false);
  const [isInstallModalOpen, setIsInstallModalOpen] = useState<boolean>(false);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  // PWA Install Prompt State
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isAppInstalled, setIsAppInstalled] = useState<boolean>(false);

  // PWA Event Listeners
  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    const handleAppInstalled = () => {
      setIsAppInstalled(true);
      setDeferredPrompt(null);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsAppInstalled(true);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setIsAppInstalled(true);
    }
    setDeferredPrompt(null);
  };

  // Save Script URL
  const handleSaveUrl = (newUrl: string) => {
    setScriptUrl(newUrl);
    localStorage.setItem('ws_script_url', newUrl);
    setFetchErrorMsg(null);
  };

  // Main Data Fetch Handler
  const loadData = useCallback(async (isManual = false) => {
    if (isManual) setIsRefreshing(true);

    if (useMockData) {
      // Mock Mode - always actively generating data
      const mockRes = generateMockData();
      setHistoryData(mockRes.history);
      setLatestData(mockRes.latest);
      setTotalRows(mockRes.totalRows);
      setIsConnected(true);
      setLastUpdate(new Date().toLocaleTimeString('id-ID'));
      setFetchErrorMsg(null);
      if (isManual) setTimeout(() => setIsRefreshing(false), 500);
      return;
    }

    try {
      const res = await fetchWeatherStationData(scriptUrl);
      if (res && res.status === 'success' && res.latest) {
        setHistoryData(res.history || []);
        setLatestData(res.latest);
        setTotalRows(res.totalRows || 0);

        // Check if data is new or stagnant
        const newTime = res.latest.time;
        const now = Date.now();

        if (newTime !== lastDataTimeRef.current) {
          lastDataTimeRef.current = newTime;
          lastDataChangeTimestampRef.current = now;
          setIsConnected(true);
        } else {
          // If the timestamp hasn't changed for more than 15 seconds, mark as disconnected
          if (now - lastDataChangeTimestampRef.current > 15000) {
            setIsConnected(false);
          } else {
            setIsConnected(true);
          }
        }

        setLastUpdate(new Date().toLocaleTimeString('id-ID'));
        setFetchErrorMsg(null);
      } else if (res && res.status === 'empty') {
        setHistoryData([]);
        setLatestData(null);
        setTotalRows(0);
        setIsConnected(false);
        setLastUpdate(new Date().toLocaleTimeString('id-ID'));
        setFetchErrorMsg(null);
      } else {
        setIsConnected(false);
      }
    } catch (err: any) {
      console.warn('Gagal mengambil data dari Google Sheet API:', err);
      setIsConnected(false);
      setFetchErrorMsg('Gagal terhubung ke Google Sheet API. Menggunakan mode simulasi fallback.');
      
      // Auto fallback to mock data on initial load if remote fetch blocked
      if (historyData.length === 0) {
        const mockRes = generateMockData();
        setHistoryData(mockRes.history);
        setLatestData(mockRes.latest);
        setTotalRows(mockRes.totalRows);
        setLastUpdate(new Date().toLocaleTimeString('id-ID'));
      }
    } finally {
      if (isManual) setTimeout(() => setIsRefreshing(false), 500);
    }
  }, [scriptUrl, useMockData, historyData.length]);

  // Initial Load & Polling (Every 3 seconds)
  useEffect(() => {
    loadData();
    const interval = setInterval(() => {
      loadData();
    }, 3000);

    return () => clearInterval(interval);
  }, [loadData]);

  // Execute Delete Database
  const handleExecuteDelete = async () => {
    setIsDeleting(true);
    try {
      if (useMockData) {
        setHistoryData([]);
        setLatestData(null);
        setTotalRows(0);
      } else {
        await clearDatabaseApi(scriptUrl);
        await loadData(true);
      }
      setIsDeleteModalOpen(false);
    } catch (err) {
      alert('Gagal menghapus database: ' + err);
    } finally {
      setIsDeleting(false);
    }
  };

  // Safe Gauge Metrics Calculation
  const tempVal = latestData ? latestData.temp : 0;
  const humVal = latestData ? latestData.hum : 0;
  const pressVal = latestData ? latestData.press : 0;
  const bmpTempVal = latestData ? latestData.bmptemp : 0;
  const coVal = latestData ? latestData.co : 0;

  return (
    <div className={`min-h-screen transition-colors duration-300 pb-16 selection:bg-blue-500 selection:text-white ${
      isDark ? 'bg-slate-900 text-slate-100' : 'bg-slate-50 text-slate-800'
    }`}>
      
      {/* HEADER NAVBAR */}
      <Header
        isConnected={isConnected}
        lastUpdate={lastUpdate}
        totalRows={totalRows}
        scriptUrl={scriptUrl}
        isRefreshing={isRefreshing}
        onRefreshManual={() => loadData(true)}
        onOpenDeleteModal={() => setIsDeleteModalOpen(true)}
        onOpenSettingsModal={() => setIsSettingsModalOpen(true)}
        onOpenCodeModal={() => setIsCodeModalOpen(true)}
        onOpenInstallModal={() => setIsInstallModalOpen(true)}
        useMockData={useMockData}
        onToggleMockMode={() => setUseMockData(!useMockData)}
        isDark={isDark}
        onToggleTheme={toggleTheme}
      />

      {/* MAIN CONTAINER */}
      <main className="max-w-7xl mx-auto px-4 lg:px-8 space-y-6">

        {/* CORS / Connection Error Notice Banner */}
        {fetchErrorMsg && !useMockData && (
          <div className={`border rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs shadow-2xs ${
            isDark 
              ? 'bg-amber-950/40 border-amber-800/80 text-amber-200' 
              : 'bg-amber-50 border-amber-200/80 text-amber-900'
          }`}>
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <p className="font-bold">Info Koneksi Google Apps Script:</p>
                <p className={`leading-relaxed ${isDark ? 'text-amber-300' : 'text-amber-800'}`}>
                  Web App Script URL saat ini: <code className={`px-1 py-0.5 rounded font-mono text-[11px] ${isDark ? 'bg-amber-900/60' : 'bg-amber-100'}`}>{scriptUrl}</code>.
                  Jika browser memblokir request lintas domain (CORS), Anda dapat beralih ke <strong>Simulasi Mode</strong> atau membuka spreadsheet langsung.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto justify-end">
              <button
                onClick={() => setUseMockData(true)}
                className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-semibold shadow-xs transition-all"
              >
                Gunakan Mode Simulasi
              </button>
              <a
                href={scriptUrl}
                target="_blank"
                rel="noreferrer"
                className={`p-1.5 rounded-xl ${isDark ? 'text-amber-300 hover:bg-amber-900/60' : 'text-amber-700 hover:bg-amber-100'}`}
                title="Buka Endpoint Google Sheet di Tab Baru"
              >
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </div>
        )}

        {/* 5 SENSOR GAUGE CARDS */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          
          {/* 1. GAUGE SUHU DHT22 */}
          <GaugeCard
            title="SUHU DHT22"
            value={tempVal}
            unit="°C"
            decimals={2}
            icon={Thermometer}
            strokeColor="#f59e0b"
            badgeBg={isDark ? "bg-amber-950/60" : "bg-amber-50"}
            iconColor="text-amber-500"
            gaugePercent={tempVal / 50}
            isDark={isDark}
          />

          {/* 2. GAUGE KELEMBABAN */}
          <GaugeCard
            title="KELEMBABAN"
            value={humVal}
            unit="% RH"
            decimals={2}
            icon={Droplets}
            strokeColor="#3b82f6"
            badgeBg={isDark ? "bg-blue-950/60" : "bg-blue-50"}
            iconColor="text-blue-500"
            gaugePercent={humVal / 100}
            isDark={isDark}
          />

          {/* 3. GAUGE TEKANAN UDARA */}
          <GaugeCard
            title="TEKANAN UDARA"
            value={pressVal}
            unit="hPa"
            decimals={2}
            icon={GaugeIcon}
            strokeColor="#10b981"
            badgeBg={isDark ? "bg-emerald-950/60" : "bg-emerald-50"}
            iconColor="text-emerald-500"
            gaugePercent={(pressVal - 900) / 200}
            isDark={isDark}
          />

          {/* 4. GAUGE SUHU BMP */}
          <GaugeCard
            title="SUHU BMP"
            value={bmpTempVal}
            unit="°C"
            decimals={2}
            icon={ThermometerSun}
            strokeColor="#6366f1"
            badgeBg={isDark ? "bg-indigo-950/60" : "bg-indigo-50"}
            iconColor="text-indigo-500"
            gaugePercent={bmpTempVal / 50}
            isDark={isDark}
          />

          {/* 5. GAUGE GAS CO WITH SAFETY STATUS */}
          <COGaugeCard coValue={coVal} isDark={isDark} />

        </section>

        {/* APEXCHARTS HISTORICAL TREND SECTION */}
        <ChartSection
          history={historyData}
          activeTab={activeChartTab}
          onTabChange={setActiveChartTab}
          isDark={isDark}
        />

        {/* RECENT SENSOR DATA TABLE */}
        <DataTable history={historyData} isDark={isDark} />

        {/* SCRIPT INFORMATION BANNER FOOTER */}
        <footer className={`rounded-2xl p-5 border shadow-2xs flex flex-col md:flex-row items-center justify-between gap-4 text-xs transition-colors ${
          isDark ? 'bg-slate-800/90 border-slate-700/80 text-slate-400' : 'bg-white border-slate-200/90 text-slate-500'
        }`}>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 rounded-xl">
              <Code className="w-4 h-4" />
            </div>
            <div>
              <p className={`font-bold ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>Air Quality Station Monitoring</p>
              <p className="text-[11px]">Dikembangkan dengan Frontend React Modern, Tailwind CSS, & Google Sheets Database.</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsCodeModalOpen(true)}
              className={`px-3 py-1.5 font-semibold rounded-xl transition-all ${
                isDark ? 'bg-slate-700 hover:bg-slate-600 text-slate-200' : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              Lihat Kode Script (kode.gs)
            </button>
            <button
              onClick={() => setIsSettingsModalOpen(true)}
              className={`px-3 py-1.5 font-semibold rounded-xl transition-all ${
                isDark ? 'bg-blue-950/80 hover:bg-blue-900 text-blue-300' : 'bg-blue-50 hover:bg-blue-100 text-blue-700'
              }`}
            >
              Pengaturan URL
            </button>
          </div>
        </footer>

      </main>

      {/* MODALS */}
      <UrlSettingsModal
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
        currentUrl={scriptUrl}
        onSaveUrl={handleSaveUrl}
      />

      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleExecuteDelete}
        isDeleting={isDeleting}
      />

      <AppsScriptCodeModal
        isOpen={isCodeModalOpen}
        onClose={() => setIsCodeModalOpen(false)}
      />

      <InstallPwaModal
        isOpen={isInstallModalOpen}
        onClose={() => setIsInstallModalOpen(false)}
        deferredPrompt={deferredPrompt}
        onInstallClick={handleInstallClick}
        isInstalled={isAppInstalled}
      />

    </div>
  );
}

