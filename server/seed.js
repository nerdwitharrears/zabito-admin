const { DatabaseSync } = require('node:sqlite');
const path = require('path');
const DB_PATH = path.join(__dirname, 'zabito.db');
// Remove old DB so we start fresh
const fs = require('fs');
if (fs.existsSync(DB_PATH)) fs.unlinkSync(DB_PATH);
const db = require('./db');

console.log('Seeding database...');

// Tables are fresh since we deleted the DB file above

// Seed hostels
const hostels = [
  { id: 'H1', name: 'Mullai Nagar',     location: 'Anna Nagar', owner_name: 'Sampath',       manager_phone: '', advance: 250000, broker_fee: 25000 },
  { id: 'H2', name: 'J Block',          location: 'Anna Nagar', owner_name: 'Rathanlal Jain', manager_phone: '', advance: 350000, broker_fee: 0 },
  { id: 'H3', name: 'Pioneer Colony 1', location: 'Anna Nagar', owner_name: 'Mathew',         manager_phone: '', advance: 150000, broker_fee: 0 },
  { id: 'H4', name: 'Kambar Colony',    location: 'Anna Nagar', owner_name: 'Kevin Royce',    manager_phone: '', advance: 100000, broker_fee: 13000 },
  { id: 'H5', name: 'Pioneer Colony 2', location: 'Anna Nagar', owner_name: 'TBD',            manager_phone: '', advance: 0, broker_fee: 0 },
  { id: 'H6', name: 'Navalar Nagar',    location: 'Anna Nagar', owner_name: 'TBD',            manager_phone: '', advance: 0, broker_fee: 0 },
  { id: 'H7', name: 'Pioneer Colony 3', location: 'Anna Nagar', owner_name: 'TBD',            manager_phone: '', advance: 0, broker_fee: 0 },
  { id: 'H8', name: 'Pioneer Colony 4', location: 'Anna Nagar', owner_name: 'TBD',            manager_phone: '', advance: 0, broker_fee: 0 },
];

const insertHostel = db.prepare(`INSERT INTO hostels (id, name, location, owner_name, manager_phone, advance, broker_fee) VALUES (?, ?, ?, ?, ?, ?, ?)`);
for (const h of hostels) {
  insertHostel.run(h.id, h.name, h.location, h.owner_name, h.manager_phone, h.advance, h.broker_fee);
}
console.log('✓ Hostels seeded');

// Seed rooms for H1 (Mullai Nagar) - Ground floor + 1st floor
const rooms = [
  { id: 'H1G1', hostel_id: 'H1', floor: 'GF', sharing_type: '4 Sharing', ac_type: 'NON AC' },
  { id: 'H1G2', hostel_id: 'H1', floor: 'GF', sharing_type: '4 Sharing', ac_type: 'NON AC' },
  { id: 'H1F1', hostel_id: 'H1', floor: '1F', sharing_type: '4 Sharing', ac_type: 'AC' },
  { id: 'H1F2', hostel_id: 'H1', floor: '1F', sharing_type: '4 Sharing', ac_type: 'AC' },
  { id: 'H2G1', hostel_id: 'H2', floor: 'GF', sharing_type: '6 Sharing', ac_type: 'NON AC' },
  { id: 'H2G2', hostel_id: 'H2', floor: 'GF', sharing_type: '6 Sharing', ac_type: 'NON AC' },
  { id: 'H2F1', hostel_id: 'H2', floor: '1F', sharing_type: '4 Sharing', ac_type: 'AC' },
  { id: 'H2F2', hostel_id: 'H2', floor: '1F', sharing_type: '4 Sharing', ac_type: 'NON AC' },
  { id: 'H3G1', hostel_id: 'H3', floor: 'GF', sharing_type: '4 Sharing', ac_type: 'NON AC' },
  { id: 'H3F1', hostel_id: 'H3', floor: '1F', sharing_type: '4 Sharing', ac_type: 'AC' },
  { id: 'H4G1', hostel_id: 'H4', floor: 'GF', sharing_type: '2 Sharing', ac_type: 'NON AC' },
  { id: 'H4F1', hostel_id: 'H4', floor: '1F', sharing_type: '4 Sharing', ac_type: 'NON AC' },
  { id: 'H5G1', hostel_id: 'H5', floor: 'GF', sharing_type: '4 Sharing', ac_type: 'NON AC' },
  { id: 'H6G1', hostel_id: 'H6', floor: 'GF', sharing_type: '4 Sharing', ac_type: 'NON AC' },
  { id: 'H7G1', hostel_id: 'H7', floor: 'GF', sharing_type: '4 Sharing', ac_type: 'NON AC' },
  { id: 'H8G1', hostel_id: 'H8', floor: 'GF', sharing_type: '4 Sharing', ac_type: 'NON AC' },
];

