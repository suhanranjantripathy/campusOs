-- Enable necessary extensions
create extension if not exists "uuid-ossp";

-- Users table
create table public.users (
  id uuid references auth.users not null primary key,
  email text unique not null,
  full_name text,
  avatar_url text,
  semester integer default 1,
  department text,
  newton_session_token text, -- Encrypted in application layer
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Subjects table
create table public.subjects (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.users(id) on delete cascade not null,
  name text not null,
  code text not null,
  faculty text,
  credits integer,
  color text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Attendance table
create table public.attendance (
  id uuid default uuid_generate_v4() primary key,
  subject_id uuid references public.subjects(id) on delete cascade not null,
  user_id uuid references public.users(id) on delete cascade not null,
  date date not null,
  status text check (status in ('present', 'absent', 'late', 'excused')) not null,
  notes text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Assignments table
create table public.assignments (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.users(id) on delete cascade not null,
  subject_id uuid references public.subjects(id) on delete cascade,
  title text not null,
  description text,
  due_date timestamp with time zone not null,
  priority text check (priority in ('low', 'medium', 'high')) default 'medium',
  status text check (status in ('todo', 'in_progress', 'completed')) default 'todo',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Calendar Events table
create table public.calendar_events (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.users(id) on delete cascade not null,
  title text not null,
  description text,
  start_time timestamp with time zone not null,
  end_time timestamp with time zone not null,
  category text check (category in ('exam', 'midsem', 'endsem', 'holiday', 'registration', 'viva', 'event', 'review', 'submission', 'other')) default 'other',
  color text,
  is_all_day boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Milestones (Projects) table
create table public.milestones (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.users(id) on delete cascade not null,
  title text not null,
  description text,
  status text check (status in ('backlog', 'todo', 'in_progress', 'completed')) default 'todo',
  estimated_hours numeric,
  due_date timestamp with time zone,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Milestone Tasks table (for checklist)
create table public.milestone_tasks (
  id uuid default uuid_generate_v4() primary key,
  milestone_id uuid references public.milestones(id) on delete cascade not null,
  title text not null,
  is_completed boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Study Sessions (AI Planner) table
create table public.study_sessions (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.users(id) on delete cascade not null,
  title text not null,
  start_time timestamp with time zone not null,
  end_time timestamp with time zone not null,
  subject_id uuid references public.subjects(id) on delete set null,
  focus_score integer,
  completed boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Notifications table
create table public.notifications (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.users(id) on delete cascade not null,
  title text not null,
  message text not null,
  type text check (type in ('attendance', 'assignment', 'exam', 'system')) not null,
  is_read boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- RLS setup (Example: Users can only see their own data)
alter table public.users enable row level security;
alter table public.subjects enable row level security;
alter table public.attendance enable row level security;
alter table public.assignments enable row level security;
alter table public.calendar_events enable row level security;
alter table public.milestones enable row level security;
alter table public.milestone_tasks enable row level security;
alter table public.study_sessions enable row level security;
alter table public.notifications enable row level security;

-- Create policies for Users
create policy "Users can view own data."
  on public.users for select
  using ( auth.uid() = id );
create policy "Users can update own data."
  on public.users for update
  using ( auth.uid() = id );

-- Create policies for other tables based on user_id
create policy "Users can view own subjects."
  on public.subjects for select using ( auth.uid() = user_id );
create policy "Users can insert own subjects."
  on public.subjects for insert with check ( auth.uid() = user_id );
create policy "Users can update own subjects."
  on public.subjects for update using ( auth.uid() = user_id );
create policy "Users can delete own subjects."
  on public.subjects for delete using ( auth.uid() = user_id );

-- (Similar policies apply to the rest of the tables)
