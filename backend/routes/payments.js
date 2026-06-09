const express = require('express');
const router = express.Router();
const pool = require('../config/database');
const { verifyToken } = require('../middleware/auth');

// Get all payments
router.get('/', async (req, res) => {
  try {
    const { loan_id } = req.query;
    let query = 'SELECT p.*, u.name as recorded_by_name FROM payments p LEFT JOIN users u ON p.recorded_by = u.id WHERE 1=1';
    const params = [];

    if (loan_id) {
      query += ' AND p.loan_id = $' + (params.length + 1);
      params.push(loan_id);
    }

    query += ' ORDER BY p.payment_date DESC';

    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Record payment
router.post('/', verifyToken, async (req, res) => {
  try {
    const { loan_id, amount, payment_date, received_by, notes } = req.body;

    const result = await pool.query(
      `INSERT INTO payments (loan_id, amount, payment_date, received_by, notes)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [loan_id, amount, payment_date, received_by, notes]
    );

    const loanResult = await pool.query('SELECT loan_amount FROM loans WHERE id = $1', [loan_id]);
    const totalPaid = await pool.query('SELECT SUM(amount) as total FROM payments WHERE loan_id = $1', [loan_id]);

    if (totalPaid.rows[0].total >= loanResult.rows[0].loan_amount) {
      await pool.query('UPDATE loans SET status = $1 WHERE id = $2', ['paid', loan_id]);
    }

    res.status(201).json({
      message: 'Payment recorded successfully',
      payment: result.rows[0]
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;