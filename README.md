Notes API
A RESTful CRUD API for managing notes, built with Node.js and Express.
Submitted for Day 1 of the IEEE × GitHub Campus Experts Codeathon — Backend Track. Focus: HTTP fundamentals, clean REST design, semantic status codes, and defensive engineering.

Features

Full CRUD operations on notes (POST, GET, PUT, PATCH, DELETE)
In-memory storage seeded with sample data
Semantic HTTP status codes (200, 201, 204, 400, 404, 500)
Pagination and sorting on the list endpoint
Custom request-logging middleware
Global 404 route handler and centralized error handler
Clean modular layout (routes / controllers / data)


Tech Stack

Node.js (v18+)
Express — HTTP routing and middleware
dotenv — environment variable loading
crypto — UUID generation (Node built-in)


Project Structure
.
├── controllers/
│   └── notes_controller.js   # Route handler logic
├── routes/
│   └── notes.js              # Express router for /notes
├── db/
│   └── database.js           # In-memory notes array (seeded)
├── server.js                 # App entry point + global middleware
├── .env                      # Environment variables (not committed)
├── .env.example              # Template for env vars
├── package.json
└── README.md

Setup
1. Clone the repo
bashgit clone <your-repo-url>
cd <repo-folder>
2. Install dependencies
bashnpm install
3. Configure environment variables
Create a .env file in the project root:
envACTIVE_PORT=3500
4. Start the server
bashnode server.js
You should see:
Server is ACTIVE🔥🔥 on http://localhost:3500

API Endpoints
Base URL: http://localhost:3500
POST /notes — Create a note
Creates a new note with a server-generated id and timestamps.
Request body:
json{
  "title": "Buy milk",
  "body": "2% from the corner store"
}
Response — 201 Created
json{
  "id": "8f3a1b2c-4d5e-6f70-8a9b-0c1d2e3f4a5b",
  "title": "Buy milk",
  "body": "2% from the corner store",
  "createdAt": "2026-05-25T14:30:00.000Z",
  "updatedAt": "2026-05-25T14:30:00.000Z"
}
curl:
bashcurl -X POST http://localhost:3500/notes \
  -H "Content-Type: application/json" \
  -d '{"title":"Buy milk","body":"2% from the corner store"}'

GET /notes — List notes
Returns notes for the current page, optionally sorted.
Query parameters (all optional):
ParamTypeDefaultDescriptionpageint1Page number (1-indexed)limitint10Items per pagesortstring—One of title, newest, lastupdated
Response — 200 OK — Array of notes for the requested page.
Error — 400 Bad Request — Invalid sort value.
json{ "error": "sort must be one of: title, newest, lastupdated" }
curl examples:
bash# Default list (page 1, 10 per page)
curl http://localhost:3500/notes

# Page 2 with 5 per page
curl "http://localhost:3500/notes?page=2&limit=5"

# Newest first
curl "http://localhost:3500/notes?sort=newest"

# By title, paginated
curl "http://localhost:3500/notes?sort=title&page=1&limit=3"

GET /notes/:id — Read a single note
Response — 200 OK — The note object.
Error — 404 Not Found — If the id doesn't exist.
curl:
bashcurl http://localhost:3500/notes/8f3a1b2c-4d5e-6f70-8a9b-0c1d2e3f4a5b

PUT /notes/:id — Replace a note (full update)
PUT is idempotent — calling it N times with the same payload yields the same result. The original createdAt is preserved; updatedAt is refreshed.
Request body:
json{
  "title": "Updated title",
  "body": "Replaced body content"
}
Response — 200 OK — The updated note.
Error — 404 Not Found — If the id doesn't exist.
curl:
bashcurl -X PUT http://localhost:3500/notes/<id> \
  -H "Content-Type: application/json" \
  -d '{"title":"Updated","body":"New body"}'

PATCH /notes/:id — Partial update
Only the fields included in the request body are modified. Omitted fields are left untouched.
Request body (any subset of title, body):
json{ "title": "Just changing the title" }
Response — 200 OK — The updated note.
Error — 404 Not Found — If the id doesn't exist.
curl:
bashcurl -X PATCH http://localhost:3500/notes/<id> \
  -H "Content-Type: application/json" \
  -d '{"title":"Patched title"}'

DELETE /notes/:id — Delete a note
Response — 204 No Content — Empty body on success.
Error — 404 Not Found — If the id doesn't exist.
curl:
bashcurl -X DELETE http://localhost:3500/notes/<id>

Status Code Reference
CodeMeaning200OK — successful read or update201Created — successful resource creation204No Content — successful delete (no body)400Bad Request — invalid query parameter404Not Found — resource doesn't exist500Internal Server Error — unhandled exception

Design Notes
PUT vs PATCH

PUT is for full replacement. The client sends the complete representation and the server overwrites the resource. Idempotent: same payload N times → same result.
PATCH is for partial update. Only the fields present in the request body are changed. Useful for updating one field without re-sending the whole resource.

Both PUT and DELETE are idempotent. POST is not — two identical POSTs create two notes with different ids.
Why DELETE returns 204
204 No Content explicitly signals "the action succeeded and there's no body to send." A 200 OK with a "Note deleted" message would be redundant — the client already knows the operation succeeded from the status code.
In-memory storage
Notes are stored in a JavaScript array in db/database.js, seeded with sample data on boot. Restarting the server resets state. A persistent database layer is planned for Day 2 of the codeathon.

Request Logging
A custom middleware logs every incoming request to the console:
[2026-05-25T14:30:00.000Z] POST /notes 201 4
[2026-05-25T14:30:05.123Z] GET /notes 200 1
[2026-05-25T14:30:10.456Z] DELETE /notes/abc-123 204 1
Format: [ISO timestamp] METHOD url statusCode durationMs

Testing
Use the curl commands in each endpoint section above, or import them into Postman / Insomnia.
Screenshots of working requests are in the screenshots/ directory.

Author
Built by Femi Oyetade — IEEE × GCE Codeathon Day 1, Backend Track.