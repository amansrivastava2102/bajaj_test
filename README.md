# Graph Hierarchy Analyzer

A web application and REST API for analyzing directed graph relationships, detecting cycles, constructing hierarchies, identifying invalid and duplicate edges, and generating graph summaries.

## Features

* Directed graph processing
* Hierarchy and tree generation
* Cycle detection
* Duplicate edge detection
* Invalid input validation
* Depth calculation
* Multiple independent graph support
* REST API endpoint
* Responsive web interface

## Technology Stack

* Next.js
* JavaScript
* Node.js
* Vercel

## API

### Endpoint

POST `/api/graph`

### Request

```json
{
  "edges": ["A->B", "A->C", "B->D"]
}
```

### Response

```json
{
  "user_id": "amansrivastava_21022004",
  "email_id": "aman.srivastava.btech2023@sitpune.edu.in",
  "enrollment_number": "23070122024",
  "hierarchies": [],
  "invalid_entries": [],
  "duplicate_edges": [],
  "summary": {}
}
```

## Environment Variables

Create a `.env.local` file in the project root:

```env
USER_ID=amansrivastava_21022004
EMAIL_ID=aman.srivastava.btech2023@sitpune.edu.in
ENROLLMENT_NUMBER=23070122024
```

## Local Development

```bash
npm install
npm run dev
```

Application will be available at:

```text
http://localhost:3000
```

## Project Structure

```text
app/
├── api/
│   └── graph/
│       └── route.js

lib/
└── graphProcessor.js

scripts/
└── test-example.mjs
```

## License

MIT
