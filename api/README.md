# API Documentation

This directory contains API functions for interacting with the Supabase database.

## Available APIs

### Organisers API (`/api/organisers.ts`)

Functions for managing organiser data with pagination and search capabilities.

#### Functions

- **`fetchOrganisers(params?)`** - Fetch organisers with pagination
- **`fetchOrganiserById(id)`** - Fetch a single organiser by ID
- **`getOrganisersCount()`** - Get total count of organisers

#### Usage Example

```typescript
import { fetchOrganisers } from "../api/organisers";

// Fetch first page with default settings
const result = await fetchOrganisers();

// Fetch with custom parameters
const result = await fetchOrganisers({
  page: 2,
  limit: 10,
  search: "running club",
  sortBy: "name",
  sortOrder: "asc",
});

console.log(result.data); // Array of organisers
console.log(result.pagination); // Pagination metadata
```

#### Parameters

| Parameter   | Type   | Default | Description                                    |
| ----------- | ------ | ------- | ---------------------------------------------- |
| `page`      | number | 1       | Page number (1-based)                          |
| `limit`     | number | 20      | Items per page                                 |
| `search`    | string | ''      | Search term for name/description               |
| `sortBy`    | string | 'name'  | Sort field: 'name', 'created_at', 'updated_at' |
| `sortOrder` | string | 'asc'   | Sort direction: 'asc' or 'desc'                |

#### Response Format

```typescript
interface FetchOrganisersResponse {
  data: Organiser[]; // Array of organiser records
  count: number; // Total number of records
  page: number; // Current page number
  limit: number; // Items per page
  totalPages: number; // Total number of pages
  hasNextPage: boolean; // Whether next page exists
  hasPreviousPage: boolean; // Whether previous page exists
}
```

## React Hooks

### `useOrganisers` Hook (`/hooks/useOrganisers.ts`)

A custom React hook that manages organisers data fetching with built-in loading states, error handling, and pagination controls.

#### Usage

```typescript
import { useOrganisers } from "../hooks/useOrganisers";

function OrganisersComponent() {
  const {
    data, // Current organisers data
    loading, // Loading state
    error, // Error message if any
    pagination, // Pagination metadata
    refresh, // Refresh current data
    nextPage, // Go to next page
    previousPage, // Go to previous page
    setSearch, // Update search term
    setSorting, // Update sorting
  } = useOrganisers();

  // Component logic here...
}
```

#### Available Actions

- `refresh()` - Reload current data
- `nextPage()` - Navigate to next page (if available)
- `previousPage()` - Navigate to previous page (if available)
- `goToPage(pageNumber)` - Navigate to specific page
- `setSearch(searchTerm)` - Update search and reset to page 1
- `setSorting(field, order)` - Update sorting and reset to page 1
- `updateParams(newParams)` - Update any parameters

## Live Interface

Visit `/organisers` in your app to see the complete production organisers page with:

- Professional card-based layout
- Paginated data display with responsive grid
- Search functionality with real-time filtering
- Sort controls with visual indicators
- Loading states and error handling
- Pull-to-refresh capabilities
- Dark/light theme support
- Responsive design optimized for web

## Database Schema

The organisers table has the following structure:

```sql
CREATE TABLE organisers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  website TEXT,
  logo TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

## Error Handling

All API functions include comprehensive error handling:

- Network errors are caught and re-thrown with descriptive messages
- Supabase errors are properly formatted
- Missing records return `null` instead of throwing
- TypeScript provides compile-time type safety

## Performance Notes

- Uses Supabase's built-in pagination with `range()` queries
- Includes exact count for accurate pagination metadata
- Search uses database indices for optimal performance
- Results are cached by React Query (if implemented in the future)
