# Chiron Event Services - AI Agent Guidelines

This document provides guidelines for AI agents working on the Chiron Event Services project to maintain code quality, consistency, and follow established patterns.

## Project Overview

Chiron Event Services is a React Native/Expo web application for managing race events, participants, and results. The app supports both individual and relay races with responsive design for desktop and mobile web browsers.

## Architecture & Technology Stack

- **Framework**: React Native with Expo Router (web-only build)
- **Routing**: Expo Router with file-based routing
- **Styling**: React Native StyleSheet with theme-based design
- **State Management**: React hooks (useState, useEffect)
- **API**: Supabase for data fetching
- **Navigation**: Top navigation with hamburger menu for mobile

## Color & Theme Guidelines

### ⚠️ CRITICAL: Never Use Hardcoded Colors

**ALWAYS use theme colors from `/constants/theme.ts`**. Never hardcode hex colors directly in components.

#### Available Theme Colors

```typescript
// Light Theme Colors
Colors.light = {
  text: "#11181C", // Primary text
  background: "#fff", // Main background
  tint: "#0a7ea4", // Accent/brand color
  subText: "#666666", // Secondary text
  link: "#2563eb", // Links
  border: "#e0e0e0", // Borders
  tableHeader: "#f5f5f5", // Table headers
  tableRowAlt: "#fafafa", // Alternate table rows
  success: "#4CAF50", // Success buttons
  primary: "#2196F3", // Primary buttons
  error: "#d32f2f", // Error messages
  muted: "#e0e0e0", // Muted elements
  secondaryText: "#333333", // Secondary content text
};

// Dark Theme Colors (automatically switches)
Colors.dark = {
  text: "#ECEDEE", // Primary text (light)
  background: "#151718", // Main background (dark)
  subText: "#cccccc", // Secondary text (light)
  link: "#60a5fa", // Links (lighter blue)
  border: "#333333", // Borders (dark)
  tableHeader: "#1a1a1a", // Table headers (dark)
  tableRowAlt: "#0a0a0a", // Alternate table rows (darker)
  error: "#ff6b6b", // Error messages (lighter red)
  secondaryText: "#e0e0e0", // Secondary content text (light)
  // success and primary stay same for both themes
};
```

#### Usage Pattern

```typescript
// ✅ CORRECT: Use theme colors
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

const colorScheme = useColorScheme();
const colors = Colors[colorScheme === 'dark' ? 'dark' : 'light'];

// Use in styles
<Text style={{ color: colors.text }}>Hello</Text>
<View style={{ backgroundColor: colors.background }}>

// ❌ WRONG: Never hardcode colors
<Text style={{ color: '#000000' }}>Hello</Text>
<View style={{ backgroundColor: isDark ? '#000' : '#fff' }}>
```

#### Adding New Colors

If you need a new color that doesn't exist:

1. Add it to both light and dark themes in `/constants/theme.ts`
2. Use semantic names (`error`, `success`, `warning`) not descriptive (`red`, `green`)
3. Ensure sufficient contrast for accessibility
4. Test in both light and dark modes

## Component Guidelines

### Table Components

#### StartListResultsTable vs StartListResultsTable2

- Use `StartListResultsTable2` for new implementations (improved responsive design)
- Located at `/components/ui/StartListResultsTable2.tsx`
- Automatically handles responsive layout and column visibility
- Supports team order column for relay events

#### Table Features

```typescript
<StartListResultsTable2
  results={results}
  isUpcoming={eventIsUpcoming} // Changes columns/layout
  isDark={isDark} // Theme support
  showTeamOrder={isRelay(event)} // Conditional team order column
/>
```

### Navigation Components

- Use `TopNavigation` component from `/components/top-navigation-simple.tsx`
- Responsive design with hamburger menu on mobile (<768px)
- CSS media queries handle desktop/mobile visibility

### Responsive Design Patterns

#### Breakpoints

- **Mobile**: <768px - Show hamburger menu, stack elements
- **Desktop**: >=768px - Show full navigation, table layout

#### Table Responsiveness

- Hide less critical columns on narrow screens
- Use horizontal scroll when needed
- Consider card layout for very small screens

## File Structure & Routing

### App Router Structure

```
app/
  _layout.tsx                    // Root layout
  (tabs)/                        // Tab group (now top nav)
    _layout.tsx                  // Tab layout with TopNavigation
    about.tsx, events.tsx, etc.  // Main pages
  events/
    [id].tsx                     // Event details
    individual/
      [participantId].tsx        // Individual participant
```

### API Structure

```
api/
  events.ts                      // Event data fetching
  results.ts                     // Results/participants data
  organisers.ts                  // Organiser data
```

