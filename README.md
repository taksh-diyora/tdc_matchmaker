# MatchMaker

MatchMaker is a full-stack matchmaking dashboard with a Node.js/Express backend and a Vite/React frontend.

## Project Structure

```text
MatchMaker/
├── backend/
│   ├── controllers/      # Request handlers for auth, clients, AI, dashboard, and matches
│   ├── data/             # JSON-based local data store
│   ├── middleware/       # Auth middleware and request guards
│   ├── routes/           # API route definitions
│   ├── utils/            # File helpers, match scoring, and migration helpers
│   ├── index.js          # Express app entry point
│   └── package.json
├── frontend/
│   ├── src/              # React app source code
│   ├── index.html        # Vite entry HTML file
│   ├── vite.config.js    # Vite configuration and aliases
│   ├── vercel.json       # SPA routing config for Vercel
│   └── package.json
└── README.md
```

## Prerequisites

- Node.js installed locally
- npm installed locally
- A backend `.env` file in `backend/`
- A frontend `.env` file in `frontend/`

## Backend Setup

The backend runs on Express and reads/writes JSON files from the `backend/data` folder.

### Install dependencies

```bash
cd backend
npm install
```

### Run in development

```bash
cd backend
npm run dev
```

### Run in production mode

```bash
cd backend
npm start
```

### Backend environment variables

Create a `backend/.env` file with values like:

```dotenv
PORT=8000
SECRET_KEY=your-secret-key
FRONTEND_URL=https://your-frontend-domain
CLIENT_URL=https://your-frontend-domain
OPENROUTER_API_KEY=your-openrouter-key
```

`OPENROUTER_API_KEY` is only needed for AI email generation.

## Frontend Setup

The frontend is a Vite app that talks to the backend through `VITE_API_BASE_URL`.

### Install dependencies

```bash
cd frontend
npm install
```

### Run in development

```bash
cd frontend
npm run dev
```

### Build for production

```bash
cd frontend
npm run build
```

### Frontend environment variables

Create a `frontend/.env` file with:

```dotenv
VITE_API_BASE_URL=https://your-backend-domain
```

## Deployment Notes

- Deploy the backend to Render.
- Deploy the frontend to Vercel.
- Set the frontend `VITE_API_BASE_URL` to the Render backend URL.
- Set the backend `FRONTEND_URL` and `CLIENT_URL` to the Vercel frontend URL.
- Add a Vercel rewrite rule so React routes work on refresh.

## Useful Commands

```bash
# Backend
cd backend
npm run dev

# Frontend
cd frontend
npm run dev
```