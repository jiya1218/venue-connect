-- ============================================================
-- PART 1: Create all city locations
-- Small file - safe to run first
-- ============================================================

INSERT INTO public.locations (city, city_slug, area, area_slug, state)
VALUES
  ('Ahmedabad', 'ahmedabad', 'Ahmedabad', 'ahmedabad', 'Gujarat'),
  ('Surat', 'surat', 'Surat', 'surat', 'Gujarat'),
  ('Vadodara', 'vadodara', 'Vadodara', 'vadodara', 'Gujarat'),
  ('Rajkot', 'rajkot', 'Rajkot', 'rajkot', 'Gujarat'),
  ('Gandhinagar', 'gandhinagar', 'Gandhinagar', 'gandhinagar', 'Gujarat'),
  ('Bhavnagar', 'bhavnagar', 'Bhavnagar', 'bhavnagar', 'Gujarat'),
  ('Jamnagar', 'jamnagar', 'Jamnagar', 'jamnagar', 'Gujarat'),
  ('Anand', 'anand', 'Anand', 'anand', 'Gujarat'),
  ('Junagadh', 'junagadh', 'Junagadh', 'junagadh', 'Gujarat'),
  ('Gandhidham', 'gandhidham', 'Gandhidham', 'gandhidham', 'Gujarat'),
  ('Navsari', 'navsari', 'Navsari', 'navsari', 'Gujarat'),
  ('Morbi', 'morbi', 'Morbi', 'morbi', 'Gujarat'),
  ('Bhuj', 'bhuj', 'Bhuj', 'bhuj', 'Gujarat'),
  ('Valsad', 'valsad', 'Valsad', 'valsad', 'Gujarat'),
  ('Palanpur', 'palanpur', 'Palanpur', 'palanpur', 'Gujarat'),
  ('Dahod', 'dahod', 'Dahod', 'dahod', 'Gujarat')
ON CONFLICT (city, area) DO NOTHING;

SELECT COUNT(*) as locations_created FROM public.locations;
