import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScanResult, SupportResistanceLevel, PullbackEntry } from '@/types/trading';
import { TrendingUp, TrendingDown, AlertCircle } from 'lucide-react';

interface ScanResultsProps {
  result: ScanResult;
}

export const ScanResults: React.FC<ScanResultsProps> = ({ result }) => {
  const getSignalColor = (signal: string) => {
    if (signal === 'buy') return 'bg-green-500/20 text-green-700 border-green-200';
    if (signal === 'sell') return 'bg-red-500/20 text-red-700 border-red-200';
    return 'bg-yellow-500/20 text-yellow-700 border-yellow-200';
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence > 0.75) return 'text-green-600';
    if (confidence > 0.5) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="space-y-4">
      {/* Overall Signal */}
      <Card className="border-border bg-card">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Trading Signal</CardTitle>
              <CardDescription>
                {result.symbol} • {result.timeframe}
              </CardDescription>
            </div>
            <Badge className={`text-lg px-4 py-2 ${getSignalColor(result.overallSignal)}`}>
              {result.overallSignal.toUpperCase()}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Confidence Level</span>
            <div className="flex items-center gap-2">
              <div className="w-32 h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all ${getConfidenceColor(result.confidence)}`}
                  style={{ width: `${result.confidence * 100}%` }}
                />
              </div>
              <span className={`font-semibold ${getConfidenceColor(result.confidence)}`}>
                {(result.confidence * 100).toFixed(1)}%
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Support Levels */}
      {result.supportLevels.length > 0 && (
        <Card className="border-border bg-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingDown className="w-5 h-5 text-green-600" />
              Support Levels
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {result.supportLevels.map((level, idx) => (
                <SupportResistanceItem key={idx} level={level} />
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Resistance Levels */}
      {result.resistanceLevels.length > 0 && (
        <Card className="border-border bg-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-red-600" />
              Resistance Levels
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {result.resistanceLevels.map((level, idx) => (
                <SupportResistanceItem key={idx} level={level} />
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Pullback Opportunities */}
      {result.pullbackOpportunities.length > 0 && (
        <Card className="border-border bg-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-blue-600" />
              Pullback Entry Opportunities
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {result.pullbackOpportunities.map((entry, idx) => (
                <PullbackEntryItem key={idx} entry={entry} />
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

const SupportResistanceItem: React.FC<{ level: SupportResistanceLevel }> = ({ level }) => (
  <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30 border border-border">
    <div className="flex-1">
      <div className="font-semibold text-foreground">{level.price.toFixed(5)}</div>
      <div className="text-xs text-muted-foreground">{level.touches} touches • Strength: {(level.strength * 100).toFixed(0)}%</div>
    </div>
    <div className="w-24 h-2 bg-muted rounded-full overflow-hidden">
      <div className="h-full bg-blue-500 transition-all" style={{ width: `${level.strength * 100}%` }} />
    </div>
  </div>
);

const PullbackEntryItem: React.FC<{ entry: PullbackEntry }> = ({ entry }) => (
  <div className="p-4 rounded-lg border border-border bg-muted/20 space-y-3">
    <div className="flex items-center justify-between">
      <span className="text-sm font-medium text-muted-foreground">Trend</span>
      <Badge variant="secondary">{entry.trend.toUpperCase()}</Badge>
    </div>

    <div className="grid grid-cols-2 gap-3">
      <div>
        <p className="text-xs text-muted-foreground">Entry Price</p>
        <p className="font-semibold text-foreground">{entry.entryPrice.toFixed(5)}</p>
      </div>
      <div>
        <p className="text-xs text-muted-foreground">Stop Loss</p>
        <p className="font-semibold text-red-600">{entry.stopLoss.toFixed(5)}</p>
      </div>
      <div>
        <p className="text-xs text-muted-foreground">Take Profit</p>
        <p className="font-semibold text-green-600">{entry.takeProfit.toFixed(5)}</p>
      </div>
      <div>
        <p className="text-xs text-muted-foreground">Risk:Reward</p>
        <p className="font-semibold text-foreground">{entry.riskReward.toFixed(2)}:1</p>
      </div>
    </div>

    <div className="flex items-center justify-between pt-2 border-t border-border">
      <span className="text-xs text-muted-foreground">Confidence</span>
      <div className="flex items-center gap-2">
        <div className="w-20 h-2 bg-muted rounded-full overflow-hidden">
          <div className="h-full bg-blue-500" style={{ width: `${entry.confidence * 100}%` }} />
        </div>
        <span className="text-sm font-semibold text-foreground">{(entry.confidence * 100).toFixed(0)}%</span>
      </div>
    </div>
  </div>
);
