/*
  # Create content sources table

  1. New Tables
    - `content_sources`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to auth.users)
      - `name` (text) - Name of the content source
      - `url` (text) - URL of the content source
      - `description` (text) - Description of the source
      - `category` (text) - Category/type of source
      - `is_selected` (boolean) - Whether user has selected this source
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on `content_sources` table
    - Add policy for users to read their own sources
    - Add policy for users to insert their own sources
    - Add policy for users to update their own sources
    - Add policy for users to delete their own sources
*/

CREATE TABLE IF NOT EXISTS content_sources (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name text NOT NULL,
  url text NOT NULL,
  description text DEFAULT '',
  category text DEFAULT 'General',
  is_selected boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE content_sources ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own content sources"
  ON content_sources FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own content sources"
  ON content_sources FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own content sources"
  ON content_sources FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own content sources"
  ON content_sources FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_content_sources_user_id ON content_sources(user_id);
CREATE INDEX IF NOT EXISTS idx_content_sources_created_at ON content_sources(created_at DESC);
