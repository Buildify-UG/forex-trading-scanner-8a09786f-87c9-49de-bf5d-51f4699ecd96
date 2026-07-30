import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ChartAnalysis } from '@/types/trading';
import { Trash2, Eye } from 'lucide-react';

interface AnalysisHistoryProps {
  analyses: ChartAnalysis[];
  onView: (analysis: ChartAnalysis) => void;
  onDelete: (id: string) => void;
}

export const AnalysisHistory: React.FC<AnalysisHistoryProps> = ({ analyses, onView, onDelete }) => {
  if (analyses.length === 0) {
    return (
      <Card className="border-border bg-card">
        <CardHeader>
          <CardTitle>Analysis History</CardTitle>
          <CardDescription>No analyses yet. Upload a chart to get started.</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card className="border-border bg-card">
      <CardHeader>
        <CardTitle>Analysis History</CardTitle>
        <CardDescription>{analyses.length} chart(s) analyzed</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {analyses.map((analysis) => (
            <div
              key={analysis.id}
              className="flex items-center justify-between p-3 rounded-lg border border-border bg-muted/30 hover:bg-muted/50 transition-colors"
            >
              <div className="flex-1 min-w-0">
                <p className="font-medium text-foreground truncate">{analysis.fileName}</p>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="secondary" className="text-xs">
                    {analysis.trend}
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    {analysis.uploadedAt.toLocaleDateString()} {analysis.uploadedAt.toLocaleTimeString()}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2 ml-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onView(analysis)}
                  title="View analysis"
                >
                  <Eye className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onDelete(analysis.id)}
                  title="Delete analysis"
                  className="text-destructive hover:text-destructive"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
