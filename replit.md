# Taste Trek

## Overview

Taste Trek is a full-stack travel and food discovery application that allows users to explore countries, destinations, restaurants, and cultural sites around the world. Users can browse curated travel content, search for destinations, and save favorites to plan their trips. The application features a modern React frontend with an Express backend, using PostgreSQL for data persistence.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: TanStack React Query for server state and caching
- **Styling**: Tailwind CSS with custom CSS variables for theming
- **UI Components**: shadcn/ui component library with Radix UI primitives
- **Animations**: Framer Motion for page transitions and micro-interactions
- **Build Tool**: Vite with hot module replacement

### Backend Architecture
- **Framework**: Express.js with TypeScript
- **API Design**: RESTful endpoints defined in `shared/routes.ts` with Zod schemas for validation
- **Database ORM**: Drizzle ORM with PostgreSQL dialect
- **Session Management**: express-session with connect-pg-simple for PostgreSQL session storage
- **Authentication**: Replit Auth integration using OpenID Connect (OIDC)

### Data Storage
- **Database**: PostgreSQL (configured via DATABASE_URL environment variable)
- **Schema Location**: `shared/schema.ts` defines all database tables using Drizzle
- **Migrations**: Drizzle Kit for database migrations (output to `./migrations`)
- **Tables**: countries, destinations, restaurants, cultural_sites, favorites, users, sessions

### Authentication
- Replit Auth via OpenID Connect
- Session-based authentication stored in PostgreSQL
- Protected routes use `isAuthenticated` middleware
- User data synchronized on login via upsert pattern

### Project Structure
```
├── client/           # React frontend
│   └── src/
│       ├── components/  # UI components
│       ├── hooks/       # Custom React hooks
│       ├── pages/       # Route components
│       └── lib/         # Utilities
├── server/           # Express backend
│   └── replit_integrations/  # Auth integration
├── shared/           # Shared types and schemas
│   ├── schema.ts     # Database schema
│   ├── routes.ts     # API route definitions
│   └── models/       # Auth models
└── migrations/       # Database migrations
```

### Build System
- Development: `tsx` for TypeScript execution with Vite dev server
- Production: Custom build script using esbuild for server, Vite for client
- Output: `dist/` directory with bundled server (`index.cjs`) and static files (`public/`)

## External Dependencies

### Database
- **PostgreSQL**: Primary database, connection via `DATABASE_URL` environment variable
- **Drizzle ORM**: Database queries and schema management
- **connect-pg-simple**: Session storage in PostgreSQL

### Authentication
- **Replit Auth**: OIDC-based authentication
- **Passport.js**: Authentication middleware with openid-client strategy
- **express-session**: Session management

### Frontend Libraries
- **@tanstack/react-query**: Data fetching and caching
- **@radix-ui/***: Accessible UI primitives
- **framer-motion**: Animation library
- **embla-carousel-react**: Carousel component
- **wouter**: Client-side routing
- **zod**: Runtime type validation

### Development Tools
- **Vite**: Frontend build tool with HMR
- **esbuild**: Server bundling
- **TypeScript**: Type safety across the stack
- **Tailwind CSS**: Utility-first styling