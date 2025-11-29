const express = require('express');
const { v4: uuidv4 } = require('uuid');
const pool = require('../config/database');
const { authMiddleware } = require('../middleware/auth');

const router = express.Router();

// GET /products - List user's products
router.get('/', authMiddleware, async (req, res) => {
  try {
    const [products] = await pool.query(
      'SELECT * FROM products WHERE user_id = ? ORDER BY created_at DESC',
      [req.userId]
    );

    const formattedProducts = products.map(p => ({
      id: p.id,
      userId: p.user_id,
      title: p.title,
      description: p.description,
      price: parseFloat(p.price),
      images: p.images ? JSON.parse(p.images) : [],
      category: p.category,
      status: p.status,
      createdAt: p.created_at
    }));

    res.json({ success: true, data: formattedProducts });
  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

// POST /products - Create product
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { title, description, price, images, category } = req.body;

    if (!title || !price) {
      return res.status(400).json({ success: false, error: 'Title and price required' });
    }

    const productId = uuidv4();
    await pool.query(
      'INSERT INTO products (id, user_id, title, description, price, images, category) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [productId, req.userId, title, description, price, JSON.stringify(images || []), category]
    );

    res.status(201).json({
      success: true,
      data: {
        id: productId,
        userId: req.userId,
        title,
        description,
        price,
        images: images || [],
        category,
        status: 'active',
        createdAt: new Date().toISOString()
      },
      message: 'Product listed successfully'
    });
  } catch (error) {
    console.error('Create product error:', error);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

// PUT /products/:id - Update product
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const { title, description, price, images, category, status } = req.body;
    const productId = req.params.id;

    // Verify ownership
    const [existing] = await pool.query('SELECT user_id FROM products WHERE id = ?', [productId]);
    if (existing.length === 0 || existing[0].user_id !== req.userId) {
      return res.status(404).json({ success: false, error: 'Product not found' });
    }

    const updates = [];
    const params = [];

    if (title) { updates.push('title = ?'); params.push(title); }
    if (description !== undefined) { updates.push('description = ?'); params.push(description); }
    if (price) { updates.push('price = ?'); params.push(price); }
    if (images) { updates.push('images = ?'); params.push(JSON.stringify(images)); }
    if (category) { updates.push('category = ?'); params.push(category); }
    if (status) { updates.push('status = ?'); params.push(status); }

    if (updates.length > 0) {
      params.push(productId);
      await pool.query(`UPDATE products SET ${updates.join(', ')} WHERE id = ?`, params);
    }

    const [product] = await pool.query('SELECT * FROM products WHERE id = ?', [productId]);

    res.json({
      success: true,
      data: {
        id: product[0].id,
        userId: product[0].user_id,
        title: product[0].title,
        description: product[0].description,
        price: parseFloat(product[0].price),
        images: product[0].images ? JSON.parse(product[0].images) : [],
        category: product[0].category,
        status: product[0].status,
        createdAt: product[0].created_at
      },
      message: 'Product updated'
    });
  } catch (error) {
    console.error('Update product error:', error);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

// DELETE /products/:id - Remove product
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const productId = req.params.id;

    const [existing] = await pool.query('SELECT user_id FROM products WHERE id = ?', [productId]);
    if (existing.length === 0 || existing[0].user_id !== req.userId) {
      return res.status(404).json({ success: false, error: 'Product not found' });
    }

    await pool.query('DELETE FROM products WHERE id = ?', [productId]);

    res.json({ success: true, message: 'Product removed' });
  } catch (error) {
    console.error('Delete product error:', error);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});


// GET /orders - Get seller orders
router.get('/seller', authMiddleware, async (req, res) => {
  try {
    const [orders] = await pool.query(`
      SELECT o.*, p.title as product_title
      FROM orders o
      JOIN products p ON o.product_id = p.id
      WHERE o.seller_id = ?
      ORDER BY o.created_at DESC
    `, [req.userId]);

    const formattedOrders = orders.map(o => ({
      id: o.id,
      productId: o.product_id,
      productTitle: o.product_title,
      buyerId: o.buyer_id,
      buyerName: o.buyer_name,
      amount: parseFloat(o.amount),
      status: o.status,
      createdAt: o.created_at
    }));

    res.json({ success: true, data: formattedOrders });
  } catch (error) {
    console.error('Get orders error:', error);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

// GET /earnings - Get earnings summary
router.get('/summary', authMiddleware, async (req, res) => {
  try {
    // Total earnings
    const [totalResult] = await pool.query(
      'SELECT COALESCE(SUM(amount), 0) as total FROM orders WHERE seller_id = ? AND status = "delivered"',
      [req.userId]
    );

    // This month earnings
    const [monthResult] = await pool.query(
      `SELECT COALESCE(SUM(amount), 0) as total FROM orders 
       WHERE seller_id = ? AND status = "delivered" 
       AND MONTH(created_at) = MONTH(CURRENT_DATE()) AND YEAR(created_at) = YEAR(CURRENT_DATE())`,
      [req.userId]
    );

    // Pending payouts (shipped orders)
    const [pendingResult] = await pool.query(
      'SELECT COALESCE(SUM(amount), 0) as total FROM orders WHERE seller_id = ? AND status IN ("confirmed", "shipped")',
      [req.userId]
    );

    // Completed orders count
    const [completedResult] = await pool.query(
      'SELECT COUNT(*) as count FROM orders WHERE seller_id = ? AND status = "delivered"',
      [req.userId]
    );

    // Recent transactions
    const [transactions] = await pool.query(`
      SELECT o.id, o.amount, o.created_at, p.title as description
      FROM orders o
      JOIN products p ON o.product_id = p.id
      WHERE o.seller_id = ?
      ORDER BY o.created_at DESC
      LIMIT 10
    `, [req.userId]);

    const recentTransactions = transactions.map(t => ({
      id: t.id,
      type: 'sale',
      amount: parseFloat(t.amount),
      description: t.description + ' sold',
      createdAt: t.created_at
    }));

    res.json({
      success: true,
      data: {
        totalEarnings: parseFloat(totalResult[0].total),
        thisMonth: parseFloat(monthResult[0].total),
        pendingPayouts: parseFloat(pendingResult[0].total),
        completedOrders: completedResult[0].count,
        recentTransactions
      }
    });
  } catch (error) {
    console.error('Get earnings error:', error);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

module.exports = router;
