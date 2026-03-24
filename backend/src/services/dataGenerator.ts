import {
  KPISummary,
  ChartDataPoint,
  CandlestickData,
  CashFlowData,
  BudgetComparisonData,
  Order,
  Customer
} from '../types';

// Seeded random number generator for consistency
class SeededRandom {
  private seed: number;

  constructor(seed: number = 42) {
    this.seed = seed;
  }

  next(): number {
    this.seed = (this.seed * 1103515245 + 12345) & 0x7fffffff;
    return this.seed / 0x7fffffff;
  }

  range(min: number, max: number): number {
    return min + this.next() * (max - min);
  }

  gaussian(mean: number, stdDev: number): number {
    const u1 = this.next();
    const u2 = this.next();
    const z = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
    return mean + z * stdDev;
  }
}

const RANDOM = new SeededRandom(42);

const REGIONS = ['North America', 'Europe', 'Asia Pacific', 'Latin America', 'Middle East'];
const CATEGORIES = ['Electronics', 'Clothing', 'Home & Garden', 'Sports', 'Books', 'Toys'];

function addDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

function getDayOfWeek(date: Date): number {
  return date.getDay(); // 0 = Sunday, 6 = Saturday
}

function getMonthPosition(date: Date): number {
  const day = date.getDate();
  const daysInMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  return day / daysInMonth; // 0 to 1
}

function calculateSeasonality(date: Date): number {
  const dayOfWeek = getDayOfWeek(date);
  const monthPosition = getMonthPosition(date);

  // Weekend boost (Sat/Sun sales are ~30% higher)
  let seasonality = dayOfWeek === 0 || dayOfWeek === 6 ? 1.3 :
                    dayOfWeek === 5 ? 1.15 : 1.0; // Friday also slightly higher

  // End of month boost (payday effect)
  if (monthPosition > 0.85) seasonality *= 1.2;

  // Monthly variation
  const month = date.getMonth();
  const monthlyFactors = [0.85, 0.87, 0.95, 0.98, 1.0, 1.02, 0.88, 0.92, 0.97, 1.0, 1.1, 1.25];
  seasonality *= monthlyFactors[month];

  return seasonality;
}

function calculateRegionalVariation(region: string): number {
  const factors: Record<string, number> = {
    'North America': 1.3,
    'Europe': 1.15,
    'Asia Pacific': 1.0,
    'Latin America': 0.75,
    'Middle East': 0.85
  };
  return factors[region] || 1.0;
}

function calculateGrowthTrend(startDate: Date, endDate: Date): number {
  const monthsDiff = (endDate.getFullYear() - startDate.getFullYear()) * 12 +
                     (endDate.getMonth() - startDate.getMonth());
  // 5-10% monthly growth
  return Math.pow(1.07, monthsDiff);
}

export function generateKPISummary(
  startDate: string,
  endDate: string,
  granularity: string = 'day'
): KPISummary {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
  const growthFactor = calculateGrowthTrend(start, end);

  const baseRevenue = 25000 * days;
  const totalRevenue = Math.round(baseRevenue * growthFactor * RANDOM.range(0.95, 1.05));
  const totalOrders = Math.round(totalRevenue / RANDOM.gaussian(85, 15));
  const avgOrderValue = Math.round(totalRevenue / totalOrders * 100) / 100;

  return {
    totalRevenue,
    totalOrders,
    avgOrderValue,
    conversionRate: Math.round(RANDOM.gaussian(3.2, 0.5) * 100) / 100,
    cartAbandonmentRate: Math.round(RANDOM.gaussian(68, 5) * 100) / 100,
    grossMargin: Math.round(RANDOM.gaussian(45, 5) * 100) / 100,
    netProfit: Math.round(totalRevenue * RANDOM.gaussian(0.15, 0.03) * 100) / 100,
    cashFlow: Math.round(totalRevenue * RANDOM.gaussian(0.12, 0.04) * 100) / 100,
    budgetVariance: Math.round(RANDOM.gaussian(0, 0.05) * 10000) / 100,
    customerLTV: Math.round(RANDOM.gaussian(450, 80) * 100) / 100,
    trends: {
      revenue: Math.round(RANDOM.gaussian(8, 3) * 100) / 100,
      orders: Math.round(RANDOM.gaussian(6, 2.5) * 100) / 100,
      margin: Math.round(RANDOM.gaussian(2, 1) * 100) / 100,
      cashFlow: Math.round(RANDOM.gaussian(5, 2) * 100) / 100
    },
    period: {
      start: startDate,
      end: endDate,
      granularity
    }
  };
}

