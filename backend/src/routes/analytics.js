const express = require('express');
const { v4: uuidv4 } = require('uuid');
const pool = require('../config/database');
const { authMiddleware, optionalAuth } = require('../middleware/auth');

const router = express.Router();

// POST /analytics/event - Track event
router.post('/event', optionalAuth, async (req, res) => {
  try {
    const { eventType, eventData, timestamp } = req.body;

    if (!eventType) {
      return res.status(400).json({ success: false, error: 'eventType required' });
    }

    await pool.query(
      'INSERT INTO analytics_events (id, user_id, event_type, event_data, created_at) VALUES (?, ?, ?, ?, ?)',
      [uuidv4(), req.userId || null, eventType, JSON.stringify(eventData || {}), timestamp || new Date()]
    );

    res.json({ success: true });
  } catch (error) {
    console.error('Track event error:', error);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

// GET /analytics/dashboard - Get analytics dashboard
router.get('/dashboard', authMiddleware, async (req, res) => {
  try {
    // Total views (screen_view events)
    const [viewsResult] = await pool.query(
      'SELECT COUNT(*) as count FROM analytics_events WHERE user_id = ? AND event_type = "screen_view"',
      [req.userId]
    );

    // Total watch time from user stats
    const [statsResult] = await pool.query(
      'SELECT minutes_learned FROM user_stats WHERE user_id = ?',
      [req.userId]
    );

    // Completion rate
    const [progressResult] = await pool.query(`
      SELECT 
        COUNT(DISTINCT up.course_id) as started,
        SUM(CASE WHEN completed_count >= reel_count THEN 1 ELSE 0 END) as completed
      FROM (
        SELECT course_id, COUNT(*) as completed_count
        FROM user_progress WHERE user_id = ?
        GROUP BY course_id
      ) up
      JOIN (
        SELECT course_id, COUNT(*) as reel_count
        FROM reels GROUP BY course_id
      ) r ON up.course_id = r.course_id
    `, [req.userId]);

    const started = progressResult[0]?.started || 0;
    const completed = progressResult[0]?.completed || 0;
    const completionRate = started > 0 ? Math.round((completed / started) * 100) : 0;

    // Popular courses
    const [popularCourses] = await pool.query(`
      SELECT c.id as courseId, c.title, COUNT(ae.id) as views
      FROM analytics_events ae
      JOIN courses c ON JSON_EXTRACT(ae.event_data, '$.courseId') = c.id
      WHERE ae.user_id = ? AND ae.event_type IN ('course_start', 'reel_watch')
      GROUP BY c.id, c.title
      ORDER BY views DESC
      LIMIT 5
    `, [req.userId]);

    // Weekly activity
    const [weeklyActivity] = await pool.query(`
      SELECT 
        DAYNAME(created_at) as day,
        COUNT(*) as minutes
      FROM analytics_events
      WHERE user_id = ? AND event_type = 'reel_watch'
        AND created_at >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)
      GROUP BY DAYNAME(created_at), DAYOFWEEK(created_at)
      ORDER BY DAYOFWEEK(created_at)
    `, [req.userId]);

    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const activityMap = {};
    weeklyActivity.forEach(w => { activityMap[w.day.substring(0, 3)] = w.minutes; });
    const formattedWeekly = days.map(day => ({ day, minutes: activityMap[day] || 0 }));

    res.json({
      success: true,
      data: {
        totalViews: viewsResult[0].count,
        totalWatchTime: statsResult[0]?.minutes_learned || 0,
        completionRate,
        popularCourses: popularCourses.map(c => ({
          courseId: c.courseId,
          title: c.title,
          views: c.views
        })),
        weeklyActivity: formattedWeekly
      }
    });
  } catch (error) {
    console.error('Get dashboard error:', error);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

module.exports = router;
