const express = require('express');
const { v4: uuidv4 } = require('uuid');
const pool = require('../config/database');
const { authMiddleware, optionalAuth } = require('../middleware/auth');

const router = express.Router();

// GET /courses
router.get('/', optionalAuth, async (req, res) => {
  try {
    const { category } = req.query;
    let query = 'SELECT * FROM courses';
    const params = [];

    if (category) {
      query += ' WHERE category = ?';
      params.push(category);
    }

    query += ' ORDER BY created_at DESC';

    const [courses] = await pool.query(query, params);

    // Get reel count for each course
    for (const course of courses) {
      const [reels] = await pool.query('SELECT COUNT(*) as count FROM reels WHERE course_id = ?', [course.id]);
      course.reelsCount = reels[0].count;
    }

    res.json({ success: true, data: courses });
  } catch (error) {
    console.error('Get courses error:', error);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

// GET /courses/:id
router.get('/:id', optionalAuth, async (req, res) => {
  try {
    const [courses] = await pool.query('SELECT * FROM courses WHERE id = ?', [req.params.id]);
    if (courses.length === 0) {
      return res.status(404).json({ success: false, error: 'Course not found' });
    }

    const [reels] = await pool.query('SELECT * FROM reels WHERE course_id = ? ORDER BY reel_order', [req.params.id]);

    const course = courses[0];
    course.reels = reels.map(r => ({
      id: r.id,
      courseId: r.course_id,
      title: r.title,
      description: r.description,
      videoUrl: r.video_url,
      thumbnail: r.thumbnail,
      duration: r.duration,
      order: r.reel_order,
      captions: {
        hindi: r.captions_hindi,
        english: r.captions_english,
        tamil: r.captions_tamil
      }
    }));

    res.json({ success: true, data: course });
  } catch (error) {
    console.error('Get course error:', error);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

// GET /courses/:id/reels
router.get('/:id/reels', optionalAuth, async (req, res) => {
  try {
    const [reels] = await pool.query('SELECT * FROM reels WHERE course_id = ? ORDER BY reel_order', [req.params.id]);

    const formattedReels = reels.map(r => ({
      id: r.id,
      courseId: r.course_id,
      title: r.title,
      description: r.description,
      videoUrl: r.video_url,
      thumbnail: r.thumbnail,
      duration: r.duration,
      order: r.reel_order,
      captions: {
        hindi: r.captions_hindi,
        english: r.captions_english,
        tamil: r.captions_tamil
      }
    }));

    res.json({ success: true, data: formattedReels });
  } catch (error) {
    console.error('Get reels error:', error);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

// POST /courses/:id/progress
router.post('/:id/progress', authMiddleware, async (req, res) => {
  try {
    const { reelId } = req.body;
    const courseId = req.params.id;
    const userId = req.userId;

    // Check if already completed
    const [existing] = await pool.query(
      'SELECT id FROM user_progress WHERE user_id = ? AND course_id = ? AND reel_id = ?',
      [userId, courseId, reelId]
    );

    if (existing.length === 0) {
      await pool.query(
        'INSERT INTO user_progress (id, user_id, course_id, reel_id) VALUES (?, ?, ?, ?)',
        [uuidv4(), userId, courseId, reelId]
      );

      // Update stats
      await pool.query(
        'UPDATE user_stats SET minutes_learned = minutes_learned + 1 WHERE user_id = ?',
        [userId]
      );
    }

    // Get progress
    const [completed] = await pool.query(
      'SELECT reel_id FROM user_progress WHERE user_id = ? AND course_id = ?',
      [userId, courseId]
    );

    const [totalReels] = await pool.query('SELECT COUNT(*) as count FROM reels WHERE course_id = ?', [courseId]);

    const progress = {
      courseId,
      completedReels: completed.map(c => c.reel_id),
      lastWatchedReelId: reelId,
      lastWatchedAt: new Date().toISOString(),
      progressPercent: Math.round((completed.length / totalReels[0].count) * 100)
    };

    res.json({ success: true, data: progress });
  } catch (error) {
    console.error('Update progress error:', error);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

module.exports = router;
