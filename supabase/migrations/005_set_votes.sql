-- Set votes: community fire/cold ratings for artist sets
-- Users can vote 'fire' or 'cold' on any set they attended
-- Votes are per-user, per-set, per-edition. Toggling the same vote removes it.

CREATE TABLE IF NOT EXISTS set_votes (
  id            UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id       UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  set_id        TEXT NOT NULL,
  edition_year  INT NOT NULL,
  vote          TEXT NOT NULL CHECK (vote IN ('fire', 'cold')),
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, set_id, edition_year)
);

-- Index for fast aggregate queries by set
CREATE INDEX IF NOT EXISTS set_votes_set_idx ON set_votes(set_id, edition_year);

-- Row-level security
ALTER TABLE set_votes ENABLE ROW LEVEL SECURITY;

-- Users can read all votes (for community counts)
CREATE POLICY "votes_read_all" ON set_votes
  FOR SELECT USING (true);

-- Users can insert their own votes
CREATE POLICY "votes_insert_own" ON set_votes
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can delete their own votes (toggle off)
CREATE POLICY "votes_delete_own" ON set_votes
  FOR DELETE USING (auth.uid() = user_id);

-- Users can update their own votes (fire ↔ cold)
CREATE POLICY "votes_update_own" ON set_votes
  FOR UPDATE USING (auth.uid() = user_id);

-- Convenience view: aggregate counts per set
CREATE OR REPLACE VIEW set_vote_counts AS
SELECT
  set_id,
  edition_year,
  COUNT(*) FILTER (WHERE vote = 'fire') AS fire_count,
  COUNT(*) FILTER (WHERE vote = 'cold') AS cold_count
FROM set_votes
GROUP BY set_id, edition_year;
