# Xandeum pNode Analytics Dashboard

A comprehensive, production-ready analytics platform for monitoring Xandeum pNodes (storage provider nodes) in the Xandeum network. Built with Next.js 16, TypeScript, and the xandeum-prpc client library.

![Xandeum Dashboard](https://img.shields.io/badge/Next.js-16.0-black?logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?logo=typescript)
![React](https://img.shields.io/badge/React-19.2-61dafb?logo=react)

## 🌟 Features

### Core Features

- **Real-time pNode Monitoring** - Live status tracking of all pNodes via pRPC gossip protocol
- **Network Health Analytics** - Comprehensive metrics including uptime, storage, and health scores
- **Advanced Caching** - Multi-layer caching with node-cache (30s node data, 120s stats, 60s analytics)
- **Interactive Data Tables** - Advanced filtering, sorting, search, and **pagination** (10/25/50/100 per page)
- **Interactive Charts** - Recharts-powered visualizations for network trends and distributions
- **Geographic Distribution** - IP-based geolocation with 24h caching for regional insights

### UX/UI Enhancements

- **Light & Dark Mode** - System preference detection with manual toggle
- **Tab Navigation** - Clean tab interface for Overview, pNodes, and Analytics sections
- **Responsive Design** - Fully responsive across desktop, tablet, and mobile devices
- **Smooth Animations** - Subtle fade-in and stagger animations for polished user experience
- **Production-Ready UI** - Minimalist, professional dashboard aesthetic inspired by top Web3 analytics platforms

## 📋 Table of Contents

- [Tech Stack](#-tech-stack)
- [Architecture](#-architecture)
- [Prerequisites](#-prerequisites)
- [Installation](#-installation)
- [Running Locally](#-running-locally)
- [pRPC Integration](#-prpc-integration)
- [Project Structure](#-project-structure)
- [API Endpoints](#-api-endpoints)
- [Caching Strategy](#-caching-strategy)
- [Environment Variables](#-environment-variables)
- [Deployment](#-deployment)
- [Extensibility](#-extensibility)

## 🛠 Tech Stack

### Core Framework

- **Next.js 16** - React framework with App Router, Server Components, and Route Handlers
- **React 19.2** - Latest React with concurrent features
- **TypeScript 5** - Type-safe development

### Data & State Management

- **xandeum-prpc** - Official Xandeum pRPC client for gossip protocol communication
- **node-cache** - In-memory caching with TTL support
- **SWR** (via React) - Client-side data fetching and caching

### UI & Styling

- **Tailwind CSS 4** - Utility-first CSS with custom design system
- **shadcn/ui** - High-quality React components
- **Recharts 2.15** - Composable charting library
- **Lucide React** - Modern icon library

### Developer Experience

- **ESLint** - Code linting
- **PostCSS** - CSS processing

## 🏗 Architecture

### Service Layer Pattern

The application follows a clean service layer architecture:

```
┌─────────────────────────────────────────────────────────────┐
│                     UI Layer (React Components)              │
│  - Server Components (RSC) for initial data                 │
│  - Client Components for interactivity                      │
└──────────────────────┬──────────────────────────────────────┘
                       │
┌──────────────────────▼──────────────────────────────────────┐
│                 API Routes (Next.js Route Handlers)          │
│  - /api/pnodes                                              │
│  - /api/pnodes/[pubkey]                                     │
│  - /api/analytics/summary                                   │
│  - /api/analytics/metrics                                   │
└──────────────────────┬──────────────────────────────────────┘
                       │
┌──────────────────────▼──────────────────────────────────────┐
│                    Service Layer                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ pnode.service.ts                                    │   │
│  │ - getAllPNodes() - Discovery via gossip             │   │
│  │ - getPNodeByPubkey() - Single node lookup           │   │
│  │ - getNodeStatsByPubkey() - Direct node stats        │   │
│  └─────────────────────────────────────────────────────┘   │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ analytics.service.ts                                │   │
│  │ - getAnalyticsSummary() - Network-wide stats        │   │
│  │ - getCachedNodeMetrics() - Health scores & tiers    │   │
│  │ - getVersionDistribution() - Software versions      │   │
│  └─────────────────────────────────────────────────────┘   │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ geo.service.ts                                      │   │
│  │ - resolveIPToGeo() - IP → Location (24h cache)     │   │
│  │ - resolveNodeGeo() - Node address → Location       │   │
│  └─────────────────────────────────────────────────────┘   │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ cache.service.ts                                    │   │
│  │ - nodeCacheService (30s TTL)                       │   │
│  │ - statsCacheService (120s TTL)                     │   │
│  │ - analyticsCacheService (60s TTL)                  │   │
│  │ - geoCacheService (24h TTL)                        │   │
│  └─────────────────────────────────────────────────────┘   │
└──────────────────────┬──────────────────────────────────────┘
                       │
┌──────────────────────▼──────────────────────────────────────┐
│              pRPC Client (xandeum-prpc)                      │
│  - Primary seed: 173.212.220.65                            │
│  - Fallback to 7 additional seed IPs                       │
│  - Methods: getPods(), getPodsWithStats(), getStats()      │
└──────────────────────┬──────────────────────────────────────┘
                       │
┌──────────────────────▼──────────────────────────────────────┐
│              Xandeum Network (Gossip Protocol)               │
│  - Distributed pNode network                                │
│  - Real-time status updates                                 │
│  - Storage and performance metrics                          │
└─────────────────────────────────────────────────────────────┘
```

### Data Flow

1. **Discovery**: Connect to seed IP → Query gossip protocol → Receive Pod data
2. **Normalization**: Raw Pod → PNode type with calculated fields (uptime%, status)
3. **Caching**: Store in node-cache with appropriate TTL
4. **Enrichment**: Add computed metrics (health scores, tiers, geo data)
5. **Presentation**: Serve via API routes → Render in React components

## 📦 Prerequisites

- **Node.js** 18+ (recommended: 20+)
- **pnpm** 8+ (or npm/yarn)
- **Xandeum pRPC Access** - Network must be accessible from your deployment environment

## 🚀 Installation

### 1. Clone the Repository

```bash
git clone <repository-url>
cd xandeum-pnode-dashboard
```

### 2. Install Dependencies

```bash
pnpm install
```

Or with npm:

```bash
npm install
```

### 3. Configure Environment Variables (Optional)

Create a `.env.local` file for custom configuration:

```bash
# Optional: Custom online threshold (default: 300 seconds)
ONLINE_THRESHOLD_SECONDS=300

# Optional: Enable debug mode for calculations
DEBUG_CALCULATIONS=false
```

## 💻 Running Locally

### Development Server

```bash
pnpm dev
```

The dashboard will be available at `http://localhost:3000`

**Features in Development Mode:**

- Hot module replacement
- Fast refresh
- TypeScript error reporting
- Theme persistence across reloads

### Production Build

```bash
pnpm build
pnpm start
```

### Lint Code

```bash
pnpm lint
```

## 🔌 pRPC Integration

### How It Works

The dashboard connects to the Xandeum network using the **xandeum-prpc** client library:

#### 1. Client Initialization

```typescript
// lib/config/prpc.ts
import { PrpcClient } from "xandeum-prpc";

const SEED_IPS = [
  "173.212.220.65",
  "161.97.97.41",
  // ... 6 more seed IPs
];

export const prpcClient = new PrpcClient(SEED_IPS[0], {
  timeout: 10000, // 10 second timeout
});
```

#### 2. Gossip Discovery

```typescript
// lib/services/pnode.service.ts
async function discoverPNodesViaGossip() {
  // Try primary method with stats
  try {
    const response = await prpcClient.getPodsWithStats();
    return response.pods.map(normalizePNode);
  } catch (error) {
    // Fallback to basic getPods()
    const response = await prpcClient.getPods();
    return response.pods.map(normalizePNode);
  }
}
```

#### 3. Direct Node Queries

For individual node statistics:

```typescript
const nodeIp = node.address.split(":")[0];
const nodeClient = new PrpcClient(nodeIp, { timeout: 8000 });
const stats = await nodeClient.getStats(); // RAM, storage, etc.
```

### Available pRPC Methods

| Method               | Description                             | Returns                              |
| -------------------- | --------------------------------------- | ------------------------------------ |
| `getPods()`          | Get all pNodes without detailed stats   | `{ pods: Pod[] }`                    |
| `getPodsWithStats()` | Get all pNodes with enriched statistics | `{ pods: Pod[] }`                    |
| `getStats()`         | Get detailed stats for a specific node  | `{ ram_used, ram_total, storage_* }` |

### Seed IPs and Fallback

The system uses a **primary + fallback** strategy:

1. Attempts connection to primary seed IP (`173.212.220.65`)
2. If primary fails, iterates through 7 fallback seed IPs
3. Returns first successful response
4. Ensures high availability even if some seeds are down

## 📁 Project Structure

```
xandeum-pnode-dashboard/
├── app/
│   ├── api/                      # API Route Handlers
│   │   ├── pnodes/
│   │   │   ├── route.ts         # GET /api/pnodes
│   │   │   └── [pubkey]/
│   │   │       └── route.ts     # GET /api/pnodes/:pubkey
│   │   ├── analytics/
│   │   │   ├── summary/
│   │   │   │   └── route.ts     # GET /api/analytics/summary
│   │   │   └── metrics/
│   │   │       └── route.ts     # GET /api/analytics/metrics
│   │   └── network-stats/
│   │       └── route.ts         # GET /api/network-stats
│   ├── analytics/
│   │   └── page.tsx             # /analytics - Network analytics
│   ├── nodes/
│   │   ├── page.tsx             # /nodes - All nodes table with pagination
│   │   └── [id]/
│   │       └── page.tsx         # /nodes/:id - Node detail
│   ├── layout.tsx               # Root layout with theme support
│   ├── page.tsx                 # / - Dashboard homepage
│   └── globals.css              # Global styles + light/dark themes
├── components/
│   ├── ui/                      # shadcn/ui components
│   ├── network-header.tsx       # Dashboard header with tabs & theme toggle
│   ├── nav-tabs.tsx             # Tab navigation (Overview/pNodes/Analytics)
│   ├── theme-toggle.tsx         # Light/Dark mode toggle
│   ├── pagination.tsx           # Pagination controls
│   ├── stat-card.tsx            # Metric display cards
│   ├── status-badge.tsx         # Status indicators
│   ├── nodes-table.tsx          # Interactive data table with pagination
│   ├── node-count-chart.tsx     # Line chart
│   ├── status-distribution-chart.tsx  # Pie chart
│   ├── region-distribution-chart.tsx  # Bar chart
│   └── uptime-history-chart.tsx # Historical uptime
├── lib/
│   ├── config/
│   │   └── prpc.ts              # pRPC client initialization
│   ├── services/
│   │   ├── cache.service.ts     # node-cache wrapper (multi-tier)
│   │   ├── pnode.service.ts     # pNode data operations
│   │   ├── analytics.service.ts # Analytics computations
│   │   ├── enrichment.service.ts # Data enrichment pipeline
│   │   └── geo.service.ts       # IP geolocation
│   ├── utils/
│   │   ├── format.ts            # Data formatting utilities
│   │   └── utils.ts             # General utilities (cn)
│   └── types.ts                 # TypeScript type definitions
├── public/                      # Static assets
├── package.json                 # Dependencies
├── tsconfig.json                # TypeScript configuration
├── next.config.mjs              # Next.js configuration
└── README.md                    # This file
```

## 🌐 API Endpoints

### `GET /api/pnodes`

Get all pNodes in the network.

**Response:**

```json
{
  "nodes": [
    {
      "pubkey": "5xK7...",
      "status": "online",
      "address": "173.212.220.65:8000",
      "ip": "173.212.220.65",
      "lastSeen": "2024-01-15T10:30:00.000Z",
      "uptime": 98.5,
      "version": "1.2.3",
      "storageUsed": 1099511627776,
      "storageTotal": 2199023255552,
      "storageCommitted": 2199023255552
    }
  ],
  "count": 223
}
```

### `GET /api/pnodes/[pubkey]`

Get a specific pNode by public key.

**Response:**

```json
{
  "node": {
    /* PNode object */
  }
}
```

### `GET /api/analytics/summary`

Get network-wide analytics summary.

**Response:**

```json
{
  "totalPNodes": 223,
  "onlinePNodes": 218,
  "onlinePercentage": 97.76,
  "totalPods": 223,
  "activePods": 218,
  "averageUptime": 96.8,
  "totalStorageUsedTB": 450.2,
  "totalStorageCapacityTB": 892.5,
  "networkHealth": "healthy",
  "consensusVersion": "1.2.3"
}
```

### `GET /api/analytics/metrics`

Get computed metrics for all nodes (health scores, tiers).

**Response:**

```json
{
  "metrics": [
    {
      "pubkey": "5xK7...",
      "healthScore": 92.5,
      "uptime24h": 98.2,
      "storageUtilization": 48.5,
      "tier": "premium"
    }
  ],
  "count": 223
}
```

## 💾 Caching Strategy

The application uses **multi-tier caching** with node-cache:

| Cache Service           | TTL  | Purpose                          |
| ----------------------- | ---- | -------------------------------- |
| `nodeCacheService`      | 30s  | Raw pNode data from gossip       |
| `statsCacheService`     | 120s | Direct node stats (RAM, storage) |
| `analyticsCacheService` | 60s  | Computed analytics & metrics     |
| `geoCacheService`       | 24h  | IP geolocation results           |

### Cache Benefits

- **Reduced pRPC Load**: Minimizes network calls to Xandeum nodes
- **Faster Response Times**: Sub-100ms for cached data
- **Rate Limit Protection**: Prevents hitting ip-api.com limits
- **Automatic Expiration**: TTL-based invalidation

### Cache Invalidation

Caches auto-expire based on TTL. To manually clear:

```typescript
import { nodeCacheService } from "@/lib/services/cache.service";

nodeCacheService.flush(); // Clear all cached nodes
```

## 🔧 Environment Variables

| Variable                   | Default | Description                                              |
| -------------------------- | ------- | -------------------------------------------------------- |
| `ONLINE_THRESHOLD_SECONDS` | `300`   | Time threshold for considering a node online (5 minutes) |
| `DEBUG_CALCULATIONS`       | `false` | Enable debug logging for health score calculations       |

## 🚢 Deployment

### Vercel (Recommended)

1. **Push to GitHub**

   ```bash
   git push origin main
   ```

2. **Import to Vercel**

   - Go to [vercel.com](https://vercel.com)
   - Click "Import Project"
   - Select your repository
   - Configure environment variables (if needed)
   - Deploy

3. **Auto-Deploy**: Every push to `main` triggers a new deployment

### Docker

```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

Build and run:

```bash
docker build -t xandeum-dashboard .
docker run -p 3000:3000 xandeum-dashboard
```

### Self-Hosted

```bash
pnpm build
pnpm start
```

Use PM2 for process management:

```bash
pm2 start npm --name "xandeum-dashboard" -- start
pm2 save
pm2 startup
```

## 🔮 Extensibility

### Adding New Analytics

1. **Create Service Function**

```typescript
// lib/services/analytics.service.ts
export async function getCustomMetric(): Promise<CustomMetric> {
  const nodes = await getAllPNodes();
  // Your calculation logic
  return result;
}
```

2. **Add API Endpoint**

```typescript
// app/api/analytics/custom/route.ts
import { getCustomMetric } from "@/lib/services/analytics.service";

export async function GET() {
  const metric = await getCustomMetric();
  return NextResponse.json(metric);
}
```

3. **Create UI Component**

```tsx
// components/custom-metric-chart.tsx
export function CustomMetricChart({ data }: Props) {
  return <ResponsiveContainer>...</ResponsiveContainer>;
}
```

### Adding New pRPC Methods

If xandeum-prpc adds new methods:

```typescript
// lib/services/pnode.service.ts
export async function getNewFeature() {
  const response = await prpcClient.newMethod();
  return processResponse(response);
}
```

### Extending Node Types

```typescript
// lib/types.ts
export interface PNode {
  // ... existing fields
  customField: string; // Add new field
}

// lib/utils/format.ts
export function normalizePNode(pod: Pod): PNode {
  return {
    // ... existing fields
    customField: pod.custom_field || "default", // Map new field
  };
}
```

## 🎯 Performance Optimizations

- **Server Components**: Initial data fetched server-side for fast First Contentful Paint
- **Parallel Queries**: `Promise.all()` for concurrent pRPC calls
- **Aggressive Caching**: Reduces network latency by 95%+
- **Debounced Searches**: Client-side filtering without server round-trips
- **Pagination**: Efficient handling of large datasets (supports 1000+ nodes)
- **Code Splitting**: Automatic route-based code splitting
- **Image Optimization**: Next.js Image component for optimized assets
- **CSS-in-JS**: Zero-runtime CSS with Tailwind CSS v4

## 🌈 Design System

### Color Palette

**Light Mode:**

- Background: `oklch(0.98 0.005 265)`
- Primary: `oklch(0.55 0.22 265)` (Purple)
- Charts: Green, Cyan, Orange, Red, Yellow

**Dark Mode:**

- Background: `oklch(0.12 0.01 265)`
- Primary: `oklch(0.65 0.25 265)` (Bright Purple)
- Charts: Vibrant Green, Cyan, Orange, Red, Yellow

### Typography

- **Font Family**: Geist Sans (body), Geist Mono (code)
- **Scale**: Responsive text sizing with Tailwind utilities
- **Line Height**: Optimized for readability (1.5-1.75)

### Animations

```css
/* Fade-in animation for cards */
.animate-fade-in {
  animation: fade-in 0.3s ease-out;
}

/* Stagger animation for grid items */
.stagger-item:nth-child(n) {
  animation-delay: calc(n * 0.05s);
}
```

## 🎨 Theme Support

The dashboard includes a comprehensive theming system:

### Light Mode

- Clean, bright interface with high contrast
- Optimized for daylight viewing
- Professional color palette

### Dark Mode (Default)

- Sophisticated dark theme inspired by observability dashboards
- Reduced eye strain for extended use
- Rich color accents for data visualization

### Theme Toggle

```tsx
// Theme automatically detects system preference
// Manual toggle available in header
<ThemeToggle />
```

## 📊 Features Overview

### Overview Page (/)

- Network health banner with real-time health score
- Key metrics: Total pNodes, Online Nodes, Storage Capacity, Average Uptime
- Status breakdown (Online, Degraded, Offline)
- Network growth chart
- Status distribution pie chart
- Regional distribution bar chart
- Storage overview with utilization tracking
- Recent activity feed

### pNodes Page (/nodes)

- **Comprehensive table with:**
  - Advanced search (ID, pubkey, region, country)
  - Multi-filter (status, region)
  - Column sorting (all columns)
  - **Pagination controls** (10/25/50/100 per page)
  - One-click copy for public keys
  - Direct links to node details
- Fully responsive on all screen sizes

### Analytics Page (/analytics)

- Network health metrics (health %, avg uptime 24h, avg health score, storage pressure)
- Top performing pNodes leaderboard
- Regional distribution analysis
- Version distribution across network
- Pod statistics (total, active, storage)
- Network status overview

### Node Detail Page (/nodes/[id])

- Comprehensive node information
- Storage details with health indicators
- Performance metrics and reliability scores
- Uptime history chart
- Geographic information
- Technical specifications

## 📝 License

This project is open source and available under the MIT License.

## 🤝 Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📧 Support

For issues or questions:

- Open an issue on GitHub
- Contact the Xandeum team
- Check Xandeum documentation

---

**Built with ❤️ for the Xandeum community**
