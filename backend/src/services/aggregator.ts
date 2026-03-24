import { ChartDataPoint } from '../types';

type Granularity = 'year' | 'quarter' | 'month' | 'week' | 'day';

function getDateKey(date: Date, granularity: Granularity): string {
  const year = date.getFullYear();
  const month = date.getMonth();
  const day = date.getDate();

  switch (granularity) {
    case 'year':
      return `${year}`;
    case 'quarter':
      const quarter = Math.floor(month / 3) + 1;
      return `${year}-Q${quarter}`;
    case 'month':
      return `${year}-${String(month + 1).padStart(2, '0')}`;
    case 'week':
      // Get the start of the week (Sunday)
      const dayOfWeek = date.getDay();
      const startOfWeek = new Date(date);
      startOfWeek.setDate(day - dayOfWeek);
      return `${startOfWeek.getFullYear()}-${String(startOfWeek.getMonth() + 1).padStart(2, '0')}-${String(startOfWeek.getDate()).padStart(2, '0')}`;
    case 'day':
    default:
      return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  }
}

export function aggregateByGranularity(
  data: ChartDataPoint[],
  granularity: Granularity
): ChartDataPoint[] {
  const aggregated = new Map<string, { sum: number; count: number; timestamp: string }>();

  for (const point of data) {
    const date = new Date(point.timestamp);
    const key = getDateKey(date, granularity);

    if (aggregated.has(key)) {
      const existing = aggregated.get(key)!;
      existing.sum += point.value;
      existing.count += 1;
    } else {
      aggregated.set(key, {
        sum: point.value,
        count: 1,
        timestamp: point.timestamp
      });
    }
  }

  const result: ChartDataPoint[] = [];

  aggregated.forEach((value, key) => {
    result.push({
      timestamp: key,
      value: Math.round(value.sum / value.count * 100) / 100
    });
  });

  // Sort by timestamp
  result.sort((a, b) => a.timestamp.localeCompare(b.timestamp));

  return result;
}
