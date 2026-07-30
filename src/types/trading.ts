export interface SupportResistanceLevel {
  price: number;
  type: 'support' | 'resistance';
  strength: number; // 0-1, based on touches
  touches: number;
  lastTouched: Date;
}

export interface PullbackEntry {
  entryPrice: number;
  stopLoss: number;
  takeProfit: number;
  riskReward: number;
  confidence: number; // 0-1
  pullbackPercentage: number;
  trend: 'uptrend' | 'downtrend';
}

export interface ChartAnalysis {
  id: string;
  fileName: string;
  uploadedAt: Date;
  imageUrl: string;
  supportLevels: SupportResistanceLevel[];
  resistanceLevels: SupportResistanceLevel[];
  pullbackEntries: PullbackEntry[];
  trend: 'uptrend' | 'downtrend' | 'sideways';
  rsi: number;
  macd: string;
  notes: string;
}

export interface ScanResult {
  symbol: string;
  timeframe: string;
  supportLevels: SupportResistanceLevel[];
  resistanceLevels: SupportResistanceLevel[];
  pullbackOpportunities: PullbackEntry[];
  overallSignal: 'buy' | 'sell' | 'neutral';
  confidence: number;
  timestamp: Date;
}
