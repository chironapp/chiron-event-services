# EventTopNav Component

## Overview

The `EventTopNav` component is a header specifically designed for event details screens. It maintains the styling of the standard `TopNav` component but with key differences tailored for event-focused pages.

## Key Differences from TopNav

| Feature | TopNav | EventTopNav |
|---------|--------|-------------|
| Left Side | Chiron logo (clickable image) | Event name and date (text) |
| Right Side | Navigation links (About, Events, Organisers, Contact) | Empty (no links) |
| Styling | Full styling with shadows, borders | Same styling preserved |
| Dark Mode | Supported | Supported |

## Key Differences from OrganiserTopNav

| Feature | OrganiserTopNav | EventTopNav |
|---------|-----------------|-------------|
| Display Content | Organiser name only | Event name \| Event start date |
| Props | `organiserName` | `eventName`, `eventStartDate` |
| Use Case | Organiser details screen | Event details screen |

## Usage

```tsx
import EventTopNav from "@/components/EventTopNav";

export default function EventDetailsPage() {
  return (
    <>
      <EventTopNav 
        eventName="Boston Marathon" 
        eventStartDate="2024-04-15" 
      />
      {/* Rest of your page content */}
    </>
  );
}
```

## Props

### `eventName` (required)
- **Type**: `string`
- **Description**: The name of the event to display in the header

### `eventStartDate` (required)
- **Type**: `string`
- **Description**: The start date of the event in ISO format (e.g., "2024-04-15")

## Date Formatting

The component automatically formats the date using `toLocaleDateString` with the following options:
- **Format**: "Month Day, Year" (e.g., "April 15, 2024")
- **Locale**: en-US
- **Options**: `{ year: "numeric", month: "long", day: "numeric" }`

## Styling

The component matches the `TopNav` and `OrganiserTopNav` styling:
- Border at the bottom with shadow
- Centered content with max-width of 1200px
- Responsive padding (16px horizontal, 12px vertical)
- Dark mode support with theme-appropriate colors
- Text truncation with `numberOfLines={1}` to prevent overflow

## Design Rationale

The event details screen requires a simpler header that:
1. **Identifies the event**: Shows the event name and date prominently
2. **Reduces navigation clutter**: Removes unnecessary navigation links for a focused view
3. **Maintains consistency**: Uses the same visual style as other headers in the app
4. **Provides context**: Displays both event name and date separated by a pipe character for clarity

## Example with Real Data

```tsx
<EventTopNav 
  eventName="London Marathon 2024" 
  eventStartDate="2024-10-13" 
/>
// Renders: "London Marathon 2024 | October 13, 2024"
```
