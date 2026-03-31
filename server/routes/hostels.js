const express = require('express');
const router = express.Router();
const db = require('../db');

// GET /api/hostels
router.get('/', (req, res) => {
  const hostels = db.prepare('SELECT * FROM hostels ORDER BY id').all();
  res.json(hostels);
});

// POST /api/hostels
router.post('/', (req, res) => {
  const { id, name, location, owner_name, manager_phone, advance, broker_fee } = req.body;
  if (!id || !name) return res.status(400).json({ error: 'id and name are required' });

  const existing = db.prepare('SELECT id FROM hostels WHERE id = ?').get(id);
  if (existing) return res.status(409).json({ error: 'Hostel ID already exists' });

  db.prepare(`
    INSERT INTO hostels (id, name, location, owner_name, manager_phone, advance, broker_fee)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `).run(id, name, location || '', owner_name || '', manager_phone || '', advance || 0, broker_fee || 0);

  res.json({ success: true, id });
});

// PUT /api/hostels/:id
router.put('/:id', (req, res) => {
  const { name, location, owner_name, manager_phone, advance, broker_fee } = req.body;
  db.prepare(`
    UPDATE hostels SET name=?, location=?, owner_name=?, manager_phone=?, advance=?, broker_fee=?
    WHERE id=?
  `).run(name, location, owner_name, manager_phone, advance || 0, broker_fee || 0, req.params.id);
  res.json({ success: true });
});

module.exports = router;