export function generateRevenueTrend(
  startDate: string,
  endDate: string,
  granularity: string = 'day'
): ChartDataPoint[] {
  const data: ChartDataPoint[] = [];
  const start = new Date(startDate);
  const end = new Date(endDate);
  let current = new Date(start);

  let prevValue = 50000;
  while (current <= end) {
    const seasonality = calculateSeasonality(current);
    const baseValue = prevValue * RANDOM.gaussian(1.02, 0.1);
    const value = Math.round(baseValue * seasonality);

    data.push({
      timestamp: current.toISOString(),
      value
    });

    prevValue = value;

    switch (granularity) {
      case 'day':
        current = addDays(current, 1);
        break;
      case 'week':
        current = addDays(current, 7);
        break;
      case 'month':
        current = new Date(current.getFullYear(), current.getMonth() + 1, current.getDate());
        break;
      case 'quarter':
        current = new Date(current.getFullYear(), current.getMonth() + 3, current.getDate());
        break;
      default:
        current = addDays(current, 1);
    }
  }

  return data;
}

export function generateCandlestickData(
  startDate: string,
  endDate: string
): CandlestickData[] {
  const data: CandlestickData[] = [];
  const start = new Date(startDate);
  const end = new Date(endDate);
  let current = new Date(start);

  let prevClose = 150 + RANDOM.range(-10, 10);
  while (current <= end) {
    const volatility = RANDOM.gaussian(2, 0.5) / 100;
    const trend = RANDOM.gaussian(0.001, 0.002);

    const open = prevClose;
    const change = open * (trend + RANDOM.gaussian(0, volatility));
    const close = open + change;
    const high = Math.max(open, close) * (1 + RANDOM.range(0, volatility));
    const low = Math.min(open, close) * (1 - RANDOM.range(0, volatility));
    const volume = Math.round(RANDOM.gaussian(1000000, 300000));

    data.push({
      timestamp: current.toISOString(),
      open: Math.round(open * 100) / 100,
      high: Math.round(high * 100) / 100,
      low: Math.round(low * 100) / 100,
      close: Math.round(close * 100) / 100,
      volume
    });

    prevClose = close;
    current = addDays(current, 1);
  }

  return data;
}

export function generateCategoryData(
  startDate: string,
  endDate: string
): ChartDataPoint[] {
  const data: ChartDataPoint[] = [];
  const start = new Date(startDate);
  const end = new Date(endDate);
  let current = new Date(start);

  while (current <= end) {
    for (const category of CATEGORIES) {
      const baseValue = RANDOM.gaussian(15000, 5000);
      const seasonality = calculateSeasonality(current);
      const value = Math.round(baseValue * seasonality);

      data.push({
        timestamp: current.toISOString(),
        value,
        category
      });
    }
    current = addDays(current, 1);
  }

  return data;
}

export function generateRegionalData(
  startDate: string,
  endDate: string
): ChartDataPoint[] {
  const data: ChartDataPoint[] = [];
  const start = new Date(startDate);
  const end = new Date(endDate);
  let current = new Date(start);

  while (current <= end) {
    for (const region of REGIONS) {
      const baseValue = RANDOM.gaussian(20000, 8000);
      const regionalFactor = calculateRegionalVariation(region);
      const seasonality = calculateSeasonality(current);
      const value = Math.round(baseValue * regionalFactor * seasonality);

      data.push({
        timestamp: current.toISOString(),
        value,
        region
      });
    }
    current = addDays(current, 1);
  }

  return data;
}

export function generateCashFlowData(
  startDate: string,
  endDate: string
): CashFlowData[] {
  const categories = ['Sales Revenue', 'Subscription Revenue', 'Services', 'Product Sales', 'Licensing'];
  const expenses = ['Inventory', 'Payroll', 'Marketing', 'Operations', 'R&D', 'Infrastructure'];
  const data: CashFlowData[] = [];

  // Inflows
  for (const category of categories) {
    data.push({
      category,
      amount: Math.round(RANDOM.gaussian(150000, 50000)),
      type: 'inflow'
    });
  }

  // Outflows
  for (const expense of expenses) {
    data.push({
      category: expense,
      amount: Math.round(RANDOM.gaussian(80000, 30000)),
      type: 'outflow'
    });
  }

  // Net
  const totalInflow = data.filter(d => d.type === 'inflow').reduce((sum, d) => sum + d.amount, 0);
  const totalOutflow = data.filter(d => d.type === 'outflow').reduce((sum, d) => sum + d.amount, 0);
  data.push({
    category: 'Net Cash Flow',
    amount: totalInflow - totalOutflow,
    type: 'net'
  });

  return data;
}

