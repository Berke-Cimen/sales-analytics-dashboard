import { Card, Title, Text, ProgressBar } from '@tremor/react';
import type { ProfitMargin } from '../../types';

interface ProfitGaugeProps {
  data?: ProfitMargin;
  isLoading?: boolean;
}

export default function ProfitGauge({ data, isLoading = false }: ProfitGaugeProps) {
  if (isLoading) {
    return (
      <Card className="bg-white dark:bg-gray-800">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-4"></div>
          <div className="h-48 bg-gray-200 dark:bg-gray-700 rounded"></div>
        </div>
      </Card>
    );
  }

  const margin = data?.margin ?? 0;
  const target = data?.target ?? 30;
  const trend = data?.trend ?? 0;

  const getColor = (value: number) => {
    if (value >= 25) return 'emerald';
    if (value >= 15) return 'yellow';
    return 'rose';
  };

  const getStatusText = (value: number) => {
    if (value >= 25) return 'Excellent';
    if (value >= 15) return 'Good';
    if (value >= 5) return 'Fair';
    return 'Poor';
  };

  return (
    <Card className="bg-white dark:bg-gray-800 shadow-tremor-card rounded-tremor-default">
      <Title className="text-gray-900 dark:text-white">Profit Margin</Title>
      <Text className="text-gray-500 dark:text-gray-400 mb-4">
        Current profit margin vs target
      </Text>

      <div className="py-4">
        <div className="text-center mb-6">
          <span className="text-5xl font-bold text-gray-900 dark:text-white">
            {margin.toFixed(1)}%
          </span>
          <Text className="text-gray-500 dark:text-gray-400 mt-1">Current Margin</Text>
        </div>

        <div className="mb-6">
          <div className="flex justify-between text-sm mb-2">
            <span className="text-gray-500 dark:text-gray-400">Progress to Target</span>
            <span className="text-gray-900 dark:text-white font-medium">{Math.min((margin / target) * 100, 100).toFixed(0)}%</span>
          </div>
          <ProgressBar value={Math.min((margin / target) * 100, 100)} color={getColor(margin)} />
        </div>
      </div>

      <div className="mt-4 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-500 dark:text-gray-400">Status</span>
          <span className={`text-sm font-medium ${
            margin >= 25 ? 'text-emerald-500' :
            margin >= 15 ? 'text-yellow-500' :
            'text-rose-500'
          }`}>
            {getStatusText(margin)}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-500 dark:text-gray-400">Target</span>
          <span className="text-sm font-medium text-gray-900 dark:text-white">
            {target.toFixed(1)}%
          </span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-500 dark:text-gray-400">Trend</span>
          <span className={`text-sm font-medium ${trend >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
            {trend >= 0 ? '+' : ''}{trend.toFixed(1)}%
          </span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-500 dark:text-gray-400">Variance</span>
          <span className={`text-sm font-medium ${margin - target >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
            {margin - target >= 0 ? '+' : ''}{(margin - target).toFixed(1)}%
          </span>
        </div>
      </div>
    </Card>
  );
}
