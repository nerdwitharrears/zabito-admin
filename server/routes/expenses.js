const express = require('express');
const router = express.Router();
const db = require('../db');

// GET /api/expenses
router.get('/', (req, res) => {
  const { hostel_id, month } = req.query;
  let where = [];
  let params = [];

  if (hostel_id) { where.push('e.hostel_id = ?'); params.push(hostel_id); }
  if (month)     { where.push("strftime('%Y-%m', e.date) = ?"); params.push(month); }

  const whereClause = where.length ? 'WHERE ' + where.join(' AND ') : '';

  const expenses = db.prepare(`
    SELECT e.*, h.name as hostel_name
    FROM expenses e
    LEFT JOIN hostels h ON h.id = e.hostel_id
    ${whereClause}
    ORDER BY e.date DESC
  `).all(...params);

  // Summary stats
  const now = new Date();
  const thisMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  const lastMonth = (() => {
    const d = new Date(now); d.setMonth(d.getMonth() - 1);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
  })();

  const thisMonthTotal = db.prepare(
    "SELECT COALESCE(SUM(amount),0) as total FROM expenses WHERE strftime('%Y-%m', date) = ?"
  ).get(thisMonth).total;
  const lastMonthTotal = db.prepare(
    "SELECT COALESCE(SUM(amount),0) as total FROM expenses WHERE strftime('%Y-%m', date) = ?"
  ).get(lastMonth).total;
  const allTime = db.prepare("SELECT COALESCE(SUM(amount),0) as total FROM expenses").get().total;

  res.json({ expenses, summary: { thisMonth: thisMonthTotal, lastMonth: lastMonthTotal, allTime } });
});

// POST /api/expenses
router.post('/', (req, res) => {
  const { date, hostel_id, category, amount, notes } = req.body;
  if (!date || !category || !amount) return res.status(400).json({ error: 'date, category and amount required' });

  const result = db.prepare(`
    INSERT INTO expenses (date, hostel_id, category, amount, notes)
    VALUES (?, ?, ?, ?, ?)
  `).run(date, hostel_id || null, category, amount, notes || '');

  res.json({ success: true, id: result.lastInsertRowid });
});

// DELETE /api/expenses/:id
router.delete('/:id', (req, res) => {
  db.prepare('DELETE FROM expenses WHERE id = ?').run(req.params.id);
  res.json({ success: true });
});

module.exports = router;
