# Portfolio API

Backend service for the portfolio ecosystem. This service stores content in MongoDB, serves published portfolio data, and protects CMS updates with JWT authentication.

## What this API does

- serves the public portfolio payload
- accepts authenticated CMS updates
- manages separate portfolio modules in MongoDB
- handles project and certificate records
- manages admin sessions and account updates
- seeds initial admin and portfolio data

## Core Endpoints

### Public

- `GET /api/health`
- `GET /api/portfolio`

### Authentication

- `POST /api/auth/login`
- `GET /api/auth/session`
- `POST /api/auth/logout`

### Admin

- `GET /api/admin/me`
- `GET /api/admin/account`
- `PUT /api/admin/account`
- `PUT /api/admin/account/password`
- `GET /api/admin/portfolio`
- `POST /api/admin/portfolio/initialize`
- `PUT /api/admin/portfolio`
- `PUT /api/admin/portfolio/module/:module`
- `PUT /api/admin/portfolio/:field`
- `POST /api/admin/portfolio/reset`
- `GET /api/admin/portfolio-fields`
- `GET /api/admin/projects`
- `POST /api/admin/projects`
- `GET /api/admin/projects/:slug`
- `PUT /api/admin/projects/:slug`
- `DELETE /api/admin/projects/:slug`
- `GET /api/admin/certificates`
- `POST /api/admin/certificates`
- `GET /api/admin/certificates/:slug`
- `PUT /api/admin/certificates/:slug`
- `DELETE /api/admin/certificates/:slug`

## Data Model Overview

The backend uses separate MongoDB collections and models for:

- portfolio content
- portfolio modules
- projects
- certificates
- media assets
- contact messages
- admin users

Validation is split by content area so the CMS and frontend can safely consume structured data.

## Local Development

Install dependencies:

```bash
npm install
```

Start the API:

```bash
npm run dev
```

Other scripts:

```bash
npm run start
npm run lint
npm run seed:admin
npm run seed:portfolio
```

## Environment

Create `api/.env`:

```env
PORT=4174
CLIENT_ORIGIN=http://localhost:5173
CMS_ORIGIN=http://localhost:5174
MONGODB_URI=mongodb://127.0.0.1:27017/portfolio_cms
JWT_SECRET=your-secret
JWT_EXPIRES_IN=8h
ADMIN_NAME=Harsh Kumar Singh
ADMIN_EMAIL=you@example.com
ADMIN_PASSWORD=your-password
```

## Implementation Notes

- MongoDB is the source of truth for CMS-managed content.
- The API exposes published portfolio data to the frontend and authenticated editing routes to the CMS.
- Cookie-based admin sessions are used for dashboard auth.
