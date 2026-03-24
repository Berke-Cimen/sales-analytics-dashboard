# Sales Analytics Dashboard

A comprehensive real-time sales analytics dashboard with financial metrics, interactive charts, and WebSocket-powered live updates.

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                      React Frontend                         │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐ │
│  │  Dashboard  │  │  KPI Cards  │  │ Real-time Widgets   │ │
│  │  (Tremor)   │  │  + Metrics  │  │ (WebSocket/Socket.io)│ │
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
└─────────────────────────────────────────────────────────────┘
```

## Tech Stack

### Frontend
- **Framework:** React 18+ with Vite
- **Styling:** TailwindCSS 3.x
- **UI Components:** Tremor (dashboard-optimized)
- **Charts:** Tremor built-in + Recharts
- **State Management:** React Context + SWR
- **Real-time:** Socket.io-client

### Backend
- **Runtime:** Node.js 18+
- **Framework:** Express.js 4.x
- **Language:** TypeScript
- **Validation:** Zod
- **Real-time:** Socket.io

## Getting Started

### Prerequisites
- Docker and Docker Compose
- Node.js 18+ (for local development)

### Quick Start with Docker

```bash
# Clone the repository
git clone <repository-url>
cd sales-analytics-dashboard

# Start all services
docker-compose up -d

# Access the dashboard
open http://localhost
```

### Local Development

```bash
# Backend
cd backend
npm install
npm run dev

# Frontend (in a new terminal)
cd frontend
npm install
npm run dev
```

The frontend will be available at http://localhost:5173
The backend API will be available at http://localhost:3001

## API Documentation

### REST Endpoints

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

### Query Parameters (All GET endpoints)
- `startDate` - ISO date string
- `endDate` - ISO date string
- `granularity` - `year|quarter|month|week|day`
- `region` - Filter by region (optional)
- `category` - Filter by category (optional)

### WebSocket Events
- **Namespace:** `/dashboard`
- **Event: `kpi-update`** - Emitted every 30 seconds with current KPI values
- **Event: `chart-update`** - Emitted every 60 seconds with chart data snapshots
- **Event: `realtime-order`** - Emitted when new order is simulated

## Features

### Dashboard
- 10 KPI cards with real-time updates and trend indicators
- Revenue trend line chart with multiple granularity options
- Sales vs Target combo chart (bar + line)
- Revenue candlestick chart for OHLC visualization
- Category funnel for product breakdown
- Regional performance heatmap
- Profit margin gauge
- Budget comparison waterfall chart
- Cash flow visualization
- Orders data table with pagination

### Theme System
- Dark mode with `#0f172a` background
- Light mode with `#f8fafc` background
- Theme toggle persisted in localStorage

### Time Filtering
- Year/Quarter/Month/Week/Day granularity
- Custom date range picker
- Regional and category filters

## Project Structure

```
sales-analytics-dashboard/
├── backend/
│   ├── src/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── stream/
│   │   ├── middleware/
│   │   ├── types/
│   │   └── app.ts
│   ├── package.json
│   └── tsconfig.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── services/
│   │   ├── pages/
│   │   ├── types/
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── index.html
│   ├── package.json
│   ├── vite.config.ts
│   ├── tailwind.config.js
│   └── tsconfig.json
├── docker-compose.yml
├── .env.example
├── .gitignore
├── README.md
└── SPEC.md
```

## License

MIT

