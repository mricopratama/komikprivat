/*
  # Seed Comics Data

  1. Sample Data
    - Add sample comics with various genres
    - Add sample chapters for each comic
    - Add sample pages for chapters

  2. Data Structure
    - 10 sample comics with different genres and statuses
    - Multiple chapters per comic
    - Sample pages with placeholder images
*/

-- Insert sample comics
INSERT INTO comics (title, slug, author, synopsis, status, cover_image_url, genres, created_at, updated_at) VALUES
(
  'Solo Leveling',
  'solo-leveling',
  'Chugong',
  'In a world where hunters battle monsters that emerge from mysterious gates, Sung Jin-Woo is the weakest of all hunters. But when he finds himself trapped in a deadly dungeon, he discovers a mysterious system that allows him to level up in ways no one else can.',
  'COMPLETED',
  'https://images.pexels.com/photos/1741230/pexels-photo-1741230.jpeg',
  ARRAY['Action', 'Fantasy', 'Adventure'],
  NOW() - INTERVAL '30 days',
  NOW() - INTERVAL '1 day'
),
(
  'Tower of God',
  'tower-of-god',
  'SIU',
  'Bam, a boy who was trapped under a mysterious tower his whole life, enters the Tower to chase after his closest friend Rachel. However, to climb the tower, he must face challenges and tests on each floor.',
  'ONGOING',
  'https://images.pexels.com/photos/2662116/pexels-photo-2662116.jpeg',
  ARRAY['Action', 'Adventure', 'Mystery'],
  NOW() - INTERVAL '25 days',
  NOW() - INTERVAL '2 hours'
),
(
  'The Beginning After The End',
  'the-beginning-after-the-end',
  'TurtleMe',
  'King Grey has unrivaled strength, wealth, and prestige in a world governed by martial ability. However, solitude lingers closely behind those with great power. Beneath the glamorous exterior of a powerful king lurks the shell of man, devoid of purpose and will.',
  'ONGOING',
  'https://images.pexels.com/photos/3861969/pexels-photo-3861969.jpeg',
  ARRAY['Fantasy', 'Action', 'Drama'],
  NOW() - INTERVAL '20 days',
  NOW() - INTERVAL '3 hours'
),
(
  'Omniscient Reader',
  'omniscient-reader',
  'Sing Shong',
  'Dokja was an average office worker whose sole interest was reading his favorite web novel. But when the novel suddenly becomes reality, he is the only person who knows how the world will end. Armed with this realization, Dokja uses his understanding to change the course of the story.',
  'ONGOING',
  'https://images.pexels.com/photos/1370298/pexels-photo-1370298.jpeg',
  ARRAY['Action', 'Fantasy', 'Thriller'],
  NOW() - INTERVAL '15 days',
  NOW() - INTERVAL '5 hours'
),
(
  'Noblesse',
  'noblesse',
  'Son Jeho',
  'Rai wakes up from 820-years long sleep and starts a new life as a student in a high school founded by his loyal servant, Frankenstein. But his peaceful days with other human students are soon interrupted by mysterious attackers known as the "Unions".',
  'COMPLETED',
  'https://images.pexels.com/photos/2662116/pexels-photo-2662116.jpeg',
  ARRAY['Action', 'Supernatural', 'School'],
  NOW() - INTERVAL '45 days',
  NOW() - INTERVAL '10 days'
),
(
  'Lookism',
  'lookism',
  'Park Taejoon',
  'Park Hyung Suk, overweight and unattractive, is bullied and abused on a daily basis. But a miracle is about to happen. He wakes up in a different body, one that is tall, muscular, and handsome. But there is a catch - he can only use this body when his original body is asleep.',
  'ONGOING',
  'https://images.pexels.com/photos/1370298/pexels-photo-1370298.jpeg',
  ARRAY['Drama', 'School', 'Action'],
  NOW() - INTERVAL '12 days',
  NOW() - INTERVAL '1 hour'
),
(
  'Unordinary',
  'unordinary',
  'uru-chan',
  'In a world where everyone has supernatural abilities, John pretends to be powerless. But when he finally reveals his true strength, everything changes. This is a story about power, friendship, and the consequences of hiding who you really are.',
  'ONGOING',
  'https://images.pexels.com/photos/3861969/pexels-photo-3861969.jpeg',
  ARRAY['Action', 'School', 'Supernatural'],
  NOW() - INTERVAL '8 days',
  NOW() - INTERVAL '6 hours'
),
(
  'The God of High School',
  'the-god-of-high-school',
  'Yongje Park',
  'A tournament to determine the strongest high school student begins. Mori Jin, a Taekwondo specialist and a high school student, soon learns that there is something much greater beneath the stage of the tournament.',
  'COMPLETED',
  'https://images.pexels.com/photos/1741230/pexels-photo-1741230.jpeg',
  ARRAY['Action', 'Martial Arts', 'Tournament'],
  NOW() - INTERVAL '35 days',
  NOW() - INTERVAL '7 days'
),
(
  'Sweet Home',
  'sweet-home',
  'Carnby Kim',
  'Cha Hyun-soo is a high school student who becomes a recluse after his family dies in a car accident. But when monsters start appearing and attacking people, he must leave his apartment and fight for survival.',
  'COMPLETED',
  'https://images.pexels.com/photos/2662116/pexels-photo-2662116.jpeg',
  ARRAY['Horror', 'Thriller', 'Survival'],
  NOW() - INTERVAL '40 days',
  NOW() - INTERVAL '15 days'
),
(
  'Hardcore Leveling Warrior',
  'hardcore-leveling-warrior',
  'Sehoon Kim',
  'Known as Hardcore Leveling Warrior, Ethan is the #1 player of the world''s biggest MMORPG. But when a mysterious player kills him and forces his character back to level 1, he will do anything to get back on top.',
  'ONGOING',
  'https://images.pexels.com/photos/1370298/pexels-photo-1370298.jpeg',
  ARRAY['Action', 'Gaming', 'Adventure'],
  NOW() - INTERVAL '5 days',
  NOW() - INTERVAL '30 minutes'
);

