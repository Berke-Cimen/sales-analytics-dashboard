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
import type { CandlestickData } from '../../types';

interface CandlestickChartProps {
  data?: CandlestickData[];
  isLoading?: boolean;
}

interface CandlestickPayload {
  timestamp: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  color: string;
}

interface CandlestickBarProps {
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  payload?: CandlestickPayload;
}

function CandlestickBar(props: CandlestickBarProps) {
  const { x = 0, width = 0, height = 0, payload } = props;

  if (!payload) return null;

  const { open, close, high, low } = payload;
  const isGreen = close >= open;
  const color = isGreen ? '#10b981' : '#ef4444';

  const bodyTop = Math.min(open, close);
  const bodyBottom = Math.max(open, close);
  const bodyHeight = bodyBottom - bodyTop;

  const scale = height / (high - low || 1);
  const candleY = height - (high - bodyTop) * scale;
  const candleHeight = Math.max(bodyHeight * scale, 1);

  return (
    <g>
      <line
        x1={x + width / 2}
        y1={candleY}
        x2={x + width / 2}
        y2={candleY + candleHeight}
        stroke={color}
        strokeWidth={1}
      />
      <rect
        x={x + width * 0.2}
        y={candleY}
        width={width * 0.6}
        height={candleHeight}
        fill={isGreen ? color : color}
        stroke={color}
        strokeWidth={1}
      />
    </g>
  );
}

function renderCandlestickShape(props: CandlestickBarProps) {
  return <CandlestickBar {...props} />;
}

export default function CandlestickChart({
  data = [],
  isLoading = false,
}: CandlestickChartProps) {
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

  const formatXAxis = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const formatYAxis = (value: number) => {
    if (value >= 1000) return `$${(value / 1000).toFixed(0)}K`;
    return `$${value}`;
  };

  const chartData = data.map((item) => ({
    ...item,
    color: item.close >= item.open ? '#10b981' : '#ef4444',
  }));

  return (
    <Card className="bg-white dark:bg-gray-800 shadow-tremor-card rounded-tremor-default">
      <Title className="text-gray-900 dark:text-white">OHLC Candlestick</Title>
      <Text className="text-gray-500 dark:text-gray-400 mb-4">
        Open, High, Low, Close prices
      </Text>

      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.2} />
            <XAxis
              dataKey="timestamp"
              tickFormatter={formatXAxis}
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
              domain={['auto', 'auto']}
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
                  open: 'Open',
                  high: 'High',
                  low: 'Low',
                  close: 'Close',
                  volume: 'Volume',
                };
                return [`$${value.toLocaleString()}`, labels[name] || name];
              }}
              labelFormatter={(label) => `Date: ${new Date(label).toLocaleDateString()}`}
            />
            <Bar
              dataKey="high"
              shape={renderCandlestickShape}
              isAnimationActive={false}
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
