import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ChartAnalysis } from '@/types/trading';
import { X, Download } from 'lucide-react';

interface ChartDetailsProps {
  analysis: ChartAnalysis;
  onClose: () => void;
}

export const ChartDetails: React.FC<ChartDetailsProps> = ({ analysis, onClose }) => {
  const getTrendColor = (trend: string) => {
    if (trend === 'uptrend') return 'bg-green-500/20 text-green-700 border-green-200';
    if (trend === 'downtrend') return 'bg-red-500/20 text-red-700 border-red-200';
    return 'bg-yellow-500/20 text-yellow-700 border-yellow-200';
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto border-border bg-card">
        <CardHeader className="flex flex-row items-start justify-between">
          <div className="flex-1">
            <CardTitle>{analysis.fileName}</CardTitle>
            <CardDescription>{analysis.uploadedAt.toLocaleString()}</CardDescription>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Chart Image */}
          <div className="space-y-2">
            <h3 className="font-semibold text-foreground">Chart Image</h3>
            <img
              src={analysis.imageUrl}
              alt="Chart"
              className="w-full rounded-lg border border-border max-h-64 object-cover"
            />
          </div>

          {/* Indicators */}
          <div className="grid grid-cols-3 gap-3">
            <div className="p-3 rounded-lg bg-muted/30 border border-border">
              <p className="text-xs text-muted-foreground mb-1">Trend</p>
              <Badge className={getTrendColor(analysis.trend)}>{analysis.trend}</Badge>
            </div>
            <div className="p-3 rounded-lg bg-muted/30 border border-border">
              <p className="text-xs text-muted-foreground mb-1">RSI</p>
              <p className="font-semibold text-foreground">{analysis.rsi.toFixed(1)}</p>
            </div>
            <div className="p-3 rounded-lg bg-muted/30 border border-border">
              <p className="text-xs text-muted-foreground mb-1">MACD</p>
              <Badge variant="secondary">{analysis.macd}</Badge>
            </div>
          </div>

          {/* Support Levels */}
          {analysis.supportLevels.length > 0 && (
            <div className="space-y-2">
              <h3 className="font-semibold text-foreground">Support Levels</h3>
              <div className="space-y-2">
                {analysis.supportLevels.map((level, idx) => (
                  <div key={idx} className="flex items-center justify-between p-2 rounded bg-muted/30 border border-border">
                    <span className="font-mono text-sm">{level.price.toFixed(5)}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground">{level.touches} touches</span>
                      <div className="w-16 h-1.5 bg-muted rounded overflow-hidden">
                        <div
                          className="h-full bg-green-500"
                          style={{ width: `${level.strength * 100}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Resistance Levels */}
          {analysis.resistanceLevels.length > 0 && (
            <div className="space-y-2">
              <h3 className="font-semibold text-foreground">Resistance Levels</h3>
              <div className="space-y-2">
                {analysis.resistanceLevels.map((level, idx) => (
                  <div key={idx} className="flex items-center justify-between p-2 rounded bg-muted/30 border border-border">
                    <span className="font-mono text-sm">{level.price.toFixed(5)}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground">{level.touches} touches</span>
                      <div className="w-16 h-1.5 bg-muted rounded overflow-hidden">
                        <div
                          className="h-full bg-red-500"
                          style={{ width: `${level.strength * 100}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Pullback Entries */}
          {analysis.pullbackEntries.length > 0 && (
            <div className="space-y-2">
              <h3 className="font-semibold text-foreground">Pullback Entries</h3>
              {analysis.pullbackEntries.map((entry, idx) => (
                <div key={idx} className="p-3 rounded-lg border border-border bg-muted/20 space-y-2">
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <p className="text-muted-foreground text-xs">Entry</p>
                      <p className="font-mono font-semibold">{entry.entryPrice.toFixed(5)}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground text-xs">Stop Loss</p>
                      <p className="font-mono font-semibold text-red-600">{entry.stopLoss.toFixed(5)}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground text-xs">Take Profit</p>
                      <p className="font-mono font-semibold text-green-600">{entry.takeProfit.toFixed(5)}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground text-xs">R:R Ratio</p>
                      <p className="font-mono font-semibold">{entry.riskReward.toFixed(2)}:1</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Notes */}
          {analysis.notes && (
            <div className="space-y-2">
              <h3 className="font-semibold text-foreground">Notes</h3>
              <p className="text-sm text-muted-foreground p-3 rounded-lg bg-muted/30 border border-border">
                {analysis.notes}
              </p>
            </div>
          )}

          {/* Export Button */}
          <Button className="w-full" variant="secondary">
            <Download className="w-4 h-4 mr-2" />
            Export Analysis
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};
