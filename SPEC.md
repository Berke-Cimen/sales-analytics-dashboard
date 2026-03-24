# Sales Analytics Dashboard - Technical Design

## 1. Overview

**Project Name:** Sales Analytics Dashboard
**Type:** Interactive Real-time Analytics Dashboard
**Core Functionality:** Comprehensive sales monitoring with financial metrics, real-time updates, and granular time-based filtering
**Target Users:** Sales managers, executives, business analysts

## 2. Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                      React Frontend                         │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐ │
│  │  Dashboard  │  │  KPI Cards  │  │ Real-time Widgets   │ │
│  │  (Tremor)   │  │  + Metrics │  │ (WebSocket/Socket.io)│ │
│  └─────────────┘  └─────────────┘  └─────────────────────┘ │
│                    TailwindCSS (Dark/Light Theme)           │
└─────────────────────────────┬───────────────────────────────┘
                              │ REST API + WebSocket
┌─────────────────────────────▼───────────────────────────────┐
│                   Node.js/Express Backend                    │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐ │
│  │  REST API   │  │ Socket.io  │  │  Data Aggregators   │ │
│  │  Endpoints  │  │  Handler   │  │  + Transformers     │ │
│  └─────────────┘  └─────────────┘  └─────────────────────┘ │
└─────────────────────────────┬───────────────────────────────┘
                              │ External Data Layer
┌─────────────────────────────▼───────────────────────────────┐
│                   Simulated Sales API                       │
│           (Mock data generators with realistic patterns)   │
└─────────────────────────────────────────────────────────────┘
```

## 3. Frontend Specifications

### 3.1 Tech Stack
- **Framework:** React 18+ with Vite
- **Styling:** TailwindCSS 3.x
- **UI Components:** Tremor (dashboard-optimized)
- **Charts:** Tremor built-in charts + Recharts for advanced visualizations
- **State:** React Context + SWR for data fetching
- **Real-time:** Socket.io (WebSocket with automatic fallback to polling)

### 3.2 Pages/Views

#### Main Dashboard Page
- **Header:** Logo, Navigation, Theme Toggle, User Menu
- **Sidebar:** Navigation menu (Dashboard, Reports, Settings)
- **Main Content:**
  - Time period selector (Year/Quarter/Month/Week/Day)
  - Date range picker for custom selection
  - KPI Cards row (6 cards)
  - Primary charts section (2 columns)
  - Secondary charts section (3 columns)
  - Data table section

#### Reports Page
- Detailed tables with export functionality
- Filtering and sorting capabilities

#### Settings Page
- Theme preference (Dark/Light/Auto)
- Notification preferences
- Data refresh interval

### 3.3 KPI Cards (10 Cards)
1. **Total Revenue** - Sum of all sales with trend indicator
2. **Total Orders** - Number of transactions with comparison
3. **Average Order Value** - Revenue / Orders ratio
4. **Conversion Rate** - Visitors to customers percentage
5. **Cart Abandonment Rate** - Carts created vs orders completed
6. **Gross Margin** - (Revenue - COGS) / Revenue percentage
7. **Net Profit** - Revenue - All expenses
8. **Cash Flow** - Net cash movement (inflows - outflows)
9. **Budget Variance** - Actual vs planned budget percentage
10. **Customer LTV** - Lifetime value per customer

### 3.4 Charts

#### Primary Charts (Large)
- **Revenue Trend (Line)** - Time series with multiple granularity
- **Sales vs Target (Bar + Line combo)** - Target comparison
- **Revenue Candlestick (Candlestick)** - OHLC visualization for daily/weekly revenue volatility

#### Secondary Charts (Medium)
- **Revenue by Category (Funnel)** - Product category breakdown
- **Regional Performance (Heatmap)** - Geographic heat map
- **Profit Margin Gauge (Gauge)** - Current vs target margin
- **Budget Comparison (Waterfall)** - Planned vs actual breakdown

#### Supporting Charts
- **Order Volume (Area)** - Stacked area for order types
- **Customer Acquisition (Waterfall)** - Funnel conversion
- **Revenue Breakdown (Donut)** - By product/channel
- **Cash Flow (Waterfall)** - Inflows, outflows, net change visualization

### 3.5 Theme System
- **Dark Mode:** `#0f172a` background, `#1e293b` cards, `#38bdf8` accents
- **Light Mode:** `#f8fafc` background, `#ffffff` cards, `#0284c7` accents
- **Toggle:** Sun/Moon icon button in header
- **Persistence:** LocalStorage for user preference

## 4. Backend Specifications

### 4.1 Tech Stack
- **Runtime:** Node.js 18+
- **Framework:** Express.js 4.x
- **Language:** TypeScript
- **Validation:** Zod
- **Real-time:** Socket.io (WebSocket with HTTP polling fallback)
- **CORS:** Configured for frontend origin

### 4.2 API Endpoints

