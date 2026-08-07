import { ApiResponse, WeatherData } from '../types';

export const DEFAULT_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzcEGAjbVS2DdFB5HcIpZVMnXHYOICD2nnway9xSBK68mGHtY0BcNQDQ9B6xTukDeke/exec';

// Generate mock data if API fails or for demo testing
export function generateMockData(): ApiResponse {
  const now = new Date();
  const history: WeatherData[] = [];
  
  for (let i = 20; i >= 0; i--) {
    const t = new Date(now.getTime() - i * 3000);
    const timeStr = t.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    
    // Realistic micro-fluctuations with 2 decimal precision
    const temp = parseFloat((27.52 + Math.sin(i * 0.3) * 1.54 + (Math.random() * 0.4 - 0.2)).toFixed(2));
    const hum = parseFloat((62.35 + Math.cos(i * 0.2) * 5.12 + (Math.random() * 1 - 0.5)).toFixed(2));
    const press = parseFloat((1011.28 + Math.sin(i * 0.1) * 3.45 + (Math.random() * 2 - 1)).toFixed(2));
    const bmptemp = parseFloat((27.84 + Math.sin(i * 0.3) * 1.42 + (Math.random() * 0.3 - 0.15)).toFixed(2));
    const co = parseFloat((3.25 + (i === 0 ? Math.random() * 2 : Math.random() * 0.8)).toFixed(2));

    history.push({
      time: timeStr,
      temp,
      hum,
      press,
      bmptemp,
      co
    });
  }

  return {
    status: 'success',
    latest: history[history.length - 1],
    history,
    totalRows: 124
  };
}

export async function fetchWeatherStationData(scriptUrl: string = DEFAULT_SCRIPT_URL): Promise<ApiResponse> {
  const targetUrl = `${scriptUrl}?action=getData&_t=${Date.now()}`;
  
  try {
    const response = await fetch(targetUrl, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    
    // Normalize data structure to ensure bmptemp is present
    if (data && data.status === 'success' && Array.isArray(data.history)) {
      const normalizedHistory = data.history.map((item: any) => ({
        time: item.time || new Date().toLocaleTimeString('id-ID'),
        temp: typeof item.temp === 'number' ? item.temp : parseFloat(item.temp || 0),
        hum: typeof item.hum === 'number' ? item.hum : parseFloat(item.hum || 0),
        press: typeof item.press === 'number' ? item.press : parseFloat(item.press || 0),
        bmptemp: item.bmptemp !== undefined 
          ? (typeof item.bmptemp === 'number' ? item.bmptemp : parseFloat(item.bmptemp || 0))
          : (item.alt !== undefined ? parseFloat(item.alt || 0) : item.temp || 0), // fallback if older dataset format
        co: typeof item.co === 'number' ? item.co : parseFloat(item.co || 0),
      }));

      const latest = normalizedHistory.length > 0 ? normalizedHistory[normalizedHistory.length - 1] : null;

      return {
        status: 'success',
        latest,
        history: normalizedHistory,
        totalRows: data.totalRows || normalizedHistory.length,
      };
    }

    if (data && data.status === 'empty') {
      return {
        status: 'empty',
        latest: null,
        history: [],
        totalRows: 0,
      };
    }

    return data;
  } catch (error) {
    console.warn('Google Sheet fetch error or CORS restriction, falling back to data parser / simulated feed:', error);
    throw error;
  }
}

export async function clearDatabaseApi(scriptUrl: string = DEFAULT_SCRIPT_URL): Promise<{ status: string; message: string }> {
  const targetUrl = `${scriptUrl}?action=clearData&_t=${Date.now()}`;

  try {
    const response = await fetch(targetUrl, { method: 'GET' });
    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Clear database API error:', error);
    throw error;
  }
}
