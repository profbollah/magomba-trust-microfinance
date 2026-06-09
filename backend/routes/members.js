const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const pool = require('../config/database');
const { verifyToken } = require('../middleware/auth');
const fs = require('fs');

const uploadsDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  },
  limits: { fileSize: 10 * 1024 * 1024 }
});

// Upload loan documents
router.post('/:loan_id/documents', verifyToken, upload.fields([
  { name: 'borrower_photo', maxCount: 1 },
  { name: 'borrower_id_photo', maxCount: 1 },
  { name: 'guarantor_photo', maxCount: 1 },
  { name: 'guarantor_id_photo', maxCount: 1 },
  { name: 'collateral_photo', maxCount: 1 }
]), async (req, res) => {
  try {
    const { loan_id } = req.params;
    const uploadedDocs = [];

    const documentTypes = [
      'borrower_photo',
      'borrower_id_photo',
      'guarantor_photo',
      'guarantor_id_photo',
      'collateral_photo'
    ];

    for (const docType of documentTypes) {
      if (req.files && req.files[docType]) {
        const file = req.files[docType][0];
        
        const result = await pool.query(
          `INSERT INTO loan_documents (loan_id, document_type, file_path, uploaded_by)
           VALUES ($1, $2, $3, $4) RETURNING *`,
          [loan_id, docType, '/uploads/' + file.filename, req.user.id]
        );

        uploadedDocs.push(result.rows[0]);
      }
    }

    res.status(201).json({
      message: 'Documents uploaded successfully',
      documents: uploadedDocs
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get loan documents
router.get('/:loan_id/documents', async (req, res) => {
  try {
    const { loan_id } = req.params;

    const result = await pool.query(
      'SELECT * FROM loan_documents WHERE loan_id = $1 ORDER BY uploaded_at DESC',
      [loan_id]
    );

    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;