const express = require('express');
const router = express.Router();
const db = require('../db');

// GET /api/rooms?hostel_id=
router.get('/', (req, res) => {
  const { hostel_id } = req.query;
  const query = hostel_id
    ? 'SELECT * FROM rooms WHERE hostel_id = ? ORDER BY id'
    : 'SELECT * FROM rooms ORDER BY hostel_id, id';
  const rooms = hostel_id
    ? db.prepare(query).all(hostel_id)
    : db.prepare(query).all();
  res.json(rooms);
});

// POST /api/rooms
router.post('/', (req, res) => {
  const { id, hostel_id, floor, sharing_type, ac_type } = req.body;
  if (!id || !hostel_id) return res.status(400).json({ error: 'id and hostel_id are required' });

  const existing = db.prepare('SELECT id FROM rooms WHERE id = ?').get(id);
  if (existing) return res.status(409).json({ error: 'Room ID already exists' });

  db.prepare(`
    INSERT INTO rooms (id, hostel_id, floor, sharing_type, ac_type)
    VALUES (?, ?, ?, ?, ?)
  `).run(id, hostel_id, floor || '', sharing_type || '', ac_type || 'NON AC');

  res.json({ success: true, id });
});

module.exports = router;
