-- Create the transactions table
CREATE TABLE transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  amount DECIMAL(12, 2) NOT NULL,
  category TEXT NOT NULL,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  notes TEXT,
  type TEXT NOT NULL CHECK (type IN ('income', 'expense')),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Set up Row Level Security (RLS)
-- For personal use, you can disable RLS or allow all access for now.
-- To allow all access (not recommended for production but okay for private local personal apps):
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all access" ON transactions FOR ALL USING (true);
