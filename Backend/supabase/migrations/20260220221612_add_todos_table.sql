CREATE TABLE IF NOT EXISTS public.todos (
  -- Use 'bigint' or 'uuid' for the ID. Identity makes it auto-increment.
  id bigint primary key generated always as identity,
  
  -- The actual task text
  task text not null,
  
  -- Status of the task
  is_complete boolean default false,
  
  -- Timestamp: 'now()' sets the time automatically on insert
  inserted_at timestamptz default now() not null
  
  -- OPTIONAL: Link this to a Supabase User (RLS)
  -- user_id uuid references auth.users not null default auth.uid()
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.todos ENABLE ROW LEVEL SECURITY;

-- Create a policy: Allow anyone to read (for now, while testing)
CREATE POLICY "Public todos are viewable by everyone" 
ON public.todos FOR SELECT USING (true);