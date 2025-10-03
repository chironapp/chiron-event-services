# OrganiserTopNav Component

## Overview

The `OrganiserTopNav` component is a header specifically designed for organiser details screens. It maintains the styling of the standard `TopNav` component but with key differences tailored for organiser-focused pages.

## Key Differences from TopNav

| Feature | TopNav | OrganiserTopNav |
|---------|--------|----------------|
| Left Side | Chiron logo (clickable image) | Organiser name (text) |
| Right Side | Navigation links (About, Events, Organisers, Contact) | Empty (no links) |
| Styling | Full styling with shadows, borders | Same styling preserved |
| Dark Mode | Supported | Supported |

## Usage

```tsx
import OrganiserTopNav from "@/components/OrganiserTopNav";

export default function OrganiserDetailsPage() {
  return (
    <>
      <OrganiserTopNav organiserName="Marathon Events Inc." />
      {/* Rest of your page content */}
    </>
  );
}
```

## Props

### `organiserName` (required)
- **Type**: `string`
- **Description**: The name of the organiser to display in the header

## Styling

The component matches the `TopNav` styling:
- Border at the bottom with shadow
- Centered content with max-width of 1200px
- Responsive padding (16px horizontal, 12px vertical)
- Dark mode support with theme-appropriate colors
- Text truncation with `numberOfLines={1}` to prevent overflow

## Design Rationale

The organiser details screen requires a simpler header that:
1. **Identifies the organiser**: Shows the organiser name prominently
2. **Reduces navigation clutter**: Removes unnecessary navigation links for a focused view
3. **Maintains consistency**: Uses the same visual style as other headers in the app
4. **Supports branding**: Allows organisers to have their name displayed in the header