const insertRoom = db.prepare(`INSERT INTO rooms (id, hostel_id, floor, sharing_type, ac_type) VALUES (?, ?, ?, ?, ?)`);
for (const r of rooms) {
  insertRoom.run(r.id, r.hostel_id, r.floor, r.sharing_type, r.ac_type);
}
console.log('✓ Rooms seeded');

// Seed beds
const beds = [
  // H1G1 — 4 sharing NON AC
  { id: 'H1G1U1', room_id: 'H1G1', hostel_id: 'H1', position: 'Upper', ac_type: 'NON AC', bed_amount: '5000', status: 'Occupied' },
  { id: 'H1G1L1', room_id: 'H1G1', hostel_id: 'H1', position: 'Lower', ac_type: 'NON AC', bed_amount: '5500', status: 'Occupied' },
  { id: 'H1G1U2', room_id: 'H1G1', hostel_id: 'H1', position: 'Upper', ac_type: 'NON AC', bed_amount: '5000', status: 'Vacant' },
  { id: 'H1G1L2', room_id: 'H1G1', hostel_id: 'H1', position: 'Lower', ac_type: 'NON AC', bed_amount: '5500', status: 'Vacant' },
  // H1G2 — 4 sharing NON AC
  { id: 'H1G2U1', room_id: 'H1G2', hostel_id: 'H1', position: 'Upper', ac_type: 'NON AC', bed_amount: '5000', status: 'Occupied' },
  { id: 'H1G2L1', room_id: 'H1G2', hostel_id: 'H1', position: 'Lower', ac_type: 'NON AC', bed_amount: '5500', status: 'Occupied' },
  { id: 'H1G2U2', room_id: 'H1G2', hostel_id: 'H1', position: 'Upper', ac_type: 'NON AC', bed_amount: '5000', status: 'Vacant' },
  { id: 'H1G2L2', room_id: 'H1G2', hostel_id: 'H1', position: 'Lower', ac_type: 'NON AC', bed_amount: '5500', status: 'Vacant' },
  // H1F1 — 4 sharing AC
  { id: 'H1F1U1', room_id: 'H1F1', hostel_id: 'H1', position: 'Upper', ac_type: 'AC', bed_amount: '6500', status: 'Occupied' },
  { id: 'H1F1L1', room_id: 'H1F1', hostel_id: 'H1', position: 'Lower', ac_type: 'AC', bed_amount: '7000', status: 'Occupied' },
  { id: 'H1F1U2', room_id: 'H1F1', hostel_id: 'H1', position: 'Upper', ac_type: 'AC', bed_amount: '6500', status: 'Occupied' },
  { id: 'H1F1L2', room_id: 'H1F1', hostel_id: 'H1', position: 'Lower', ac_type: 'AC', bed_amount: '7000', status: 'Occupied' },
  // H1F2 — 4 sharing AC
  { id: 'H1F2U1', room_id: 'H1F2', hostel_id: 'H1', position: 'Upper', ac_type: 'AC', bed_amount: '6500', status: 'Occupied' },
  { id: 'H1F2L1', room_id: 'H1F2', hostel_id: 'H1', position: 'Lower', ac_type: 'AC', bed_amount: '7000', status: 'Occupied' },
  { id: 'H1F2U2', room_id: 'H1F2', hostel_id: 'H1', position: 'Upper', ac_type: 'AC', bed_amount: '6500', status: 'Vacant' },
  { id: 'H1F2L2', room_id: 'H1F2', hostel_id: 'H1', position: 'Lower', ac_type: 'AC', bed_amount: '7000', status: 'Vacant' },
  // H2G1 — 6 sharing NON AC
  { id: 'H2G1B1', room_id: 'H2G1', hostel_id: 'H2', position: 'Lower', ac_type: 'NON AC', bed_amount: '4750', status: 'Occupied' },
  { id: 'H2G1B2', room_id: 'H2G1', hostel_id: 'H2', position: 'Upper', ac_type: 'NON AC', bed_amount: '4500', status: 'Occupied' },
  { id: 'H2G1B3', room_id: 'H2G1', hostel_id: 'H2', position: 'Lower', ac_type: 'NON AC', bed_amount: '4750', status: 'Occupied' },
  { id: 'H2G1B4', room_id: 'H2G1', hostel_id: 'H2', position: 'Upper', ac_type: 'NON AC', bed_amount: '4500', status: 'Vacant' },
  { id: 'H2G1B5', room_id: 'H2G1', hostel_id: 'H2', position: 'Lower', ac_type: 'NON AC', bed_amount: '4750', status: 'Vacant' },
  { id: 'H2G1B6', room_id: 'H2G1', hostel_id: 'H2', position: 'Upper', ac_type: 'NON AC', bed_amount: '4500', status: 'Vacant' },
  // H2G2 — 6 sharing NON AC
  { id: 'H2G2B1', room_id: 'H2G2', hostel_id: 'H2', position: 'Lower', ac_type: 'NON AC', bed_amount: '4750', status: 'Occupied' },
  { id: 'H2G2B2', room_id: 'H2G2', hostel_id: 'H2', position: 'Upper', ac_type: 'NON AC', bed_amount: '4500', status: 'Occupied' },
  { id: 'H2G2B3', room_id: 'H2G2', hostel_id: 'H2', position: 'Lower', ac_type: 'NON AC', bed_amount: '4750', status: 'Occupied' },
  { id: 'H2G2B4', room_id: 'H2G2', hostel_id: 'H2', position: 'Upper', ac_type: 'NON AC', bed_amount: '4500', status: 'Occupied' },
  { id: 'H2G2B5', room_id: 'H2G2', hostel_id: 'H2', position: 'Lower', ac_type: 'NON AC', bed_amount: '4750', status: 'Vacant' },
  { id: 'H2G2B6', room_id: 'H2G2', hostel_id: 'H2', position: 'Upper', ac_type: 'NON AC', bed_amount: '4500', status: 'Vacant' },
  // H2F1 — 4 sharing AC
  { id: 'H2F1U1', room_id: 'H2F1', hostel_id: 'H2', position: 'Upper', ac_type: 'AC', bed_amount: '6000', status: 'Occupied' },
  { id: 'H2F1L1', room_id: 'H2F1', hostel_id: 'H2', position: 'Lower', ac_type: 'AC', bed_amount: '6500', status: 'Occupied' },
  { id: 'H2F1U2', room_id: 'H2F1', hostel_id: 'H2', position: 'Upper', ac_type: 'AC', bed_amount: '6000', status: 'Occupied' },
  { id: 'H2F1L2', room_id: 'H2F1', hostel_id: 'H2', position: 'Lower', ac_type: 'AC', bed_amount: '6500', status: 'Occupied' },
  // H2F2 — 4 sharing NON AC
  { id: 'H2F2U1', room_id: 'H2F2', hostel_id: 'H2', position: 'Upper', ac_type: 'NON AC', bed_amount: '5000', status: 'Occupied' },
  { id: 'H2F2L1', room_id: 'H2F2', hostel_id: 'H2', position: 'Lower', ac_type: 'NON AC', bed_amount: '5500', status: 'Occupied' },
  { id: 'H2F2U2', room_id: 'H2F2', hostel_id: 'H2', position: 'Upper', ac_type: 'NON AC', bed_amount: '5000', status: 'Vacant' },
  { id: 'H2F2L2', room_id: 'H2F2', hostel_id: 'H2', position: 'Lower', ac_type: 'NON AC', bed_amount: '5500', status: 'Vacant' },
  // H3G1 — 4 sharing NON AC
  { id: 'H3G1U1', room_id: 'H3G1', hostel_id: 'H3', position: 'Upper', ac_type: 'NON AC', bed_amount: '5000', status: 'Occupied' },
  { id: 'H3G1L1', room_id: 'H3G1', hostel_id: 'H3', position: 'Lower', ac_type: 'NON AC', bed_amount: '5500', status: 'Occupied' },
  { id: 'H3G1U2', room_id: 'H3G1', hostel_id: 'H3', position: 'Upper', ac_type: 'NON AC', bed_amount: '5000', status: 'Occupied' },
  { id: 'H3G1L2', room_id: 'H3G1', hostel_id: 'H3', position: 'Lower', ac_type: 'NON AC', bed_amount: '5500', status: 'Vacant' },
  // H3F1 — 4 sharing AC
  { id: 'H3F1U1', room_id: 'H3F1', hostel_id: 'H3', position: 'Upper', ac_type: 'AC', bed_amount: '6500', status: 'Occupied' },
  { id: 'H3F1L1', room_id: 'H3F1', hostel_id: 'H3', position: 'Lower', ac_type: 'AC', bed_amount: '7000', status: 'Occupied' },
  { id: 'H3F1U2', room_id: 'H3F1', hostel_id: 'H3', position: 'Upper', ac_type: 'AC', bed_amount: '6500', status: 'Vacant' },
  { id: 'H3F1L2', room_id: 'H3F1', hostel_id: 'H3', position: 'Lower', ac_type: 'AC', bed_amount: '7000', status: 'Vacant' },
  // H4G1 — 2 sharing NON AC
  { id: 'H4G1B1', room_id: 'H4G1', hostel_id: 'H4', position: 'Lower', ac_type: 'NON AC', bed_amount: '6000', status: 'Occupied' },
  { id: 'H4G1B2', room_id: 'H4G1', hostel_id: 'H4', position: 'Upper', ac_type: 'NON AC', bed_amount: '5500', status: 'Vacant' },
  // H4F1 — 4 sharing NON AC
  { id: 'H4F1U1', room_id: 'H4F1', hostel_id: 'H4', position: 'Upper', ac_type: 'NON AC', bed_amount: '5000', status: 'Occupied' },
  { id: 'H4F1L1', room_id: 'H4F1', hostel_id: 'H4', position: 'Lower', ac_type: 'NON AC', bed_amount: '5500', status: 'Occupied' },
  { id: 'H4F1U2', room_id: 'H4F1', hostel_id: 'H4', position: 'Upper', ac_type: 'NON AC', bed_amount: '5000', status: 'Occupied' },
  { id: 'H4F1L2', room_id: 'H4F1', hostel_id: 'H4', position: 'Lower', ac_type: 'NON AC', bed_amount: '5500', status: 'Occupied' },
  // H5G1
  { id: 'H5G1U1', room_id: 'H5G1', hostel_id: 'H5', position: 'Upper', ac_type: 'NON AC', bed_amount: '5000', status: 'Vacant' },
  { id: 'H5G1L1', room_id: 'H5G1', hostel_id: 'H5', position: 'Lower', ac_type: 'NON AC', bed_amount: '5500', status: 'Vacant' },
  { id: 'H5G1U2', room_id: 'H5G1', hostel_id: 'H5', position: 'Upper', ac_type: 'NON AC', bed_amount: '5000', status: 'Vacant' },
  { id: 'H5G1L2', room_id: 'H5G1', hostel_id: 'H5', position: 'Lower', ac_type: 'NON AC', bed_amount: '5500', status: 'Vacant' },
  // H6G1
  { id: 'H6G1U1', room_id: 'H6G1', hostel_id: 'H6', position: 'Upper', ac_type: 'NON AC', bed_amount: '5000', status: 'Vacant' },
  { id: 'H6G1L1', room_id: 'H6G1', hostel_id: 'H6', position: 'Lower', ac_type: 'NON AC', bed_amount: '5500', status: 'Vacant' },
  { id: 'H6G1U2', room_id: 'H6G1', hostel_id: 'H6', position: 'Upper', ac_type: 'NON AC', bed_amount: '5000', status: 'Vacant' },
  { id: 'H6G1L2', room_id: 'H6G1', hostel_id: 'H6', position: 'Lower', ac_type: 'NON AC', bed_amount: '5500', status: 'Vacant' },
  // H7G1
  { id: 'H7G1U1', room_id: 'H7G1', hostel_id: 'H7', position: 'Upper', ac_type: 'NON AC', bed_amount: '5000', status: 'Vacant' },
  { id: 'H7G1L1', room_id: 'H7G1', hostel_id: 'H7', position: 'Lower', ac_type: 'NON AC', bed_amount: '5500', status: 'Vacant' },
  { id: 'H7G1U2', room_id: 'H7G1', hostel_id: 'H7', position: 'Upper', ac_type: 'NON AC', bed_amount: '5000', status: 'Vacant' },
  { id: 'H7G1L2', room_id: 'H7G1', hostel_id: 'H7', position: 'Lower', ac_type: 'NON AC', bed_amount: '5500', status: 'Vacant' },
  // H8G1
  { id: 'H8G1U1', room_id: 'H8G1', hostel_id: 'H8', position: 'Upper', ac_type: 'NON AC', bed_amount: '5000', status: 'Vacant' },
  { id: 'H8G1L1', room_id: 'H8G1', hostel_id: 'H8', position: 'Lower', ac_type: 'NON AC', bed_amount: '5500', status: 'Vacant' },
  { id: 'H8G1U2', room_id: 'H8G1', hostel_id: 'H8', position: 'Upper', ac_type: 'NON AC', bed_amount: '5000', status: 'Vacant' },
  { id: 'H8G1L2', room_id: 'H8G1', hostel_id: 'H8', position: 'Lower', ac_type: 'NON AC', bed_amount: '5500', status: 'Vacant' },
];

