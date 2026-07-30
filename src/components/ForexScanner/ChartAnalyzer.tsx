import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Upload, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { ChartAnalysis } from '@/types/trading';

interface ChartAnalyzerProps {
  onAnalysisComplete: (analysis: ChartAnalysis) => void;
}

export const ChartAnalyzer: React.FC<ChartAnalyzerProps> = ({ onAnalysisComplete }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>('');

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image must be less than 5MB');
      return;
    }

    setFileName(file.name);

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleAnalyze = async () => {
    if (!preview) {
      toast.error('Please select a chart image');
      return;
    }

    setIsLoading(true);
    try {
      // Simulate chart analysis
      await new Promise((resolve) => setTimeout(resolve, 2000));

      const mockAnalysis: ChartAnalysis = {
        id: Math.random().toString(36).substr(2, 9),
        fileName,
        uploadedAt: new Date(),
        imageUrl: preview,
        supportLevels: [
          { price: 1.1000, type: 'support', strength: 0.8, touches: 3, lastTouched: new Date() },
          { price: 1.0950, type: 'support', strength: 0.6, touches: 2, lastTouched: new Date() },
        ],
        resistanceLevels: [
          { price: 1.1100, type: 'resistance', strength: 0.85, touches: 3, lastTouched: new Date() },
          { price: 1.1150, type: 'resistance', strength: 0.7, touches: 2, lastTouched: new Date() },
        ],
        pullbackEntries: [
          {
            entryPrice: 1.1025,
            stopLoss: 1.0990,
            takeProfit: 1.1080,
            riskReward: 2.1,
            confidence: 0.78,
            pullbackPercentage: 1.2,
            trend: 'uptrend',
          },
        ],
        trend: 'uptrend',
        rsi: 62,
        macd: 'Bullish',
        notes: 'Strong support at 1.1000 with multiple touches. Pullback opportunity identified.',
      };

      onAnalysisComplete(mockAnalysis);
      toast.success('Chart analyzed successfully');
      setPreview(null);
      setFileName('');
    } catch (error) {
      toast.error('Failed to analyze chart');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="border-border bg-card">
      <CardHeader>
        <CardTitle>Chart Image Analyzer</CardTitle>
        <CardDescription>Upload a Forex chart to analyze support/resistance and pullback entries</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-foreground">Upload Chart Image</label>
          <div className="flex items-center gap-2">
            <Input
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              disabled={isLoading}
              className="cursor-pointer"
            />
            <Button variant="outline" size="sm" disabled={isLoading} asChild>
              <label className="cursor-pointer">
                <Upload className="w-4 h-4 mr-2" />
                Browse
              </label>
            </Button>
          </div>
        </div>

        {preview && (
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Preview:</p>
            <img src={preview} alt="Chart preview" className="w-full max-h-64 object-cover rounded-lg border border-border" />
          </div>
        )}

        <Button onClick={handleAnalyze} disabled={!preview || isLoading} className="w-full" size="lg">
          {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
          {isLoading ? 'Analyzing...' : 'Analyze Chart'}
        </Button>
      </CardContent>
    </Card>
  );
};
