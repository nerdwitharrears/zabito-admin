const express = require('express');
const router = express.Router();
const db = require('../db');

// GET /api/investments
router.get('/', (req, res) => {
  const { hostel_id } = req.query;
  let where = [];
  let params = [];

  if (hostel_id) { where.push('i.hostel_id = ?'); params.push(hostel_id); }

  const whereClause = where.length ? 'WHERE ' + where.join(' AND ') : '';

  const investments = db.prepare(`
    SELECT i.*, h.name as hostel_name
    FROM investments i
    LEFT JOIN hostels h ON h.id = i.hostel_id
    ${whereClause}
    ORDER BY i.date DESC
  `).all(...params);

  // Summary
  const allTime = db.prepare("SELECT COALESCE(SUM(amount),0) as total FROM investments").get().total;
  const muthu   = db.prepare("SELECT COALESCE(SUM(amount),0) as total FROM investments WHERE investor = 'Muthu'").get().total;
  const naveen  = db.prepare("SELECT COALESCE(SUM(amount),0) as total FROM investments WHERE investor = 'Naveen'").get().total;

  res.json({ investments, summary: { total: allTime, muthu, naveen } });
});

// POST /api/investments
router.post('/', (req, res) => {
  const { date, hostel_id, category, investor, amount, notes } = req.body;
  if (!date || !category || !amount) return res.status(400).json({ error: 'date, category and amount required' });

  const result = db.prepare(`
    INSERT INTO investments (date, hostel_id, category, investor, amount, notes)
    VALUES (?, ?, ?, ?, ?, ?)
  `).run(date, hostel_id || null, category, investor || '', amount, notes || '');

  res.json({ success: true, id: result.lastInsertRowid });
});

module.exports = router;
