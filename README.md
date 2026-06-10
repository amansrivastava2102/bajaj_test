# Graph Hierarchy Analyzer

A web application and REST API for processing directed graph relationships, building hierarchies, detecting cycles, validating inputs, and generating graph summaries.

## Features

* Hierarchy generation
* Cycle detection
* Duplicate edge detection
* Input validation
* Depth calculation
* Graph summary generation
* REST API
* Responsive web interface

## API

### POST /api/graph

Request:

```json
{
  "edges": ["A->B", "A->C", "B->D"]
}
```

Response:

```json
{
  "user_id": "...",
  "email_id": "...",
  "enrollment_number": "...",
  "hierarchies": [],
  "invalid_entries": [],
  "duplicate_edges": [],
  "summary": {}
}
```

## Environment Variables

```env
USER_ID=
EMAIL_ID=
ENROLLMENT_NUMBER=
```

## Run Locally

```bash
npm install
cp .env.example .env.local
npm run dev
```

## Tech Stack

* Next.js
* JavaScript
* Node.js
* Vercel