export function generateBudgetData(
  startDate: string,
  endDate: string
): BudgetComparisonData[] {
  const categories = ['Revenue', 'Cost of Goods', 'Operating Expenses', 'Marketing', 'R&D', 'Admin'];
  return categories.map(category => {
    const planned = Math.round(RANDOM.gaussian(500000, 100000));
    const variance = RANDOM.gaussian(0, 0.1);
    const actual = Math.round(planned * (1 + variance));
    return {
      category,
      planned,
      actual,
      variance: Math.round((actual - planned) * 100) / 100
    };
  });
}

export function generateOrders(
  startDate: string,
  endDate: string,
  page: number = 1,
  limit: number = 50
): { orders: Order[]; total: number } {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
  const totalOrders = days * 150; // ~150 orders per day average
  const totalPages = Math.ceil(totalOrders / limit);

  const orders: Order[] = [];
  const startIndex = (page - 1) * limit;

  for (let i = 0; i < limit && (startIndex + i) < totalOrders; i++) {
    const orderDate = addDays(start, Math.floor(RANDOM.range(0, days)));
    const region = REGIONS[Math.floor(RANDOM.next() * REGIONS.length)];
    const category = CATEGORIES[Math.floor(RANDOM.next() * CATEGORIES.length)];

    const statusRand = RANDOM.next();
    const status: Order['status'] = statusRand < 0.7 ? 'completed' :
                                     statusRand < 0.85 ? 'pending' : 'cancelled';

    orders.push({
      id: `ORD-${String(totalOrders - startIndex - i).padStart(6, '0')}`,
      customerId: `CUST-${String(Math.floor(RANDOM.range(1000, 9999)))}`,
      amount: Math.round(RANDOM.gaussian(85, 35) * 100) / 100,
      status,
      createdAt: orderDate.toISOString(),
      region,
      category
    });
  }

  return { orders, total: totalOrders };
}

export function generateProfitMarginData(
  startDate: string,
  endDate: string
): ChartDataPoint[] {
  const data: ChartDataPoint[] = [];
  const start = new Date(startDate);
  const end = new Date(endDate);
  let current = new Date(start);

  while (current <= end) {
    const baseMargin = RANDOM.gaussian(35, 10);
    const seasonality = calculateSeasonality(current);
    const value = Math.round(baseMargin * seasonality * 100) / 100;

    data.push({
      timestamp: current.toISOString(),
      value
    });

    current = addDays(current, 1);
  }

  return data;
}

export function generateCustomers(
  startDate: string,
  endDate: string,
  page: number = 1,
  limit: number = 50
): { customers: Customer[]; total: number } {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
  const totalCustomers = days * 25; // ~25 new customers per day

  const customers: Customer[] = [];
  const startIndex = (page - 1) * limit;

  const firstNames = ['John', 'Jane', 'Michael', 'Sarah', 'David', 'Emily', 'Robert', 'Lisa', 'James', 'Mary'];
  const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez'];

  for (let i = 0; i < limit && (startIndex + i) < totalCustomers; i++) {
    const firstName = firstNames[Math.floor(RANDOM.next() * firstNames.length)];
    const lastName = lastNames[Math.floor(RANDOM.next() * lastNames.length)];
    const customerId = 1000 + startIndex + i;
    const totalOrders = Math.floor(RANDOM.gaussian(5, 2));
    const totalSpent = Math.round(RANDOM.gaussian(450, 150) * 100) / 100;
    const avgOrderValue = Math.round((totalSpent / totalOrders) * 100) / 100;
    const lastOrderDate = addDays(start, Math.floor(RANDOM.range(0, days)));
    const region = REGIONS[Math.floor(RANDOM.next() * REGIONS.length)];
    const category = CATEGORIES[Math.floor(RANDOM.next() * CATEGORIES.length)];

    customers.push({
      id: `CUST-${String(customerId).padStart(5, '0')}`,
      name: `${firstName} ${lastName}`,
      email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@example.com`,
      totalOrders,
      totalSpent,
      avgOrderValue,
      lastOrderDate: lastOrderDate.toISOString(),
      region,
      category
    });
  }

  return { customers, total: totalCustomers };
}
