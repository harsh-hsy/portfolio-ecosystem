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
- Store portfolio content and media metadata.
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
- `PUT /api/admin/portfolio/module/:module`

## Data Source Direction

MongoDB is the source of truth for live portfolio content.

The frontend repository snapshot is used only when the API cannot provide published content.
The API does not maintain a second default portfolio snapshot.

## Development Ports

- Frontend: `http://localhost:5173`
- CMS: `http://localhost:5174`
- API: `http://localhost:4174`
