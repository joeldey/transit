# Transit Schedule Dashboard

A live departures board for "Cascadia Metro" - a fictional transit system. Shows real-time bus and train departures from various transit hubs.

## Quick Start

### Prerequisites

- **Node.js 18+** (check with `node --version`)
- **npm 9+** (check with `npm --version`)

### Setup (3 commands)

```bash
# 1. Install all dependencies (frontend + backend)
npm install

# 2. Set up the database (creates SQLite DB and populates with sample data)
npm run setup

# 3. Start both servers
npm run dev
```

### Access the App

Once running, open your browser to:
- **Frontend:** http://localhost:5173
- **Backend API:** http://localhost:3001

---

## What Each Command Does

| Command | What it does |
|---------|--------------|
| `npm install` | Installs dependencies for root, frontend, and backend (using npm workspaces) |
| `npm run setup` | Generates Prisma client, creates SQLite database, seeds with sample data |
| `npm run dev` | Starts both backend (port 3001) and frontend (port 5173) concurrently |

### Running Servers Individually

If you prefer to run servers in separate terminals:

```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend  
cd frontend
npm run dev
```

---

## Project Structure

```
transit-schedule/
├── frontend/                 # React application (Vite)
│   └── src/
│       ├── components/       # UI components (Header, RouteCard, etc.)
│       ├── pages/            # Page components (Departures, Settings, RouteDetail)
│       ├── App.jsx           # Router setup
│       └── main.jsx          # Entry point
├── backend/                  # Express API server
│   ├── src/
│   │   └── index.js          # API routes and server
│   └── prisma/
│       ├── schema.prisma     # Database schema
│       ├── seed.js           # Sample data population
│       └── dev.db            # SQLite database (generated)
├── package.json              # Workspace root (monorepo config)
└── README.md
```

---

## API Endpoints

| Endpoint | Description |
|----------|-------------|
| `GET /api/stations` | List all transit stations |
| `GET /api/routes` | Get departures (uses first station by default) |
| `GET /api/routes?stationId=1` | Get departures from a specific station |
| `GET /api/routes?type=bus` | Filter by route type (bus, train, rapid, express) |
| `GET /api/routes?status=delayed` | Filter by status (on-time, delayed, cancelled) |
| `GET /api/route-patterns/:routeNumber` | Get detailed route information |

---

## Troubleshooting

### "Cannot find module '@prisma/client'"
Run `npm run setup` - the Prisma client needs to be generated.

### "Database does not exist" or empty data
Run `npm run setup` - this creates and seeds the database.

### Port already in use
Kill existing processes:
```bash
# Kill processes on ports 3001 and 5173
lsof -ti:3001 | xargs kill -9 2>/dev/null
lsof -ti:5173 | xargs kill -9 2>/dev/null
```

### Fresh start
Delete generated files and re-setup:
```bash
rm -rf node_modules frontend/node_modules backend/node_modules backend/prisma/dev.db
npm install
npm run setup
npm run dev
```

---

## Tech Stack

- **Frontend:** React 18, React Router, Vite
- **Backend:** Express.js, Prisma ORM
- **Database:** SQLite

---

## Notes

This is an internal prototype. The codebase has some rough edges that are intentional for discussion purposes.
