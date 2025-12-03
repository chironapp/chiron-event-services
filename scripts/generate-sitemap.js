#!/usr/bin/env node

/**
 * Sitemap Generator for Chiron Event Services
 *
 * This script generates a sitemap.xml file for the website at build time.
 * It fetches all event and organiser IDs from Supabase and generates URLs.
 *
 * Usage:
 *   node scripts/generate-sitemap.js
 *
 * Environment variables required:
 *   - EXPO_PUBLIC_SUPABASE_URL: Supabase project URL
 *   - EXPO_PUBLIC_SUPABASE_ANON_KEY: Supabase anonymous key
 *
 * Output:
 *   - dist/sitemap.xml
 */

const { createClient } = require("@supabase/supabase-js");
const fs = require("fs");
const path = require("path");

// Configuration
const BASE_URL = "https://events.chironapp.com";
const OUTPUT_DIR = path.join(__dirname, "..", "dist");
const OUTPUT_FILE = path.join(OUTPUT_DIR, "sitemap.xml");

// Static pages to include in sitemap
const STATIC_PAGES = [
  { path: "/", priority: "1.0", changefreq: "daily" },
  { path: "/about", priority: "0.8", changefreq: "monthly" },
  { path: "/organisers", priority: "0.9", changefreq: "weekly" },
];

/**
 * Initialize Supabase client
 */
function initSupabase() {
  const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl) {
    throw new Error("Missing EXPO_PUBLIC_SUPABASE_URL environment variable");
  }

  if (!supabaseAnonKey) {
    throw new Error(
      "Missing EXPO_PUBLIC_SUPABASE_ANON_KEY environment variable"
    );
  }

  return createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
      detectSessionInUrl: false,
    },
  });
}

/**
 * Fetch all event IDs from Supabase
 */
async function fetchAllEventIds(supabase) {
  console.log("📋 Fetching event IDs...");

  const { data, error } = await supabase
    .from("public_race_events")
    .select("id")
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(`Failed to fetch event IDs: ${error.message}`);
  }

  const ids = (data || []).map((event) => event.id);
  console.log(`   Found ${ids.length} events`);
  return ids;
}

/**
 * Fetch all organiser IDs from Supabase
 */
async function fetchAllOrganiserIds(supabase) {
  console.log("📋 Fetching organiser IDs...");

  const { data, error } = await supabase
    .from("organisers")
    .select("id")
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(`Failed to fetch organiser IDs: ${error.message}`);
  }

  const ids = (data || []).map((organiser) => organiser.id);
  console.log(`   Found ${ids.length} organisers`);
  return ids;
}

/**
 * Generate XML for a single URL entry
 */
function generateUrlEntry(loc, priority = "0.5", changefreq = "weekly") {
  const lastmod = new Date().toISOString().split("T")[0];
  return `  <url>
    <loc>${loc}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`;
}

/**
 * Generate the complete sitemap XML
 */
function generateSitemapXml(staticPages, eventIds, organiserIds) {
  const urlEntries = [];

  // Add static pages
  for (const page of staticPages) {
    urlEntries.push(
      generateUrlEntry(
        `${BASE_URL}${page.path}`,
        page.priority,
        page.changefreq
      )
    );
  }

  // Add event pages
  for (const eventId of eventIds) {
    urlEntries.push(
      generateUrlEntry(`${BASE_URL}/events/${eventId}`, "0.7", "weekly")
    );
  }

  // Add organiser pages
  for (const organiserId of organiserIds) {
    urlEntries.push(
      generateUrlEntry(`${BASE_URL}/organisers/${organiserId}`, "0.7", "weekly")
    );
  }

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlEntries.join("\n")}
</urlset>`;
}

/**
 * Ensure output directory exists
 */
function ensureOutputDir() {
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
    console.log(`📁 Created output directory: ${OUTPUT_DIR}`);
  }
}

/**
 * Main function
 */
async function main() {
  console.log("🚀 Generating sitemap for Chiron Event Services...\n");

  try {
    // Initialize Supabase client
    const supabase = initSupabase();

    // Fetch IDs in parallel
    const [eventIds, organiserIds] = await Promise.all([
      fetchAllEventIds(supabase),
      fetchAllOrganiserIds(supabase),
    ]);

    // Generate sitemap XML
    console.log("\n📝 Generating sitemap XML...");
    const sitemapXml = generateSitemapXml(STATIC_PAGES, eventIds, organiserIds);

    // Ensure output directory exists
    ensureOutputDir();

    // Write sitemap to file
    fs.writeFileSync(OUTPUT_FILE, sitemapXml, "utf8");

    const totalUrls = STATIC_PAGES.length + eventIds.length + organiserIds.length;
    console.log(`\n✅ Sitemap generated successfully!`);
    console.log(`   Total URLs: ${totalUrls}`);
    console.log(`   Output: ${OUTPUT_FILE}`);
  } catch (error) {
    console.error("\n❌ Error generating sitemap:", error.message);
    process.exit(1);
  }
}

// Run the script
main();
