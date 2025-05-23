
/*
  # Create furniture and maintenance management schema

  1. Tables
    - categories
    - locations
    - furniture
    - maintenance_tasks
    - maintenance_records

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to manage their own data
*/

-- Create ENUM type for maintenance status
CREATE TYPE maintenance_status AS ENUM ('completed', 'skipped', 'partial');

-- Categories table (master)
CREATE TABLE categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL,
    icon TEXT
);

-- Locations table (user-specific)
CREATE TABLE locations (
    id SERIAL PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    name VARCHAR(50) NOT NULL
);

-- Furniture table
CREATE TABLE furniture (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    name VARCHAR(100) NOT NULL,
    brand VARCHAR(100),
    category_id INT REFERENCES categories(id),
    location_id INT REFERENCES locations(id),
    image_url TEXT,
    purchased_at DATE,
    purchased_from VARCHAR(150),
    next_due_date DATE,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Maintenance tasks per furniture
CREATE TABLE maintenance_tasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    furniture_id UUID REFERENCES furniture(id) ON DELETE CASCADE NOT NULL,
    name VARCHAR(100) NOT NULL,
    cycle_value INT NOT NULL,
    cycle_unit VARCHAR(10) NOT NULL CHECK (cycle_unit IN ('days', 'weeks', 'months', 'years')),
    description TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Maintenance records
CREATE TABLE maintenance_records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    task_id UUID REFERENCES maintenance_tasks(id) ON DELETE SET NULL,
    performed_at DATE NOT NULL,
    notes TEXT,
    status maintenance_status DEFAULT 'completed',
    task_name VARCHAR(100),
    task_cycle_value INT,
    task_cycle_unit VARCHAR(10),
    next_due_date DATE,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Enable Row Level Security
ALTER TABLE furniture ENABLE ROW LEVEL SECURITY;
ALTER TABLE maintenance_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE maintenance_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE locations ENABLE ROW LEVEL SECURITY;

-- RLS Policies for furniture
CREATE POLICY "Users can manage their own furniture" ON furniture
  FOR ALL TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- RLS Policies for maintenance_tasks
CREATE POLICY "Users can manage tasks for their furniture" ON maintenance_tasks
  FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM furniture WHERE id = furniture_id AND user_id = auth.uid()))
  WITH CHECK (EXISTS (SELECT 1 FROM furniture WHERE id = furniture_id AND user_id = auth.uid()));

-- RLS Policies for maintenance_records
CREATE POLICY "Users can manage records for their tasks" ON maintenance_records
  FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM maintenance_tasks mt JOIN furniture f ON mt.furniture_id = f.id WHERE mt.id = task_id AND f.user_id = auth.uid()))
  WITH CHECK (EXISTS (SELECT 1 FROM maintenance_tasks mt JOIN furniture f ON mt.furniture_id = f.id WHERE mt.id = task_id AND f.user_id = auth.uid()));

-- RLS Policies for categories (read only)
CREATE POLICY "Anyone can read categories" ON categories
  FOR SELECT TO public USING (TRUE);

-- RLS Policies for locations
CREATE POLICY "Users can manage their own locations" ON locations
  FOR ALL TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- updated_at Trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_furniture_updated_at
  BEFORE UPDATE ON furniture
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
