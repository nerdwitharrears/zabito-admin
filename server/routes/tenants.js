const express = require('express');
const router = express.Router();
const db = require('../db');

// GET /api/tenants?active=1
router.get('/', (req, res) => {
  const { active, search, hostel_id } = req.query;
  let where = [];
  let params = [];

  if (active !== undefined) { where.push('t.is_active = ?'); params.push(Number(active)); }
  if (hostel_id) { where.push('t.hostel_id = ?'); params.push(hostel_id); }
  if (search) {
    where.push('(t.name LIKE ? OR t.bed_id LIKE ? OR t.phone LIKE ?)');
    const s = `%${search}%`;
    params.push(s, s, s);
  }

  const whereClause = where.length ? 'WHERE ' + where.join(' AND ') : '';

  const tenants = db.prepare(`
    SELECT t.*, h.name as hostel_name
    FROM tenants t
    LEFT JOIN hostels h ON h.id = t.hostel_id
    ${whereClause}
    ORDER BY t.created_at DESC
  `).all(...params);

  res.json(tenants);
});

// GET /api/tenants/history
router.get('/history', (req, res) => {
  const tenants = db.prepare(`
    SELECT t.*, h.name as hostel_name
    FROM tenants t
    LEFT JOIN hostels h ON h.id = t.hostel_id
    WHERE t.is_active = 0
    ORDER BY t.check_out DESC
  `).all();
  res.json(tenants);
});

// POST /api/tenants
router.post('/', (req, res) => {
  const {
    hostel_id, room_id, bed_id, name, phone, aadhar,
    check_in, check_out, deposit, actual_rent, deposit_status, notes
  } = req.body;

  if (!name || !phone || !bed_id || !check_in) {
    return res.status(400).json({ error: 'Name, phone, bed_id and check_in are required' });
  }

  // Check bed exists and is vacant
  const bed = db.prepare('SELECT * FROM beds WHERE id = ?').get(bed_id);
  if (!bed) return res.status(404).json({ error: 'Bed not found' });
  if (bed.status === 'Occupied') return res.status(409).json({ error: 'Bed is already occupied' });

  const result = db.prepare(`
    INSERT INTO tenants (hostel_id, room_id, bed_id, name, phone, aadhar, check_in, check_out, deposit, actual_rent, deposit_status, notes, is_active)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1)
  `).run(
    hostel_id, room_id, bed_id, name, phone, aadhar || '',
    check_in, check_out || null, deposit || '', actual_rent || 0,
    deposit_status || 'Not Collected', notes || ''
  );

  // Mark bed as occupied
  db.prepare("UPDATE beds SET status = 'Occupied' WHERE id = ?").run(bed_id);

  res.json({ success: true, id: result.lastInsertRowid });
});

// PUT /api/tenants/:id/checkout
router.put('/:id/checkout', (req, res) => {
  const { check_out } = req.body;
  const today = check_out || new Date().toISOString().split('T')[0];

  const tenant = db.prepare('SELECT * FROM tenants WHERE id = ?').get(req.params.id);
  if (!tenant) return res.status(404).json({ error: 'Tenant not found' });

  db.prepare('UPDATE tenants SET is_active = 0, check_out = ? WHERE id = ?').run(today, req.params.id);
  db.prepare("UPDATE beds SET status = 'Vacant' WHERE id = ?").run(tenant.bed_id);

  res.json({ success: true });
});

// PUT /api/tenants/:id
router.put('/:id', (req, res) => {
  const {
    name, phone, aadhar, check_in, check_out, deposit,
    actual_rent, deposit_status, notes
  } = req.body;

  db.prepare(`
    UPDATE tenants SET name=?, phone=?, aadhar=?, check_in=?, check_out=?,
    deposit=?, actual_rent=?, deposit_status=?, notes=?
    WHERE id=?
  `).run(name, phone, aadhar, check_in, check_out, deposit, actual_rent, deposit_status, notes, req.params.id);

  res.json({ success: true });
});

module.exports = router;
