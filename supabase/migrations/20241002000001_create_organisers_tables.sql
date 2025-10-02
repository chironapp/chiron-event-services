-- Create organisers table
CREATE TABLE organisers (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    website TEXT,
    logo TEXT, -- URL to logo image
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create organiser_admins table (junction table for organiser-admin relationships)
CREATE TABLE organiser_admins (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    organiser_id UUID NOT NULL REFERENCES organisers(id) ON DELETE CASCADE,
    admin_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(organiser_id, admin_id) -- Prevent duplicate admin assignments
);

-- Create indexes for better performance
CREATE INDEX idx_organiser_admins_organiser_id ON organiser_admins(organiser_id);
CREATE INDEX idx_organiser_admins_admin_id ON organiser_admins(admin_id);
CREATE INDEX idx_organisers_name ON organisers(name);

-- Enable Row Level Security
ALTER TABLE organisers ENABLE ROW LEVEL SECURITY;
ALTER TABLE organiser_admins ENABLE ROW LEVEL SECURITY;

-- RLS Policies for organisers table

-- Public read access (anyone can view organisers)
CREATE POLICY "Anyone can view organisers" ON organisers
    FOR SELECT USING (true);

-- Authenticated users can create organisers
CREATE POLICY "Authenticated users can create organisers" ON organisers
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Organiser admins can update organisers
CREATE POLICY "Organiser admins can update organisers" ON organisers
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM organiser_admins 
            WHERE organiser_id = organisers.id 
            AND admin_id = auth.uid()
        )
    );

-- Organiser admins can delete organisers
CREATE POLICY "Organiser admins can delete organisers" ON organisers
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM organiser_admins 
            WHERE organiser_id = organisers.id 
            AND admin_id = auth.uid()
        )
    );

-- RLS Policies for organiser_admins table

-- Organiser admins can view admin relationships for their organisers
CREATE POLICY "Organiser admins can view admin relationships" ON organiser_admins
    FOR SELECT USING (
        admin_id = auth.uid() OR 
        EXISTS (
            SELECT 1 FROM organiser_admins oa 
            WHERE oa.organiser_id = organiser_admins.organiser_id 
            AND oa.admin_id = auth.uid()
        )
    );

-- Organiser admins can add new admins to their organisers
CREATE POLICY "Organiser admins can add admins" ON organiser_admins
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM organiser_admins 
            WHERE organiser_id = organiser_admins.organiser_id 
            AND admin_id = auth.uid()
        )
    );

-- Organiser admins can remove admins from their organisers
CREATE POLICY "Organiser admins can remove admins" ON organiser_admins
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM organiser_admins oa 
            WHERE oa.organiser_id = organiser_admins.organiser_id 
            AND oa.admin_id = auth.uid()
        )
    );

-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update updated_at on organisers table
CREATE TRIGGER update_organisers_updated_at 
    BEFORE UPDATE ON organisers 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Comments for documentation
COMMENT ON TABLE organisers IS 'Event organisers/companies that manage races and events';
COMMENT ON TABLE organiser_admins IS 'Junction table linking organisers to their admin users';
COMMENT ON COLUMN organisers.name IS 'Display name of the organiser';
COMMENT ON COLUMN organisers.description IS 'Optional description of the organiser';
COMMENT ON COLUMN organisers.website IS 'Optional website URL';
COMMENT ON COLUMN organisers.logo IS 'Optional logo image URL';
COMMENT ON COLUMN organiser_admins.organiser_id IS 'Reference to the organiser';
COMMENT ON COLUMN organiser_admins.admin_id IS 'Reference to the user who is an admin for this organiser';
