-- Migration: Create race_teams, race_start_list_results, and race_start_list_athlete_personal tables
-- Description: Creates tables for race teams, start lists/results, and athlete personal data

-- Create race_teams table
CREATE TABLE IF NOT EXISTS race_teams (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  public_race_event_id uuid NOT NULL REFERENCES public_race_events(id) ON DELETE CASCADE,
  name text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT race_teams_unique_name_per_event UNIQUE (public_race_event_id, name)
);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS race_teams_public_race_event_id_idx ON race_teams(public_race_event_id);

-- Create race_start_list_results table
CREATE TABLE IF NOT EXISTS race_start_list_results (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  public_race_event_id uuid NOT NULL REFERENCES public_race_events(id) ON DELETE CASCADE,
  race_number int4 NOT NULL,
  first_name text,
  last_name text,
  sex_category_id int4 REFERENCES race_athlete_categories(id) ON DELETE SET NULL,
  age_category_id int4 REFERENCES race_athlete_categories(id) ON DELETE SET NULL,
  team_id uuid REFERENCES race_teams(id) ON DELETE SET NULL,
  finish_time100 int8,
  net_finish_time100 int8,
  net_started_at_local timestamptz,
  position int4,
  age_category_position int4,
  sex_category_position int4,
  race_team_id uuid REFERENCES race_teams(id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT race_start_list_results_unique_race_number_per_event UNIQUE (public_race_event_id, race_number)
);

-- Create indexes for faster lookups
CREATE INDEX IF NOT EXISTS race_start_list_results_public_race_event_id_idx ON race_start_list_results(public_race_event_id);
CREATE INDEX IF NOT EXISTS race_start_list_results_race_number_idx ON race_start_list_results(race_number);
CREATE INDEX IF NOT EXISTS race_start_list_results_sex_category_id_idx ON race_start_list_results(sex_category_id);
CREATE INDEX IF NOT EXISTS race_start_list_results_age_category_id_idx ON race_start_list_results(age_category_id);
CREATE INDEX IF NOT EXISTS race_start_list_results_team_id_idx ON race_start_list_results(team_id);
CREATE INDEX IF NOT EXISTS race_start_list_results_race_team_id_idx ON race_start_list_results(race_team_id);

-- Create race_start_list_athlete_personal table
CREATE TABLE IF NOT EXISTS race_start_list_athlete_personal (
  id uuid PRIMARY KEY REFERENCES race_start_list_results(id) ON DELETE CASCADE,
  month_of_birth smallint NOT NULL CHECK (month_of_birth >= 1 AND month_of_birth <= 12),
  year_of_birth smallint NOT NULL CHECK (year_of_birth >= 1900 AND year_of_birth <= 2100),
  email text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS race_start_list_athlete_personal_id_idx ON race_start_list_athlete_personal(id);

-- Enable Row Level Security (RLS) on all tables
ALTER TABLE race_teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE race_start_list_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE race_start_list_athlete_personal ENABLE ROW LEVEL SECURITY;

-- RLS Policies for race_teams

-- Public read access
CREATE POLICY "race_teams_public_read" ON race_teams
  FOR SELECT
  USING (true);

-- Organiser admin users can INSERT
CREATE POLICY "race_teams_organiser_admin_insert" ON race_teams
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public_race_events pre
      JOIN organisers o ON pre.organiser_id = o.id
      WHERE pre.id = race_teams.public_race_event_id
      AND o.id = auth.uid()::text
    )
  );

-- Organiser admin users can UPDATE
CREATE POLICY "race_teams_organiser_admin_update" ON race_teams
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public_race_events pre
      JOIN organisers o ON pre.organiser_id = o.id
      WHERE pre.id = race_teams.public_race_event_id
      AND o.id = auth.uid()::text
    )
  );

-- Organiser admin users can DELETE
CREATE POLICY "race_teams_organiser_admin_delete" ON race_teams
  FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public_race_events pre
      JOIN organisers o ON pre.organiser_id = o.id
      WHERE pre.id = race_teams.public_race_event_id
      AND o.id = auth.uid()::text
    )
  );

-- RLS Policies for race_start_list_results

-- Public read access
CREATE POLICY "race_start_list_results_public_read" ON race_start_list_results
  FOR SELECT
  USING (true);

-- Organiser admin users can INSERT
CREATE POLICY "race_start_list_results_organiser_admin_insert" ON race_start_list_results
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public_race_events pre
      JOIN organisers o ON pre.organiser_id = o.id
      WHERE pre.id = race_start_list_results.public_race_event_id
      AND o.id = auth.uid()::text
    )
  );

-- Organiser admin users can UPDATE
CREATE POLICY "race_start_list_results_organiser_admin_update" ON race_start_list_results
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public_race_events pre
      JOIN organisers o ON pre.organiser_id = o.id
      WHERE pre.id = race_start_list_results.public_race_event_id
      AND o.id = auth.uid()::text
    )
  );

-- Organiser admin users can DELETE
CREATE POLICY "race_start_list_results_organiser_admin_delete" ON race_start_list_results
  FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public_race_events pre
      JOIN organisers o ON pre.organiser_id = o.id
      WHERE pre.id = race_start_list_results.public_race_event_id
      AND o.id = auth.uid()::text
    )
  );

-- RLS Policies for race_start_list_athlete_personal

-- Organiser admin users can SELECT
CREATE POLICY "race_start_list_athlete_personal_organiser_admin_read" ON race_start_list_athlete_personal
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM race_start_list_results rslr
      JOIN public_race_events pre ON rslr.public_race_event_id = pre.id
      JOIN organisers o ON pre.organiser_id = o.id
      WHERE rslr.id = race_start_list_athlete_personal.id
      AND o.id = auth.uid()::text
    )
  );

-- Organiser admin users can INSERT
CREATE POLICY "race_start_list_athlete_personal_organiser_admin_insert" ON race_start_list_athlete_personal
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM race_start_list_results rslr
      JOIN public_race_events pre ON rslr.public_race_event_id = pre.id
      JOIN organisers o ON pre.organiser_id = o.id
      WHERE rslr.id = race_start_list_athlete_personal.id
      AND o.id = auth.uid()::text
    )
  );

-- Organiser admin users can UPDATE
CREATE POLICY "race_start_list_athlete_personal_organiser_admin_update" ON race_start_list_athlete_personal
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM race_start_list_results rslr
      JOIN public_race_events pre ON rslr.public_race_event_id = pre.id
      JOIN organisers o ON pre.organiser_id = o.id
      WHERE rslr.id = race_start_list_athlete_personal.id
      AND o.id = auth.uid()::text
    )
  );

-- Organiser admin users can DELETE
CREATE POLICY "race_start_list_athlete_personal_organiser_admin_delete" ON race_start_list_athlete_personal
  FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM race_start_list_results rslr
      JOIN public_race_events pre ON rslr.public_race_event_id = pre.id
      JOIN organisers o ON pre.organiser_id = o.id
      WHERE rslr.id = race_start_list_athlete_personal.id
      AND o.id = auth.uid()::text
    )
  );

-- Create triggers to update updated_at timestamp

-- Trigger function to update updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Add triggers for race_teams
CREATE TRIGGER update_race_teams_updated_at BEFORE UPDATE ON race_teams
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Add triggers for race_start_list_results
CREATE TRIGGER update_race_start_list_results_updated_at BEFORE UPDATE ON race_start_list_results
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Add triggers for race_start_list_athlete_personal
CREATE TRIGGER update_race_start_list_athlete_personal_updated_at BEFORE UPDATE ON race_start_list_athlete_personal
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
