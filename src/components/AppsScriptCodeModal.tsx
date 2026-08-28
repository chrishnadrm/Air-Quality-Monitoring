import React, { useState } from 'react';
import { X, Code, Copy, Check, FileSpreadsheet } from 'lucide-react';

interface AppsScriptCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AppsScriptCodeModal: React.FC<AppsScriptCodeModalProps> = ({ isOpen, onClose }) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const scriptCode = `// ==========================================================
// BACKEND GOOGLE APPS SCRIPT - WEATHER STATION MONITORING
// PARAMETER: Suhu DHT, Kelembaban, Tekanan, Suhu BMP, CO
// ==========================================================

function doGet(e) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  
  // Buat header otomatis jika sheet masih kosong
  if (sheet.getLastRow() == 0) {
    sheet.appendRow([
      "Waktu",
      "Suhu DHT",
      "Kelembaban",
      "Tekanan",
      "Suhu BMP",
      "CO"
    ]);
  }

  // 1. Handling pengiriman data dari ESP32 (HTTP GET)
  if (e && e.parameter && e.parameter.temp !== undefined) {
    sheet.appendRow([
      new Date(),
      Number(e.parameter.temp),
      Number(e.parameter.hum),
      Number(e.parameter.press),
      Number(e.parameter.bmptemp || e.parameter.alt || 0),
      Number(e.parameter.co)
    ]);
    return ContentService.createTextOutput("OK");
  }

  // 2. Request API AJAX untuk mengambil data histori & realtime
  if (e && e.parameter && e.parameter.action === "getData") {
    var data = getLatestData();
    return ContentService.createTextOutput(JSON.stringify(data))
      .setMimeType(ContentService.MimeType.JSON);
  }

  // 3. Request API AJAX untuk menghapus seluruh database
  if (e && e.parameter && e.parameter.action === "clearData") {
    var result = clearDatabase();
    return ContentService.createTextOutput(JSON.stringify(result))
      .setMimeType(ContentService.MimeType.JSON);
  }

  return ContentService.createTextOutput("Weather Station Apps Script API Active");
}

// Fungsi untuk mengambil data terbaru dan 50 data terakhir untuk grafik
function getLatestData() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var lastRow = sheet.getLastRow();
  
  if (lastRow <= 1) {
    return {
      status: "empty",
      latest: null,
      history: [],
      totalRows: 0
    };
  }

  var maxRows = 50;
  var startRow = Math.max(2, lastRow - maxRows + 1);
  var numRows = lastRow - startRow + 1;
  
  var range = sheet.getRange(startRow, 1, numRows, 6);
  var values = range.getValues();
  
  var history = [];
  for (var i = 0; i < values.length; i++) {
    var row = values[i];
    var timeFormatted = row[0] instanceof Date 
      ? Utilities.formatDate(row[0], Session.getScriptTimeZone(), "HH:mm:ss")
      : String(row[0]);
      
    history.push({
      time: timeFormatted,
      temp: Number(row[1]) || 0,
      hum: Number(row[2]) || 0,
      press: Number(row[3]) || 0,
      bmptemp: Number(row[4]) || 0,
      co: Number(row[5]) || 0
    });
  }

  return {
    status: "success",
    latest: history[history.length - 1],
    history: history,
    totalRows: lastRow - 1
  };
}

// Fungsi Backend untuk Menghapus Seluruh Isi Database (Menyisakan Header)
function clearDatabase() {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    var lastRow = sheet.getLastRow();
    
    if (lastRow > 1) {
      sheet.deleteRows(2, lastRow - 1);
    }
    return { status: "success", message: "Database berhasil dibersihkan!" };
  } catch (error) {
    return { status: "error", message: error.toString() };
  }
}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(scriptCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-fade-in">
      <div className="bg-white border border-slate-200 rounded-2xl max-w-2xl w-full p-6 shadow-xl space-y-4 max-h-[90vh] flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl">
              <Code className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-slate-900">Kode Google Apps Script (kode.gs)</h3>
              <p className="text-xs text-slate-500">Versi Diperbarui: Parameter Altitude diganti Suhu BMP</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Info Banner */}
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-900 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <FileSpreadsheet className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Copy kode di bawah ini lalu tempel di menu <strong>Extensions &gt; Apps Script</strong> pada Google Sheets Anda.</span>
          </div>
          <button
            onClick={handleCopy}
            className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-semibold flex items-center gap-1 transition-all shrink-0 ml-2"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>Tersalin!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Salin Kode</span>
              </>
            )}
          </button>
        </div>

        {/* Code View */}
        <div className="overflow-y-auto flex-1 bg-slate-900 text-slate-100 p-4 rounded-xl font-mono text-xs leading-relaxed border border-slate-800 selection:bg-blue-500 selection:text-white">
          <pre>{scriptCode}</pre>
        </div>

        {/* Footer */}
        <div className="pt-2 border-t border-slate-100 flex justify-end shrink-0">
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
