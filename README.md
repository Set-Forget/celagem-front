# Celagem Portal Frontend

This repository contains the Next.js application for the Celagem portal. The project uses the App Router with TypeScript and integrates several business modules such as commercial management, accounting, inventory and medical management.

## Features

- **Authentication middleware** that verifies a `sessionToken` cookie before allowing access to private routes【F:middleware.ts†L1-L23】.
- **Redux Toolkit store** with RTK Query and multiple API slices defined under `lib/apis` and `lib/services`【F:store.ts†L1-L29】.
- **API rewrites** configured to proxy requests to backend services using environment variables【F:next.config.mjs†L18-L44】.
- **Tailwind CSS** with a custom theme and Shadcn UI components【F:tailwind.config.ts†L1-L23】.
- **PDF utilities** and other React components under the `components` directory.

## Getting Started

Install dependencies and run the development server:

```bash
npm install
npm run dev
```

To create a production build:

```bash
npm run build
npm run start
```

Run tests with Vitest:

```bash
npm test
```

## Environment Variables

Create a `.env` file (or set environment variables) with the following values:

```env
NEXT_PUBLIC_ERP_URL=<ERP base url>
NEXT_PUBLIC_HC_URL=<HC base url>
NEXT_PUBLIC_USERS_URL=<Users base url>
GOOGLE_PLACES_API=<Google Places API key>
NEXT_PUBLIC_BASE_URL=<Site base url>
```

## Project Structure

- `app/` – public routes live under `(public)` and authenticated routes under `(private)`.
- `components/` – shared UI components and widgets.
- `lib/apis/` and `lib/services/` – RTK Query API definitions and domain services.
- `store.ts` – Redux store configuration.
- `middleware.ts` – authentication middleware logic.
- `tailwind.config.ts` – Tailwind CSS setup.

---

This project was bootstrapped with Next.js and uses React 19. Refer to `package.json` for the complete list of dependencies and scripts【F:package.json†L1-L94】.
