import { Router, Request, Response } from 'express';
import {
  generateKPISummary,
  generateRevenueTrend,
  generateCandlestickData,
  generateCategoryData,
  generateRegionalData,
  generateCashFlowData,
  generateBudgetData,
  generateProfitMarginData
} from '../services/dataGenerator';
import { aggregateByGranularity } from '../services/aggregator';
import { validateQuery, dateRangeQuerySchema } from '../middleware/validator';

const router = Router();

// Helper to get default dates
function getDefaultStartDate(): string {
  const date = new Date();
  date.setDate(date.getDate() - 30);
  return date.toISOString().split('T')[0];
}

function getDefaultEndDate(): string {
  return new Date().toISOString().split('T')[0];
}

// GET /api/dashboard/summary
router.get('/summary', validateQuery(dateRangeQuerySchema), (req: Request, res: Response) => {
  const startDate = req.query.startDate as string || getDefaultStartDate();
  const endDate = req.query.endDate as string || getDefaultEndDate();
  const granularity = req.query.granularity as string || 'day';

  const kpi = generateKPISummary(startDate, endDate, granularity);
  res.json(kpi);
});

// GET /api/dashboard/kpis
router.get('/kpis', validateQuery(dateRangeQuerySchema), (req: Request, res: Response) => {
  const startDate = req.query.startDate as string || getDefaultStartDate();
  const endDate = req.query.endDate as string || getDefaultEndDate();
  const granularity = req.query.granularity as string || 'day';

  const kpi = generateKPISummary(startDate, endDate, granularity);
  res.json(kpi);
});

// GET /api/dashboard/charts/revenue-trend
router.get('/charts/revenue-trend', validateQuery(dateRangeQuerySchema), (req: Request, res: Response) => {
  const startDate = req.query.startDate as string || getDefaultStartDate();
  const endDate = req.query.endDate as string || getDefaultEndDate();
  const granularity = req.query.granularity as string || 'day';

  const data = generateRevenueTrend(startDate, endDate, granularity);
  const aggregated = aggregateByGranularity(data, granularity as any);
  res.json(aggregated);
});

// GET /api/dashboard/charts/revenue-candlestick
router.get('/charts/revenue-candlestick', validateQuery(dateRangeQuerySchema), (req: Request, res: Response) => {
  const startDate = req.query.startDate as string || getDefaultStartDate();
  const endDate = req.query.endDate as string || getDefaultEndDate();

  const data = generateCandlestickData(startDate, endDate);
  res.json(data);
});

// GET /api/dashboard/charts/sales-by-category
router.get('/charts/sales-by-category', validateQuery(dateRangeQuerySchema), (req: Request, res: Response) => {
  const startDate = req.query.startDate as string || getDefaultStartDate();
  const endDate = req.query.endDate as string || getDefaultEndDate();

  const data = generateCategoryData(startDate, endDate);
  res.json(data);
});

// GET /api/dashboard/charts/regional
router.get('/charts/regional', validateQuery(dateRangeQuerySchema), (req: Request, res: Response) => {
  const startDate = req.query.startDate as string || getDefaultStartDate();
  const endDate = req.query.endDate as string || getDefaultEndDate();

  const data = generateRegionalData(startDate, endDate);
  res.json(data);
});

// GET /api/dashboard/charts/profit-margin
router.get('/charts/profit-margin', validateQuery(dateRangeQuerySchema), (req: Request, res: Response) => {
  const startDate = req.query.startDate as string || getDefaultStartDate();
  const endDate = req.query.endDate as string || getDefaultEndDate();

  const data = generateProfitMarginData(startDate, endDate);
  res.json(data);
});

// GET /api/dashboard/charts/budget-comparison
router.get('/charts/budget-comparison', validateQuery(dateRangeQuerySchema), (req: Request, res: Response) => {
  const startDate = req.query.startDate as string || getDefaultStartDate();
  const endDate = req.query.endDate as string || getDefaultEndDate();

  const data = generateBudgetData(startDate, endDate);
  res.json(data);
});

// GET /api/dashboard/charts/cash-flow
router.get('/charts/cash-flow', validateQuery(dateRangeQuerySchema), (req: Request, res: Response) => {
  const startDate = req.query.startDate as string || getDefaultStartDate();
  const endDate = req.query.endDate as string || getDefaultEndDate();

  const data = generateCashFlowData(startDate, endDate);
  res.json(data);
});

export default router;