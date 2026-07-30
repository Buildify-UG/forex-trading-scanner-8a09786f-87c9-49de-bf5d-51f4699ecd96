import React, { useState } from 'react';
import { MarketScanner } from '@/components/ForexScanner/MarketScanner';
import { ChartAnalyzer } from '@/components/ForexScanner/ChartAnalyzer';
import { ScanResults } from '@/components/ForexScanner/ScanResults';
import { AnalysisHistory } from '@/components/ForexScanner/AnalysisHistory';
import { ChartDetails } from '@/components/ForexScanner/ChartDetails';
import { ScanResult, ChartAnalysis } from '@/types/trading';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function ForexTrader() {
  const [scanResult, setScanResult] = useState<ScanResult | null>(null);
  const [chartAnalyses, setChartAnalyses] = useState<ChartAnalysis[]>([]);
  const [selectedAnalysis, setSelectedAnalysis] = useState<ChartAnalysis | null>(null);

  const handleChartAnalysis = (analysis: ChartAnalysis) => {
    setChartAnalyses([analysis, ...chartAnalyses]);
    setSelectedAnalysis(analysis);
  };

  const handleDeleteAnalysis = (id: string) => {
    setChartAnalyses(chartAnalyses.filter((a) => a.id !== id));
    if (selectedAnalysis?.id === id) {
      setSelectedAnalysis(null);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">Forex Trading Scanner</h1>
          <p className="text-muted-foreground">
            Advanced support/resistance analysis with pullback entry detection
          </p>
        </div>

        <Tabs defaultValue="market" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 bg-muted">
            <TabsTrigger value="market">Market Scanner</TabsTrigger>
            <TabsTrigger value="chart">Chart Analyzer</TabsTrigger>
            <TabsTrigger value="history">History ({chartAnalyses.length})</TabsTrigger>
          </TabsList>

          {/* Market Scanner Tab */}
          <TabsContent value="market" className="space-y-6">
            <MarketScanner onScanComplete={setScanResult} />
            {scanResult && <ScanResults result={scanResult} />}
          </TabsContent>

          {/* Chart Analyzer Tab */}
          <TabsContent value="chart" className="space-y-6">
            <ChartAnalyzer onAnalysisComplete={handleChartAnalysis} />
            {selectedAnalysis && (
              <ChartDetails
                analysis={selectedAnalysis}
                onClose={() => setSelectedAnalysis(null)}
              />
            )}
          </TabsContent>

          {/* History Tab */}
          <TabsContent value="history">
            <AnalysisHistory
              analyses={chartAnalyses}
              onView={setSelectedAnalysis}
              onDelete={handleDeleteAnalysis}
            />
            {selectedAnalysis && (
              <ChartDetails
                analysis={selectedAnalysis}
                onClose={() => setSelectedAnalysis(null)}
              />
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
