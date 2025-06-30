# VoipFit - Premium Telecom Solutions

## Overview

VoipFit is a modern full-stack web application for a telecommunications company that provides premium telecom solutions including SMS, Voice, and Data services. The application serves as both a public-facing website and an administrative panel for content management.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter for client-side routing
- **Styling**: Tailwind CSS with Shadcn/ui component library
- **State Management**: TanStack React Query for server state
- **Build Tool**: Vite for fast development and optimized builds
- **Animations**: Framer Motion for smooth animations and transitions

### Backend Architecture
- **Runtime**: Node.js with Express.js
- **Language**: TypeScript with ES modules
- **Database**: PostgreSQL with Drizzle ORM
- **Database Provider**: Neon Database (serverless PostgreSQL)
- **Authentication**: Session-based authentication with bcrypt password hashing
- **API Design**: RESTful API with JSON responses

### Key Components

#### Database Schema
The application uses five main tables:
- **site_content**: Dynamic content management (hero sections, about, stats)
- **contact_messages**: Contact form submissions with read status tracking
- **news_articles**: Blog/news system with publish status
- **services**: Service offerings with features and styling metadata
- **admin_users**: Administrative user accounts with encrypted passwords

#### Public Routes
- `/` - Home page with carousel, services, stats, about, news, and contact sections
- `/api/content/:key` - Dynamic content retrieval
- `/api/services` - Active services listing
- `/api/news` - Published news articles
- `/api/contact` - Contact form submission

#### Admin Routes
- `/admin` - Administrative dashboard with authentication
- `/api/admin/*` - Protected admin endpoints for content management

#### Content Management System
- Dynamic content editing for hero sections, about page, and statistics
- News article creation and management with publish controls
- Service management with customizable features and styling
- Contact message inbox with read/unread status
- Real-time content updates without page refresh

## Data Flow

1. **Public Website**: Users browse services, read news, view company information, and submit contact forms
2. **Content Delivery**: Dynamic content is fetched from the database and rendered with React Query caching
3. **Admin Authentication**: Administrators log in with username/password to access the admin panel
4. **Content Management**: Admins can create, edit, and delete content through the administrative interface
5. **Real-time Updates**: Changes made in the admin panel are immediately reflected on the public website

## External Dependencies

### Core Dependencies
- **@neondatabase/serverless**: Serverless PostgreSQL database connection
- **drizzle-orm**: Type-safe SQL query builder and ORM
- **@tanstack/react-query**: Server state management and caching
- **framer-motion**: Animation library for smooth UI transitions
- **bcrypt**: Password hashing for secure authentication
- **wouter**: Lightweight client-side routing

### UI Components
- **@radix-ui/***: Accessible headless UI components
- **tailwindcss**: Utility-first CSS framework
- **lucide-react**: Icon library
- **shadcn/ui**: Pre-built component library

### Development Tools
- **vite**: Fast build tool and development server
- **typescript**: Type safety and better developer experience
- **tsx**: TypeScript execution for Node.js

## Deployment Strategy

### Development Environment
- **Runtime**: Node.js 20
- **Database**: PostgreSQL 16
- **Development Server**: Vite dev server with HMR
- **Port Configuration**: Frontend on port 5000, mapped to external port 80

### Production Build
- **Frontend**: Vite builds optimized static assets to `dist/public`
- **Backend**: esbuild bundles server code to `dist/index.js`
- **Database**: Drizzle migrations manage schema changes
- **Deployment**: Autoscale deployment target on Replit

### Database Management
- **Migrations**: Stored in `./migrations` directory
- **Schema**: Defined in `shared/schema.ts` for type safety
- **Environment**: Requires `DATABASE_URL` environment variable

## Changelog

```
Changelog:
- June 25, 2025. Initial setup
```

## User Preferences

```
Preferred communication style: Simple, everyday language.
```