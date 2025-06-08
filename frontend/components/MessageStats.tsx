import { Clock, DollarSign, Zap } from 'lucide-react';

interface MessageStatsProps {
  model: string;
  duration: number;
  cost: number;
  tokensPerSecond: number;
}

export default function MessageStats({ model, duration, cost, tokensPerSecond }: MessageStatsProps) {
  const formatDuration = (ms: number) => {
    if (ms < 1000) return `${ms}ms`;
    return `${(ms / 1000).toFixed(1)}s`;
  };

  const formatCost = (cost: number) => {
    if (cost < 0.001) return '<$0.001';
    return `$${cost.toFixed(4)}`;
  };

  const formatTPS = (tps: number) => {
    return `${tps.toFixed(1)} t/s`;
  };

  return (
    <div className="flex items-center gap-3 text-xs text-muted-foreground">
      <div className="flex items-center gap-1">
        <Clock className="w-3 h-3" />
        <span>{formatDuration(duration)}</span>
      </div>
      <div className="flex items-center gap-1">
        <DollarSign className="w-3 h-3" />
        <span>{formatCost(cost)}</span>
      </div>
      <div className="flex items-center gap-1">
        <Zap className="w-3 h-3" />
        <span>{formatTPS(tokensPerSecond)}</span>
      </div>
      <div className="text-xs font-mono opacity-70">
        {model}
      </div>
    </div>
  );
} 