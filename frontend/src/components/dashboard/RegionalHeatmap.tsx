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
} from 'recharts';
import type { RegionalData } from '../../types';

interface RegionalHeatmapProps {
  data?: RegionalData[];
  isLoading?: boolean;
}

export default function RegionalHeatmap({ data = [], isLoading = false }: RegionalHeatmapProps) {
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
        <Title className="text-gray-900 dark:text-white">Regional Performance</Title>
        <Text className="text-gray-500 dark:text-gray-400 mb-4">
          Revenue by region
        </Text>
        <div className="h-64 flex items-center justify-center text-gray-400">
          No data available
        </div>
      </Card>
    );
  }

  const maxRevenue = Math.max(...data.map((d) => d.revenue));
  const minRevenue = Math.min(...data.map((d) => d.revenue));

  const getIntensityColor = (revenue: number) => {
    const intensity = ((revenue - minRevenue) / (maxRevenue - minRevenue || 1)) * 100;
    if (intensity >= 80) return '#1e3a5f';
    if (intensity >= 60) return '#2563eb';
    if (intensity >= 40) return '#3b82f6';
    if (intensity >= 20) return '#60a5fa';
    return '#93c5fd';
  };

  const chartData = data.map((item) => ({
    region: item.region,
    revenue: item.revenue,
    orders: item.orders,
    growth: item.growth,
    fill: getIntensityColor(item.revenue),
  }));

  return (
    <Card className="bg-white dark:bg-gray-800 shadow-tremor-card rounded-tremor-default">
      <Title className="text-gray-900 dark:text-white">Regional Performance</Title>
      <Text className="text-gray-500 dark:text-gray-400 mb-4">
        Revenue by region
      </Text>

      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            layout="vertical"
            margin={{ top: 10, right: 10, left: 60, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.2} />
            <XAxis
              type="number"
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
            <YAxis
              type="category"
              dataKey="region"
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
              formatter={(value: number) => [`$${value.toLocaleString()}`, 'Revenue']}
            />
            <Bar dataKey="revenue" radius={[0, 4, 4, 0]}>
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
        {data.slice(0, 4).map((item) => (
          <div key={item.region} className="text-center">
            <p className="text-sm text-gray-500 dark:text-gray-400">{item.region}</p>
            <p className="text-lg font-semibold text-gray-900 dark:text-white">
              ${item.revenue.toLocaleString()}
            </p>
            <p className={`text-xs ${item.growth >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
              {item.growth >= 0 ? '+' : ''}{item.growth.toFixed(1)}%
            </p>
          </div>
        ))}
      </div>
    </Card>
  );
}
