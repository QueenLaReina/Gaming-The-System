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

Community comments on game detail pages are shared publicly and stored in PostgreSQL. Configure `DATABASE_URL` on the server, then apply the schema migration from `gaming_hub/nextjs_space`:

```powershell
npx prisma migrate deploy
npx prisma generate
```

The comment API validates names and comment lengths. Do not post personal or sensitive information; comments are visible to all visitors.

Catalog records use an ISO first-release `releaseDate` (`YYYY-MM-DD`) for the 28-day New Releases row and an explicit `isPopular` flag for the curated Popular Games row. When adding an audited game, enter its verified release date and choose whether it belongs in Popular Games. Keep platform and genre lists synchronized between `public/gaming-hub.html` and `public/game-details-data.js`. ESRB badges use official rating icon images; only add an ESRB code when it has been verified, and leave it blank when unknown.

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
| `gaming_hub/nextjs_space/public/gaming-hub.html` | Catalog interface, filters, ESRB rating browse mode, search, and vision-audit UI |
| `gaming_hub/nextjs_space/public/game.html` | Game synopses, ESRB ratings, public opinions, hardware links, and community comments |
| `gaming_hub/nextjs_space/public/game-details-data.js` | Curated game platforms, genres, ratings, release dates, synopses, and opinions |
| `gaming_hub/nextjs_space/app/api/game-comments/` | Shared community comment API |
| `gaming_hub/nextjs_space/app/api/vision/` | Server-side endpoint for screenshot vision audits |
| `community-sprint-starter-live/` | Separate community-resource starter project |
| `Uploads/` | Uploaded project assets |