### Utility Functions

```
utils/
  nameUtils.ts                   // Name formatting (getNameWithRaceNumber)
  relayRaceUtils.ts             // Relay-specific logic (isRelay, getTeamOrder)
  eventFilters.ts               // Event filtering (isUpcoming)
```

## Data Handling Patterns

### Event Types

- Check if event is relay: `isRelay(event)`
- Check if event is upcoming: `isUpcoming(event)`
- Format names with race numbers: `getNameWithRaceNumber(firstName, lastName, raceNumber)`

### Result Processing

- Filter results: Use utility functions in `/utils/tableUtils.ts`
- Sort results: Maintain consistent sorting patterns
- Handle team order: Use `getTeamOrder(result, allResults)` for relay events

## Navigation & Linking

### Internal Navigation

```typescript
// Link to participant details
<Link href={`/events/individual/${result.id}`} asChild>
  <Pressable>
    <Text style={{ color: colors.link }}>Participant Name</Text>
  </Pressable>
</Link>
```

### External Links

```typescript
// External links (registration, etc.)
<TouchableOpacity onPress={() => Linking.openURL(url)}>
  <Text>Register Now</Text>
</TouchableOpacity>
```

## State Management Patterns

### Loading States

```typescript
const [loading, setLoading] = useState(true);
const [error, setError] = useState<string | null>(null);

// Always handle loading and error states in UI
if (loading) return <LoadingComponent />;
if (error) return <ErrorComponent message={error} />;
```

### Search & Filtering

- Debounce search inputs for performance
- Use `useMemo` for expensive filtering operations
- Maintain filter state at appropriate component level

## Performance Guidelines

### React Native Web Optimization

- Use `useWindowDimensions()` for responsive calculations
- Implement proper `useMemo` and `useCallback` for expensive operations
- Avoid inline styles when possible, use StyleSheet.create()

### Table Performance

- Implement virtualization for large datasets
- Use proper keys for list items
- Consider pagination for large result sets

## Code Quality Standards

### TypeScript

- Use strict typing for all props and state
- Define interfaces for API responses
- Use `type` for unions, `interface` for object shapes

### Component Structure

```typescript
interface ComponentProps {
  // Define all props with proper types
}

export function Component({ prop1, prop2 }: ComponentProps) {
  // Hooks first
  const [state, setState] = useState();

  // Computed values
  const computedValue = useMemo(() => calculation, [deps]);

  // Event handlers
  const handleEvent = useCallback(() => {}, [deps]);

  // Render
  return <JSX />;
}
```

### Styling Patterns

```typescript
// Use StyleSheet.create for performance
const styles = StyleSheet.create({
  container: {
    flex: 1,
    // Use semantic property names
  },
});

// Dynamic styles with theme colors
<View style={[styles.container, { backgroundColor: colors.background }]} />;
```

## Testing & Debugging

### Component Testing

- Test responsive behavior at different screen sizes
- Verify light/dark theme compatibility
- Test with empty states and error conditions

### Common Issues

- CSS properties not supported in React Native (use compatible alternatives)
- Font weight values (use 'bold', '600', etc. not arbitrary numbers)
- Platform-specific behaviors (handle with Platform.OS checks)

## Deployment & Build

### Web-Only Configuration

- App is configured for web-only deployment
- No mobile platform dependencies
- Uses Metro bundler with web target

## Best Practices Summary

1. **Always use theme colors** - Never hardcode hex values
2. **Responsive design** - Consider mobile and desktop layouts
3. **Type safety** - Use TypeScript interfaces and proper typing
4. **Performance** - Use memoization and efficient rendering patterns
5. **Accessibility** - Ensure proper contrast and touch targets
6. **Error handling** - Always handle loading and error states
7. **Code organization** - Follow established file structure and patterns
8. **Testing** - Test across different screen sizes and themes

## Common Patterns to Follow

### Theme-Aware Component

```typescript
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";

export function ThemedComponent() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme === "dark" ? "dark" : "light"];

  return (
    <View style={{ backgroundColor: colors.background }}>
      <Text style={{ color: colors.text }}>Content</Text>
    </View>
  );
}
```

### Responsive Table Component

```typescript
export function ResponsiveTable({ data, showOptionalColumn }) {
  const { width } = useWindowDimensions();
  const isMobile = width < 768;

  if (isMobile) {
    return <MobileCardLayout data={data} />;
  }

  return (
    <DesktopTableLayout data={data} showOptionalColumn={showOptionalColumn} />
  );
}
```

This document should be updated as new patterns and requirements emerge.