-- Get comic IDs for inserting chapters
DO $$
DECLARE
    comic_record RECORD;
    chapter_count INTEGER;
    page_count INTEGER;
    i INTEGER;
    j INTEGER;
BEGIN
    -- Insert chapters for each comic
    FOR comic_record IN SELECT id, slug FROM comics LOOP
        -- Determine number of chapters based on comic
        CASE comic_record.slug
            WHEN 'solo-leveling' THEN chapter_count := 179;
            WHEN 'tower-of-god' THEN chapter_count := 590;
            WHEN 'the-beginning-after-the-end' THEN chapter_count := 180;
            WHEN 'omniscient-reader' THEN chapter_count := 200;
            WHEN 'noblesse' THEN chapter_count := 544;
            WHEN 'lookism' THEN chapter_count := 480;
            WHEN 'unordinary' THEN chapter_count := 320;
            WHEN 'the-god-of-high-school' THEN chapter_count := 569;
            WHEN 'sweet-home' THEN chapter_count := 141;
            WHEN 'hardcore-leveling-warrior' THEN chapter_count := 380;
            ELSE chapter_count := 50;
        END CASE;

        -- Insert first 10 chapters for each comic (to keep data manageable)
        FOR i IN 1..LEAST(chapter_count, 10) LOOP
            INSERT INTO chapters (chapter_number, title, comic_id, created_at) VALUES
            (
                i,
                CASE 
                    WHEN i = 1 THEN 'The Beginning'
                    WHEN i = 2 THEN 'First Steps'
                    WHEN i = 3 THEN 'New Powers'
                    WHEN i = 4 THEN 'The Challenge'
                    WHEN i = 5 THEN 'Unexpected Ally'
                    WHEN i = 6 THEN 'Rising Tension'
                    WHEN i = 7 THEN 'The Battle'
                    WHEN i = 8 THEN 'Revelation'
                    WHEN i = 9 THEN 'New Enemies'
                    WHEN i = 10 THEN 'Cliffhanger'
                    ELSE 'Chapter ' || i
                END,
                comic_record.id,
                NOW() - ((11 - i) * INTERVAL '1 day')
            );
        END LOOP;
    END LOOP;

    -- Insert pages for chapters
    FOR comic_record IN 
        SELECT c.id as chapter_id, co.slug 
        FROM chapters c 
        JOIN comics co ON c.comic_id = co.id 
    LOOP
        -- Each chapter has 15-25 pages
        page_count := 15 + (RANDOM() * 10)::INTEGER;
        
        FOR j IN 1..page_count LOOP
            INSERT INTO pages (page_number, image_url, chapter_id) VALUES
            (
                j,
                CASE (j % 5)
                    WHEN 0 THEN 'https://images.pexels.com/photos/1741230/pexels-photo-1741230.jpeg'
                    WHEN 1 THEN 'https://images.pexels.com/photos/2662116/pexels-photo-2662116.jpeg'
                    WHEN 2 THEN 'https://images.pexels.com/photos/3861969/pexels-photo-3861969.jpeg'
                    WHEN 3 THEN 'https://images.pexels.com/photos/1370298/pexels-photo-1370298.jpeg'
                    ELSE 'https://images.pexels.com/photos/1741230/pexels-photo-1741230.jpeg'
                END,
                comic_record.chapter_id
            );
        END LOOP;
    END LOOP;
END $$;

-- Create an admin user for testing
INSERT INTO users (username, email, password, role, created_at) VALUES
(
    'admin',
    'admin@comichub.com',
    '$2b$10$rOzJqQqQqQqQqQqQqQqQqO', -- This is a placeholder hash, you should use proper bcrypt
    'ADMIN',
    NOW()
),
(
    'testuser',
    'user@comichub.com',
    '$2b$10$rOzJqQqQqQqQqQqQqQqQqO', -- This is a placeholder hash
    'USER',
    NOW()
);