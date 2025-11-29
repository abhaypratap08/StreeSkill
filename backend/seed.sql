users-- Run this in MySQL Workbench after setup.sql
USE streeskill;

-- Clear existing data for fresh seed
DELETE FROM reels;
DELETE FROM courses;

-- Insert sample courses with YouTube thumbnail URLs
INSERT INTO courses (id, title, description, thumbnail, category, duration, instructor, rating, enrolled_count) VALUES
('course_1', 'Mehndi Design Basics', 'Learn beautiful mehndi patterns from scratch', 'https://img.youtube.com/vi/7NOSDKb0HlU/maxresdefault.jpg', 'Art', 45, 'Priya Sharma', 4.8, 1250),
('course_2', 'Embroidery Masterclass', 'Traditional embroidery techniques for beginners', 'https://img.youtube.com/vi/wxWNj0Vy1IA/maxresdefault.jpg', 'Craft', 60, 'Lakshmi Devi', 4.9, 890),
('course_3', 'Pickle Making', 'Homemade pickle recipes that sell', 'https://img.youtube.com/vi/9bZkp7q19f0/maxresdefault.jpg', 'Food', 30, 'Anita Kumari', 4.7, 2100),
('course_4', 'Candle Making', 'Create decorative candles at home', 'https://img.youtube.com/vi/JGwWNGJdvx8/maxresdefault.jpg', 'Craft', 40, 'Meera Patel', 4.6, 750),
('course_5', 'Jewelry Design', 'Handmade jewelry basics for beginners', 'https://img.youtube.com/vi/OPf0YbXqDm0/maxresdefault.jpg', 'Fashion', 55, 'Sunita Rao', 4.8, 1100);

-- Insert sample reels with YouTube video IDs (format: youtube:VIDEO_ID)
INSERT INTO reels (id, course_id, title, description, video_url, thumbnail, duration, reel_order, captions_hindi, captions_english, captions_tamil) VALUES
-- Mehndi Course
('reel_1_1', 'course_1', 'Introduction to Mehndi', 'Getting started with mehndi art basics', 'youtube:7NOSDKb0HlU', 'https://img.youtube.com/vi/7NOSDKb0HlU/hqdefault.jpg', 60, 1, 'मेहंदी का परिचय', 'Introduction to Mehndi', 'மெஹந்தி அறிமுகம்'),
('reel_1_2', 'course_1', 'Basic Mehndi Patterns', 'Simple designs for beginners', 'youtube:Lp7E973zozc', 'https://img.youtube.com/vi/Lp7E973zozc/hqdefault.jpg', 55, 2, 'बुनियादी मेहंदी पैटर्न', 'Basic Mehndi Patterns', 'அடிப்படை மெஹந்தி வடிவங்கள்'),
('reel_1_3', 'course_1', 'Floral Mehndi Designs', 'Beautiful flower patterns', 'youtube:K8nrF5aXPlQ', 'https://img.youtube.com/vi/K8nrF5aXPlQ/hqdefault.jpg', 58, 3, 'फूलों की मेहंदी डिज़ाइन', 'Floral Mehndi Designs', 'மலர் மெஹந்தி வடிவமைப்புகள்'),

-- Embroidery Course
('reel_2_1', 'course_2', 'Embroidery Thread Selection', 'Choosing the right threads', 'youtube:wxWNj0Vy1IA', 'https://img.youtube.com/vi/wxWNj0Vy1IA/hqdefault.jpg', 50, 1, 'कढ़ाई के धागे का चयन', 'Embroidery Thread Selection', 'எம்பிராய்டரி நூல் தேர்வு'),
('reel_2_2', 'course_2', 'Basic Embroidery Stitches', 'Foundation stitches explained', 'youtube:grTFoLVSpLM', 'https://img.youtube.com/vi/grTFoLVSpLM/hqdefault.jpg', 60, 2, 'बुनियादी कढ़ाई के टांके', 'Basic Embroidery Stitches', 'அடிப்படை எம்பிராய்டரி தையல்கள்'),

-- Pickle Making Course
('reel_3_1', 'course_3', 'Pickle Making Basics', 'Essential ingredients and tools', 'youtube:9bZkp7q19f0', 'https://img.youtube.com/vi/9bZkp7q19f0/hqdefault.jpg', 45, 1, 'अचार बनाने की मूल बातें', 'Pickle Making Basics', 'ஊறுகாய் செய்யும் அடிப்படைகள்'),
('reel_3_2', 'course_3', 'Mango Pickle Recipe', 'Traditional mango pickle', 'youtube:kJQP7kiw5Fk', 'https://img.youtube.com/vi/kJQP7kiw5Fk/hqdefault.jpg', 50, 2, 'आम का अचार रेसिपी', 'Mango Pickle Recipe', 'மாங்காய் ஊறுகாய் செய்முறை'),

-- Candle Making Course
('reel_4_1', 'course_4', 'Candle Making Introduction', 'Getting started with candles', 'youtube:JGwWNGJdvx8', 'https://img.youtube.com/vi/JGwWNGJdvx8/hqdefault.jpg', 55, 1, 'मोमबत्ती बनाने का परिचय', 'Candle Making Introduction', 'மெழுகுவர்த்தி செய்யும் அறிமுகம்'),
('reel_4_2', 'course_4', 'Decorative Candles', 'Create beautiful candles', 'youtube:dQw4w9WgXcQ', 'https://img.youtube.com/vi/dQw4w9WgXcQ/hqdefault.jpg', 60, 2, 'सजावटी मोमबत्तियां', 'Decorative Candles', 'அலங்கார மெழுகுவர்த்திகள்'),

-- Jewelry Design Course
('reel_5_1', 'course_5', 'Jewelry Making Tools', 'Essential tools for jewelry', 'youtube:OPf0YbXqDm0', 'https://img.youtube.com/vi/OPf0YbXqDm0/hqdefault.jpg', 50, 1, 'आभूषण बनाने के उपकरण', 'Jewelry Making Tools', 'நகை செய்யும் கருவிகள்'),
('reel_5_2', 'course_5', 'Beaded Jewelry Basics', 'Create beaded jewelry', 'youtube:fJ9rUzIMcZQ', 'https://img.youtube.com/vi/fJ9rUzIMcZQ/hqdefault.jpg', 55, 2, 'मोतियों के आभूषण', 'Beaded Jewelry Basics', 'மணி நகை அடிப்படைகள்');

SELECT 'Database seeded with YouTube videos!' as Status;
