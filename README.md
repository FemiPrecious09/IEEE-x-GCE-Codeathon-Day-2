# Notes API — Day 2

A RESTful CRUD API for managing notes, built with **Node.js**, **Express**, and **PostgreSQL**.

This project extends the Day 1 version by introducing:

* Persistent database storage with PostgreSQL
* User authentication with JWT
* Password hashing using bcrypt
* Protected routes and user-scoped notes
* Better project structure and centralized error handling

Built for the IEEE × GitHub Campus Experts Codeathon — Backend Track.

---

# Table of Contents

1. [Features](#features)
2. [Tech Stack](#tech-stack)
3. [Project Structure](#project-structure)
4. [Database Schema](#database-schema)
5. [Getting Started](#getting-started)
6. [Environment Variables](#environment-variables)
7. [Running the Server](#running-the-server)
8. [Authentication Flow](#authentication-flow)
9. [API Endpoints](#api-endpoints)
10. [Status Codes](#status-codes)
11. [Design Decisions](#design-decisions)
12. [Request Logging](#request-logging)
13. [Testing](#testing)
14. [Author](#author)

---

# Features

## Authentication

* User registration
* User login
* JWT-based authentication
* Password hashing with bcrypt
* Protected routes using middleware

## Notes Management

* Create notes
* Read all notes
* Read a single note
* Replace a note with PUT
* Partially update a note with PATCH
* Delete notes

## Database Features

* PostgreSQL persistence
* UUID-based public identifiers
* Foreign-key relationships
* Automatic timestamps
* Unique username constraint

## Engineering Features

* Centralized error handling
* Request logging middleware
* Modular folder structure
* Semantic HTTP status codes

---

# Tech Stack

| Technology   | Purpose                         |
| ------------ | ------------------------------- |
| Node.js      | JavaScript runtime              |
| Express      | Routing and middleware          |
| PostgreSQL   | Relational database             |
| pg           | PostgreSQL client for Node.js   |
| bcryptjs     | Password hashing                |
| jsonwebtoken | JWT generation and verification |
| dotenv       | Environment variable management |

---

# Project Structure

```txt
.
├── controllers/
│   ├── auth_controller.js
│   └── notes_controller.js
│
├── routes/
│   ├── auth_route.js
│   └── notes_route.js
│
├── models/
│   ├── auth_model.js
│   └── note_model.js
│
├── middlewares/
│   ├── auth.js
│   └── error.js
│
├── db/
│   ├── database.js
│   └── setup.js
│
├── server.js
├── .env
├── .env.example
├── package.json
└── README.md
```

---

# Database Schema

## Profile Table

| Column    | Type         | Constraints            |
| --------- | ------------ | ---------------------- |
| id        | SERIAL       | Primary Key            |
| public_id | UUID         | Unique, auto-generated |
| username  | VARCHAR(255) | Unique, NOT NULL       |
| password  | TEXT         | bcrypt hash            |

## Note Table

| Column     | Type        | Constraints                       |
| ---------- | ----------- | --------------------------------- |
| id         | SERIAL      | Primary Key                       |
| public_id  | UUID        | Unique, auto-generated            |
| title      | TEXT        | NOT NULL                          |
| body       | TEXT        | Optional                          |
| created_at | TIMESTAMPTZ | Default NOW()                     |
| updated_at | TIMESTAMPTZ | Updated automatically             |
| profile_id | UUID        | Foreign key to profile(public_id) |

---

# Getting Started

## 1. Clone the Repository

```bash
git clone <your-repo-url>
cd <repo-folder>
```

## 2. Install Dependencies

```bash
npm install
```

## 3. Set Up PostgreSQL

Create a database:

```sql
CREATE DATABASE notes_db;
```

You can use:

* Local PostgreSQL installation
* Neon
* Supabase

---

# Environment Variables

Create a `.env` file in the root directory.

```env
ACTIVE_PORT=8800

DB_USER=postgres
DB_HOST=localhost
DB_NAME=notes_db
DB_PASSWORD=your_postgres_password
DB_PORT=5432

JWT_SECRET=your_jwt_secret_here
```

---

# Running the Server

Start the development server:

```bash
npm run dev
```

Expected output:

```txt
Database connected Successfully
Server is ACTIVE🔥🔥 on http://localhost:8800
```

Tables are automatically created on startup using `IF NOT EXISTS`.

---

# Authentication Flow

1. Register an account
2. Login to receive a JWT token
3. Include the token in protected requests
4. Access `/notes` endpoints

Authorization header format:

```txt
Authorization: Bearer <your-token>
```

---

# API Endpoints

Base URL:

```txt
http://localhost:8800
```

---

# Authentication Routes

## Register User

### POST `/auth/register`

### Request Body

```json
{
  "username": "femiprecious",
  "password": "supersecret123"
}
```

### Success Response — 201 Created

```json
{
  "message": "Account Created Successfully",
  "data": {
    "id": 1,
    "public_id": "uuid-value",
    "username": "femiprecious"
  }
}
```

### Possible Errors

| Status | Meaning                      |
| ------ | ---------------------------- |
| 400    | Missing username or password |
| 409    | Username already exists      |

### Example cURL

```bash
curl -X POST http://localhost:8800/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"femiprecious","password":"supersecret123"}'
```

---

## Login User

### POST `/auth/login`

### Request Body

```json
{
  "username": "femiprecious",
  "password": "supersecret123"
}
```

### Success Response — 200 OK

```json
{
  "message": "Login Successful",
  "token": "jwt-token-here"
}
```

### Possible Errors

| Status | Meaning                      |
| ------ | ---------------------------- |
| 400    | Missing credentials          |
| 401    | Invalid username or password |

### Example cURL

```bash
curl -X POST http://localhost:8800/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"femiprecious","password":"supersecret123"}'
```

---

## Logout User

### POST `/auth/logout`

### Success Response — 200 OK

```json
{
  "message": "Logged out successfully"
}
```

---

# Notes Routes (Protected)

All routes below require a valid JWT.

---

## Create Note

### POST `/notes`

### Request Body

```json
{
  "title": "Buy milk",
  "body": "2% from the corner store"
}
```

### Success Response — 201 Created

```json
{
  "id": 1,
  "public_id": "uuid-value",
  "title": "Buy milk",
  "body": "2% from the corner store",
  "created_at": "2026-05-28T14:30:00.000Z",
  "updated_at": "2026-05-28T14:30:00.000Z",
  "profile_id": "user-uuid"
}
```

---

## Get All Notes

### GET `/notes`

Returns all notes belonging to the authenticated user.

### Success Response — 200 OK

```json
[
  {
    "title": "Buy milk"
  }
]
```

---

## Get Single Note

### GET `/notes/:id`

### Success Response — 200 OK

Returns a single note.

### Error

| Status | Meaning        |
| ------ | -------------- |
| 404    | Note not found |

---

## Replace Note

### PUT `/notes/:id`

Fully replaces the note.

### Request Body

```json
{
  "title": "Updated title",
  "body": "Updated body"
}
```

### Success Response — 200 OK

Returns the updated note.

---

## Update Note Partially

### PATCH `/notes/:id`

Updates only the provided fields.

### Request Body

```json
{
  "title": "New title only"
}
```

### Success Response — 200 OK

Returns the updated note.

---

## Delete Note

### DELETE `/notes/:id`

### Success Response — 204 No Content

Returns an empty response body.

---

# Status Codes

| Code | Meaning               |
| ---- | --------------------- |
| 200  | Successful request    |
| 201  | Resource created      |
| 204  | Successful deletion   |
| 400  | Bad request           |
| 401  | Unauthorized          |
| 404  | Resource not found    |
| 409  | Conflict              |
| 500  | Internal server error |

---

# Design Decisions

## Why PostgreSQL?

PostgreSQL provides:

* Persistent storage
* Data integrity
* Foreign-key support
* Better scalability
* Concurrency safety

---

## Why bcrypt?

Passwords are hashed before storage.

Benefits:

* Plain-text passwords are never saved
* Each password gets a random salt
* Safer against database leaks

---

## Why JWT?

JWT allows stateless authentication.

Workflow:

1. User logs in
2. Server signs a token
3. Client stores the token
4. Token is sent with protected requests
5. Middleware verifies the token

---

## Why Use UUIDs?

UUIDs are safer for public APIs because they:

* Prevent predictable URLs
* Reduce enumeration attacks
* Separate internal IDs from public IDs

---

## PUT vs PATCH

| Method | Purpose          |
| ------ | ---------------- |
| PUT    | Full replacement |
| PATCH  | Partial update   |

Both PUT and DELETE are idempotent.

---

## Why DELETE Returns 204

`204 No Content` means:

* The operation succeeded
* No response body is needed

---

# Request Logging

Example logs:

```txt
[2026-05-28T14:30:00.000Z] POST /auth/register 201 161
[2026-05-28T14:30:05.123Z] POST /auth/login 200 174
[2026-05-28T14:30:10.456Z] GET /notes 200 42
```

Format:

```txt
[ISO Timestamp] METHOD URL STATUS_CODE DURATION_MS
```

---

# Testing

You can test the API using:

* Postman
* Insomnia
* Thunder Client
* curl

Typical workflow:

1. Register a user
2. Login to receive a JWT
3. Add the JWT to request headers
4. Access protected `/notes` routes

---

# Author

Built by **Femi Oyetade** for the IEEE × GitHub Campus Experts Codeathon — Backend Track.
