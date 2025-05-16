/*
  # Create furniture management tables

  1. New Tables
    - `furnitures`: Stores furniture information
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to users)
      - `name` (text)
      - `brand` (text)
      - `purchased_at` (date)
      - `purchased_from` (text)
      - `location` (text)
      - `image_url` (text)
      - `has_maintenance` (boolean)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

    - `maintenances`: Stores maintenance history
      - `id` (uuid, primary key)
      - `furniture_id` (uuid, foreign key to furnitures)
      - `method` (text)
      - `cycle` (text)
      - `last_done_at` (date)
      - `memo` (text)
      - `created_at` (timestamp)

    - `tags`: Stores user-defined tags
      - `id` (uuid, primary key)
      - `name` (text)
      - `user_id` (uuid, foreign key to users)

    - `furniture_tags`: Links furniture with tags
      - `furniture_id` (uuid, foreign key to furnitures)
      - `tag_id` (uuid, foreign key to tags)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to manage their own data
*/

-- Create furnitures table
CREATE TABLE IF NOT EXISTS furnitures (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) NOT NULL,
  name text NOT NULL,
  brand text,
  purchased_at date,
  purchased_from text,
  location text,
  image_url text,
  has_maintenance boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create maintenances table
CREATE TABLE IF NOT EXISTS maintenances (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  furniture_id uuid REFERENCES furnitures(id) ON DELETE CASCADE NOT NULL,
  method text NOT NULL,
  cycle text,
  last_done_at date,
  memo text,
  created_at timestamptz DEFAULT now()
);

-- Create tags table
CREATE TABLE IF NOT EXISTS tags (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  user_id uuid REFERENCES auth.users(id) NOT NULL,
  UNIQUE (name, user_id)
);

-- Create furniture_tags table
CREATE TABLE IF NOT EXISTS furniture_tags (
  furniture_id uuid REFERENCES furnitures(id) ON DELETE CASCADE,
  tag_id uuid REFERENCES tags(id) ON DELETE CASCADE,
  PRIMARY KEY (furniture_id, tag_id)
);

-- Enable Row Level Security
ALTER TABLE furnitures ENABLE ROW LEVEL SECURITY;
ALTER TABLE maintenances ENABLE ROW LEVEL SECURITY;
ALTER TABLE tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE furniture_tags ENABLE ROW LEVEL SECURITY;

-- Furniture policies
CREATE POLICY "Users can read own furnitures"
  ON furnitures
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own furnitures"
  ON furnitures
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own furnitures"
  ON furnitures
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own furnitures"
  ON furnitures
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Maintenance policies
CREATE POLICY "Users can read own furniture maintenances"
  ON maintenances
  FOR SELECT
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM furnitures
    WHERE furnitures.id = maintenances.furniture_id
    AND furnitures.user_id = auth.uid()
  ));

CREATE POLICY "Users can create maintenances for own furniture"
  ON maintenances
  FOR INSERT
  TO authenticated
  WITH CHECK (EXISTS (
    SELECT 1 FROM furnitures
    WHERE furnitures.id = furniture_id
    AND furnitures.user_id = auth.uid()
  ));

CREATE POLICY "Users can update maintenances for own furniture"
  ON maintenances
  FOR UPDATE
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM furnitures
    WHERE furnitures.id = maintenances.furniture_id
    AND furnitures.user_id = auth.uid()
  ));

CREATE POLICY "Users can delete maintenances for own furniture"
  ON maintenances
  FOR DELETE
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM furnitures
    WHERE furnitures.id = maintenances.furniture_id
    AND furnitures.user_id = auth.uid()
  ));

-- Tag policies
CREATE POLICY "Users can read own tags"
  ON tags
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own tags"
  ON tags
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own tags"
  ON tags
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own tags"
  ON tags
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Furniture tags policies
CREATE POLICY "Users can read own furniture tags"
  ON furniture_tags
  FOR SELECT
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM furnitures
    WHERE furnitures.id = furniture_tags.furniture_id
    AND furnitures.user_id = auth.uid()
  ));

CREATE POLICY "Users can manage furniture tags for own furniture"
  ON furniture_tags
  FOR ALL
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM furnitures
    WHERE furnitures.id = furniture_tags.furniture_id
    AND furnitures.user_id = auth.uid()
  ))
  WITH CHECK (EXISTS (
    SELECT 1 FROM furnitures
    WHERE furnitures.id = furniture_tags.furniture_id
    AND furnitures.user_id = auth.uid()
  ));

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Add updated_at trigger to furnitures table
CREATE TRIGGER update_furnitures_updated_at
  BEFORE UPDATE ON furnitures
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();