# Portfolio Frontend

This is the public portfolio website that visitors see.

It shows the live portfolio content, keeps the design polished, and reads published data from the API instead of depending on hardcoded page content.

## What this frontend is responsible for

- showing the public portfolio
- loading published content from the API
- rendering the main sections of the site
- keeping the UI responsive and smooth
- supporting dark and light themes
- handling animations and interaction details

## Main sections

- Hero
- About
- Skills
- Projects
- Journey
- Milestones
- Certificates
- Services
- Achievements
- Contact

## How it fits in the ecosystem

```mermaid
flowchart LR
  API["API /api/portfolio"] --> Frontend["Frontend"]
  Frontend --> Visitor["Visitor"]
```

The frontend asks the API for the latest published portfolio data. It only uses safe defaults when a field is missing.

## Main features

- dark and light theme toggle
- smooth scrolling
- custom cursor
- command palette
- animated sections with Framer Motion
- SEO support with `react-helmet-async`
- content selectors, defaults, and validation helpers

## Local setup

Install dependencies:

```bash
npm install
```

Run the frontend in development:

```bash
npm run dev
```

Other scripts:

```bash
npm run build
npm run lint
npm run preview
```

## Environment variables

Create `frontend/.env`:

```env
VITE_API_BASE_URL=http://localhost:4174
```

## API dependency

The frontend reads the published portfolio from:

```text
GET /api/portfolio
```

Make sure the API is running before opening the public site.

## Current status

The public experience is already connected to the CMS-driven content flow. The remaining work is mostly about refinement and keeping the data model clean.

## Future goal

Keep the public site aligned with new CMS modules, including the inbox-related workflow when it is added later.
