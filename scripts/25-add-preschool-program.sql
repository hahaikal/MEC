INSERT INTO public.programs (name, description, duration_months, price, is_active)
SELECT 
  'MEC PRESCHOOL',
  'Program prasekolah yang mengintegrasikan metode bermain sambil belajar bahasa Inggris. Memfokuskan pada pengembangan motorik, sosial emosional, dan kognitif anak usia dini.',
  12,
  475000,
  true
WHERE NOT EXISTS (
    SELECT 1 FROM public.programs WHERE name = 'MEC PRESCHOOL'
);