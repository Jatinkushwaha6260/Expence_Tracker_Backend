# Expense Tracker Backend

Production-ready RESTful backend for an Expense Tracker application built with Node.js, Express and MongoDB (Mongoose). Implements user authentication (JWT + bcrypt) and full CRUD for expenses with filtering, searching, pagination and category-based queries.

Table of contents
- Features
- Tech stack
- Quick start
- Environment variables
- Running locally (dev & prod)
- API reference
    - Auth
    - Expenses
    - Query parameters (filter/search/pagination)
- Data models
- Security & best practices
- Testing & CI
- Deployment
- Contributing
- License

## Features
- User registration and login (bcrypt password hashing)
- JWT-based authentication and route protection
- Expense CRUD: create, read, update, delete
- Advanced list APIs: filter by date/range/amount, search (description/title), category grouping
- Pagination and sorting
- Input validation and consistent error responses
- Prepared for production (env config, logging, security middlewares)

## Tech stack
- Node.js + Express
- MongoDB + Mongoose (can be replaced with Postgres)
- jsonwebtoken (JWT)
- bcrypt (password hashing)
- express-validator (input validation)
- Helmet, CORS, rate-limit (security)
- Winston / Morgan (logging)
- Jest / Supertest (testing)

## Quick start

1. Clone repository
     git clone <repo-url>
2. Install dependencies
     npm install
3. Create `.env` file (example below)
4. Start in development
     npm run dev
5. Build & run production
     npm run build && npm start

## Environment variables (.env example)
Provide these in a secure way (not in source).
PORT=4000
NODE_ENV=production
MONGO_URI=mongodb+srv://user:pass@cluster0.mongodb.net/expense-tracker?retryWrites=true&w=majority
JWT_SECRET=your_strong_jwt_secret_here
JWT_EXPIRES_IN=7d
BCRYPT_SALT_ROUNDS=12
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX=100

## Running locally
- Development (auto-reload)
    npm run dev
- Production
    npm run build
    npm start
- Docker (example)
    docker build -t expense-backend .
    docker run -d --env-file .env -p 4000:4000 expense-backend

## API Reference

Base URL: /api

Authentication: send header
Authorization: Bearer <token>

Standard response envelope:
{
    "success": true|false,
    "data": ...,
    "error": { "message": "...", "fields": {...} }
}

### Auth

- POST /api/auth/register
    - Body
        {
            "name": "User Name",
            "email": "user@example.com",
            "password": "StrongPassword123"
        }
    - Success: 201 Created
        {
            "success": true,
            "data": {
                "user": { "id": "...", "name": "...", "email": "..." },
                "token": "jwt-token"
            }
        }
    - Notes: password is hashed with bcrypt before storage.

- POST /api/auth/login
    - Body
        {
            "email": "user@example.com",
            "password": "password"
        }
    - Success: 200 OK
        {
            "success": true,
            "data": { "user": { "id": "...", "name": "...", "email": "..." }, "token": "jwt-token" }
        }

### Expenses (authenticated)

All expense routes require Authorization header.

- POST /api/expenses
    - Create an expense
    - Body:
        {
            "title": "Groceries",
            "amount": 45.5,
            "currency": "USD",
            "category": "Food",
            "date": "2025-10-30",
            "notes": "Bought fruits"
        }
    - Success: 201 Created -> returns created expense

- GET /api/expenses
    - List expenses with query support
    - Query parameters:
        - page (default 1), limit (default 20)
        - sortBy (e.g. date:desc, amount:asc)
        - q (search: matches title or notes)
        - category (e.g. Food, Travel)
        - minAmount, maxAmount
        - startDate, endDate (ISO dates)
    - Example:
        GET /api/expenses?page=1&limit=20&category=Food&q=market&startDate=2025-10-01&endDate=2025-10-31&sortBy=date:desc
    - Success: 200 OK
        {
            "success": true,
            "data": {
                "items": [ ... ],
                "meta": { "page": 1, "limit": 20, "total": 123, "pages": 7 }
            }
        }

- GET /api/expenses/:id
    - Get single expense (must belong to authenticated user)
    - Success: 200 OK -> expense object

- PUT /api/expenses/:id
    - Update expense fields (title, amount, category, date, notes)
    - Success: 200 OK -> updated expense

- DELETE /api/expenses/:id
    - Delete an expense
    - Success: 204 No Content

- GET /api/expenses/stats/category
    - Returns aggregated totals grouped by category (helpful for dashboards)
    - Query params: startDate, endDate, currency (if multi-currency support)
    - Success: 200 OK
        {
            "success": true,
            "data": [
                { "category": "Food", "total": 234.5 },
                { "category": "Transport", "total": 120.0 }
            ]
        }

## Query behavior highlights
- Searching (q) performs case-insensitive partial match on title and notes.
- Filtering supports date ranges and numeric ranges.
- Pagination returns meta with total count and pages.
- Sorting supports single field with asc/desc (field:order).

## Data models (summary)

User
- name: String, required
- email: String, required, unique, lowercase
- password: String, required (hashed)
- createdAt, updatedAt

Expense
- user: ObjectId (ref User), indexed
- title: String, required
- amount: Number, required
- currency: String (e.g. USD), default USD
- category: String (indexed)
- date: Date (required)
- notes: String
- createdAt, updatedAt

## Authentication & Security
- Passwords: hashed with bcrypt (configurable salt rounds)
- JWT: signed with strong secret, token expiry set (e.g. 7d)
- Secure routes: middleware verifies token and loads user
- Rate limiting: protect endpoints from brute-force
- Helmet: sets secure HTTP headers
- CORS: configured per allowed origins
- Input validation & sanitization using express-validator
- Store secrets securely (secrets manager / env)
- Use HTTPS in production; never expose JWT secret or DB credentials

## Error handling & Logging
- Centralized error handler returns consistent structure and proper HTTP status codes.
- Validation errors return 400 with field details.
- Not found returns 404.
- Authentication errors return 401.
- Use structured logs (Winston) and optionally integrate with centralized logging (ELK, Datadog).

## Testing & CI
- Unit & integration tests: Jest + Supertest (cover auth, validation, expense endpoints)
- Add CI pipeline (GitHub Actions) to run tests, lint, and build.
- Use a test database (in-memory MongoDB or separate DB) in CI.

## Deployment notes
- Build artifacts (if using TypeScript) and run with process manager (pm2) or container orchestration (Docker/Kubernetes).
- Scale stateless app horizontally; use shared DB and distributed cache if needed.
- Backups: enable DB backups and retention policy.
- Monitor: uptime, error rates, response latencies, and JWT expiry issues.

## Example cURL
Register:
curl -X POST /api/auth/register -H "Content-Type: application/json" -d '{"name":"Test","email":"t@t.com","password":"P@ssw0rd"}'

Login:
curl -X POST /api/auth/login -H "Content-Type: application/json" -d '{"email":"t@t.com","password":"P@ssw0rd"}'

Create expense:
curl -X POST /api/expenses -H "Authorization: Bearer <token>" -H "Content-Type: application/json" -d '{"title":"Groceries","amount":50,"category":"Food","date":"2025-10-30"}'

## Contributing
- Follow standard GitFlow.
- Write tests for new features.
- Lint with configured rules and ensure CI passes.

## License
Specify your license (e.g. MIT) in LICENSE file.

If you want, I can generate:
- Example Express folder structure
- Example Mongoose schemas, auth middleware and sample route handlers
- Full Postman collection or OpenAPI (Swagger) spec







