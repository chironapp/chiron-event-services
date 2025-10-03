# Supabase Configuration for Chiron Event Services

This document explains how to use the Supabase client in the chiron-event-services web application.

## Overview

The `/lib/supabase.ts` file provides a web-optimized Supabase client configuration for **anonymous-only access**:

- Optimized for public data access without authentication
- Disabled session management for improved performance
- Database health monitoring functions
- Type-safe exports for all database tables
- Helper functions for database connection testing

## Environment Setup

1. Copy the environment template:

   ```bash
   cp .env.example .env.local
   ```

2. Add your Supabase credentials to `.env.local`:
   ```env
   EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
   ```

## Usage Examples

### Basic Data Fetching

```typescript
import { supabase } from "../lib/supabase";

// Fetch race events
const { data, error } = await supabase
  .from("public_race_events")
  .select("*")
  .eq("race_status", "published")
  .limit(10);
```

### Using Type-Safe Helpers

```typescript
import { supabase, PublicRaceEvent, Organiser } from "../lib/supabase";

// Get typed data
const { data: events } = await supabase
  .from("public_race_events")
  .select("*")
  .returns<PublicRaceEvent[]>();
```

### Database Health Monitoring

```typescript
import { checkDatabaseConnection, getDatabaseStats } from "../lib/supabase";

// Check database connectivity
const isConnected = await checkDatabaseConnection();

// Get database statistics
const stats = await getDatabaseStats();
console.log("Total organisers:", stats.organisersCount);
console.log("Total events:", stats.eventsCount);
```

### Real-time Subscriptions

```typescript
import { supabase } from "../lib/supabase";

// Subscribe to changes
const subscription = supabase
  .channel("race-events")
  .on(
    "postgres_changes",
    {
      event: "*",
      schema: "public",
      table: "public_race_events",
    },
    (payload) => {
      console.log("Change received!", payload);
    }
  )
  .subscribe();

// Clean up
subscription.unsubscribe();
```

## Available Database Types

The following type-safe exports are available:

- `Tables` - All database table types
- `PublicRaceEvent` - Race event row type
- `Organiser` - Organiser row type
- `RaceAthleteCategory` - Category row type
- `RaceAthleteCategoryCollection` - Category collection row type

## Testing

Use the test utility to verify your anonymous access configuration:

```bash
npx tsx utils/test-supabase.ts
```

This will test:

- Database connectivity with anonymous access
- Public data access permissions
- Database health statistics

## Anonymous-Only Features

This configuration is optimized for public data access without authentication:

- No session management overhead
- Optimized for static site deployment
- Anonymous access to public tables only
- Database health monitoring capabilities
- No React Native dependencies

## Security Notes

- Uses anonymous access only - no user authentication
- The anon key is safe to use in client-side code
- Row Level Security (RLS) controls public data access
- Optimized for public data display applications
- No sensitive user data or authentication flows
