import { SupportResistanceLevel, PullbackEntry } from '@/types/trading';

// Generate mock support/resistance levels based on price data
export function analyzeSupportResistance(
  prices: number[],
  tolerance: number = 0.02
): { support: SupportResistanceLevel[]; resistance: SupportResistanceLevel[] } {
  if (prices.length < 10) {
    return { support: [], resistance: [] };
  }

  const highs = prices.map((p, i) => ({
    price: p,
    index: i,
    isLocal: i > 0 && i < prices.length - 1 && p > prices[i - 1] && p > prices[i + 1],
  }));

  const lows = prices.map((p, i) => ({
    price: p,
    index: i,
    isLocal: i > 0 && i < prices.length - 1 && p < prices[i - 1] && p < prices[i + 1],
  }));

  const support: SupportResistanceLevel[] = [];
  const resistance: SupportResistanceLevel[] = [];

  // Group similar prices
  const groupedLows = groupPrices(
    lows.filter((l) => l.isLocal).map((l) => l.price),
    tolerance
  );
  const groupedHighs = groupPrices(
    highs.filter((h) => h.isLocal).map((h) => h.price),
    tolerance
  );

  groupedLows.forEach((group) => {
    const avgPrice = group.reduce((a, b) => a + b, 0) / group.length;
    support.push({
      price: avgPrice,
      type: 'support',
      strength: Math.min(1, group.length / 5),
      touches: group.length,
      lastTouched: new Date(),
    });
  });

  groupedHighs.forEach((group) => {
    const avgPrice = group.reduce((a, b) => a + b, 0) / group.length;
    resistance.push({
      price: avgPrice,
      type: 'resistance',
      strength: Math.min(1, group.length / 5),
      touches: group.length,
      lastTouched: new Date(),
    });
  });

  return {
    support: support.sort((a, b) => a.price - b.price),
    resistance: resistance.sort((a, b) => a.price - b.price),
  };
}

// Identify pullback entry points
export function identifyPullbackEntries(
  prices: number[],
  support: SupportResistanceLevel[],
  resistance: SupportResistanceLevel[]
): PullbackEntry[] {
  if (prices.length < 20) return [];

  const entries: PullbackEntry[] = [];
  const currentPrice = prices[prices.length - 1];
  const trend = determineTrend(prices);

  if (trend === 'uptrend' && support.length > 0) {
    // Look for pullbacks to support in uptrend
    const nearestSupport = support[support.length - 1];
    const pullbackPercentage = ((currentPrice - nearestSupport.price) / currentPrice) * 100;

    if (pullbackPercentage > 0.5 && pullbackPercentage < 5) {
      const entryPrice = nearestSupport.price * 1.002; // Entry slightly above support
      const stopLoss = nearestSupport.price * 0.998;
      const takeProfit = currentPrice * 1.02;
      const riskReward = (takeProfit - entryPrice) / (entryPrice - stopLoss);

      entries.push({
        entryPrice,
        stopLoss,
        takeProfit,
        riskReward,
        confidence: Math.min(0.95, 0.5 + nearestSupport.strength * 0.3 + Math.min(0.2, pullbackPercentage / 25)),
        pullbackPercentage,
        trend: 'uptrend',
      });
    }
  } else if (trend === 'downtrend' && resistance.length > 0) {
    // Look for pullbacks to resistance in downtrend
    const nearestResistance = resistance[0];
    const pullbackPercentage = ((nearestResistance.price - currentPrice) / currentPrice) * 100;

    if (pullbackPercentage > 0.5 && pullbackPercentage < 5) {
      const entryPrice = nearestResistance.price * 0.998;
      const stopLoss = nearestResistance.price * 1.002;
      const takeProfit = currentPrice * 0.98;
      const riskReward = (entryPrice - takeProfit) / (stopLoss - entryPrice);

      entries.push({
        entryPrice,
        stopLoss,
        takeProfit,
        riskReward,
        confidence: Math.min(0.95, 0.5 + nearestResistance.strength * 0.3 + Math.min(0.2, pullbackPercentage / 25)),
        pullbackPercentage,
        trend: 'downtrend',
      });
    }
  }

  return entries;
}

// Determine market trend
export function determineTrend(prices: number[], period: number = 20): 'uptrend' | 'downtrend' | 'sideways' {
  if (prices.length < period) return 'sideways';

  const recentPrices = prices.slice(-period);
  const sma = recentPrices.reduce((a, b) => a + b, 0) / period;
  const currentPrice = prices[prices.length - 1];

  const avgHigh = Math.max(...recentPrices);
  const avgLow = Math.min(...recentPrices);
  const range = avgHigh - avgLow;

  if (currentPrice > sma + range * 0.1) return 'uptrend';
  if (currentPrice < sma - range * 0.1) return 'downtrend';
  return 'sideways';
}

// Calculate RSI
export function calculateRSI(prices: number[], period: number = 14): number {
  if (prices.length < period + 1) return 50;

  let gains = 0;
  let losses = 0;

  for (let i = prices.length - period; i < prices.length; i++) {
    const change = prices[i] - prices[i - 1];
    if (change > 0) gains += change;
    else losses += Math.abs(change);
  }

  const avgGain = gains / period;
  const avgLoss = losses / period;
  const rs = avgGain / avgLoss;
  const rsi = 100 - 100 / (1 + rs);

  return isNaN(rsi) ? 50 : rsi;
}

// Helper function to group similar prices
function groupPrices(prices: number[], tolerance: number): number[][] {
  if (prices.length === 0) return [];

  const sorted = [...prices].sort((a, b) => a - b);
  const groups: number[][] = [];
  let currentGroup: number[] = [sorted[0]];

  for (let i = 1; i < sorted.length; i++) {
    const diff = Math.abs(sorted[i] - sorted[i - 1]) / sorted[i - 1];
    if (diff <= tolerance) {
      currentGroup.push(sorted[i]);
    } else {
      groups.push(currentGroup);
      currentGroup = [sorted[i]];
    }
  }
  groups.push(currentGroup);

  return groups.filter((g) => g.length > 0);
}

// Generate mock price data for demonstration
export function generateMockPrices(basePrice: number = 1.1050, count: number = 100): number[] {
  const prices: number[] = [basePrice];
  let currentPrice = basePrice;

  for (let i = 1; i < count; i++) {
    const change = (Math.random() - 0.48) * 0.0010;
    currentPrice += change;
    prices.push(Math.round(currentPrice * 10000) / 10000);
  }

  return prices;
}
