const { DatabaseSync } = require('node:sqlite');
const path = require('path');

const DB_PATH = path.join(__dirname, 'zabito.db');
const db = new DatabaseSync(DB_PATH);

db.exec('PRAGMA journal_mode = WAL;');
db.exec('PRAGMA foreign_keys = ON;');

db.exec(`
  CREATE TABLE IF NOT EXISTS hostels (
    id          TEXT PRIMARY KEY,
    name        TEXT NOT NULL,
    location    TEXT,
    owner_name  TEXT,
    manager_phone TEXT,
    advance     INTEGER DEFAULT 0,
    broker_fee  INTEGER DEFAULT 0,
    created_at  DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS rooms (
    id           TEXT PRIMARY KEY,
    hostel_id    TEXT NOT NULL,
    floor        TEXT,
    sharing_type TEXT,
    ac_type      TEXT,
    FOREIGN KEY (hostel_id) REFERENCES hostels(id)
  );

  CREATE TABLE IF NOT EXISTS beds (
    id           TEXT PRIMARY KEY,
    room_id      TEXT NOT NULL,
    hostel_id    TEXT NOT NULL,
    position     TEXT,
    ac_type      TEXT,
    bed_amount   TEXT,
    status       TEXT DEFAULT 'Vacant',
    FOREIGN KEY (room_id) REFERENCES rooms(id),
    FOREIGN KEY (hostel_id) REFERENCES hostels(id)
  );

  CREATE TABLE IF NOT EXISTS tenants (
    id            INTEGER PRIMARY KEY AUTOINCREMENT,
    hostel_id     TEXT NOT NULL,
    room_id       TEXT NOT NULL,
    bed_id        TEXT NOT NULL,
    name          TEXT NOT NULL,
    phone         TEXT,
    aadhar        TEXT,
    check_in      DATE,
    check_out     DATE,
    deposit       TEXT,
    actual_rent   INTEGER,
    deposit_status TEXT DEFAULT 'Not Collected',
    notes         TEXT,
    is_active     INTEGER DEFAULT 1,
    created_at    DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (bed_id) REFERENCES beds(id)
  );

  CREATE TABLE IF NOT EXISTS rent_payments (
    id         INTEGER PRIMARY KEY AUTOINCREMENT,
    tenant_id  INTEGER NOT NULL,
    bed_id     TEXT NOT NULL,
    month      TEXT NOT NULL,
    amount     INTEGER,
    paid_at    DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (tenant_id) REFERENCES tenants(id)
  );

  CREATE TABLE IF NOT EXISTS expenses (
    id         INTEGER PRIMARY KEY AUTOINCREMENT,
    date       DATE NOT NULL,
    hostel_id  TEXT,
    category   TEXT NOT NULL,
    amount     INTEGER NOT NULL,
    notes      TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS investments (
    id         INTEGER PRIMARY KEY AUTOINCREMENT,
    date       DATE NOT NULL,
    hostel_id  TEXT,
    category   TEXT NOT NULL,
    investor   TEXT,
    amount     INTEGER NOT NULL,
    notes      TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`);

module.exports = db;
