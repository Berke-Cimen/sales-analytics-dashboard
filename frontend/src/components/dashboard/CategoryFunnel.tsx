import { Card, Title, Text, DonutChart } from '@tremor/react';
import type { SalesByCategory } from '../../types';

interface CategoryFunnelProps {
  data?: SalesByCategory[];
  isLoading?: boolean;
}

export default function CategoryFunnel({ data = [], isLoading = false }: CategoryFunnelProps) {
  if (isLoading) {
    return (
      <Card className="bg-white dark:bg-gray-800">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-4"></div>
          <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded"></div>
        </div>
      </Card>
    );
  }

  if (data.length === 0) {
    return (
      <Card className="bg-white dark:bg-gray-800 shadow-tremor-card rounded-tremor-default">
        <Title className="text-gray-900 dark:text-white">Sales by Category</Title>
        <Text className="text-gray-500 dark:text-gray-400 mb-4">
          Category breakdown
        </Text>
        <div className="h-64 flex items-center justify-center text-gray-400">
          No data available
        </div>
      </Card>
    );
  }

  return (
    <Card className="bg-white dark:bg-gray-800 shadow-tremor-card rounded-tremor-default">
      <Title className="text-gray-900 dark:text-white">Sales by Category</Title>
      <Text className="text-gray-500 dark:text-gray-400 mb-4">
        Revenue distribution across categories
      </Text>

      <div className="h-72">
        <DonutChart
          data={data}
          category="sales"
          index="category"
          valueFormatter={(value: number) => `$${value.toLocaleString()}`}
          colors={['blue', 'cyan', 'indigo', 'violet', 'rose', 'amber']}
          showAnimation
        />
      </div>

      <div className="mt-4 space-y-2">
        {data.map((item, index) => (
          <div key={item.category} className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-full"
                style={{
                  backgroundColor: ['#3b82f6', '#06b6d4', '#8b5cf6', '#d946ef', '#f43f5e', '#f59e0b'][index % 6],
                }}
              />
              <span className="text-gray-600 dark:text-gray-400">{item.category}</span>
            </div>
            <span className="font-medium text-gray-900 dark:text-white">
              {item.percentage.toFixed(1)}%
            </span>
          </div>
        ))}
      </div>
    </Card>
  );
}
