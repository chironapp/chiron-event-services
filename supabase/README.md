# Supabase Migrations

This directory contains Supabase database migrations for the Chiron Event Services project.

## Migrations

### 20240101000000_create_race_tables.sql

Creates the following tables:

#### race_teams
- Stores team information for race events
- Unique team name per race event
- Foreign key to `public_race_events`

**Columns:**
- `id` (uuid, primary key)
- `public_race_event_id` (uuid, FK to public_race_events.id)
- `name` (text, not null)
- `created_at` (timestamptz)
- `updated_at` (timestamptz)

**RLS Policies:**
- Public read access
- Organiser admin users can CRUD

#### race_start_list_results
- Stores athlete start list and race results
- Unique race number per race event
- Foreign keys to race categories and teams

**Columns:**
- `id` (uuid, primary key)
- `public_race_event_id` (uuid, FK to public_race_events.id)
- `race_number` (int4, not null)
- `first_name` (text)
- `last_name` (text)
- `sex_category_id` (int4, FK to race_athlete_categories.id)
- `age_category_id` (int4, FK to race_athlete_categories.id)
- `team_id` (uuid, FK to race_teams.id)
- `finish_time100` (int8, finish time in hundredths of a second)
- `net_finish_time100` (int8, net finish time in hundredths of a second)
- `net_started_at_local` (timestamptz)
- `position` (int4)
- `age_category_position` (int4)
- `sex_category_position` (int4)
- `race_team_id` (uuid, FK to race_teams.id)
- `created_at` (timestamptz)
- `updated_at` (timestamptz)

**RLS Policies:**
- Public read access
- Organiser admin users can CRUD

#### race_start_list_athlete_personal
- Stores personal/sensitive athlete information
- One-to-one relationship with race_start_list_results

**Columns:**
- `id` (uuid, primary key, FK to race_start_list_results.id)
- `month_of_birth` (smallint, not null, 1-12)
- `year_of_birth` (smallint, not null, 1900-2100)
- `email` (text)
- `created_at` (timestamptz)
- `updated_at` (timestamptz)

**RLS Policies:**
- Organiser admin users can CRUD (no public read access)

## Applying Migrations

To apply migrations to your Supabase project:

1. Using Supabase CLI:
   ```bash
   supabase db push
   ```

2. Using Supabase Dashboard:
   - Go to your project's SQL Editor
   - Copy and paste the migration SQL
   - Execute the query

3. Using API/SDK:
   - Not recommended for migrations
   - Use CLI or Dashboard for schema changes

## RLS Policies

All tables have Row Level Security (RLS) enabled:

- **Public Read**: `race_teams` and `race_start_list_results` are readable by anyone
- **Admin CRUD**: Organiser admin users (linked via `organisers` table) can Create, Read, Update, Delete their own race data
- **Private Data**: `race_start_list_athlete_personal` is only accessible to organiser admins

## Indexes

Indexes are created on:
- Foreign key columns for faster joins
- `race_number` for efficient race result lookups
- Category columns for filtering

## Triggers

Automatic `updated_at` timestamp updates are handled by triggers on all tables.
