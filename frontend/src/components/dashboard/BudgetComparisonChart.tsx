import { Card, Title, Text } from '@tremor/react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  ReferenceLine,
} from 'recharts';
import type { BudgetComparisonData } from '../../types';

interface BudgetComparisonChartProps {
  data?: BudgetComparisonData[];
  isLoading?: boolean;
}

export default function BudgetComparisonChart({
  data = [],
  isLoading = false,
}: BudgetComparisonChartProps) {
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
        <Title className="text-gray-900 dark:text-white">Budget Comparison</Title>
        <Text className="text-gray-500 dark:text-gray-400 mb-4">
          Planned vs Actual budget
        </Text>
        <div className="h-64 flex items-center justify-center text-gray-400">
          No data available
        </div>
      </Card>
    );
  }

  const chartData = data.map((item) => ({
    category: item.category,
    planned: item.planned,
    actual: item.actual,
    variance: item.variance,
    variancePercentage: ((item.variance / item.planned) * 100).toFixed(1),
  }));

  const formatYAxis = (value: number) => {
    if (value >= 1000000) return `$${(value / 1000000).toFixed(1)}M`;
    if (value >= 1000) return `$${(value / 1000).toFixed(0)}K`;
    return `$${value}`;
  };

  return (
    <Card className="bg-white dark:bg-gray-800 shadow-tremor-card rounded-tremor-default">
      <Title className="text-gray-900 dark:text-white">Budget Comparison</Title>
      <Text className="text-gray-500 dark:text-gray-400 mb-4">
        Planned vs Actual budget by category
      </Text>

      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
            barCategoryGap="20%"
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.2} />
            <XAxis
              dataKey="category"
              stroke="#9ca3af"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              tickFormatter={formatYAxis}
              stroke="#9ca3af"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#1f2937',
                border: 'none',
                borderRadius: '0.5rem',
                color: '#fff',
              }}
              formatter={(value: number, name: string) => {
                const labels: Record<string, string> = {
                  planned: 'Planned',
                  actual: 'Actual',
                  variance: 'Variance',
                };
                return [`$${value.toLocaleString()}`, labels[name] || name];
              }}
            />
            <ReferenceLine y={0} stroke="#374151" />
            <Bar dataKey="planned" fill="#3b82f6" name="Planned" radius={[4, 4, 0, 0]} />
            <Bar dataKey="actual" name="Actual" radius={[4, 4, 0, 0]}>
              {chartData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={entry.actual >= entry.planned ? '#10b981' : '#ef4444'}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-4 overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200 dark:border-gray-700">
              <th className="text-left py-2 text-gray-500 dark:text-gray-400">Category</th>
              <th className="text-right py-2 text-gray-500 dark:text-gray-400">Planned</th>
              <th className="text-right py-2 text-gray-500 dark:text-gray-400">Actual</th>
              <th className="text-right py-2 text-gray-500 dark:text-gray-400">Variance</th>
            </tr>
          </thead>
          <tbody>
            {chartData.map((item) => (
              <tr key={item.category} className="border-b border-gray-100 dark:border-gray-800">
                <td className="py-2 text-gray-900 dark:text-white">{item.category}</td>
                <td className="text-right text-gray-600 dark:text-gray-400">
                  ${item.planned.toLocaleString()}
                </td>
                <td className="text-right text-gray-600 dark:text-gray-400">
                  ${item.actual.toLocaleString()}
                </td>
                <td className={`text-right font-medium ${
                  item.variance >= 0 ? 'text-emerald-500' : 'text-rose-500'
                }`}>
                  {item.variance >= 0 ? '+' : ''}{item.variancePercentage}%
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
