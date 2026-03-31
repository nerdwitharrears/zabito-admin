import React, { useState } from 'react';
import { useApi, apiPost, apiPut } from '../hooks/useApi.js';
import { useToast } from '../context/ToastContext.jsx';
import EmptyState from '../components/EmptyState.jsx';

// ─── Hostel Section ────────────────────────────────────────────────────────────
function HostelSection() {
  const { show } = useToast();
  const [refreshKey, setRefreshKey] = useState(0);
  const { data: hostels } = useApi('/hostels', [refreshKey]);
  const [adding, setAdding]   = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm]       = useState({ id: '', name: '', location: 'Anna Nagar', owner_name: '', manager_phone: '', advance: '', broker_fee: '' });
  const [saving, setSaving]   = useState(false);
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const nextId = () => {
    if (!hostels?.length) return 'H1';
    const nums = hostels.map(h => parseInt(h.id.replace('H', ''))).filter(n => !isNaN(n));
    return `H${Math.max(...nums) + 1}`;
  };

  const startAdd = () => {
    setForm({ id: nextId(), name: '', location: 'Anna Nagar', owner_name: '', manager_phone: '', advance: '', broker_fee: '' });
    setEditing(null); setAdding(true);
  };

  const startEdit = (h) => {
    setForm({ id: h.id, name: h.name, location: h.location || '', owner_name: h.owner_name || '', manager_phone: h.manager_phone || '', advance: h.advance || '', broker_fee: h.broker_fee || '' });
    setEditing(h.id); setAdding(true);
  };

  const handleSave = async () => {
    if (!form.id || !form.name) { show('ID and name required', 'error'); return; }
    setSaving(true);
    try {
      if (editing) {
        await apiPut(`/hostels/${editing}`, { ...form, advance: Number(form.advance || 0), broker_fee: Number(form.broker_fee || 0) });
        show('Hostel updated');
      } else {
        await apiPost('/hostels', { ...form, advance: Number(form.advance || 0), broker_fee: Number(form.broker_fee || 0) });
        show('Hostel added');
      }
      setAdding(false); setEditing(null);
      setRefreshKey(k => k + 1);
    } catch (e) { show(e.message, 'error'); }
    finally { setSaving(false); }
  };

  return (
    <div className="md:grid md:grid-cols-2 md:gap-6 space-y-4 md:space-y-0">
      {/* Left: form */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <p className="section-title mb-0">{editing ? 'Edit hostel' : 'Add hostel'}</p>
          {!adding && <button onClick={startAdd} className="btn-primary text-xs py-1.5 px-3">+ Add hostel</button>}
        </div>

        {adding ? (
          <div className="card p-4 space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="label">Hostel ID *</label>
                <input className="input" value={form.id} onChange={e => set('id', e.target.value.toUpperCase())} disabled={!!editing} placeholder="H9" />
              </div>
              <div>
                <label className="label">Name *</label>
                <input className="input" value={form.name} onChange={e => set('name', e.target.value)} placeholder="Hostel name" />
              </div>
              <div>
                <label className="label">Location</label>
                <input className="input" value={form.location} onChange={e => set('location', e.target.value)} />
              </div>
              <div>
                <label className="label">Owner name</label>
                <input className="input" value={form.owner_name} onChange={e => set('owner_name', e.target.value)} />
              </div>
              <div>
                <label className="label">Manager phone</label>
                <input className="input" value={form.manager_phone} onChange={e => set('manager_phone', e.target.value)} />
              </div>
              <div>
                <label className="label">Advance (₹)</label>
                <input className="input" type="number" value={form.advance} onChange={e => set('advance', e.target.value)} />
              </div>
              <div>
                <label className="label">Broker fee (₹)</label>
                <input className="input" type="number" value={form.broker_fee} onChange={e => set('broker_fee', e.target.value)} />
              </div>
            </div>
            <div className="flex gap-2">
              <button onClick={handleSave} disabled={saving} className="btn-primary flex-1 py-2.5">
                {saving ? 'Saving…' : editing ? 'Update' : 'Save'}
              </button>
              <button onClick={() => { setAdding(false); setEditing(null); }} className="btn-secondary flex-1 py-2.5">Cancel</button>
            </div>
          </div>
        ) : (
          <div className="card p-6 text-center text-sm text-gray-400 dark:text-gray-500">
            Click "+ Add hostel" to add a new hostel
          </div>
        )}
      </div>

      {/* Right: table */}
      <div>
        <p className="section-title mb-3">All hostels</p>
        <div className="card overflow-hidden">
          {!hostels?.length
            ? <EmptyState icon="🏠" title="No hostels" />
            : hostels.map((h, i) => (
              <div key={h.id} className={`flex items-start justify-between px-4 py-3 gap-3 ${i < hostels.length - 1 ? 'border-b border-gray-100 dark:border-gray-800' : ''}`}>
                <div className="min-w-0">
                  <p className="text-sm font-semibold">{h.id} · {h.name}</p>
                  <p className="text-xs text-gray-400 dark:text-gray-500">{h.location} · {h.owner_name || 'No owner'}</p>
                  {(h.advance > 0 || h.broker_fee > 0) && (
                    <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
                      Adv: ₹{h.advance?.toLocaleString()} · Broker: ₹{h.broker_fee?.toLocaleString()}
                    </p>
                  )}
                </div>
                <button onClick={() => startEdit(h)} className="text-xs text-[#185FA5] hover:underline flex-shrink-0">Edit</button>
              </div>
            ))
          }
        </div>
      </div>
    </div>
  );
}

