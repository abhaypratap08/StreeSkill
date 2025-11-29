const express = require('express');
const { v4: uuidv4 } = require('uuid');
const pool = require('../config/database');
const { authMiddleware } = require('../middleware/auth');

const router = express.Router();

// GET /notifications - Get notifications
router.get('/', authMiddleware, async (req, res) => {
  try {
    const [notifications] = await pool.query(
      'SELECT * FROM notifications WHERE user_id = ? ORDER BY created_at DESC LIMIT 50',
      [req.userId]
    );

    const formattedNotifications = notifications.map(n => ({
      id: n.id,
      type: n.type,
      title: n.title,
      message: n.message,
      read: n.is_read === 1,
      createdAt: n.created_at,
      data: n.data ? JSON.parse(n.data) : null
    }));

    res.json({ success: true, data: formattedNotifications });
  } catch (error) {
    console.error('Get notifications error:', error);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

// PUT /notifications/read - Mark as read
router.put('/read', authMiddleware, async (req, res) => {
  try {
    const { notificationIds } = req.body;

    if (!notificationIds || !Array.isArray(notificationIds)) {
      return res.status(400).json({ success: false, error: 'notificationIds array required' });
    }

    if (notificationIds.length > 0) {
      const placeholders = notificationIds.map(() => '?').join(',');
      await pool.query(
        `UPDATE notifications SET is_read = TRUE WHERE id IN (${placeholders}) AND user_id = ?`,
        [...notificationIds, req.userId]
      );
    }

    res.json({ success: true, message: 'Marked as read' });
  } catch (error) {
    console.error('Mark read error:', error);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

// PUT /notifications/read-all - Mark all as read
router.put('/read-all', authMiddleware, async (req, res) => {
  try {
    await pool.query('UPDATE notifications SET is_read = TRUE WHERE user_id = ?', [req.userId]);
    res.json({ success: true, message: 'All marked as read' });
  } catch (error) {
    console.error('Mark all read error:', error);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

// GET /notifications/unread-count - Get unread count
router.get('/unread-count', authMiddleware, async (req, res) => {
  try {
    const [result] = await pool.query(
      'SELECT COUNT(*) as count FROM notifications WHERE user_id = ? AND is_read = FALSE',
      [req.userId]
    );
    res.json({ success: true, data: { count: result[0].count } });
  } catch (error) {
    console.error('Get unread count error:', error);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

module.exports = router;
