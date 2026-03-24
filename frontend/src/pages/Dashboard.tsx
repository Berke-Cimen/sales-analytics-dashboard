import { useState } from 'react';
import { Title, Text, Select, SelectItem, Grid } from '@tremor/react';
import KPICard from '../components/dashboard/KPICard';
import RevenueChart from '../components/dashboard/RevenueChart';
import CandlestickChart from '../components/dashboard/CandlestickChart';
import CategoryFunnel from '../components/dashboard/CategoryFunnel';
import RegionalHeatmap from '../components/dashboard/RegionalHeatmap';
import ProfitGauge from '../components/dashboard/ProfitGauge';
import BudgetComparisonChart from '../components/dashboard/BudgetComparisonChart';
import CashFlowChart from '../components/dashboard/CashFlowChart';
import OrdersTable from '../components/dashboard/OrdersTable';
import {
  useKPISummary,
  useRevenueTrend,
  useCandlestickData,
  useSalesByCategory,
  useRegionalData,
  useProfitMargin,
  useBudgetComparison,
  useCashFlow,
  useOrders,
} from '../services/api';
import type { Granularity } from '../types';

export default function Dashboard() {
  const [granularity, setGranularity] = useState<Granularity>('month');
  const [startDate] = useState<string>('');
  const [endDate] = useState<string>('');

  const { data: kpiData, isLoading: kpiLoading } = useKPISummary(startDate, endDate, granularity);
  const { data: revenueData, isLoading: revenueLoading } = useRevenueTrend(startDate, endDate, granularity);
  const { data: candlestickData, isLoading: candlestickLoading } = useCandlestickData(startDate, endDate);
  const { data: categoryData, isLoading: categoryLoading } = useSalesByCategory(startDate, endDate);
  const { data: regionalData, isLoading: regionalLoading } = useRegionalData(startDate, endDate);
  const { data: profitData, isLoading: profitLoading } = useProfitMargin(startDate, endDate);
  const { data: budgetData, isLoading: budgetLoading } = useBudgetComparison(startDate, endDate);
  const { data: cashFlowData, isLoading: cashFlowLoading } = useCashFlow(startDate, endDate);
  const { data: ordersData, isLoading: ordersLoading } = useOrders(1, 10);

  const formatCurrency = (value: number) => `$${value.toLocaleString()}`;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <Title className="text-2xl text-gray-900 dark:text-white">Dashboard</Title>
          <Text className="text-gray-500 dark:text-gray-400">
            Sales analytics overview
          </Text>
        </div>
        <div className="flex items-center gap-3">
          <Select value={granularity} onValueChange={(v) => setGranularity(v as Granularity)} className="w-40">
            <SelectItem value="year">Year</SelectItem>
            <SelectItem value="quarter">Quarter</SelectItem>
            <SelectItem value="month">Month</SelectItem>
            <SelectItem value="week">Week</SelectItem>
            <SelectItem value="day">Day</SelectItem>
          </Select>
        </div>
      </div>

      {/* KPI Cards */}
      <Grid numItemsLg={4} numItemsMd={2} className="gap-6">
        <KPICard
          title="Total Revenue"
          value={formatCurrency(kpiData?.totalRevenue ?? 0)}
          trend={kpiData?.trends.revenue}
          trendLabel="vs last period"
          isLoading={kpiLoading}
        />
        <KPICard
          title="Total Orders"
          value={kpiData?.totalOrders ?? 0}
          trend={kpiData?.trends.orders}
          trendLabel="vs last period"
          isLoading={kpiLoading}
        />
        <KPICard
          title="Avg Order Value"
          value={formatCurrency(kpiData?.avgOrderValue ?? 0)}
          trend={kpiData?.trends.revenue}
          trendLabel="vs last period"
          isLoading={kpiLoading}
        />
        <KPICard
          title="Profit Margin"
          value={`${kpiData?.grossMargin ?? 0}%`}
          trend={kpiData?.trends.margin}
          trendLabel="vs last period"
          isLoading={kpiLoading}
        />
      </Grid>

      {/* Charts Row 1 */}
      <Grid numItemsLg={2} className="gap-6">
        <RevenueChart
          data={revenueData}
          isLoading={revenueLoading}
          granularity={granularity}
        />
        <CandlestickChart
          data={candlestickData}
          isLoading={candlestickLoading}
        />
      </Grid>

      {/* Charts Row 2 */}
      <Grid numItemsLg={3} className="gap-6">
        <CategoryFunnel
          data={categoryData}
          isLoading={categoryLoading}
        />
        <ProfitGauge
          data={profitData}
          isLoading={profitLoading}
        />
        <RegionalHeatmap
          data={regionalData}
          isLoading={regionalLoading}
        />
      </Grid>

      {/* Charts Row 3 */}
      <Grid numItemsLg={2} className="gap-6">
        <BudgetComparisonChart
          data={budgetData}
          isLoading={budgetLoading}
        />
        <CashFlowChart
          data={cashFlowData}
          isLoading={cashFlowLoading}
        />
      </Grid>

      {/* Recent Orders */}
      <OrdersTable
        orders={ordersData?.orders}
        total={ordersData?.total ?? 0}
        page={ordersData?.page ?? 1}
        limit={ordersData?.limit ?? 10}
        isLoading={ordersLoading}
      />
    </div>
  );
}
