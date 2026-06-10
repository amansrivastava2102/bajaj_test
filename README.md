# SIT Graph Hierarchy Analyzer

Full-stack solution for the SIT Full Stack Engineering Challenge — a REST API that processes node hierarchies and a web UI to interact with it.

## Live URLs

> Update these after deploying to Vercel (or your host).

| Resource | URL |
|----------|-----|
| **API** | `https://YOUR-PROJECT.vercel.app/api/graph` |
| **Frontend** | `https://YOUR-PROJECT.vercel.app` |
| **GitHub** | `https://github.com/YOUR-USERNAME/sit-graph-challenge` |

## Features

- **POST `/api/graph`** — validates edges, builds trees, detects cycles, computes depth
- **CORS enabled** — evaluators can call the API from any origin
- **Single-page frontend** — textarea input, structured results with tree view, summary cards, error handling

## Tech Stack

- [Next.js](https://nextjs.org/) (App Router)
- Node.js / JavaScript
- Deployed on Vercel (API + frontend in one project)

## Setup

```bash
npm install
cp .env.example .env.local
# Edit .env.local with your USER_ID, EMAIL_ID, ENROLLMENT_NUMBER
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Environment Variables

| Variable | Description |
|----------|-------------|
| `USER_ID` | Format: `fullname_yyyymmdd` (e.g. `johndoe_19990917`) |
| `EMAIL_ID` | Your university email |
| `ENROLLMENT_NUMBER` | Your enrollment number |
| `NEXT_PUBLIC_API_URL` | Optional — defaults to `/api/graph` on same origin |

## API Usage

```bash
curl -X POST https://YOUR-PROJECT.vercel.app/api/graph \
  -H "Content-Type: application/json" \
  -d '{"edges": ["A->B", "A->C", "B->D"]}'
```

## Test Example Output

```bash
node scripts/test-example.mjs
```

## Deploy to Vercel

1. Push this repo to a **public** GitHub repository
2. Import the repo at [vercel.com/new](https://vercel.com/new)
3. Add environment variables (`USER_ID`, `EMAIL_ID`, `ENROLLMENT_NUMBER`) in Project Settings → Environment Variables
4. Deploy — both API and frontend are served from the same URL

## Project Structure

```
app/
  api/graph/route.js   # POST /api/graph endpoint
  page.js              # Frontend UI
lib/
  graphProcessor.js    # Core graph logic
scripts/
  test-example.mjs     # Validates against challenge example
```

## License

MIT