#### REST Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/dashboard/summary` | Aggregated KPI data |
| GET | `/api/dashboard/kpis` | Individual KPI metrics |
| GET | `/api/dashboard/charts/revenue-trend` | Time series revenue data |
| GET | `/api/dashboard/charts/revenue-candlestick` | OHLC candlestick data |
| GET | `/api/dashboard/charts/sales-by-category` | Category breakdown |
| GET | `/api/dashboard/charts/regional` | Regional performance |
| GET | `/api/dashboard/charts/profit-margin` | Margin analysis |
| GET | `/api/dashboard/charts/budget-comparison` | Budget vs actual data |
| GET | `/api/dashboard/charts/cash-flow` | Cash flow waterfall data |
| GET | `/api/reports/orders` | Order data with pagination |
| GET | `/api/reports/customers` | Customer analytics |
| GET | `/api/settings` | User preferences |
| PUT | `/api/settings` | Update preferences |

#### Query Parameters (All GET endpoints)
- `startDate` - ISO date string
- `endDate` - ISO date string
- `granularity` - `year|quarter|month|week|day`
- `region` - Filter by region (optional)
- `category` - Filter by category (optional)

#### WebSocket Events (Socket.io)
- **Namespace:** `/dashboard`
- **Event: `kpi-update`** - Emitted every 30 seconds with current KPI values
- **Event: `chart-update`** - Emitted every 60 seconds with chart data snapshots
- **Event: `realtime-order`** - Emitted when new order is simulated

### 4.3 Data Models

#### KPISummary
```typescript
interface KPISummary {
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
```

#### CandlestickData
```typescript
interface CandlestickData {
  timestamp: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}
```

#### CashFlowData
```typescript
interface CashFlowData {
  category: string;
  amount: number;
  type: 'inflow' | 'outflow' | 'net';
}
```

#### BudgetComparisonData
```typescript
interface BudgetComparisonData {
  category: string;
  planned: number;
  actual: number;
  variance: number;
}
```

### 4.4 Data Generation (Simulated API)
- Generate realistic sales patterns with:
  - Daily/weekly/monthly seasonality
  - Random variation (seeded for consistency)
  - Growth trend over time
  - Regional variation

## 5. Project Structure

```
sales-analytics-dashboard/
├── backend/
│   ├── src/
│   │   ├── routes/
│   │   │   ├── dashboard.ts
│   │   │   ├── reports.ts
│   │   │   └── settings.ts
│   │   ├── services/
│   │   │   ├── dataGenerator.ts
│   │   │   └── aggregator.ts
│   │   ├── stream/
│   │   │   └── socketHandler.ts
│   │   ├── middleware/
│   │   │   ├── errorHandler.ts
│   │   │   └── validator.ts
│   │   ├── types/
│   │   │   └── index.ts
│   │   └── app.ts
│   ├── package.json
│   └── tsconfig.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── dashboard/
│   │   │   │   ├── KPICard.tsx
│   │   │   │   ├── RevenueChart.tsx
│   │   │   │   ├── CandlestickChart.tsx
│   │   │   │   ├── CategoryFunnel.tsx
│   │   │   │   ├── RegionalHeatmap.tsx
│   │   │   │   ├── ProfitGauge.tsx
│   │   │   │   ├── BudgetComparisonChart.tsx
│   │   │   │   ├── CashFlowChart.tsx
│   │   │   │   └── OrdersTable.tsx
│   │   │   ├── layout/
│   │   │   │   ├── Header.tsx
│   │   │   │   ├── Sidebar.tsx
│   │   │   │   └── ThemeToggle.tsx
│   │   │   └── ui/
│   │   │       ├── Card.tsx
│   │   │       └── Button.tsx
│   │   ├── hooks/
│   │   │   ├── useDashboard.ts
│   │   │   ├── useSocket.ts
│   │   │   └── useTheme.ts
│   │   ├── services/
│   │   │   └── api.ts
│   │   ├── pages/
│   │   │   ├── Dashboard.tsx
│   │   │   ├── Reports.tsx
│   │   │   └── Settings.tsx
│   │   ├── types/
│   │   │   └── index.ts
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── index.html
│   ├── package.json
│   ├── vite.config.ts
│   ├── tailwind.config.js
│   └── tsconfig.json
├── docker-compose.yml
├── README.md
└── SPEC.md
```

## 6. Docker Configuration

### Services
- **frontend** - Nginx serving React build
- **backend** - Node.js/Express API server

### Ports
- Frontend: 80 (nginx)
- Backend: 3001

## 7. Error Handling

### Frontend
- Loading states for all async operations
- Error boundaries for component failures
- Toast notifications for user feedback
- Retry logic for failed requests

### Backend
- Global error handler middleware
- Structured error responses: `{ error: string, details?: any }`
- Request validation with Zod
- 404 for unknown routes
- 500 for internal errors (no stack trace in production)

## 8. Testing Strategy

### Backend
- Unit tests for data generators
- Integration tests for API endpoints
- Socket.io connection and event tests

### Frontend
- Component rendering tests
- Hook tests for custom hooks
- Integration tests for data flow

## 9. GitHub Repository

### Setup
- Initialize git in project root
- Create comprehensive README.md
- Add .gitignore (node_modules, build, env files)
- GitHub Actions CI/CD workflow for:
  - Backend tests on push
  - Frontend build verification
  - Docker image build on release

### Repository Structure
```
sales-analytics-dashboard/
├── .github/
│   └── workflows/
│       ├── ci.yml
│       └── docker.yml
├── backend/
├── frontend/
├── docker-compose.yml
├── README.md
└── SPEC.md
```
