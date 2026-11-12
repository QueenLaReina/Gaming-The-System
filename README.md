# Gaming The System

Gaming The System is an accessible gaming hub for exploring verified motor-accessibility features and adaptive-controller compatibility.

## Features

- Browse games in curated collections or by genre.
- Save favorite games in the current browser.
- Search by game title, genre, or platform, with matching autocomplete suggestions.
- Filter by controller remapping, input alternatives, camera assistance, game-speed controls, and adaptive hardware compatibility.
- Upload a game screenshot for an AI-assisted accessibility audit.

## Run locally

Requirements: Node.js 20.9 or later and npm.

From the repository root:

```powershell
cd gaming_hub\nextjs_space
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). The Next.js home page displays the accessible gaming hub at `public/gaming-hub.html`.

## Configuration

The core catalog works without API credentials. The screenshot vision audit requires the server-side `ABACUSAI_API_KEY`. To enable it locally, create `gaming_hub/nextjs_space/.env` and add:

```dotenv
ABACUSAI_API_KEY=your-server-side-api-key
```

Keep credentials private; `.env` is ignored by Git. Do not put secret keys in browser code or commit them.

`NEXTAUTH_URL` can optionally be set to the site's public base URL for metadata. The Prisma schema uses PostgreSQL and expects `DATABASE_URL` when database-backed Prisma commands are used.

## Available scripts

Run these from `gaming_hub/nextjs_space`:

| Command | Description |
| --- | --- |
| `npm run dev` | Start the development server |
| `npm run build` | Create a production build |
| `npm run start` | Start the production server |
| `npm run lint` | Run ESLint |

## Repository layout

| Path | Description |
| --- | --- |
| `gaming_hub/nextjs_space/` | Main Next.js application and accessible gaming catalog |
| `gaming_hub/nextjs_space/public/gaming-hub.html` | Catalog interface, filters, browse modes, search, and vision-audit UI |
| `gaming_hub/nextjs_space/app/api/vision/` | Server-side endpoint for screenshot vision audits |
| `community-sprint-starter-live/` | Separate community-resource starter project |
| `Uploads/` | Uploaded project assets |
