import React from 'react';
import { Smartphone, Download, X, Share, PlusSquare, CheckCircle2 } from 'lucide-react';

interface InstallPwaModalProps {
  isOpen: boolean;
  onClose: () => void;
  deferredPrompt: any;
  onInstallClick: () => void;
  isInstalled: boolean;
}

export const InstallPwaModal: React.FC<InstallPwaModalProps> = ({
  isOpen,
  onClose,
  deferredPrompt,
  onInstallClick,
  isInstalled
}) => {
  if (!isOpen) return null;

  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-fade-in">
      <div className="bg-white border border-slate-200 rounded-2xl max-w-md w-full p-6 shadow-xl space-y-4">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-slate-900">Install Aplikasi Weather Station</h3>
              <p className="text-xs text-slate-500">Pasang di Layar Utama Smartphone HP / Tablet</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        {isInstalled ? (
          <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-center space-y-2">
            <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
            <p className="text-sm font-bold text-emerald-900">Aplikasi Sudah Terinstall!</p>
            <p className="text-xs text-emerald-700">
              Aplikasi telah terpasang di perangkat Anda. Anda dapat membukanya langsung dari layar utama / app drawer.
            </p>
          </div>
        ) : deferredPrompt ? (
          <div className="space-y-4">
            <p className="text-xs text-slate-600 leading-relaxed">
              Klik tombol di bawah ini untuk memasang aplikasi Weather Station Monitoring secara native di smartphone Android atau Komputer Anda.
            </p>
            <button
              onClick={onInstallClick}
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-md shadow-blue-500/20 flex items-center justify-center gap-2 transition-all active:scale-98"
            >
              <Download className="w-4 h-4" />
              <span>Install Sekarang</span>
            </button>
          </div>
        ) : isIOS ? (
          <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs space-y-3">
            <p className="font-bold text-slate-800">Petunjuk Instalasi untuk iOS (iPhone / iPad):</p>
            <ol className="list-decimal pl-4 space-y-2 text-slate-600">
              <li className="flex items-center gap-1.5">
                <span>1. Buka halaman ini di browser <strong>Safari</strong>.</span>
              </li>
              <li className="flex items-center gap-1.5">
                <span>2. Ketuk tombol Share</span>
                <Share className="w-3.5 h-3.5 text-blue-600 inline" />
                <span>di bagian bawah browser.</span>
              </li>
              <li className="flex items-center gap-1.5">
                <span>3. Pilih menu <strong>"Add to Home Screen"</strong></span>
                <PlusSquare className="w-3.5 h-3.5 text-slate-700 inline" />
              </li>
              <li>4. Ketuk <strong>"Add"</strong> di pojok kanan atas.</li>
            </ol>
          </div>
        ) : (
          <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs space-y-2 text-slate-600">
            <p className="font-bold text-slate-800">Cara Instalasi Manual di HP (Chrome / Edge / Opera):</p>
            <ul className="list-disc pl-4 space-y-1.5">
              <li>Buka menu opsi browser (ikon titik tiga <strong className="text-slate-800">⋮</strong> di pojok atas)</li>
              <li>Pilih menu <strong>"Tambahkan ke Layar Utama"</strong> atau <strong>"Install Aplikasi"</strong></li>
              <li>Aplikasi akan langsung terpasang di layar utama smartphone Anda</li>
            </ul>
          </div>
        )}

        {/* Footer */}
        <div className="pt-2 border-t border-slate-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 transition-all"
          >
            Tutup
          </button>
        </div>

      </div>
    </div>
  );
};
