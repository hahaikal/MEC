-- ============================================================
-- Seed data for gallery_items (development/testing only)
-- ============================================================

INSERT INTO public.gallery_items (title, description, image_url, category, is_active, order_index) VALUES
  ('English Class Fun Day', 'Students enjoying interactive English activities and games.', 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=800&h=600&q=80', 'english-class', true, 1),
  ('Reading Circle', 'Weekly reading circle session with our English teachers.', 'https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?auto=format&fit=crop&w=800&h=600&q=80', 'english-class', true, 2),
  ('Grammar Workshop', 'Hands-on grammar workshop for intermediate students.', 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=800&h=600&q=80', 'english-class', true, 3),
  ('Tutoring Math Session', 'Small group math tutoring with personalized attention.', 'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=800&h=600&q=80', 'bimbel', true, 1),
  ('Science Experiment', 'Students conducting science experiments in tutoring class.', 'https://images.unsplash.com/photo-1588072432836-e10032774350?auto=format&fit=crop&w=800&h=600&q=80', 'bimbel', true, 2),
  ('Early Literacy Fun', 'Children learning to read through play-based methods.', 'https://images.unsplash.com/photo-1571260899304-425eee4c7efc?auto=format&fit=crop&w=800&h=600&q=80', 'calistung', true, 1),
  ('Counting Games', 'Fun counting activities for early learners.', 'https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?auto=format&fit=crop&w=800&h=600&q=80', 'calistung', true, 2),
  ('Preschool Circle Time', 'Morning circle time with songs and stories.', 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&w=800&h=600&q=80', 'preschool', true, 1),
  ('Preschool Art Class', 'Creative art session with our little learners.', 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?auto=format&fit=crop&w=800&h=600&q=80', 'preschool', true, 2),
  ('Preschool Outdoor Play', 'Physical education and outdoor activities.', 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=800&h=600&q=80', 'preschool', true, 3),
  ('Spelling Bee Championship', 'Annual academy-level spelling competition.', 'https://images.unsplash.com/photo-1564429097439-e4ffa3a3ab16?auto=format&fit=crop&w=800&h=600&q=80', 'event', true, 1),
  ('Summer Camp 2026', 'Summer camping activities with an Explorers theme.', 'https://images.unsplash.com/photo-1610484826967-09c5720778c7?auto=format&fit=crop&w=800&h=600&q=80', 'event', true, 2),
  ('Graduation Day', 'Graduation celebration for Preschool and English Class students.', 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=800&h=600&q=80', 'event', true, 3)
ON CONFLICT DO NOTHING;
