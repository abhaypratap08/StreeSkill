CREATE DATABASE IF NOT EXISTS streeskill;

-- Run this in MySQL Workbench
USE streeskill;

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id VARCHAR(36) PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  avatar VARCHAR(500),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- User preferences table
CREATE TABLE IF NOT EXISTS user_preferences (
  user_id VARCHAR(36) PRIMARY KEY,
  notifications BOOLEAN DEFAULT TRUE,
  auto_play BOOLEAN DEFAULT TRUE,
  download_over_wifi BOOLEAN DEFAULT TRUE,
  language VARCHAR(50) DEFAULT 'English',
  caption_languages JSON,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Courses table
CREATE TABLE IF NOT EXISTS courses (
  id VARCHAR(36) PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  thumbnail VARCHAR(500),
  category VARCHAR(100),
  duration INT DEFAULT 0,
  instructor VARCHAR(255),
  rating DECIMAL(2,1) DEFAULT 0,
  enrolled_count INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Reels table
CREATE TABLE IF NOT EXISTS reels (
  id VARCHAR(36) PRIMARY KEY,
  course_id VARCHAR(36) NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  video_url VARCHAR(500),
  thumbnail VARCHAR(500),
  duration INT DEFAULT 60,
  reel_order INT DEFAULT 0,
  captions_hindi TEXT,
  captions_english TEXT,
  captions_tamil TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE
);

-- User progress table
CREATE TABLE IF NOT EXISTS user_progress (
  id VARCHAR(36) PRIMARY KEY,
  user_id VARCHAR(36) NOT NULL,
  course_id VARCHAR(36) NOT NULL,
  reel_id VARCHAR(36) NOT NULL,
  completed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY unique_progress (user_id, course_id, reel_id),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE,
  FOREIGN KEY (reel_id) REFERENCES reels(id) ON DELETE CASCADE
);

-- User stats table
CREATE TABLE IF NOT EXISTS user_stats (
  user_id VARCHAR(36) PRIMARY KEY,
  total_sessions INT DEFAULT 0,
  minutes_learned INT DEFAULT 0,
  longest_streak INT DEFAULT 0,
  current_streak INT DEFAULT 0,
  last_activity_date DATE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Community posts table
CREATE TABLE IF NOT EXISTS community_posts (
  id VARCHAR(36) PRIMARY KEY,
  user_id VARCHAR(36) NOT NULL,
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  category VARCHAR(100),
  upvotes INT DEFAULT 0,
  downvotes INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Post replies table
CREATE TABLE IF NOT EXISTS post_replies (
  id VARCHAR(36) PRIMARY KEY,
  post_id VARCHAR(36) NOT NULL,
  user_id VARCHAR(36) NOT NULL,
  content TEXT NOT NULL,
  upvotes INT DEFAULT 0,
  downvotes INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (post_id) REFERENCES community_posts(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Post votes table
CREATE TABLE IF NOT EXISTS post_votes (
  id VARCHAR(36) PRIMARY KEY,
  post_id VARCHAR(36) NOT NULL,
  user_id VARCHAR(36) NOT NULL,
  vote_type ENUM('up', 'down') NOT NULL,
  UNIQUE KEY unique_vote (post_id, user_id),
  FOREIGN KEY (post_id) REFERENCES community_posts(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Products table
CREATE TABLE IF NOT EXISTS products (
  id VARCHAR(36) PRIMARY KEY,
  user_id VARCHAR(36) NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  images JSON,
  category VARCHAR(100),
  status ENUM('active', 'sold', 'inactive') DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Orders table
CREATE TABLE IF NOT EXISTS orders (
  id VARCHAR(36) PRIMARY KEY,
  product_id VARCHAR(36) NOT NULL,
  seller_id VARCHAR(36) NOT NULL,
  buyer_id VARCHAR(36) NOT NULL,
  buyer_name VARCHAR(255),
  amount DECIMAL(10,2) NOT NULL,
  status ENUM('pending', 'confirmed', 'shipped', 'delivered', 'cancelled') DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (product_id) REFERENCES products(id),
  FOREIGN KEY (seller_id) REFERENCES users(id),
  FOREIGN KEY (buyer_id) REFERENCES users(id)
);

-- Notifications table
CREATE TABLE IF NOT EXISTS notifications (
  id VARCHAR(36) PRIMARY KEY,
  user_id VARCHAR(36) NOT NULL,
  type ENUM('course', 'community', 'order', 'system') NOT NULL,
  title VARCHAR(255) NOT NULL,
  message TEXT,
  is_read BOOLEAN DEFAULT FALSE,
  data JSON,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Analytics events table
CREATE TABLE IF NOT EXISTS analytics_events (
  id VARCHAR(36) PRIMARY KEY,
  user_id VARCHAR(36),
  event_type VARCHAR(100) NOT NULL,
  event_data JSON,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);
