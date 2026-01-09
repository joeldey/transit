# Transit Schedule Dashboard

An internal prototype for displaying real-time transit information including bus and train routes.

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm 9+

### Installation

```bash
# Install all dependencies
npm install

# Set up the database (creates SQLite DB and seeds data)
npm run setup

# Start the development servers
npm run dev
```

This will start:
- Backend API server at `http://localhost:3001`
- Frontend dev server at `http://localhost:5173`

## Project Structure

```
transit-schedule/
├── frontend/          # React application
│   └── src/
│       ├── components/   # UI components
│       ├── App.jsx       # Main application
│       └── main.jsx      # Entry point
├── backend/           # Express API server
│   ├── src/
│   │   └── index.js      # API routes
│   └── prisma/
│       ├── schema.prisma # Database schema
│       └── seed.js       # Sample data
└── package.json       # Workspace root
```

## API Endpoints

- `GET /api/routes` - Returns all transit routes
- `GET /api/routes?type=bus` - Filter by route type
- `GET /api/routes?status=delayed` - Filter by status

## Notes

This is an internal prototype. Some rough edges are expected.

