-- Create table for Invitation Templates
create table
  public.invitation_templates (
    id uuid not null default gen_random_uuid (),
    created_at timestamp with time zone not null default now(),
    name character varying not null,
    category character varying not null, -- e.g., 'Wedding', 'Engagement', 'Birthday'
    thumbnail_url text not null,
    background_url text not null,
    default_text_color character varying not null default '#000000',
    constraint invitation_templates_pkey primary key (id)
  );

-- Create table for User Saved Invitations
create table
  public.user_invitations (
    id uuid not null default gen_random_uuid (),
    created_at timestamp with time zone not null default now(),
    user_id uuid not null references auth.users (id) on delete cascade,
    template_id uuid not null references public.invitation_templates (id),
    event_title character varying not null,
    host_name character varying not null,
    event_date date not null,
    event_time time without time zone not null,
    venue_name character varying not null,
    venue_address text not null,
    additional_notes text,
    custom_text_color character varying,
    constraint user_invitations_pkey primary key (id)
  );

-- Insert dummy templates
insert into public.invitation_templates (name, category, thumbnail_url, background_url, default_text_color)
values 
  ('Classic Gold', 'Wedding', 'https://images.unsplash.com/photo-1544531585-9ec482bdbe76?w=400&q=80', 'https://images.unsplash.com/photo-1544531585-9ec482bdbe76?w=800&q=80', '#b8860b'),
  ('Elegant Floral', 'Engagement', 'https://images.unsplash.com/photo-1505932794465-147d1f1b2c97?w=400&q=80', 'https://images.unsplash.com/photo-1505932794465-147d1f1b2c97?w=800&q=80', '#2d3748'),
  ('Royal Palace', 'Wedding', 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=400&q=80', 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=800&q=80', '#1a365d');

-- Enable RLS
alter table public.invitation_templates enable row level security;
alter table public.user_invitations enable row level security;

-- Policies for templates (Public Read)
create policy "Allow public read access to templates" on public.invitation_templates for select using (true);
create policy "Only admins can modify templates" on public.invitation_templates using (false); -- Assuming no admin panel yet

-- Policies for user invitations
create policy "Users can read own invitations" on public.user_invitations for select using (auth.uid() = user_id);
create policy "Users can insert own invitations" on public.user_invitations for insert with check (auth.uid() = user_id);
create policy "Users can update own invitations" on public.user_invitations for update using (auth.uid() = user_id);
create policy "Users can delete own invitations" on public.user_invitations for delete using (auth.uid() = user_id);
