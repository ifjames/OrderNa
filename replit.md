# OrderNa - Food Ordering System

## Overview

OrderNa is a comprehensive web-based and mobile-responsive food ordering system designed for University of Batangas canteens. The system allows students to browse menus, place orders in advance, and pick up their food using QR codes, significantly reducing wait times and improving the overall dining experience.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite for fast development and optimized builds
- **Styling**: Tailwind CSS with shadcn/ui components for consistent design
- **State Management**: TanStack Query for server state and local React state for UI
- **Routing**: Wouter for lightweight client-side routing
- **UI Components**: Radix UI primitives with custom styling

### Backend Architecture
- **Runtime**: Node.js with Express.js server
- **Database**: PostgreSQL with Drizzle ORM for type-safe database operations
- **Authentication**: Firebase Auth with Google OAuth integration
- **Real-time Features**: Firebase Firestore for live order updates
- **API Design**: RESTful endpoints with proper error handling

### Database Schema
The system uses a PostgreSQL database with the following key tables:
- **users**: Store user information (students, staff, admin) with Firebase UID mapping
- **menuItems**: Store food items with pricing, categories, and availability
- **orders**: Store order details with status tracking and QR codes
- **orderItems**: Junction table for order line items

## Key Components

### Authentication System
- Firebase Auth integration for secure user management
- Google OAuth for seamless login experience
- Role-based access control (student, staff, admin)
- Automatic user profile creation and management

### Menu Management
- Dynamic menu display with category filtering
- Search functionality for easy item discovery
- Real-time availability updates
- Image support for visual menu presentation

### Order Processing
- Shopping cart functionality with quantity management
- Order scheduling with pickup time selection
- QR code generation for order verification
- Real-time order status tracking

### Staff Dashboard
- Live order queue management
- QR code scanning for order fulfillment
- Order status updates (pending, preparing, ready, completed)
- Quick order lookup and management tools

### Admin Panel
- Menu item management (CRUD operations)
- User role management
- Order analytics and reporting
- System configuration options

## Data Flow

1. **User Authentication**: Users sign in with Google OAuth through Firebase Auth
2. **Menu Browsing**: Frontend fetches menu items from Firestore with real-time updates
3. **Order Placement**: Users add items to cart and submit orders with payment simulation
4. **QR Generation**: System generates unique QR codes for each order
5. **Staff Processing**: Kitchen staff receive orders in real-time queue
6. **Order Fulfillment**: Staff scan QR codes to complete orders
7. **Status Updates**: Real-time status updates flow back to users

## External Dependencies

### Core Dependencies
- **Firebase Suite**: Authentication, Firestore database, and real-time features
- **Drizzle ORM**: Type-safe database operations with PostgreSQL
- **Neon Database**: Serverless PostgreSQL hosting
- **TanStack Query**: Server state management and caching

### UI/UX Libraries
- **Radix UI**: Accessible component primitives
- **Tailwind CSS**: Utility-first CSS framework
- **Lucide React**: Icon library
- **QRCode.js**: QR code generation

### Development Tools
- **TypeScript**: Type safety across the entire application
- **Vite**: Fast build tool with HMR
- **ESBuild**: Fast JavaScript bundler for production

## Deployment Strategy

### Development Environment
- Local development with Vite dev server
- Hot module replacement for fast iteration
- TypeScript compilation checking
- Database migrations with Drizzle Kit

### Production Build
- Vite builds optimized frontend assets
- ESBuild bundles Node.js server code
- Static assets served from `/dist/public`
- Express server serves both API and frontend

### Database Management
- Drizzle migrations for schema changes
- Connection pooling for performance
- Environment-based configuration
- Backup and recovery procedures

### Architecture Decisions

#### Database Choice: PostgreSQL with Drizzle
- **Problem**: Need for type-safe database operations with complex relationships
- **Solution**: PostgreSQL provides ACID compliance and complex query support, while Drizzle offers TypeScript integration
- **Alternatives**: MongoDB with Mongoose, Prisma ORM
- **Pros**: Type safety, SQL flexibility, excellent tooling
- **Cons**: More complex setup than NoSQL alternatives

#### Authentication: Firebase Auth
- **Problem**: Secure user authentication with social login support
- **Solution**: Firebase Auth provides Google OAuth integration and secure token management
- **Alternatives**: Auth0, AWS Cognito, custom JWT implementation
- **Pros**: Easy Google integration, secure by default, scalable
- **Cons**: Vendor lock-in, requires internet connectivity

#### Real-time Updates: Firebase Firestore
- **Problem**: Live order updates between users and staff
- **Solution**: Firestore provides real-time subscriptions with offline support
- **Alternatives**: WebSockets, Server-Sent Events, Socket.io
- **Pros**: Built-in offline support, automatic scaling, simple API
- **Cons**: Cost at scale, limited query capabilities

#### Frontend Framework: React with TypeScript
- **Problem**: Need for maintainable, scalable user interface
- **Solution**: React provides component reusability, TypeScript adds type safety
- **Alternatives**: Vue.js, Svelte, vanilla JavaScript
- **Pros**: Large ecosystem, excellent tooling, type safety
- **Cons**: Bundle size, learning curve for beginners

## Changelog

```
Changelog:
- July 01, 2025. Initial setup with modern red/maroon theme
- July 01, 2025. Enhanced UI with liquid glass morphism effects
- July 01, 2025. Updated all components with modern design elements
- July 01, 2025. Added enhanced animations and transitions
- July 01, 2025. Implemented gradient backgrounds and floating actions
- July 01, 2025. Migrated from Replit Agent to Replit environment
- July 01, 2025. Integrated Firebase Firestore database replacing PostgreSQL
- July 01, 2025. Updated authentication system with required phone numbers and student IDs
- July 01, 2025. Removed role selection from registration (defaults to student)
- July 01, 2025. Added Terms of Service page with navigation
- July 01, 2025. Enhanced Menu page with scrollable layout for mobile compatibility
- July 01, 2025. Applied comprehensive red/maroon theme throughout the application
- July 01, 2025. Successfully migrated from Replit Agent to Replit environment
- July 01, 2025. Updated Firebase configuration with permanent API keys for ordernaub project
- July 01, 2025. Fixed Firebase duplicate app initialization issue for stable operation
- July 01, 2025. Redesigned Home page as Grab/FoodPanda-style dashboard with user greeting
- July 01, 2025. Fixed navbar spacing issues and added cart icon with item count
- July 01, 2025. Added Profile page with red/maroon theming and proper logo integration
- July 01, 2025. Implemented canteen/brand selection functionality in Menu page
- July 01, 2025. Added mobile-responsive scrolling containers for menu items (max 4 visible)
- July 01, 2025. Fixed logout functionality to redirect to landing page properly
- July 01, 2025. Applied comprehensive red/maroon theme across all pages for brand consistency
- July 03, 2025. Successfully migrated from Replit Agent to standard Replit environment
- July 03, 2025. Fixed routing structure to prevent 404 errors and navigation conflicts
- July 03, 2025. Added functional notification bell with dropdown menu in navigation bar
- July 03, 2025. Removed duplicate notification and profile icons from Home page header
- July 03, 2025. Fixed login redirect to use root path for proper routing after authentication
- July 03, 2025. Redesigned Menu page with proper stall selection flow - users must choose canteen first
- July 03, 2025. Removed redundant canteens section near categories since stall selection handles this
- July 03, 2025. Expanded menu items significantly: 40+ items across 4 canteens with authentic Filipino cuisine
- July 03, 2025. Added availability display ("X available tomorrow") to menu items matching home page format
```

## User Preferences

```
Preferred communication style: Simple, everyday language.
```