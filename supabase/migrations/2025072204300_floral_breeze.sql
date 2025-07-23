/*
  # Comic Platform Database Schema

  1. New Tables
    - `users`
      - `id` (uuid, primary key)
      - `username` (text, unique)
      - `email` (text, unique) 
      - `password` (text, hashed)
      - `role` (enum: USER, ADMIN)
      - `created_at` (timestamp)
    
    - `comics`
      - `id` (uuid, primary key)
      - `title` (text)
      - `slug` (text, unique for URLs)
      - `author` (text)
      - `synopsis` (text)
      - `status` (enum: ONGOING, COMPLETED)
      - `cover_image_url` (text)
      - `genres` (text array)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `chapters`
      - `id` (uuid, primary key)
      - `chapter_number` (numeric)
      - `title` (text, optional)
      - `comic_id` (foreign key to comics)
      - `created_at` (timestamp)
    
    - `pages`
      - `id` (uuid, primary key)
      - `page_number` (integer)
      - `image_url` (text)
      - `chapter_id` (foreign key to chapters)

  2. Security
    - Enable RLS on all tables
    - Add policies for public read access to comics/chapters/pages
    - Add policies for authenticated admin access to manage content
    - Add policies for user authentication
*/

-- Create custom types
CREATE TYPE user_role AS ENUM ('USER', 'ADMIN');
CREATE TYPE comic_status AS ENUM ('ONGOING', 'COMPLETED');

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  username text UNIQUE NOT NULL,
  email text UNIQUE NOT NULL,
  password text NOT NULL,
  role user_role DEFAULT 'USER',
  created_at timestamptz DEFAULT now()
);

-- Comics table
CREATE TABLE IF NOT EXISTS comics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text UNIQUE NOT NULL,
  author text NOT NULL,
  synopsis text DEFAULT '',
  status comic_status DEFAULT 'ONGOING',
  cover_image_url text DEFAULT '',
  genres text[] DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Chapters table
CREATE TABLE IF NOT EXISTS chapters (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  chapter_number numeric NOT NULL,
  title text DEFAULT '',
  comic_id uuid NOT NULL REFERENCES comics(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  UNIQUE(comic_id, chapter_number)
);

-- Pages table
CREATE TABLE IF NOT EXISTS pages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  page_number integer NOT NULL,
  image_url text NOT NULL,
  chapter_id uuid NOT NULL REFERENCES chapters(id) ON DELETE CASCADE,
  UNIQUE(chapter_id, page_number)
);

-- Enable RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE comics ENABLE ROW LEVEL SECURITY;
ALTER TABLE chapters ENABLE ROW LEVEL SECURITY;
ALTER TABLE pages ENABLE ROW LEVEL SECURITY;

-- RLS Policies for users
CREATE POLICY "Users can read own data"
  ON users
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

-- RLS Policies for comics (public read, admin write)
CREATE POLICY "Anyone can read comics"
  ON comics
  FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Only admins can insert comics"
  ON comics
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() AND role = 'ADMIN'
    )
  );

CREATE POLICY "Only admins can update comics"
  ON comics
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() AND role = 'ADMIN'
    )
  );

CREATE POLICY "Only admins can delete comics"
  ON comics
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() AND role = 'ADMIN'
    )
  );

-- RLS Policies for chapters (public read, admin write)
CREATE POLICY "Anyone can read chapters"
  ON chapters
  FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Only admins can insert chapters"
  ON chapters
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() AND role = 'ADMIN'
    )
  );

CREATE POLICY "Only admins can update chapters"
  ON chapters
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() AND role = 'ADMIN'
    )
  );

CREATE POLICY "Only admins can delete chapters"
  ON chapters
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() AND role = 'ADMIN'
    )
  );

-- RLS Policies for pages (public read, admin write)
CREATE POLICY "Anyone can read pages"
  ON pages
  FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Only admins can insert pages"
  ON pages
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() AND role = 'ADMIN'
    )
  );

CREATE POLICY "Only admins can update pages"
  ON pages
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() AND role = 'ADMIN'
    )
  );

CREATE POLICY "Only admins can delete pages"
  ON pages
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() AND role = 'ADMIN'
    )
  );

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_comics_slug ON comics(slug);
CREATE INDEX IF NOT EXISTS idx_comics_status ON comics(status);
CREATE INDEX IF NOT EXISTS idx_comics_updated_at ON comics(updated_at DESC);
CREATE INDEX IF NOT EXISTS idx_chapters_comic_id ON chapters(comic_id);
CREATE INDEX IF NOT EXISTS idx_chapters_number ON chapters(chapter_number);
CREATE INDEX IF NOT EXISTS idx_pages_chapter_id ON pages(chapter_id);
CREATE INDEX IF NOT EXISTS idx_pages_number ON pages(page_number);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for comics updated_at
CREATE TRIGGER update_comics_updated_at 
    BEFORE UPDATE ON comics 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();