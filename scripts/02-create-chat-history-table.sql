-- Create chat_history table to store user analysis results
CREATE TABLE IF NOT EXISTS chat_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  pdf_filename TEXT NOT NULL,
  analysis_results JSONB NOT NULL,
  marks_total INT,
  important_count INT DEFAULT 0,
  medium_count INT DEFAULT 0,
  easy_count INT DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE chat_history ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Users can only see their own analysis history
CREATE POLICY "Users can view their own chat history"
  ON chat_history
  FOR SELECT
  USING (auth.uid() = user_id);

-- RLS Policy: Users can insert their own analysis
CREATE POLICY "Users can insert their own analysis"
  ON chat_history
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- RLS Policy: Users can update their own analysis
CREATE POLICY "Users can update their own analysis"
  ON chat_history
  FOR UPDATE
  USING (auth.uid() = user_id);

-- Create index for faster queries
CREATE INDEX idx_chat_history_user_id ON chat_history(user_id);
CREATE INDEX idx_chat_history_created_at ON chat_history(created_at DESC);
