# Architecture

## Chosen Direction

The portfolio ecosystem uses Option A:

- `Portfolio_Frontend` is the public visitor-facing portfolio.
- `Portfolio_CMS` is the private editor/admin dashboard.
- `Portfolio_API` is the backend API and MongoDB integration layer.

## Application Boundaries

### Portfolio_Frontend

Responsibilities:

- Render the public portfolio.
- Show published portfolio content.
- Preserve premium UI, animations, theme, responsiveness, SEO, and project detail routes.
- Do not expose admin links, login buttons, dashboard routes, or editing controls.

### Portfolio_CMS

Responsibilities:

- Render the private dashboard experience.
- Provide editor/admin workflows.
- Communicate with `Portfolio_API` for auth and protected content management.

### Portfolio_API

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

## Data Source Direction

MongoDB will become the source of truth.

During transition, frontend static/default content can remain as fallback content, but CMS-driven content should come from `Portfolio_API`.

## Development Ports

- Frontend: `http://localhost:5173`
- CMS: `http://localhost:5174`
- API: `http://localhost:4174`
