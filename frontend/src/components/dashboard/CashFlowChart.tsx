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
import type { CashFlowData } from '../../types';

interface CashFlowChartProps {
  data?: CashFlowData[];
  isLoading?: boolean;
}

export default function CashFlowChart({ data = [], isLoading = false }: CashFlowChartProps) {
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
        <Title className="text-gray-900 dark:text-white">Cash Flow</Title>
        <Text className="text-gray-500 dark:text-gray-400 mb-4">
          Cash flow breakdown
        </Text>
        <div className="h-64 flex items-center justify-center text-gray-400">
          No data available
        </div>
      </Card>
    );
  }

  const chartData = data.map((item) => ({
    category: item.category,
    amount: item.amount,
    type: item.type,
    fill: item.type === 'inflow' ? '#10b981' : item.type === 'outflow' ? '#ef4444' : '#3b82f6',
  }));

  const totalInflow = data
    .filter((d) => d.type === 'inflow')
    .reduce((sum, d) => sum + d.amount, 0);
  const totalOutflow = data
    .filter((d) => d.type === 'outflow')
    .reduce((sum, d) => sum + d.amount, 0);
  const netFlow = totalInflow - totalOutflow;

  return (
    <Card className="bg-white dark:bg-gray-800 shadow-tremor-card rounded-tremor-default">
      <Title className="text-gray-900 dark:text-white">Cash Flow</Title>
      <Text className="text-gray-500 dark:text-gray-400 mb-4">
        Inflow and outflow breakdown
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
              stroke="#9ca3af"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value: number) => {
                if (value >= 1000000) return `$${(value / 1000000).toFixed(1)}M`;
                if (value >= 1000) return `$${(value / 1000).toFixed(0)}K`;
                return `$${value}`;
              }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#1f2937',
                border: 'none',
                borderRadius: '0.5rem',
                color: '#fff',
              }}
              formatter={(value: number) => [`$${value.toLocaleString()}`, 'Amount']}
            />
            <ReferenceLine y={0} stroke="#374151" />
            <Bar dataKey="amount" radius={[4, 4, 0, 0]}>
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-4 grid grid-cols-3 gap-4">
        <div className="text-center p-3 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg">
          <p className="text-sm text-gray-500 dark:text-gray-400">Inflow</p>
          <p className="text-lg font-semibold text-emerald-600 dark:text-emerald-400">
            +${totalInflow.toLocaleString()}
          </p>
        </div>
        <div className="text-center p-3 bg-rose-50 dark:bg-rose-900/20 rounded-lg">
          <p className="text-sm text-gray-500 dark:text-gray-400">Outflow</p>
          <p className="text-lg font-semibold text-rose-600 dark:text-rose-400">
            -${totalOutflow.toLocaleString()}
          </p>
        </div>
        <div className="text-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <p className="text-sm text-gray-500 dark:text-gray-400">Net Flow</p>
          <p className={`text-lg font-semibold ${
            netFlow >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'
          }`}>
            {netFlow >= 0 ? '+' : ''}${netFlow.toLocaleString()}
          </p>
        </div>
      </div>
    </Card>
  );
}
