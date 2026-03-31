const express = require('express');
const router = express.Router();
const db = require('../db');

// POST /api/rent
router.post('/', (req, res) => {
  const { tenant_id, bed_id, month, amount } = req.body;
  if (!tenant_id || !month) return res.status(400).json({ error: 'tenant_id and month required' });

  // Check if already paid for this month
  const existing = db.prepare(
    'SELECT id FROM rent_payments WHERE tenant_id = ? AND month = ?'
  ).get(tenant_id, month);

  if (existing) {
    // Update existing
    db.prepare('UPDATE rent_payments SET amount = ?, paid_at = CURRENT_TIMESTAMP WHERE id = ?')
      .run(amount, existing.id);
  } else {
    db.prepare('INSERT INTO rent_payments (tenant_id, bed_id, month, amount) VALUES (?, ?, ?, ?)')
      .run(tenant_id, bed_id, month, amount);
  }

  res.json({ success: true });
});

// GET /api/rent?tenant_id=
router.get('/', (req, res) => {
  const { tenant_id } = req.query;
  if (!tenant_id) return res.status(400).json({ error: 'tenant_id required' });
  const payments = db.prepare(
    'SELECT * FROM rent_payments WHERE tenant_id = ? ORDER BY month DESC'
  ).all(tenant_id);
  res.json(payments);
});

module.exports = router;
