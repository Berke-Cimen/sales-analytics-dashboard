import { Card, Metric, Text, Flex, Badge } from '@tremor/react';

interface KPICardProps {
  title: string;
  value: string | number;
  trend?: number;
  trendLabel?: string;
  icon?: React.ReactNode;
  isLoading?: boolean;
}

export default function KPICard({
  title,
  value,
  trend,
  trendLabel,
  icon,
  isLoading = false,
}: KPICardProps) {
  if (isLoading) {
    return (
      <Card className="bg-white dark:bg-gray-800">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-2"></div>
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-2"></div>
          <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
        </div>
      </Card>
    );
  }

  const isPositiveTrend = trend !== undefined && trend >= 0;

  return (
    <Card className="bg-white dark:bg-gray-800 shadow-tremor-card rounded-tremor-default">
      <Flex alignItems="start">
        <div className="flex-1">
          <Text className="text-gray-500 dark:text-gray-400">{title}</Text>
          <Metric className="text-gray-900 dark:text-white mt-1">
            {typeof value === 'number' ? value.toLocaleString() : value}
          </Metric>
        </div>
        {icon && (
          <div className="text-gray-400 dark:text-gray-500">{icon}</div>
        )}
      </Flex>

      {trend !== undefined && (
        <Flex className="mt-2">
          <Badge color={isPositiveTrend ? 'emerald' : 'rose'}>
            {isPositiveTrend ? '+' : ''}{trend.toFixed(1)}%
          </Badge>
          {trendLabel && (
            <Text className="text-gray-500 dark:text-gray-400 ml-2 text-xs">
              {trendLabel}
            </Text>
          )}
        </Flex>
      )}
    </Card>
  );
}
