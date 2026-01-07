# Chiron Event Services 🏃‍♂️

A **web-only** platform for hosting start lists and race results for endurance events managed through the [Chiron](https://www.chironapp.com) training application.

## About This Project

This project is specifically designed to complement the Chiron ecosystem by providing a public-facing web interface where:

- Athletes can find and browse upcoming events
- Event organizers can showcase their race portfolio
- Race results and timing data are displayed (coming soon)
- Public can discover endurance events and racing opportunities

**Web Platform Only**: This application is built exclusively for web deployment and is not intended for mobile app stores.

## Key Features

- **📱 Responsive Design** - Optimized for all screen sizes with mobile-first approach
- **🌓 Dark/Light Theme** - Automatic theme switching with user preference support
- **🔍 Advanced Search** - Real-time search with pagination and sorting
- **📊 Data Management** - Professional data display with loading states and error handling
- **🏃‍♂️ Race Discovery** - Browse events and organizers with detailed information
- **⚡ Fast Performance** - Static site generation with efficient data loading

## Open Source & Race Timing Community

Feel free to use some or all of this code for your own race timing projects! The components and architecture patterns here can be adapted for various endurance sports timing applications.

### Key Reusable Components:

- **UI Components**: `SearchInput`, `ToggleSwitch`, `NoResultsFound`, `MaxWidthContainer`
- **Navigation**: `TopNav` with responsive navigation and theme support, `OrganiserTopNav` for organiser pages, `EventTopNav` for event detail pages
- **Data Management**: Custom hooks (`useOrganisers`) with pagination and search
- **API Layer**: Modular API functions that can be swapped with any backend
- **Theme System**: Complete dark/light mode with consistent color schemes
- **Layout System**: Responsive grid layouts and card-based designs

## Type Synchronization from Main Repository

⚠️ **Important**: The following files are automatically synchronized from the main chironapp repository and should **NOT** be modified directly in this repository. Any local changes will be overwritten.

### Auto-Synced Files

These files are automatically updated via GitHub Actions when changes are pushed to the `staging` branch of the main repository:

#### Database Types

- `types/supabase.ts` - Database schema types (8 tables)
  - Contains: `organisers`, `public_race_events`, `race_athlete_categories`, `race_athlete_category_collections`, `race_start_list_results`, `race_teams`, `public_race_event_series`, `series_participant`, `series_standings_scoring_config`
  - **DO NOT EDIT**: This file is auto-generated from the main repository's database schema

#### Race-Related Types

- `types/race.ts` - Race entity type definitions

  - Contains: Race status, types, sport types, and related interfaces
  - **DO NOT EDIT**: Import paths are automatically updated during sync

- `types/raceSeries.ts` - Race series type definitions
  - Contains: Series participant types, scoring methods, aggregation methods
  - **DO NOT EDIT**: Synced from main repository

#### Constants

- `constants/raceTypes.ts` - Race constants and enums

  - Contains: Race statuses, race types, sport types, age categories
  - **DO NOT EDIT**: Shared constants from main repository

- `constants/sex.ts` - Sex/gender category constants
  - Contains: Sex category IDs, labels, display utilities, and validation logic
  - **DO NOT EDIT**: Shared constants from main repository

#### API Functions

- `api/raceOrganiserEventsPublic.ts` - Public race organiser event queries

  - Contains: Functions for fetching organiser events with filtering and pagination
  - **DO NOT EDIT**: Synced from main repository

- `api/raceOrganisersPublic.ts` - Public race organiser queries

  - Contains: Functions for fetching organiser data
  - **DO NOT EDIT**: Synced from main repository

- `api/raceSeriesPublic.ts` - Public race series queries

  - Contains: Functions for fetching series data, events, and standings
  - **DO NOT EDIT**: Synced from main repository

- `api/startListEntriesPublic.ts` - Public start list entry queries
  - Contains: Functions for fetching race start list and result data
  - **DO NOT EDIT**: Synced from main repository

### Sync Triggers

Files are automatically synchronized when:

- Changes are pushed to `staging` branch in main repository
- Changes are detected in any of the tracked files above
- Manual workflow trigger via GitHub Actions

### Making Changes

If you need to modify any of these files:

1. Make changes in the **main chironapp repository**
2. Push to `staging` branch - changes will auto-sync to this repository
3. **Never edit directly** in `chiron-event-services` - changes will be lost

### Workflow Details

- **Source Repository**: `chironapp/chironapp`
- **Sync Workflow**: `sync-types-to-event-services.yml`
- **Target Branch**: Current branch in chiron-event-services
- **Sync Method**: Selective table extraction + import path updates

💡 **Need database schema changes?** Make them in the main repository and they'll automatically sync here within minutes of pushing to staging.

## Get Started

1. Install dependencies

   ```bash
   npm install
   ```

2. Set up environment variables

   ```bash
   cp .env.example .env.local
   ```

   Edit `.env.local` and add your Supabase project credentials:

   - `EXPO_PUBLIC_SUPABASE_URL` - Your Supabase project URL
   - `EXPO_PUBLIC_SUPABASE_ANON_KEY` - Your Supabase anon/public key

3. Start the web development server

   ```bash
   npm run web
   ```

4. Open your browser to view the application

This project uses [Expo Router](https://docs.expo.dev/router/introduction) for file-based routing and is optimized for web deployment.

## Backend & Database

### Supabase Integration (Default)

This project uses **[Supabase](https://supabase.com)** as the default backend with **anonymous-only access**, providing:

- **PostgreSQL Database** - Relational database with full-text search
- **Anonymous Access Only** - Optimized for public data without authentication overhead
- **Row Level Security** - Controls public data access and permissions
- **Auto-generated Types** - TypeScript types from database schema
- **Database Health Monitoring** - Connection testing and statistics

#### Key Database Tables:

- `organisers` - Event organizer profiles and details
- `public_race_events` - Race event information and metadata
- `race_athlete_categories` - Age/gender category definitions
- `race_athlete_category_collections` - Category groupings and collections

### Flexible Backend Architecture

**The API layer is completely modular** - you can easily swap Supabase for any backend:

```typescript
// Current Supabase implementation in /api/organisers.ts
export async function fetchOrganisers(params) {
  const { data, error } = await supabase.from("organisers").select("*");
  // ... pagination logic
}

// Swap with your own backend:
export async function fetchOrganisers(params) {
  const response = await fetch("/api/organisers", {
    method: "POST",
    body: JSON.stringify(params),
  });
  return response.json();
}
```

The React components and hooks remain unchanged when switching backends.

## Project Structure

```
/api                    # Backend integration layer
├── organisers.ts      # Organiser data fetching with pagination
└── README.md          # API documentation and usage examples

/app                    # Expo Router pages (file-based routing)
├── index.tsx          # Find Your Race (home page)
├── organisers.tsx     # Browse Race Organisers page
├── about.tsx          # About Chiron Event Services
└── _layout.tsx        # Root layout configuration

/components            # Reusable UI components
├── /input             # Form components (SearchInput, ToggleSwitch)
├── /ui                # Display components (NoResultsFound, MaxWidthContainer)
├── TopNav.tsx         # Navigation header with theme support
└── Footer.tsx         # Site footer with links

/hooks                 # Custom React hooks
├── useOrganisers.ts   # Data fetching with pagination and search
├── useSupabase.ts     # Supabase integration hooks
└── use-*.ts           # Theme and utility hooks

/lib                   # Core utilities and configuration
├── supabase.ts        # Supabase client (web-optimized)
└── utils/             # Helper functions

/types                 # TypeScript type definitions
├── supabase.ts        # Auto-generated database types
├── race.ts            # Race and event type definitions
└── *.ts               # Additional type definitions

/constants             # Configuration and constants
├── theme.ts           # Color system and styling
├── raceTypes.ts       # Race type definitions
└── urls.ts            # External links and URLs

/docs                  # Documentation
└── supabase.md        # Supabase setup and usage guide
```

## Technology Stack

### Frontend

- **[Expo](https://expo.dev)** - React Native for web platform with static export
- **[Expo Router](https://docs.expo.dev/router/)** - File-based routing system
- **[TypeScript](https://www.typescriptlang.org/)** - Type safety and development experience
- **[React Native Web](https://necolas.github.io/react-native-web/)** - Cross-platform component system

### Backend & Data

- **[Supabase](https://supabase.com)** - PostgreSQL database with anonymous-only access
- **Custom API Layer** - Modular functions that work with any backend
- **Type Generation** - Automatic TypeScript types from database schema
- **Pagination & Search** - Efficient data loading with filtering capabilities
- **Database Monitoring** - Health checks and connection status tracking

### Development & Deployment

- **GitHub Actions** - Automated deployment to GitHub Pages
- **Environment Variables** - Secure configuration management
- **Static Site Generation** - Fast loading and SEO optimization
- **Responsive Design** - Mobile-first approach with theme support

## Deployment

This project is designed for static web hosting and can be deployed to platforms like:

- Vercel
- Netlify
- GitHub Pages
- Any static hosting service

Build for production:

```bash
npx expo export -p web
```

## SEO & Sitemap

### Dynamic SEO Meta Tags

All dynamic pages have SEO-friendly meta tags set based on page context using the `<Head>` component from `/components/utils/Head.tsx`:

- **Event Pages** (`/events/[eventId]`) - Dynamic title, description, and social sharing metadata based on event details
- **Organiser Pages** (`/organisers/[organiserId]`) - Dynamic title, description, and social sharing metadata based on organiser details

### Sitemap Generation

The sitemap is automatically generated at build time and includes URLs for:

- Static pages (home, about, organisers)
- All event pages (`/events/[eventId]`)
- All organiser pages (`/organisers/[organiserId]`)

Individual and team result pages are intentionally excluded from the sitemap.

#### Generating the Sitemap

The sitemap is generated automatically during the CI/CD build process. To generate it manually:

```bash
# Ensure environment variables are set
export EXPO_PUBLIC_SUPABASE_URL=your-supabase-url
export EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# Generate sitemap
npm run generate-sitemap
```

The sitemap is output to `dist/sitemap.xml` and will be available at `https://events.chironapp.com/sitemap.xml`.

## API Integration & Backend Flexibility

### Using with Different Backends

The API layer is designed to be backend-agnostic. To use with your own backend:

1. **Keep the React components unchanged** - They only depend on the API contracts
2. **Replace API functions** in `/api/` folder to match your backend
3. **Update types** in `/types/` to match your data structure
4. **Modify environment variables** as needed for your backend

### Example: REST API Integration

```typescript
// Replace /api/organisers.ts with your REST API:
export async function fetchOrganisers(params: FetchOrganisersParams) {
  const queryString = new URLSearchParams({
    page: params.page.toString(),
    limit: params.limit.toString(),
    search: params.search || "",
    sortBy: params.sortBy || "name",
    sortOrder: params.sortOrder || "asc",
  });

  const response = await fetch(`/api/organisers?${queryString}`);
  return response.json(); // Should match FetchOrganisersResponse interface
}
```

### Example: GraphQL Integration

```typescript
// Replace with GraphQL client:
export async function fetchOrganisers(params: FetchOrganisersParams) {
  const { data } = await apolloClient.query({
    query: GET_ORGANISERS,
    variables: params,
  });

  return {
    data: data.organisers,
    count: data.organisersCount,
    // ... map to expected response format
  };
}
```

## Contributing to Race Timing Projects

If you're building your own race timing solution, this project provides:

- **📐 Professional Design System** - Consistent UI components and theming
- **🔍 Advanced Search & Filtering** - Real-time search with pagination
- **📱 Responsive Architecture** - Mobile-first design patterns
- **🎨 Theme Support** - Complete dark/light mode implementation
- **🔧 Modular API Layer** - Easy backend integration patterns
- **⚡ Performance Optimization** - Loading states, error handling, caching strategies
- **🚀 Deployment Ready** - GitHub Actions workflow for static hosting

## Key Pages & Features

### 🏠 Home Page (`/`)

- Event discovery and search functionality
- Toggle between results and upcoming events
- Responsive design with theme support

### 🏃‍♂️ Organisers Page (`/organisers`)

- Browse race organisers with pagination
- Advanced search and sorting capabilities
- Professional card-based layout
- Real-time filtering and data management

### ℹ️ About Page (`/about`)

- Information about Chiron Event Services
- Links to main Chiron platform
- Company and project details

## Documentation

- **[API Documentation](/api/README.md)** - Complete API reference and examples
- **[Supabase Setup](/docs/supabase.md)** - Database configuration and security
- **[Expo Documentation](https://docs.expo.dev/)** - Framework and deployment guides
- **[Chiron Platform](https://www.chironapp.com)** - Main endurance training application

## License & Usage

This project is open source and available for use in race timing and endurance sports applications. The modular architecture makes it easy to adapt for different sports, regions, and backend systems.

**Perfect for:**

- Race timing companies looking for a public-facing interface
- Running clubs wanting to showcase their events
- Event management platforms needing a discovery interface
- Developers learning modern React Native Web patterns
