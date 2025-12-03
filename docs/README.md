# Documentation

This folder contains documentation for Chiron Event Services.

## Contents

- [Supabase Setup](./supabase.md) - Database configuration and security
- [Event Top Navigation](./EventTopNav.md) - Event page navigation component
- [Organiser Top Navigation](./OrganiserTopNav.md) - Organiser page navigation component

## SEO & Sitemap

### Dynamic SEO Meta Tags

All dynamic pages in Chiron Event Services have SEO-friendly meta tags set based on page context. This is handled by the `<Head>` component from `/components/utils/Head.tsx`.

#### Event Pages (`/events/[eventId]`)

Each event page sets the following meta tags dynamically:
- **Title**: Event title with site name
- **Description**: Event description or default text based on event status
- **Open Graph**: Event-specific title and description for social sharing
- **Twitter Card**: Event-specific title and description for Twitter sharing

#### Organiser Pages (`/organisers/[organiserId]`)

Each organiser page sets the following meta tags dynamically:
- **Title**: Organiser name with site name
- **Description**: Default text describing the organiser's events
- **Open Graph**: Organiser-specific title and description for social sharing
- **Twitter Card**: Organiser-specific title and description for Twitter sharing

### Sitemap Generation

The sitemap is automatically generated at build time and includes URLs for:
- Static pages (home, about, organisers)
- All event pages (`/events/[eventId]`)
- All organiser pages (`/organisers/[organiserId]`)

Individual and team result pages are intentionally excluded from the sitemap as they are sub-pages of events.

#### How It Works

1. The sitemap generator script (`/scripts/generate-sitemap.js`) runs during the build process
2. It fetches all event and organiser IDs from Supabase
3. Generates a `sitemap.xml` file in the `dist` folder

#### Running Manually

```bash
# Ensure environment variables are set
export EXPO_PUBLIC_SUPABASE_URL=your-supabase-url
export EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# Generate sitemap
npm run generate-sitemap
```

#### Output Location

The sitemap is output to `dist/sitemap.xml` and will be available at:
- `https://events.chironapp.com/sitemap.xml`

#### Sitemap Structure

```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://events.chironapp.com/</loc>
    <lastmod>2024-01-01</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://events.chironapp.com/events/abc123</loc>
    <lastmod>2024-01-01</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>
  <!-- Additional URLs -->
</urlset>
```

### Build Process

The GitHub Actions workflow automatically:
1. Builds the web application
2. Generates the sitemap
3. Deploys both to GitHub Pages

See `.github/workflows/deploy-web.yml` for the complete workflow.
