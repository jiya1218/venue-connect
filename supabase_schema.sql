-- Create table for Get Quote leads
create table
  public.venue_leads (
    id uuid not null default gen_random_uuid (),
    created_at timestamp with time zone not null default now(),
    venue_name character varying not null,
    event_date text not null,
    guest_count integer not null,
    name character varying not null,
    phone character varying not null,
    email character varying not null,
    requirements text null,
    status character varying not null default 'new'::character varying,
    constraint venue_leads_pkey primary key (id)
  );

-- Create table for Venue Listing Applications
create table
  public.venue_applications (
    id uuid not null default gen_random_uuid (),
    created_at timestamp with time zone not null default now(),
    business_name character varying not null,
    contact_person character varying not null,
    business_email character varying not null,
    business_phone character varying not null,
    address text not null,
    city character varying not null,
    venue_type text not null,
    capacity integer not null,
    price_per_plate integer null,
    amenities text[] null,
    description text null,
    image_url text null,
    status character varying not null default 'pending'::character varying,
    constraint venue_applications_pkey primary key (id)
  );

-- Enable Row Level Security (RLS) but allow anonymous inserts for forms
alter table public.venue_leads enable row level security;
alter table public.venue_applications enable row level security;

-- Create policies to allow anyone to insert into these tables (since public users submit forms)
create policy "Allow public inserts to venue_leads" on public.venue_leads for insert with check (true);
create policy "Allow public inserts to venue_applications" on public.venue_applications for insert with check (true);

-- Create policies to allow only authenticated users to read (later we can restrict to admins)
create policy "Allow read access to authenticated users only for leads" on public.venue_leads for select to authenticated using (true);
create policy "Allow read access to authenticated users only for applications" on public.venue_applications for select to authenticated using (true);

-- Also, please manually create a Storage Bucket named: venue_applications_images
-- And set it to "Public" so images can be viewed.
