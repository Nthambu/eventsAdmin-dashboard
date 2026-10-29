# EventHub Admin Dashboard

A server-side rendered Angular admin panel for managing events, ticket types, and orders. Built with Angular 20 SSR, PrimeNG, and Cloudinary for image uploads.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Angular 20 (SSR / Universal) |
| UI Components | PrimeNG 20, Bootstrap 5, Bootstrap Icons |
| Notifications | ngx-toastr |
| Image Uploads | Cloudinary (unsigned preset) |
| Auth | JWT via OTP two-step login |
| HTTP | Angular HttpClient with interceptor |
| Deployment | Render.com |

---

## Features

- **Two-step login** — email/password triggers an OTP sent to email; OTP verified before access is granted
- **JWT session guard** — all protected routes check for a valid token in `localStorage`; expired/invalid tokens redirect to login automatically
- **Dashboard** — overview cards showing revenue, tickets sold, paid orders, and active events
- **Events management** — full CRUD table: create, edit, toggle active/inactive, and delete events
- **Poster uploads** — drag-and-drop style file picker uploads directly to Cloudinary; returns a `secure_url` stored as `image_url`
- **Ticket types** — each event supports multiple ticket tiers with name, price (KES), available quantity, and description
- **SSR-safe** — all `localStorage` access is guarded with `isPlatformBrowser` to prevent server-side crashes

---

## Project Structure

```
src/
├── app/
│   ├── components/
│   │   ├── login/          # Login + OTP verification form
│   │   └── dashboard/      # Main admin panel (dashboard, events, orders views)
│   ├── services/
│   │   ├── auth.ts                      # Login, verifyOtp, token management
│   │   ├── events-service.ts            # getEvents, createEvent, updateEvent, deleteEvent
│   │   └── cloudinary-upload.service.ts # Direct browser-to-Cloudinary upload
│   ├── data/
│   │   └── eventsDTO.dto.ts             # TypeScript interfaces for API payloads
│   ├── environments/
│   │   ├── environment.ts               # Dev config (localhost:3000)
│   │   └── environment.prod.ts          # Prod config (Render backend URL)
│   ├── admin.guard.ts                   # CanActivate route guard
│   └── auth.interceptot.ts              # Attaches Bearer token; handles 401 logout
```

---

## Getting Started

### Prerequisites

- Node.js 20+
- Angular CLI 20 (`npm install -g @angular/cli@20.3.34`)

### Installation

```bash
npm install
```

### Development

```bash
ng serve
```

Runs at `http://localhost:4200`. The dev build proxies API calls to `http://localhost:3000` — make sure the backend is running locally.

### Production Build

```bash
ng build
```

Output goes to `dist/admin-dashboard/`. The build uses `environment.prod.ts` automatically via the `fileReplacements` config in `angular.json`.

---

## Environment Configuration

The app reads from `src/app/environments/environment.ts` (dev) and `environment.prod.ts` (prod). Angular swaps the file at build time — **never import `environment.prod.ts` directly in services**.

| Key | Description |
|---|---|
| `baseUrl` | Backend API base URL |
| `cloudinary.cloudName` | Your Cloudinary cloud name |
| `cloudinary.uploadPreset` | Unsigned upload preset name |

---

## Backend API

This dashboard consumes the [madfuns-backend](https://github.com/Nthambu/madfuns_backend) NestJS API.

### Auth endpoints

| Method | Path | Description |
|---|---|---|
| POST | `/user/login` | Email + password — triggers OTP |
| POST | `/user/verify` | Email + OTP — returns `accessToken` |

### Events endpoints (JWT required)

| Method | Path | Description |
|---|---|---|
| GET | `/events` | List all events |
| POST | `/events` | Create a new event |
| PATCH | `/events/:id` | Update event fields (partial) |
| DELETE | `/events/:id` | Soft-delete an event |

---

## Deployment (Render.com)

The project deploys as a Node.js SSR server on Render.

**Build command:**
```
npm install && ng build
```

**Start command:**
```
node dist/admin-dashboard/server/server.mjs
```

**Environment variables to set on Render:**

None required on the frontend — the backend URL and Cloudinary config are baked into the build via `environment.prod.ts`.

> Ensure your backend (`madfuns-backend`) has `JWT_SECRET` set as an environment variable on its own Render service. A mismatch between the secret used to sign and verify tokens is the most common cause of unexpected 401 logouts.

---

## Known Gotchas

- **All Angular packages must be on the same exact version.** The `package.json` pins all `@angular/*` packages to `20.3.34` to avoid peer dependency conflicts on Render's clean install environment.
- **Cloudinary uploads bypass the auth interceptor.** Requests to `cloudinary.com` are explicitly excluded from `Authorization` header injection — Cloudinary's CORS policy rejects that header.
- **SSR and localStorage.** Any direct `localStorage` access must be wrapped with `isPlatformBrowser()` from `@angular/common`. The `Auth` service handles this for token storage.