const insertBed = db.prepare(`INSERT INTO beds (id, room_id, hostel_id, position, ac_type, bed_amount, status) VALUES (?, ?, ?, ?, ?, ?, ?)`);
for (const b of beds) {
  insertBed.run(b.id, b.room_id, b.hostel_id, b.position, b.ac_type, b.bed_amount, b.status);
}
console.log('✓ Beds seeded');

// Seed sample tenants for occupied beds
const today = new Date();
const fmt = (d) => d.toISOString().split('T')[0];
const addDays = (d, n) => { const x = new Date(d); x.setDate(x.getDate() + n); return x; };
const subDays = (d, n) => addDays(d, -n);

const tenantData = [
  { hostel_id: 'H1', room_id: 'H1G1', bed_id: 'H1G1U1', name: 'Arjun Kumar',   phone: '9841001001', check_in: fmt(subDays(today, 45)), check_out: fmt(addDays(today, 15)), deposit: '5000', actual_rent: 5000 },
  { hostel_id: 'H1', room_id: 'H1G1', bed_id: 'H1G1L1', name: 'Rahul Sharma',  phone: '9841001002', check_in: fmt(subDays(today, 30)), check_out: fmt(addDays(today, 30)), deposit: '5500', actual_rent: 5500 },
  { hostel_id: 'H1', room_id: 'H1G2', bed_id: 'H1G2U1', name: 'Vikram Singh',  phone: '9841001003', check_in: fmt(subDays(today, 60)), check_out: fmt(addDays(today, 5)),  deposit: '5000', actual_rent: 5000 },
  { hostel_id: 'H1', room_id: 'H1G2', bed_id: 'H1G2L1', name: 'Suresh Babu',   phone: '9841001004', check_in: fmt(subDays(today, 20)), check_out: fmt(addDays(today, 40)), deposit: '5500', actual_rent: 5500 },
  { hostel_id: 'H1', room_id: 'H1F1', bed_id: 'H1F1U1', name: 'Deepak Raj',    phone: '9841001005', check_in: fmt(subDays(today, 90)), check_out: fmt(addDays(today, -2)), deposit: '6500', actual_rent: 6500 },
  { hostel_id: 'H1', room_id: 'H1F1', bed_id: 'H1F1L1', name: 'Karthik M',     phone: '9841001006', check_in: fmt(subDays(today, 15)), check_out: fmt(addDays(today, 60)), deposit: '7000', actual_rent: 7000 },
  { hostel_id: 'H1', room_id: 'H1F1', bed_id: 'H1F1U2', name: 'Manoj Kumar',   phone: '9841001007', check_in: fmt(subDays(today, 25)), check_out: fmt(addDays(today, 35)), deposit: '6500', actual_rent: 6500 },
  { hostel_id: 'H1', room_id: 'H1F1', bed_id: 'H1F1L2', name: 'Praveen R',     phone: '9841001008', check_in: fmt(subDays(today, 10)), check_out: fmt(addDays(today, 50)), deposit: '7000', actual_rent: 7000 },
  { hostel_id: 'H1', room_id: 'H1F2', bed_id: 'H1F2U1', name: 'Sathish Kumar', phone: '9841001009', check_in: fmt(subDays(today, 35)), check_out: fmt(addDays(today, 25)), deposit: '6500', actual_rent: 6500 },
  { hostel_id: 'H1', room_id: 'H1F2', bed_id: 'H1F2L1', name: 'Ravi Chandran', phone: '9841001010', check_in: fmt(subDays(today, 50)), check_out: fmt(addDays(today, 10)), deposit: '7000', actual_rent: 7000 },
  { hostel_id: 'H2', room_id: 'H2G1', bed_id: 'H2G1B1', name: 'Arun Prasad',   phone: '9841002001', check_in: fmt(subDays(today, 40)), check_out: fmt(addDays(today, 20)), deposit: '4750', actual_rent: 4750 },
  { hostel_id: 'H2', room_id: 'H2G1', bed_id: 'H2G1B2', name: 'Dinesh M',      phone: '9841002002', check_in: fmt(subDays(today, 55)), check_out: fmt(addDays(today, 5)),  deposit: '4500', actual_rent: 4500 },
  { hostel_id: 'H2', room_id: 'H2G1', bed_id: 'H2G1B3', name: 'Ganesh R',      phone: '9841002003', check_in: fmt(subDays(today, 20)), check_out: fmt(addDays(today, 40)), deposit: '4750', actual_rent: 4750 },
  { hostel_id: 'H2', room_id: 'H2G2', bed_id: 'H2G2B1', name: 'Hari Krishnan', phone: '9841002004', check_in: fmt(subDays(today, 30)), check_out: fmt(addDays(today, 30)), deposit: '4750', actual_rent: 4750 },
  { hostel_id: 'H2', room_id: 'H2G2', bed_id: 'H2G2B2', name: 'Jagan S',       phone: '9841002005', check_in: fmt(subDays(today, 45)), check_out: fmt(addDays(today, 15)), deposit: '4500', actual_rent: 4500 },
  { hostel_id: 'H2', room_id: 'H2G2', bed_id: 'H2G2B3', name: 'Kiran P',       phone: '9841002006', check_in: fmt(subDays(today, 10)), check_out: fmt(addDays(today, 50)), deposit: '4750', actual_rent: 4750 },
  { hostel_id: 'H2', room_id: 'H2G2', bed_id: 'H2G2B4', name: 'Lokesh N',      phone: '9841002007', check_in: fmt(subDays(today, 60)), check_out: fmt(addDays(today, 2)),  deposit: '4500', actual_rent: 4500 },
  { hostel_id: 'H2', room_id: 'H2F1', bed_id: 'H2F1U1', name: 'Mani V',        phone: '9841002008', check_in: fmt(subDays(today, 25)), check_out: fmt(addDays(today, 35)), deposit: '6000', actual_rent: 6000 },
  { hostel_id: 'H2', room_id: 'H2F1', bed_id: 'H2F1L1', name: 'Naresh G',      phone: '9841002009', check_in: fmt(subDays(today, 15)), check_out: fmt(addDays(today, 45)), deposit: '6500', actual_rent: 6500 },
  { hostel_id: 'H2', room_id: 'H2F1', bed_id: 'H2F1U2', name: 'Prabhu K',      phone: '9841002010', check_in: fmt(subDays(today, 80)), check_out: fmt(addDays(today, -1)), deposit: '6000', actual_rent: 6000 },
  { hostel_id: 'H2', room_id: 'H2F1', bed_id: 'H2F1L2', name: 'Rajan A',       phone: '9841002011', check_in: fmt(subDays(today, 5)),  check_out: fmt(addDays(today, 55)), deposit: '6500', actual_rent: 6500 },
  { hostel_id: 'H2', room_id: 'H2F2', bed_id: 'H2F2U1', name: 'Senthil D',     phone: '9841002012', check_in: fmt(subDays(today, 35)), check_out: fmt(addDays(today, 25)), deposit: '5000', actual_rent: 5000 },
  { hostel_id: 'H2', room_id: 'H2F2', bed_id: 'H2F2L1', name: 'Thiru M',       phone: '9841002013', check_in: fmt(subDays(today, 70)), check_out: fmt(addDays(today, 3)),  deposit: '5500', actual_rent: 5500 },
  { hostel_id: 'H3', room_id: 'H3G1', bed_id: 'H3G1U1', name: 'Udhay K',       phone: '9841003001', check_in: fmt(subDays(today, 40)), check_out: fmt(addDays(today, 20)), deposit: '5000', actual_rent: 5000 },
  { hostel_id: 'H3', room_id: 'H3G1', bed_id: 'H3G1L1', name: 'Vinoth P',      phone: '9841003002', check_in: fmt(subDays(today, 20)), check_out: fmt(addDays(today, 40)), deposit: '5500', actual_rent: 5500 },
  { hostel_id: 'H3', room_id: 'H3G1', bed_id: 'H3G1U2', name: 'Xavier S',      phone: '9841003003', check_in: fmt(subDays(today, 30)), check_out: fmt(addDays(today, 30)), deposit: '5000', actual_rent: 5000 },
  { hostel_id: 'H3', room_id: 'H3F1', bed_id: 'H3F1U1', name: 'Yuvaraj T',     phone: '9841003004', check_in: fmt(subDays(today, 50)), check_out: fmt(addDays(today, 10)), deposit: '6500', actual_rent: 6500 },
  { hostel_id: 'H3', room_id: 'H3F1', bed_id: 'H3F1L1', name: 'Zafar A',       phone: '9841003005', check_in: fmt(subDays(today, 15)), check_out: fmt(addDays(today, 45)), deposit: '7000', actual_rent: 7000 },
  { hostel_id: 'H4', room_id: 'H4G1', bed_id: 'H4G1B1', name: 'Abishek R',     phone: '9841004001', check_in: fmt(subDays(today, 25)), check_out: fmt(addDays(today, 35)), deposit: '6000', actual_rent: 6000 },
  { hostel_id: 'H4', room_id: 'H4F1', bed_id: 'H4F1U1', name: 'Bala S',        phone: '9841004002', check_in: fmt(subDays(today, 60)), check_out: fmt(addDays(today, 4)),  deposit: '5000', actual_rent: 5000 },
  { hostel_id: 'H4', room_id: 'H4F1', bed_id: 'H4F1L1', name: 'Chandru N',     phone: '9841004003', check_in: fmt(subDays(today, 30)), check_out: fmt(addDays(today, 30)), deposit: '5500', actual_rent: 5500 },
  { hostel_id: 'H4', room_id: 'H4F1', bed_id: 'H4F1U2', name: 'Durai K',       phone: '9841004004', check_in: fmt(subDays(today, 10)), check_out: fmt(addDays(today, 50)), deposit: '5000', actual_rent: 5000 },
  { hostel_id: 'H4', room_id: 'H4F1', bed_id: 'H4F1L2', name: 'Elan M',        phone: '9841004005', check_in: fmt(subDays(today, 45)), check_out: fmt(addDays(today, 15)), deposit: '5500', actual_rent: 5500 },
];

