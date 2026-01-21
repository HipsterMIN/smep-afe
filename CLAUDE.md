# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is **SMEP AFE** (중소통합 관리자 플랫폼) - a React-based admin platform built with Vite for managing various government services including business information, certifications, surveys, notifications, and user management.

## Build & Development Commands

### Development
```bash
npm run dev              # Start local dev server (uses localhost mode)
```

### Building
```bash
npm run build:local      # Build for localhost environment
npm run build:dev        # Build for development environment
npm run build:prod       # Build for production environment
npm run build            # Alias for build:dev
```

### Testing
```bash
npm test                 # Run tests with Vitest
npm run test:ui          # Open Vitest UI
npm run test:coverage    # Generate test coverage report
```

### Code Quality
```bash
npm run lint             # Run ESLint (check only)
npm run lint:fix         # Run ESLint and auto-fix issues
npm run format           # Format code with Prettier
```

### Preview
```bash
npm run preview          # Preview production build locally
```

## Environment Configuration

This project uses Vite's environment variables with mode-based configuration:

- **localhost mode**: `.env.localhost` - Local development (base: `/admin-dev/`)
- **development mode**: `.env.development` - Dev server deployment (base: `/admin-dev/`)
- **production mode**: `.env.production` - Production deployment (base: `/admin/`)

Environment variables must be prefixed with `VITE_` to be exposed to the client. See `.env.example` for reference.

## Architecture

### Routing Strategy

The app uses two distinct routing systems:

1. **Main Admin Routes** (`src/routes/index.jsx`):
   - Static routes defined for core admin features
   - Uses React Router's `createBrowserRouter` with dynamic `basename` from Vite's `BASE_URL`
   - Layout: `Admin.jsx` → `Header` + `Layout` (Leftbar + Outlet)
   - Examples: `/common-code`, `/auth-mgmt`, `/menu-mgmt`, `/board-mgmt`

2. **Auto-Generated Publishing Routes** (`src/routes/autoRoutes.jsx`):
   - Automatically generates routes from all `.jsx` files in `src/publishing/`
   - File names are converted to URL-safe paths (e.g., `UI-ADM-L-431-공통코드관리.jsx` → `/UI-ADM-L-431-공통코드관리`)
   - Lazy-loaded with `React.lazy()` and `Suspense`
   - Nested under `/publishing` route with `PublishingMain.jsx` layout
   - `PublishingMain.jsx` itself is excluded from auto-routing

### State Management

The project uses **Zustand** for global state:

- `src/store/useTabStore.js`: Tab management (open tabs, active tab, max limit 10)
- `src/store/useCounterStore.js`: Example counter store

Each store is a standalone file exporting a Zustand `create()` hook.

### Authentication

- `src/context/AuthContext.jsx`: Provides auth context via React Context API
- Currently uses mock authentication (development mode)
- Production: Should use HTTP-only cookies for tokens
- `src/lib/http.js`: Axios instance with `withCredentials: true` for session cookies (JSESSIONID)

### API Communication

- **HTTP Client**: `src/lib/http.js` - Pre-configured Axios instance
- Base URL set via `VITE_API_BASE_URL` environment variable
- Includes credentials for session-based auth
- Vite dev server proxies `/admin-dev/main-dev` and `/main-dev` to `localhost:8082`
- Proxy rewrites Set-Cookie Path headers for dev environment compatibility

### Component Structure

- `src/components/ui/`: Reusable UI components (Button, CheckBox, GridTable, Header, Leftbar, Popup, RichEditor, etc.)
- `src/components/custom/`: Custom grid cells (ButtonCell, etc.)
- `src/components/a11y/`: Accessibility components (SkipNav)
- `src/layouts/`: Layout wrappers (MainLayout)
- `src/pages/`: Page-level components (Login, LoginView)
- `src/publishing/`: Publishing team's standalone pages (auto-routed)
- `src/publishing/components/`: Shared components for publishing pages

### Key UI Components

- **GridTable** (`src/components/ui/GridTable.jsx`): Uses `@svar-ui/react-grid` (Willow theme) for data tables
- **RichEditor** (`src/components/ui/RichEditor.jsx`): TipTap-based WYSIWYG editor with table, image, YouTube, and text formatting support
- **FileUpload** (`src/components/ui/FileUpload.jsx`): File upload component with drag & drop

## Important Conventions

### ESLint Rules

The project enforces strict ESLint rules (`eslint.config.js`):

- **Accessibility**: WCAG 2.0 Level AA compliance required (using `eslint-plugin-jsx-a11y`)
  - Images must have `alt` text (error level)
  - Click handlers must have keyboard events (warning)
  - No autofocus (warning)
- **Security**:
  - `dangerouslySetInnerHTML` is forbidden (`react/no-danger`: error)
  - `target="_blank"` requires `rel="noopener noreferrer"` (error)
- **Code Style**:
  - 2-space indentation (enforced)
  - Import sorting enforced (`simple-import-sort`)
  - Prettier rules disabled to allow quote style flexibility
- **React**:
  - Unused variables with uppercase names (constants) are allowed
  - React Hooks rules enforced

### File Naming

- Publishing page files follow the pattern: `UI-ADM-{L|R|W|P}-{number}-{description}.jsx`
  - L: List view
  - R: Read/Detail view
  - W: Write/Create view
  - P: Popup/Modal view

### Accessibility Requirements

This is a public sector project requiring WCAG 2.0 Level AA compliance. All components must:
- Provide keyboard navigation support
- Include ARIA labels where appropriate
- Ensure sufficient color contrast
- Provide text alternatives for non-text content

### Path Aliasing

- Vitest is configured with `@` alias pointing to `src/` directory
- Use absolute imports where needed: `import Foo from '@/components/Foo'`

## Backend Integration

- Backend context path: `/main-dev` (development), `/main` (production)
- Frontend base path: `/admin-dev/` (development), `/admin/` (production)
- Local dev proxy rewrites `/admin-dev/main-dev` → `/main-dev` to backend at `localhost:8082`
- Session cookies use JSESSIONID (handled by backend)

## Testing

- Framework: Vitest with jsdom environment
- Test files: `src/components/__tests__/*.test.jsx`
- Coverage reports: text, JSON, and HTML formats
- Global test utilities available (configured in `vitest.config.js`)
