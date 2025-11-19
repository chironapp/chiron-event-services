# Results Components

This directory contains components for displaying race results and start lists.

## Components

### StartListResultsTable

Displays individual athlete results or start list entries for a race event.

**Props:**
- `eventId` (string): The race event ID
- `results` (RaceStartListResultWithCategories[]): Array of athlete results
- `isUpcoming` (boolean): Whether the event is upcoming (shows start list vs results)
- `isDark` (boolean, optional): Whether to use dark theme colors
- `showTeamOrder` (boolean, optional): Whether to show team order column (for relay races)

**Usage:**
```tsx
import { StartListResultsTable } from "@/components/results/StartListResultsTable";
import { fetchRaceResults } from "@/api/results";

const results = await fetchRaceResults({ eventId: 'event-123' });

<StartListResultsTable
  eventId="event-123"
  results={results.data}
  isUpcoming={false}
  isDark={isDark}
  showTeamOrder={isRelay(event)}
/>
```

### RelayTeamResultsTable

Displays relay team results with position, team name, member count, and finish time.

**Props:**
- `teams` (RaceTeamWithMemberCount[]): Array of team results with member counts
- `isDark` (boolean, optional): Whether to use dark theme colors

**Usage:**
```tsx
import { RelayTeamResultsTable } from "@/components/results/RelayTeamResultsTable";
import { fetchRaceTeams } from "@/api/results";

const teams = await fetchRaceTeams('event-123');

<RelayTeamResultsTable
  teams={teams}
  isDark={isDark}
/>
```

**Features:**
- Displays three columns: Position, Team (with member count), Finish Time
- Responsive design adapts to mobile and desktop widths
- Team member count shown in subtext style below team name
- Supports light and dark themes
- Sorts teams by position

**Example Output:**
```
Position | Team                    | Finish Time
---------|-------------------------|------------
1        | Lightning Runners       | 2:34:15
         | 6 team members          |
2        | Thunder Squad           | 2:45:30
         | 5 team members          |
```

## API Functions

### fetchRaceResults

Fetches individual athlete results for an event with pagination support.

```typescript
const results = await fetchRaceResults({
  eventId: 'event-123',
  page: 1,
  limit: 50,
  search: 'John',
  sortBy: 'position',
  sortOrder: 'asc'
});
```

### fetchRaceTeams

Fetches relay team results with member counts for an event.

```typescript
const teams = await fetchRaceTeams('event-123');
```

Returns `RaceTeamWithMemberCount[]` which includes:
- `id`: Team ID
- `name`: Team name
- `position`: Team position in race
- `finish_time100`: Finish time in centiseconds
- `member_count`: Number of team members
- `created_at`: Creation timestamp
- `updated_at`: Update timestamp
- `public_race_event_id`: Event ID

## Styling

Both components follow the same styling patterns:
- Use theme colors from `@/constants/theme` (no hardcoded colors)
- Responsive width calculations (max 1000px, adapts to screen)
- Consistent table styling with headers, borders, and alternating row colors
- Support for light and dark themes

## Time Formatting

Both components use the `formatTime` utility function to display times consistently:
- Times stored as centiseconds (e.g., 12345 = 2:03:45)
- Displayed as MM:SS or HH:MM:SS depending on duration
- Shows "-" for null/missing times
