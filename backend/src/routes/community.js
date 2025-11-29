const express = require('express');
const { v4: uuidv4 } = require('uuid');
const pool = require('../config/database');
const { authMiddleware, optionalAuth } = require('../middleware/auth');

const router = express.Router();

// GET /community/posts - List posts
router.get('/posts', optionalAuth, async (req, res) => {
  try {
    const { category } = req.query;
    let query = `
      SELECT p.*, u.name as user_name, u.avatar as user_avatar,
      (SELECT COUNT(*) FROM post_replies WHERE post_id = p.id) as replies_count
      FROM community_posts p
      JOIN users u ON p.user_id = u.id
    `;
    const params = [];

    if (category && category !== 'All') {
      query += ' WHERE p.category = ?';
      params.push(category);
    }
    query += ' ORDER BY p.created_at DESC';

    const [posts] = await pool.query(query, params);

    // Get user votes if authenticated
    let userVotes = {};
    if (req.userId) {
      const [votes] = await pool.query('SELECT post_id, vote_type FROM post_votes WHERE user_id = ?', [req.userId]);
      votes.forEach(v => { userVotes[v.post_id] = v.vote_type; });
    }

    const formattedPosts = posts.map(p => ({
      id: p.id,
      userId: p.user_id,
      userName: p.user_name,
      userAvatar: p.user_avatar,
      title: p.title,
      content: p.content,
      category: p.category,
      upvotes: p.upvotes,
      downvotes: p.downvotes,
      repliesCount: p.replies_count,
      createdAt: p.created_at,
      userVote: userVotes[p.id] || null
    }));

    res.json({ success: true, data: formattedPosts });
  } catch (error) {
    console.error('Get posts error:', error);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});


// POST /community/posts - Create post
router.post('/posts', authMiddleware, async (req, res) => {
  try {
    const { title, content, category } = req.body;
    
    if (!title || !content) {
      return res.status(400).json({ success: false, error: 'Title and content required' });
    }

    const postId = uuidv4();
    await pool.query(
      'INSERT INTO community_posts (id, user_id, title, content, category) VALUES (?, ?, ?, ?, ?)',
      [postId, req.userId, title, content, category || 'General']
    );

    const [users] = await pool.query('SELECT name, avatar FROM users WHERE id = ?', [req.userId]);

    res.status(201).json({
      success: true,
      data: {
        id: postId,
        userId: req.userId,
        userName: users[0]?.name || 'User',
        userAvatar: users[0]?.avatar,
        title,
        content,
        category: category || 'General',
        upvotes: 0,
        downvotes: 0,
        repliesCount: 0,
        createdAt: new Date().toISOString(),
        userVote: null
      },
      message: 'Post created successfully'
    });
  } catch (error) {
    console.error('Create post error:', error);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

// GET /community/posts/:id/replies - Get replies
router.get('/posts/:id/replies', optionalAuth, async (req, res) => {
  try {
    const [replies] = await pool.query(`
      SELECT r.*, u.name as user_name, u.avatar as user_avatar
      FROM post_replies r
      JOIN users u ON r.user_id = u.id
      WHERE r.post_id = ?
      ORDER BY r.created_at ASC
    `, [req.params.id]);

    const formattedReplies = replies.map(r => ({
      id: r.id,
      postId: r.post_id,
      userId: r.user_id,
      userName: r.user_name,
      userAvatar: r.user_avatar,
      content: r.content,
      upvotes: r.upvotes,
      downvotes: r.downvotes,
      createdAt: r.created_at,
      userVote: null
    }));

    res.json({ success: true, data: formattedReplies });
  } catch (error) {
    console.error('Get replies error:', error);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

// POST /community/posts/:id/reply - Reply to post
router.post('/posts/:id/reply', authMiddleware, async (req, res) => {
  try {
    const { content } = req.body;
    const postId = req.params.id;

    if (!content) {
      return res.status(400).json({ success: false, error: 'Content required' });
    }

    const replyId = uuidv4();
    await pool.query(
      'INSERT INTO post_replies (id, post_id, user_id, content) VALUES (?, ?, ?, ?)',
      [replyId, postId, req.userId, content]
    );

    const [users] = await pool.query('SELECT name, avatar FROM users WHERE id = ?', [req.userId]);

    res.status(201).json({
      success: true,
      data: {
        id: replyId,
        postId,
        userId: req.userId,
        userName: users[0]?.name || 'User',
        userAvatar: users[0]?.avatar,
        content,
        upvotes: 0,
        downvotes: 0,
        createdAt: new Date().toISOString(),
        userVote: null
      },
      message: 'Reply posted'
    });
  } catch (error) {
    console.error('Create reply error:', error);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

// POST /community/posts/:id/vote - Vote on post
router.post('/posts/:id/vote', authMiddleware, async (req, res) => {
  try {
    const { voteType } = req.body;
    const postId = req.params.id;

    if (!['up', 'down'].includes(voteType)) {
      return res.status(400).json({ success: false, error: 'Invalid vote type' });
    }

    // Check existing vote
    const [existing] = await pool.query(
      'SELECT id, vote_type FROM post_votes WHERE post_id = ? AND user_id = ?',
      [postId, req.userId]
    );

    if (existing.length > 0) {
      if (existing[0].vote_type === voteType) {
        // Remove vote
        await pool.query('DELETE FROM post_votes WHERE id = ?', [existing[0].id]);
        await pool.query(
          `UPDATE community_posts SET ${voteType === 'up' ? 'upvotes = upvotes - 1' : 'downvotes = downvotes - 1'} WHERE id = ?`,
          [postId]
        );
      } else {
        // Change vote
        await pool.query('UPDATE post_votes SET vote_type = ? WHERE id = ?', [voteType, existing[0].id]);
        await pool.query(
          `UPDATE community_posts SET 
            upvotes = upvotes ${voteType === 'up' ? '+ 1' : '- 1'},
            downvotes = downvotes ${voteType === 'down' ? '+ 1' : '- 1'}
          WHERE id = ?`,
          [postId]
        );
      }
    } else {
      // New vote
      await pool.query(
        'INSERT INTO post_votes (id, post_id, user_id, vote_type) VALUES (?, ?, ?, ?)',
        [uuidv4(), postId, req.userId, voteType]
      );
      await pool.query(
        `UPDATE community_posts SET ${voteType === 'up' ? 'upvotes = upvotes + 1' : 'downvotes = downvotes + 1'} WHERE id = ?`,
        [postId]
      );
    }

    const [post] = await pool.query('SELECT upvotes, downvotes FROM community_posts WHERE id = ?', [postId]);

    res.json({ success: true, data: { upvotes: post[0].upvotes, downvotes: post[0].downvotes } });
  } catch (error) {
    console.error('Vote error:', error);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

module.exports = router;
