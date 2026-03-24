import { Server as SocketIOServer, Socket } from 'socket.io';
import { generateKPISummary, generateRevenueTrend, generateOrders } from '../services/dataGenerator';

const UPDATE_INTERVALS: Map<string, NodeJS.Timeout> = new Map();

function getDateRangeForInterval(): { startDate: string; endDate: string } {
  const end = new Date();
  const start = new Date();
  start.setDate(start.getDate() - 30);

  return {
    startDate: start.toISOString().split('T')[0],
    endDate: end.toISOString().split('T')[0]
  };
}

export function setupSocketHandlers(io: SocketIOServer): void {
  // Use /dashboard namespace
  const dashboardNamespace = io.of('/dashboard');

  dashboardNamespace.on('connection', (socket: Socket) => {
    console.log(`Client connected: ${socket.id}`);

    // Send initial data immediately on connection
    const { startDate, endDate } = getDateRangeForInterval();
    socket.emit('kpi-update', generateKPISummary(startDate, endDate, 'day'));
    socket.emit('chart-update', generateRevenueTrend(startDate, endDate, 'day'));

    socket.on('disconnect', () => {
      console.log(`Client disconnected: ${socket.id}`);
    });
  });

  // KPI update every 30 seconds
  const kpiInterval = setInterval(() => {
    const { startDate, endDate } = getDateRangeForInterval();
    const kpiData = generateKPISummary(startDate, endDate, 'day');
    dashboardNamespace.emit('kpi-update', kpiData);
  }, 30000);

  UPDATE_INTERVALS.set('kpi', kpiInterval);

  // Chart update every 60 seconds
  const chartInterval = setInterval(() => {
    const { startDate, endDate } = getDateRangeForInterval();
    const chartData = generateRevenueTrend(startDate, endDate, 'day');
    dashboardNamespace.emit('chart-update', chartData);
  }, 60000);

  UPDATE_INTERVALS.set('chart', chartInterval);

  // Simulate new orders periodically
  const orderInterval = setInterval(() => {
    const order = generateOrders(
      new Date().toISOString().split('T')[0],
      new Date().toISOString().split('T')[0],
      1,
      1
    );
    if (order.orders.length > 0) {
      dashboardNamespace.emit('realtime-order', order.orders[0]);
    }
  }, 15000);

  UPDATE_INTERVALS.set('order', orderInterval);
}

export function cleanupSocketHandlers(): void {
  UPDATE_INTERVALS.forEach((interval) => {
    clearInterval(interval);
  });
  UPDATE_INTERVALS.clear();
}
