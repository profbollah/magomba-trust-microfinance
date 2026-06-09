const express = require('express');
const router = express.Router();
const pool = require('../config/database');
const { verifyToken } = require('../middleware/auth');

// Get all groups
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM groups WHERE status = $1 ORDER BY created_at DESC', ['active']);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get single group with members
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const groupResult = await pool.query('SELECT * FROM groups WHERE id = $1', [id]);
    if (groupResult.rows.length === 0) {
      return res.status(404).json({ error: 'Group not found' });
    }

    const membersResult = await pool.query(
      'SELECT gm.*, u.name, u.email FROM group_members gm JOIN users u ON gm.user_id = u.id WHERE gm.group_id = $1 AND gm.status = $2',
      [id, 'active']
    );

    res.json({
      group: groupResult.rows[0],
      members: membersResult.rows
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Create group
router.post('/', verifyToken, async (req, res) => {
  try {
    const { name, description, chairman_id, secretary_id, treasurer_id } = req.body;

    const result = await pool.query(
      'INSERT INTO groups (name, description, chairman_id, secretary_id, treasurer_id) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [name, description, chairman_id, secretary_id, treasurer_id]
    );

    res.status(201).json({
      message: 'Group created successfully',
      group: result.rows[0]
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Add member to group
router.post('/:id/members', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { user_id, phone, id_number, id_type } = req.body;

    const result = await pool.query(
      'INSERT INTO group_members (group_id, user_id, phone, id_number, id_type) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [id, user_id, phone, id_number, id_type]
    );

    res.status(201).json({
      message: 'Member added to group',
      member: result.rows[0]
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;