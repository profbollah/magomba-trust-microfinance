const express = require('express');
const router = express.Router();
const pool = require('../config/database');
const { verifyToken } = require('../middleware/auth');

// Get all loans
router.get('/', async (req, res) => {
  try {
    const { group_id, status } = req.query;
    let query = 'SELECT l.*, u.name as borrower_name, g.name as guarantor_name FROM loans l JOIN users u ON l.borrower_id = u.id LEFT JOIN users g ON l.guarantor_id = g.id WHERE 1=1';
    const params = [];

    if (group_id) {
      query += ' AND l.group_id = $' + (params.length + 1);
      params.push(group_id);
    }

    if (status) {
      query += ' AND l.status = $' + (params.length + 1);
      params.push(status);
    }

    query += ' ORDER BY l.created_at DESC';

    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get single loan with documents
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const loanResult = await pool.query(
      'SELECT l.*, u.name as borrower_name FROM loans l JOIN users u ON l.borrower_id = u.id WHERE l.id = $1',
      [id]
    );

    if (loanResult.rows.length === 0) {
      return res.status(404).json({ error: 'Loan not found' });
    }

    const documentsResult = await pool.query(
      'SELECT * FROM loan_documents WHERE loan_id = $1',
      [id]
    );

    const paymentsResult = await pool.query(
      'SELECT * FROM payments WHERE loan_id = $1 ORDER BY payment_date DESC',
      [id]
    );

    res.json({
      loan: loanResult.rows[0],
      documents: documentsResult.rows,
      payments: paymentsResult.rows
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Create loan
router.post('/', verifyToken, async (req, res) => {
  try {
    const { group_id, borrower_id, guarantor_id, loan_amount, interest_rate, duration_months, start_date, purpose } = req.body;

    const endDate = new Date(start_date);
    endDate.setMonth(endDate.getMonth() + duration_months);

    const result = await pool.query(
      `INSERT INTO loans (group_id, borrower_id, guarantor_id, loan_amount, interest_rate, duration_months, start_date, end_date, purpose)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *`,
      [group_id, borrower_id, guarantor_id, loan_amount, interest_rate, duration_months, start_date, endDate, purpose]
    );

    res.status(201).json({
      message: 'Loan created successfully',
      loan: result.rows[0]
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Approve loan
router.put('/:id/approve', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { approved_by } = req.body;

    const result = await pool.query(
      'UPDATE loans SET status = $1, approved_by = $2, approved_at = CURRENT_TIMESTAMP WHERE id = $3 RETURNING *',
      ['approved', approved_by, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Loan not found' });
    }

    res.json({
      message: 'Loan approved',
      loan: result.rows[0]
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Disburse loan
router.put('/:id/disburse', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      'UPDATE loans SET status = $1, disbursed_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *',
      ['disbursed', id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Loan not found' });
    }

    res.json({
      message: 'Loan disbursed',
      loan: result.rows[0]
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;