export interface KPISummary {
  totalRevenue: number;
  totalOrders: number;
  avgOrderValue: number;
  conversionRate: number;
  cartAbandonmentRate: number;
  grossMargin: number;
  netProfit: number;
  cashFlow: number;
  budgetVariance: number;
  customerLTV: number;
  trends: {
    revenue: number;
    orders: number;
    margin: number;
    cashFlow: number;
  };
  period: {
    start: string;
    end: string;
    granularity: string;
  };
}

export interface CandlestickData {
  timestamp: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface CashFlowData {
  category: string;
  amount: number;
  type: 'inflow' | 'outflow' | 'net';
}

export interface BudgetComparisonData {
  category: string;
  planned: number;
  actual: number;
  variance: number;
}

export interface ChartDataPoint {
  timestamp: string;
  value: number;
  category?: string;
  region?: string;
}

export interface Order {
  id: string;
  customerId: string;
  amount: number;
  status: 'pending' | 'completed' | 'cancelled';
  createdAt: string;
  region: string;
  category: string;
}

export interface Settings {
  theme: 'dark' | 'light' | 'auto';
  notifications: boolean;
  refreshInterval: number;
}

export type Granularity = 'year' | 'quarter' | 'month' | 'week' | 'day';

export interface SalesByCategory {
  category: string;
  sales: number;
  percentage: number;
}

export interface RegionalData {
  region: string;
  revenue: number;
  orders: number;
  growth: number;
}

export interface ProfitMargin {
  margin: number;
  target: number;
  trend: number;
}
