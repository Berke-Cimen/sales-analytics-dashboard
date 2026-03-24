import useSWR from 'swr';
import type {
  KPISummary,
  ChartDataPoint,
  CandlestickData,
  CashFlowData,
  BudgetComparisonData,
  Order,
  Settings,
  Granularity,
  SalesByCategory,
  RegionalData,
  ProfitMargin,
} from '../types';

const API_BASE = '/api';

const fetcher = (url: string) => fetch(url).then(res => res.json());

// Dashboard APIs
export function useKPISummary(startDate?: string, endDate?: string, granularity?: Granularity) {
  const params = new URLSearchParams();
  if (startDate) params.append('startDate', startDate);
  if (endDate) params.append('endDate', endDate);
  if (granularity) params.append('granularity', granularity);

  return useSWR<KPISummary>(`${API_BASE}/dashboard/summary?${params}`, fetcher);
}

export function useRevenueTrend(startDate?: string, endDate?: string, granularity?: Granularity) {
  const params = new URLSearchParams();
  if (startDate) params.append('startDate', startDate);
  if (endDate) params.append('endDate', endDate);
  if (granularity) params.append('granularity', granularity);

  return useSWR<ChartDataPoint[]>(`${API_BASE}/dashboard/charts/revenue-trend?${params}`, fetcher);
}

export function useCandlestickData(startDate?: string, endDate?: string) {
  const params = new URLSearchParams();
  if (startDate) params.append('startDate', startDate);
  if (endDate) params.append('endDate', endDate);

  return useSWR<CandlestickData[]>(`${API_BASE}/dashboard/charts/candlestick?${params}`, fetcher);
}

export function useSalesByCategory(startDate?: string, endDate?: string) {
  const params = new URLSearchParams();
  if (startDate) params.append('startDate', startDate);
  if (endDate) params.append('endDate', endDate);

  return useSWR<SalesByCategory[]>(`${API_BASE}/dashboard/charts/sales-by-category?${params}`, fetcher);
}

export function useRegionalData(startDate?: string, endDate?: string) {
  const params = new URLSearchParams();
  if (startDate) params.append('startDate', startDate);
  if (endDate) params.append('endDate', endDate);

  return useSWR<RegionalData[]>(`${API_BASE}/dashboard/charts/regional?${params}`, fetcher);
}

export function useProfitMargin(startDate?: string, endDate?: string) {
  const params = new URLSearchParams();
  if (startDate) params.append('startDate', startDate);
  if (endDate) params.append('endDate', endDate);

  return useSWR<ProfitMargin>(`${API_BASE}/dashboard/charts/profit-margin?${params}`, fetcher);
}

export function useBudgetComparison(startDate?: string, endDate?: string) {
  const params = new URLSearchParams();
  if (startDate) params.append('startDate', startDate);
  if (endDate) params.append('endDate', endDate);

  return useSWR<BudgetComparisonData[]>(`${API_BASE}/dashboard/charts/budget-comparison?${params}`, fetcher);
}

export function useCashFlow(startDate?: string, endDate?: string) {
  const params = new URLSearchParams();
  if (startDate) params.append('startDate', startDate);
  if (endDate) params.append('endDate', endDate);

  return useSWR<CashFlowData[]>(`${API_BASE}/dashboard/charts/cash-flow?${params}`, fetcher);
}

// Reports APIs
export function useOrders(page = 1, limit = 50) {
  return useSWR<{ orders: Order[]; total: number; page: number; limit: number }>(
    `${API_BASE}/reports/orders?page=${page}&limit=${limit}`,
    fetcher
  );
}

// Settings APIs
export function useSettings() {
  return useSWR<Settings>(`${API_BASE}/settings`, fetcher);
}

export async function updateSettings(settings: Partial<Settings>): Promise<Settings> {
  const res = await fetch(`${API_BASE}/settings`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(settings)
  });
  return res.json();
}