const insertTenant = db.prepare(`
  INSERT INTO tenants (hostel_id, room_id, bed_id, name, phone, check_in, check_out, deposit, actual_rent, deposit_status, is_active)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'Collected', 1)
`);

for (const t of tenantData) {
  insertTenant.run(t.hostel_id, t.room_id, t.bed_id, t.name, t.phone, t.check_in, t.check_out, t.deposit, t.actual_rent);
}
console.log('✓ Tenants seeded');

// Seed rent payments for last 3 months
const tenants = db.prepare('SELECT id, bed_id, actual_rent FROM tenants WHERE is_active = 1').all();
const insertRent = db.prepare(`INSERT INTO rent_payments (tenant_id, bed_id, month, amount) VALUES (?, ?, ?, ?)`);

const months = [];
for (let i = 2; i >= 0; i--) {
  const d = new Date(today);
  d.setMonth(d.getMonth() - i);
  months.push(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`);
}

for (const t of tenants) {
  // Pay for first 2 months, skip current month for some
  insertRent.run(t.id, t.bed_id, months[0], t.actual_rent);
  if (Math.random() > 0.2) insertRent.run(t.id, t.bed_id, months[1], t.actual_rent);
}
console.log('✓ Rent payments seeded');

// Seed expenses (last 3 months)
const expCategories = ['Rent', 'EB', 'House Keeping Salary', 'Drinking Water Can', 'Wifi Setup'];
const insertExp = db.prepare(`INSERT INTO expenses (date, hostel_id, category, amount, notes) VALUES (?, ?, ?, ?, ?)`);

const hostelIds = ['H1', 'H2', 'H3', 'H4'];
for (let m = 2; m >= 0; m--) {
  const d = new Date(today);
  d.setMonth(d.getMonth() - m);
  const monthStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;

  for (const hid of hostelIds) {
    insertExp.run(`${monthStr}-05`, hid, 'Rent',               [25000, 35000, 15000, 10000][hostelIds.indexOf(hid)], 'Monthly rent');
    insertExp.run(`${monthStr}-10`, hid, 'EB',                 [3500, 4200, 2800, 2100][hostelIds.indexOf(hid)],    'Electricity bill');
    insertExp.run(`${monthStr}-01`, hid, 'House Keeping Salary', 8000, 'Staff salary');
    if (m === 2) insertExp.run(`${monthStr}-15`, hid, 'Wifi Setup', 2000, 'Jio fiber monthly');
  }
}
console.log('✓ Expenses seeded');

// Seed investments
const insertInv = db.prepare(`INSERT INTO investments (date, hostel_id, category, investor, amount, notes) VALUES (?, ?, ?, ?, ?, ?)`);
insertInv.run('2024-01-10', 'H1', 'Investment Advance', 'Muthu',  125000, 'Initial advance for H1');
insertInv.run('2024-01-10', 'H1', 'Investment Advance', 'Naveen', 125000, 'Initial advance for H1');
insertInv.run('2024-02-05', 'H2', 'Investment Advance', 'Muthu',  175000, 'Advance for H2');
insertInv.run('2024-02-05', 'H2', 'Investment Advance', 'Naveen', 175000, 'Advance for H2');
insertInv.run('2024-03-01', 'H1', 'Interior',           'Muthu',   50000, 'Furniture & interior');
insertInv.run('2024-03-01', 'H1', 'Interior',           'Naveen',  50000, 'Furniture & interior');
insertInv.run('2024-04-15', 'H3', 'Building Advance',   'Muthu',   75000, 'Advance for H3');
insertInv.run('2024-04-15', 'H3', 'Building Advance',   'Naveen',  75000, 'Advance for H3');
insertInv.run('2024-05-20', 'H2', 'AC/Washing Machine', 'Muthu',   45000, '3 AC units');
console.log('✓ Investments seeded');

console.log('\n✅ Database seeded successfully!');
