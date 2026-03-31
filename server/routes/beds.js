const express = require('express');
const router = express.Router();
const db = require('../db');

// GET /api/beds?hostel_id=&status=&ac_type=
router.get('/', (req, res) => {
  const { hostel_id, status, ac_type, search } = req.query;

  let where = [];
  let params = [];

  if (hostel_id) { where.push('b.hostel_id = ?'); params.push(hostel_id); }
  if (status)    { where.push('b.status = ?');    params.push(status); }
  if (ac_type)   { where.push('b.ac_type = ?');   params.push(ac_type); }
  if (search) {
    where.push('(b.id LIKE ? OR t.name LIKE ? OR t.phone LIKE ?)');
    const s = `%${search}%`;
    params.push(s, s, s);
  }

  const whereClause = where.length ? 'WHERE ' + where.join(' AND ') : '';

  const beds = db.prepare(`
    SELECT b.*,
           h.name as hostel_name,
           r.floor, r.sharing_type,
           t.id as tenant_id, t.name as tenant_name, t.phone as tenant_phone,
           t.check_in, t.check_out, t.actual_rent, t.deposit, t.deposit_status
    FROM beds b
    LEFT JOIN hostels h ON h.id = b.hostel_id
    LEFT JOIN rooms r ON r.id = b.room_id
    LEFT JOIN tenants t ON t.bed_id = b.id AND t.is_active = 1
    ${whereClause}
    ORDER BY b.hostel_id, b.room_id, b.id
  `).all(...params);

  // Build dynamic month list: from earliest rent payment up to current month
  const now = new Date();
  const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  const earliest = db.prepare("SELECT MIN(month) as m FROM rent_payments").get().m;
  const months = [];
  if (earliest) {
    let d = new Date(`${earliest}-01`);
    const end = new Date(`${currentMonth}-01`);
    while (d <= end) {
      months.push(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`);
      d.setMonth(d.getMonth() + 1);
    }
  } else {
    // Fallback: last 3 months
    for (let i = 2; i >= 0; i--) {
      const d = new Date(now);
      d.setMonth(d.getMonth() - i);
      months.push(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`);
    }
  }

  const result = beds.map(bed => {
    const rentHistory = months.map(m => {
      if (!bed.tenant_id) return { month: m, status: 'no_tenant', amount: null };
      const payment = db.prepare(
        'SELECT amount FROM rent_payments WHERE tenant_id = ? AND month = ?'
      ).get(bed.tenant_id, m);
      return { month: m, status: payment ? 'paid' : 'unpaid', amount: payment?.amount || null };
    });
    return { ...bed, rent_history: rentHistory };
  });

  res.json(result);
});

// POST /api/beds
router.post('/', (req, res) => {
  const { id, room_id, hostel_id, position, ac_type, bed_amount } = req.body;
  if (!id || !room_id || !hostel_id) return res.status(400).json({ error: 'id, room_id, hostel_id required' });

  const existing = db.prepare('SELECT id FROM beds WHERE id = ?').get(id);
  if (existing) return res.status(409).json({ error: 'Bed ID already exists' });

  db.prepare(`
    INSERT INTO beds (id, room_id, hostel_id, position, ac_type, bed_amount, status)
    VALUES (?, ?, ?, ?, ?, ?, 'Vacant')
  `).run(id, room_id, hostel_id, position || '', ac_type || 'NON AC', bed_amount || '');

  res.json({ success: true, id });
});

// PUT /api/beds/:id/status
router.put('/:id/status', (req, res) => {
  const { status } = req.body;
  db.prepare('UPDATE beds SET status = ? WHERE id = ?').run(status, req.params.id);
  res.json({ success: true });
});

module.exports = router;
