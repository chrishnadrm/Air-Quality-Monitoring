export interface WeatherData {
  time: string;
  temp: number;      // Suhu DHT22 (°C)
  hum: number;       // Kelembaban (% RH)
  press: number;     // Tekanan Udara (hPa)
  bmptemp: number;   // Suhu BMP (°C)
  co: number;        // Gas CO (PPM)
  alt?: number;      // Deprecated altitude
}

export interface ApiResponse {
  status: 'success' | 'empty' | 'error';
  latest: WeatherData | null;
  history: WeatherData[];
  totalRows: number;
  message?: string;
}

export type ChartTabType = 'all' | 'temp' | 'hum' | 'press' | 'bmptemp' | 'co';

export interface GaugeConfig {
  label: string;
  sublabel: string;
  unit: string;
  min: number;
  max: number;
  color: string;
  bgColor: string;
  borderColor: string;
  textColor: string;
  icon: string;
}
