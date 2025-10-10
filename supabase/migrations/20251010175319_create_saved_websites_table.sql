/*
  # Create saved websites table for Idea Bank

  1. New Tables
    - `saved_websites`
      - `id` (uuid, primary key) - Unique identifier for each saved website
      - `user_id` (uuid, foreign key) - References the user who saved the website
      - `url` (text) - The full URL of the website
      - `domain` (text) - The domain name extracted from the URL
      - `name` (text) - Display name for the website
      - `note` (text, optional) - User's note about the website
      - `last_used_at` (timestamptz) - When the website was last used to generate ideas
      - `created_at` (timestamptz) - When the website was added
      - `updated_at` (timestamptz) - When the record was last updated

  2. Security
    - Enable RLS on `saved_websites` table
    - Add policy for authenticated users to read their own websites
    - Add policy for authenticated users to insert their own websites
    - Add policy for authenticated users to update their own websites
    - Add policy for authenticated users to delete their own websites

  3. Indexes
    - Index on user_id for faster queries
    - Index on domain for duplicate checking
*/

CREATE TABLE IF NOT EXISTS saved_websites (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  url text NOT NULL,
  domain text NOT NULL,
  name text NOT NULL,
  note text DEFAULT '',
  last_used_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE saved_websites ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own websites"
  ON saved_websites FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own websites"
  ON saved_websites FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own websites"
  ON saved_websites FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own websites"
  ON saved_websites FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_saved_websites_user_id ON saved_websites(user_id);
CREATE INDEX IF NOT EXISTS idx_saved_websites_domain ON saved_websites(domain, user_id);