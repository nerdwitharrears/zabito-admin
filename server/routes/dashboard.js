const express = require('express');
const router = express.Router();
const db = require('../db');

// GET /api/dashboard/stats
router.get('/stats', (req, res) => {
  const total    = db.prepare('SELECT COUNT(*) as count FROM beds').get().count;
  const occupied = db.prepare("SELECT COUNT(*) as count FROM beds WHERE status = 'Occupied'").get().count;
  const vacant   = db.prepare("SELECT COUNT(*) as count FROM beds WHERE status = 'Vacant'").get().count;
  const temp     = db.prepare("SELECT COUNT(*) as count FROM beds WHERE status = 'Temporary'").get().count;
  const maint    = db.prepare("SELECT COUNT(*) as count FROM beds WHERE status = 'Maintenance'").get().count;
  const occupancy = total > 0 ? Math.round((occupied / total) * 100) : 0;
  res.json({ total, occupied, vacant, temporary: temp, maintenance: maint, occupancy });
});

// GET /api/dashboard/hostel-occ
router.get('/hostel-occ', (req, res) => {
  const hostels = db.prepare('SELECT id, name FROM hostels ORDER BY id').all();
  const result = hostels.map(h => {
    const total    = db.prepare('SELECT COUNT(*) as c FROM beds WHERE hostel_id = ?').get(h.id).c;
    const occupied = db.prepare("SELECT COUNT(*) as c FROM beds WHERE hostel_id = ? AND status = 'Occupied'").get(h.id).c;
    const pct = total > 0 ? Math.round((occupied / total) * 100) : 0;
    return { hostel: h.id, name: h.name, total, occupied, pct };
  });
  res.json(result);
});

// GET /api/dashboard/revenue
router.get('/revenue', (req, res) => {
  const months = [];
  const now = new Date();
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now);
    d.setMonth(d.getMonth() - i);
    months.push({
      key:   `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`,
      label: d.toLocaleString('default', { month: 'short' }),
    });
  }

  const result = months.map(m => {
    const revenue = db.prepare(
      "SELECT COALESCE(SUM(amount),0) as total FROM rent_payments WHERE month = ?"
    ).get(m.key).total;
    const expenses = db.prepare(
      "SELECT COALESCE(SUM(amount),0) as total FROM expenses WHERE strftime('%Y-%m', date) = ?"
    ).get(m.key).total;
    return { month: m.label, revenue, expenses };
  });
  res.json(result);
});

// GET /api/dashboard/vacating
router.get('/vacating', (req, res) => {
  const today = new Date().toISOString().split('T')[0];
  const in7   = new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0];
  const in30  = new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0];

  const query = `
    SELECT t.id, t.name, t.bed_id, t.check_out, t.actual_rent,
           h.name as hostel_name
    FROM tenants t
    JOIN hostels h ON h.id = t.hostel_id
    WHERE t.is_active = 1 AND t.check_out IS NOT NULL
    ORDER BY t.check_out ASC
  `;
  const rows = db.prepare(query).all();

  const already = rows.filter(r => r.check_out < today);
  const thisWeek = rows.filter(r => r.check_out >= today && r.check_out <= in7);
  const thisMonth = rows.filter(r => r.check_out > in7 && r.check_out <= in30);

  res.json({ already_vacant: already, this_week: thisWeek, this_month: thisMonth });
});

// GET /api/dashboard/rent-pct
router.get('/rent-pct', (req, res) => {
  const now = new Date();
  const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  const monthLabel = now.toLocaleString('default', { month: 'long', year: 'numeric' });

  const totalActive = db.prepare("SELECT COUNT(*) as c FROM tenants WHERE is_active = 1").get().c;
  const paid = db.prepare(
    "SELECT COUNT(DISTINCT tenant_id) as c FROM rent_payments WHERE month = ?"
  ).get(currentMonth).c;

  const pct = totalActive > 0 ? Math.round((paid / totalActive) * 100) : 0;
  res.json({ month: monthLabel, paid, total: totalActive, pct });
});

module.exports = router;
