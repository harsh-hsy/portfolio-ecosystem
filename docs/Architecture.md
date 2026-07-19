# Architecture

## Chosen Direction

The portfolio ecosystem uses Option A:

- `frontend` is the public visitor-facing portfolio.
- `cms` is the private editor/admin dashboard.
- `api` is the backend API and MongoDB integration layer.

## Application Boundaries

### frontend

Responsibilities:

- Render the public portfolio.
- Show published portfolio content.
- Preserve premium UI, animations, theme, responsiveness, SEO, and project detail routes.
- Do not expose admin links, login buttons, dashboard routes, or editing controls.

### cms

Responsibilities:

- Render the private dashboard experience.
- Provide editor/admin workflows.
- Communicate with `api` for auth and protected content management.

### api

Responsibilities:

- Handle authentication.
- Connect to MongoDB.
- Store admin users with hashed passwords.
- Store portfolio content, media metadata, and contact messages.
- Expose public published-content APIs.
- Expose protected admin APIs.

## Current API Foundation

Implemented routes:

- `GET /api/health`
- `POST /api/auth/login`
- `GET /api/auth/session`
- `POST /api/auth/logout`
- `GET /api/portfolio`
- `GET /api/admin/me`
- `GET /api/admin/portfolio`
- `POST /api/admin/portfolio/initialize`
- `PUT /api/admin/portfolio`
- `PUT /api/admin/portfolio/:field`
- `POST /api/admin/portfolio/reset`
- `GET /api/admin/portfolio-fields`

## Data Source Direction

MongoDB will become the source of truth.

During transition, frontend static/default content can remain as fallback content, but CMS-driven content should come from `api`.

## Development Ports

- Frontend: `http://localhost:5173`
- CMS: `http://localhost:5174`
- API: `http://localhost:4174`
