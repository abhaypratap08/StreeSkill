const mysql = require('mysql2/promise');
require('dotenv').config();

const setupDatabase = async () => {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
  });

  console.log('Creating database...');
  await connection.query(`CREATE DATABASE IF NOT EXISTS ${process.env.DB_NAME || 'streeskill'}`);
  await connection.query(`USE ${process.env.DB_NAME || 'streeskill'}`);

  console.log('Creating tables...');

  // Users table
  await connection.query(`
    CREATE TABLE IF NOT EXISTS users (
      id VARCHAR(36) PRIMARY KEY,
      email VARCHAR(255) UNIQUE NOT NULL,
      password VARCHAR(255) NOT NULL,
      name VARCHAR(255) NOT NULL,
      avatar VARCHAR(500),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )
  `);

  // User preferences table
  await connection.query(`
    CREATE TABLE IF NOT EXISTS user_preferences (
      user_id VARCHAR(36) PRIMARY KEY,
      notifications BOOLEAN DEFAULT TRUE,
      auto_play BOOLEAN DEFAULT TRUE,
      download_over_wifi BOOLEAN DEFAULT TRUE,
      language VARCHAR(50) DEFAULT 'English',
      caption_languages JSON,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )
  `);

  // Courses table
  await connection.query(`
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
    )
  `);

  // Reels table
  await connection.query(`
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
    )
  `);

  // User progress table
  await connection.query(`
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
    )
  `);

  // User stats table
  await connection.query(`
    CREATE TABLE IF NOT EXISTS user_stats (
      user_id VARCHAR(36) PRIMARY KEY,
      total_sessions INT DEFAULT 0,
      minutes_learned INT DEFAULT 0,
      longest_streak INT DEFAULT 0,
      current_streak INT DEFAULT 0,
      last_activity_date DATE,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )
  `);

  // Community posts table
  await connection.query(`
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
    )
  `);

  // Post replies table
  await connection.query(`
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
    )
  `);

  // Post votes table
  await connection.query(`
    CREATE TABLE IF NOT EXISTS post_votes (
      id VARCHAR(36) PRIMARY KEY,
      post_id VARCHAR(36) NOT NULL,
      user_id VARCHAR(36) NOT NULL,
      vote_type ENUM('up', 'down') NOT NULL,
      UNIQUE KEY unique_vote (post_id, user_id),
      FOREIGN KEY (post_id) REFERENCES community_posts(id) ON DELETE CASCADE,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )
  `);

  // Products table
  await connection.query(`
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
    )
  `);

  // Orders table
  await connection.query(`
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
    )
  `);

  // Notifications table
  await connection.query(`
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
    )
  `);

  // Analytics events table
  await connection.query(`
    CREATE TABLE IF NOT EXISTS analytics_events (
      id VARCHAR(36) PRIMARY KEY,
      user_id VARCHAR(36),
      event_type VARCHAR(100) NOT NULL,
      event_data JSON,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
    )
  `);

  console.log('Inserting sample data...');

  // Insert sample courses
  const courses = [
    ['course_1', 'Mehndi Design Basics', 'Learn beautiful mehndi patterns from scratch', 'https://picsum.photos/300/200?random=1', 'Art', 45, 'Priya Sharma', 4.8, 1250],
    ['course_2', 'Embroidery Masterclass', 'Traditional embroidery techniques for beginners', 'https://picsum.photos/300/200?random=2', 'Craft', 60, 'Lakshmi Devi', 4.9, 890],
    ['course_3', 'Pickle Making', 'Homemade pickle recipes that sell', 'https://picsum.photos/300/200?random=3', 'Food', 30, 'Anita Kumari', 4.7, 2100],
    ['course_4', 'Candle Making', 'Create decorative candles at home', 'https://picsum.photos/300/200?random=4', 'Craft', 40, 'Meera Patel', 4.6, 750],
    ['course_5', 'Jewelry Design', 'Handmade jewelry basics for beginners', 'https://picsum.photos/300/200?random=5', 'Fashion', 55, 'Sunita Rao', 4.8, 1100],
  ];

  for (const course of courses) {
    await connection.query(
      'INSERT IGNORE INTO courses (id, title, description, thumbnail, category, duration, instructor, rating, enrolled_count) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
      course
    );
  }

  // Insert sample reels
  const reels = [
    ['reel_1_1', 'course_1', 'Introduction to Mehndi', 'Getting started with mehndi art', 'https://example.com/video1.mp4', 'https://picsum.photos/200/350?random=11', 60, 1, 'मेहंदी का परिचय', 'Introduction to Mehndi', 'மெஹந்தி அறிமுகம்'],
    ['reel_1_2', 'course_1', 'Basic Patterns', 'Simple designs for beginners', 'https://example.com/video2.mp4', 'https://picsum.photos/200/350?random=12', 55, 2, 'बुनियादी पैटर्न', 'Basic Patterns', 'அடிப்படை வடிவங்கள்'],
    ['reel_1_3', 'course_1', 'Floral Designs', 'Beautiful flower patterns', 'https://example.com/video3.mp4', 'https://picsum.photos/200/350?random=13', 58, 3, 'फूलों के डिज़ाइन', 'Floral Designs', 'மலர் வடிவமைப்புகள்'],
    ['reel_2_1', 'course_2', 'Thread Selection', 'Choosing the right threads', 'https://example.com/video4.mp4', 'https://picsum.photos/200/350?random=21', 50, 1, 'धागा चयन', 'Thread Selection', 'நூல் தேர்வு'],
    ['reel_2_2', 'course_2', 'Basic Stitches', 'Foundation stitches explained', 'https://example.com/video5.mp4', 'https://picsum.photos/200/350?random=22', 60, 2, 'बुनियादी टांके', 'Basic Stitches', 'அடிப்படை தையல்கள்'],
  ];

  for (const reel of reels) {
    await connection.query(
      'INSERT IGNORE INTO reels (id, course_id, title, description, video_url, thumbnail, duration, reel_order, captions_hindi, captions_english, captions_tamil) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      reel
    );
  }

  console.log('Database setup complete!');
  await connection.end();
};

setupDatabase().catch(console.error);