// ─── Room Section ──────────────────────────────────────────────────────────────
function RoomSection({ hostels }) {
  const { show }           = useToast();
  const [selectedHostel, setSelectedHostel] = useState('');
  const [refreshKey, setRefreshKey]         = useState(0);
  const { data: rooms }    = useApi(selectedHostel ? `/rooms?hostel_id=${selectedHostel}` : null, [refreshKey, selectedHostel]);
  const [adding, setAdding]= useState(false);
  const [form, setForm]    = useState({ id: '', floor: 'GF', sharing_type: '4 Sharing', ac_type: 'NON AC' });
  const [saving, setSaving]= useState(false);
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSave = async () => {
    if (!form.id || !selectedHostel) { show('Room ID and hostel required', 'error'); return; }
    setSaving(true);
    try {
      await apiPost('/rooms', { ...form, hostel_id: selectedHostel });
      show('Room added'); setAdding(false);
      setForm({ id: '', floor: 'GF', sharing_type: '4 Sharing', ac_type: 'NON AC' });
      setRefreshKey(k => k + 1);
    } catch (e) { show(e.message, 'error'); }
    finally { setSaving(false); }
  };

  return (
    <div className="md:grid md:grid-cols-2 md:gap-6 space-y-4 md:space-y-0">
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <p className="section-title mb-0">Add room</p>
          {!adding && <button onClick={() => setAdding(true)} className="btn-primary text-xs py-1.5 px-3">+ Add room</button>}
        </div>
        <div>
          <label className="label">Select hostel</label>
          <select className="input" value={selectedHostel} onChange={e => setSelectedHostel(e.target.value)}>
            <option value="">Choose hostel</option>
            {hostels?.map(h => <option key={h.id} value={h.id}>{h.id} · {h.name}</option>)}
          </select>
        </div>

        {adding && selectedHostel && (
          <div className="card p-4 space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="label">Room ID *</label>
                <input className="input" value={form.id} onChange={e => set('id', e.target.value.toUpperCase())} placeholder={`${selectedHostel}G1`} />
              </div>
              <div>
                <label className="label">Floor</label>
                <select className="input" value={form.floor} onChange={e => set('floor', e.target.value)}>
                  <option value="GF">Ground floor</option>
                  <option value="1F">1st floor</option>
                  <option value="2F">2nd floor</option>
                  <option value="3F">3rd floor</option>
                </select>
              </div>
              <div>
                <label className="label">Sharing type</label>
                <select className="input" value={form.sharing_type} onChange={e => set('sharing_type', e.target.value)}>
                  <option>2 Sharing</option><option>4 Sharing</option><option>6 Sharing</option><option>Single</option>
                </select>
              </div>
              <div>
                <label className="label">AC type</label>
                <select className="input" value={form.ac_type} onChange={e => set('ac_type', e.target.value)}>
                  <option value="NON AC">Non-AC</option><option value="AC">AC</option>
                </select>
              </div>
            </div>
            <div className="flex gap-2">
              <button onClick={handleSave} disabled={saving} className="btn-primary flex-1 py-2">{saving ? 'Saving…' : 'Save room'}</button>
              <button onClick={() => setAdding(false)} className="btn-secondary flex-1 py-2">Cancel</button>
            </div>
          </div>
        )}
      </div>

      <div>
        <p className="section-title mb-3">Rooms {selectedHostel ? `in ${selectedHostel}` : ''}</p>
        {!selectedHostel ? (
          <div className="card p-6 text-center text-sm text-gray-400 dark:text-gray-500">Select a hostel to view rooms</div>
        ) : (
          <div className="card overflow-hidden">
            {!rooms?.length
              ? <EmptyState icon="🚪" title="No rooms" sub="Add a room" />
              : rooms.map((r, i) => (
                <div key={r.id} className={`flex items-center justify-between px-4 py-3 ${i < rooms.length - 1 ? 'border-b border-gray-100 dark:border-gray-800' : ''}`}>
                  <div>
                    <p className="text-sm font-medium">{r.id}</p>
                    <p className="text-xs text-gray-400 dark:text-gray-500">{r.floor} · {r.sharing_type} · {r.ac_type}</p>
                  </div>
                </div>
              ))
            }
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Bed Section ───────────────────────────────────────────────────────────────
function BedSection({ hostels }) {
  const { show }                            = useToast();
  const [selectedHostel, setSelectedHostel] = useState('');
  const [selectedRoom, setSelectedRoom]     = useState('');
  const [refreshKey, setRefreshKey]         = useState(0);
  const { data: rooms } = useApi(selectedHostel ? `/rooms?hostel_id=${selectedHostel}` : null, [selectedHostel]);
  const { data: beds }  = useApi(selectedRoom   ? `/beds?hostel_id=${selectedHostel}`  : null, [selectedRoom, refreshKey]);
  const [adding, setAdding] = useState(false);
  const [form, setForm]     = useState({ id: '', position: 'Lower', ac_type: 'NON AC', bed_amount: '' });
  const [saving, setSaving] = useState(false);
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const roomBeds = beds?.filter(b => b.room_id === selectedRoom) || [];

  const handleSave = async () => {
    if (!form.id || !selectedRoom || !selectedHostel) { show('Bed ID and room required', 'error'); return; }
    setSaving(true);
    try {
      await apiPost('/beds', { ...form, room_id: selectedRoom, hostel_id: selectedHostel });
      show('Bed added'); setAdding(false);
      setForm({ id: '', position: 'Lower', ac_type: 'NON AC', bed_amount: '' });
      setRefreshKey(k => k + 1);
    } catch (e) { show(e.message, 'error'); }
    finally { setSaving(false); }
  };

  return (
    <div className="md:grid md:grid-cols-2 md:gap-6 space-y-4 md:space-y-0">
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <p className="section-title mb-0">Add bed</p>
          {!adding && <button onClick={() => setAdding(true)} className="btn-primary text-xs py-1.5 px-3">+ Add bed</button>}
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="label">Hostel</label>
            <select className="input" value={selectedHostel} onChange={e => { setSelectedHostel(e.target.value); setSelectedRoom(''); }}>
              <option value="">Select hostel</option>
              {hostels?.map(h => <option key={h.id} value={h.id}>{h.id} · {h.name}</option>)}
            </select>
          </div>
          <div>
            <label className="label">Room</label>
            <select className="input" value={selectedRoom} onChange={e => setSelectedRoom(e.target.value)} disabled={!selectedHostel}>
              <option value="">Select room</option>
              {rooms?.map(r => <option key={r.id} value={r.id}>{r.id}</option>)}
            </select>
          </div>
        </div>

        {adding && selectedRoom && (
          <div className="card p-4 space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="label">Bed ID *</label>
                <input className="input" value={form.id} onChange={e => set('id', e.target.value.toUpperCase())} placeholder={`${selectedRoom}L1`} />
              </div>
              <div>
                <label className="label">Position</label>
                <select className="input" value={form.position} onChange={e => set('position', e.target.value)}>
                  <option>Lower</option><option>Upper</option><option>Single</option>
                </select>
              </div>
              <div>
                <label className="label">AC type</label>
                <select className="input" value={form.ac_type} onChange={e => set('ac_type', e.target.value)}>
                  <option value="NON AC">Non-AC</option><option value="AC">AC</option>
                </select>
              </div>
              <div>
                <label className="label">Bed amount (₹)</label>
                <input className="input" value={form.bed_amount} onChange={e => set('bed_amount', e.target.value)} placeholder="5500" />
              </div>
            </div>
            <div className="flex gap-2">
              <button onClick={handleSave} disabled={saving} className="btn-primary flex-1 py-2">{saving ? 'Saving…' : 'Save bed'}</button>
              <button onClick={() => setAdding(false)} className="btn-secondary flex-1 py-2">Cancel</button>
            </div>
          </div>
        )}
      </div>

      <div>
        <p className="section-title mb-3">Beds {selectedRoom ? `in ${selectedRoom}` : ''}</p>
        {!selectedRoom ? (
          <div className="card p-6 text-center text-sm text-gray-400 dark:text-gray-500">Select a room to view beds</div>
        ) : (
          <div className="card overflow-hidden">
            {roomBeds.length === 0
              ? <EmptyState icon="🛏️" title="No beds in this room" sub="Add a bed" />
              : roomBeds.map((b, i) => (
                <div key={b.id} className={`flex items-center justify-between px-4 py-3 ${i < roomBeds.length - 1 ? 'border-b border-gray-100 dark:border-gray-800' : ''}`}>
                  <div>
                    <p className="text-sm font-medium">{b.id}</p>
                    <p className="text-xs text-gray-400 dark:text-gray-500">{b.position} · {b.ac_type} · ₹{b.bed_amount}</p>
                  </div>
                  <span className={`${b.status === 'Occupied' ? 'badge-green' : 'badge-gray'}`}>{b.status}</span>
                </div>
              ))
            }
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Settings Page ─────────────────────────────────────────────────────────────
export default function Settings() {
  const { data: hostels } = useApi('/hostels');
  const [section, setSection] = useState('hostels');

  return (
    <div className="page-container">
      <h2 className="page-heading">Settings</h2>

      <div className="flex gap-1 mb-6 bg-gray-100 dark:bg-gray-800 rounded-xl p-1">
        {[{ key: 'hostels', label: 'Hostels' }, { key: 'rooms', label: 'Rooms' }, { key: 'beds', label: 'Beds' }].map(s => (
          <button key={s.key} onClick={() => setSection(s.key)}
            className={`flex-1 py-2 text-xs font-medium rounded-lg transition-colors ${
              section === s.key
                ? 'bg-white dark:bg-[#1e1e1e] text-[#185FA5] shadow-sm'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
            }`}>
            {s.label}
          </button>
        ))}
      </div>

      {section === 'hostels' && <HostelSection />}
      {section === 'rooms'   && <RoomSection hostels={hostels} />}
      {section === 'beds'    && <BedSection hostels={hostels} />}
    </div>
  );
}
