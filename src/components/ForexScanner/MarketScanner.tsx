import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Loader2, Scan } from 'lucide-react';
import { toast } from 'sonner';
import { ScanResult } from '@/types/trading';
import {
  analyzeSupportResistance,
  identifyPullbackEntries,
  determineTrend,
  calculateRSI,
  generateMockPrices,
} from '@/utils/technicalAnalysis';

interface MarketScannerProps {
  onScanComplete: (result: ScanResult) => void;
}

const FOREX_PAIRS = ['EURUSD', 'GBPUSD', 'USDJPY', 'AUDUSD', 'NZDUSD', 'USDCAD', 'USDHKD'];
const TIMEFRAMES = ['1M', '5M', '15M', '1H', '4H', '1D', '1W'];

export const MarketScanner: React.FC<MarketScannerProps> = ({ onScanComplete }) => {
  const [isScanning, setIsScanning] = useState(false);
  const [selectedPair, setSelectedPair] = useState('EURUSD');
  const [selectedTimeframe, setSelectedTimeframe] = useState('1H');

  const handleScan = async () => {
    if (!selectedPair || !selectedTimeframe) {
      toast.error('Please select a pair and timeframe');
      return;
    }

    setIsScanning(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Generate mock price data
      const prices = generateMockPrices(1.1050, 100);

      // Analyze
      const { support, resistance } = analyzeSupportResistance(prices);
      const trend = determineTrend(prices);
      const pullbackEntries = identifyPullbackEntries(prices, support, resistance);
      const rsi = calculateRSI(prices);

      // Determine overall signal
      let overallSignal: 'buy' | 'sell' | 'neutral' = 'neutral';
      let confidence = 0.5;

      if (trend === 'uptrend' && pullbackEntries.length > 0) {
        overallSignal = 'buy';
        confidence = Math.min(0.95, 0.6 + pullbackEntries[0].confidence * 0.2);
      } else if (trend === 'downtrend' && pullbackEntries.length > 0) {
        overallSignal = 'sell';
        confidence = Math.min(0.95, 0.6 + pullbackEntries[0].confidence * 0.2);
      }

      const result: ScanResult = {
        symbol: selectedPair,
        timeframe: selectedTimeframe,
        supportLevels: support,
        resistanceLevels: resistance,
        pullbackOpportunities: pullbackEntries,
        overallSignal,
        confidence,
        timestamp: new Date(),
      };

      onScanComplete(result);
      toast.success(`${selectedPair} scanned successfully`);
    } catch (error) {
      toast.error('Failed to scan market');
    } finally {
      setIsScanning(false);
    }
  };

  return (
    <Card className="border-border bg-card">
      <CardHeader>
        <CardTitle>Market Scanner</CardTitle>
        <CardDescription>Scan Forex pairs for support/resistance and pullback opportunities</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-foreground">Currency Pair</label>
            <Select value={selectedPair} onValueChange={setSelectedPair} disabled={isScanning}>
              <SelectTrigger className="bg-background border-border text-foreground">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-background border-border">
                {FOREX_PAIRS.map((pair) => (
                  <SelectItem key={pair} value={pair}>
                    {pair}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-foreground">Timeframe</label>
            <Select value={selectedTimeframe} onValueChange={setSelectedTimeframe} disabled={isScanning}>
              <SelectTrigger className="bg-background border-border text-foreground">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-background border-border">
                {TIMEFRAMES.map((tf) => (
                  <SelectItem key={tf} value={tf}>
                    {tf}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <Button onClick={handleScan} disabled={isScanning} className="w-full" size="lg">
          {isScanning && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
          {isScanning ? 'Scanning...' : 'Scan Market'}
          {!isScanning && <Scan className="w-4 h-4 ml-2" />}
        </Button>
      </CardContent>
    </Card>
  );
};
