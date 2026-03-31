import React, { useState } from 'react';
import { useApi, apiPost, apiPut } from '../hooks/useApi.js';
import { useToast } from '../context/ToastContext.jsx';
import TenantCard from '../components/TenantCard.jsx';
import EmptyState from '../components/EmptyState.jsx';

const DEPOSIT_STATUSES = ['Not Collected', 'Collected', 'Partial'];

function AddTenantForm({ hostels, onSaved }) {
  const { show } = useToast();
  const [form, setForm] = useState({
    hostel_id: '', room_id: '', bed_id: '', ac_type: 'NON AC',
    name: '', phone: '', aadhar: '',
    check_in: new Date().toISOString().split('T')[0],
    check_out: '', deposit: '', actual_rent: '',
    deposit_status: 'Not Collected', notes: '',
  });
  const [saving, setSaving] = useState(false);
  const { data: rooms } = useApi(form.hostel_id ? `/rooms?hostel_id=${form.hostel_id}` : null, [form.hostel_id]);
  const { data: beds }  = useApi(form.room_id   ? `/beds?hostel_id=${form.hostel_id}`   : null, [form.room_id]);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSave = async () => {
    if (!form.name || !form.phone || !form.bed_id || !form.check_in) {
      show('Name, phone, bed ID and check-in are required', 'error'); return;
    }
    setSaving(true);
    try {
      await apiPost('/tenants', { ...form, actual_rent: Number(form.actual_rent) });
      show('Tenant added successfully');
      setForm({
        hostel_id: '', room_id: '', bed_id: '', ac_type: 'NON AC',
        name: '', phone: '', aadhar: '',
        check_in: new Date().toISOString().split('T')[0],
        check_out: '', deposit: '', actual_rent: '',
        deposit_status: 'Not Collected', notes: '',
      });
      onSaved();
    } catch (e) {
      show(e.message, 'error');
    } finally {
      setSaving(false);
    }
  };

  const filteredBeds = beds?.filter(b => b.room_id === form.room_id && b.status !== 'Occupied') || [];

  return (
    /* On desktop: 2-panel layout — bed selection left, personal details right */
    <div className="md:grid md:grid-cols-2 md:gap-6 space-y-4 md:space-y-0">

      {/* Left panel — Bed assignment */}
      <div className="space-y-3">
        <div className="card p-4">
          <p className="section-title">Bed assignment</p>

          <div className="space-y-3">
            <div>
              <label className="label">Hostel *</label>
              <select className="input" value={form.hostel_id}
                onChange={e => { set('hostel_id', e.target.value); set('room_id', ''); set('bed_id', ''); }}>
                <option value="">Select hostel</option>
                {hostels?.map(h => <option key={h.id} value={h.id}>{h.id} · {h.name}</option>)}
              </select>
            </div>
            <div>
              <label className="label">Room *</label>
              <select className="input" value={form.room_id}
                onChange={e => { set('room_id', e.target.value); set('bed_id', ''); }}
                disabled={!form.hostel_id}>
                <option value="">Select room</option>
                {rooms?.map(r => <option key={r.id} value={r.id}>{r.id} · {r.floor} · {r.sharing_type} · {r.ac_type}</option>)}
              </select>
            </div>
            <div>
              <label className="label">Bed *</label>
              <select className="input" value={form.bed_id} onChange={e => set('bed_id', e.target.value)} disabled={!form.room_id}>
                <option value="">Select bed</option>
                {filteredBeds.map(b => <option key={b.id} value={b.id}>{b.id} · {b.position} · {b.ac_type} · ₹{b.bed_amount}</option>)}
              </select>
              {form.room_id && filteredBeds.length === 0 && (
                <p className="text-xs text-amber-600 mt-1">No vacant beds in this room</p>
              )}
            </div>
          </div>
        </div>

        {/* Financial */}
        <div className="card p-4">
          <p className="section-title">Financials</p>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label">Deposit (₹)</label>
              <input className="input" type="number" placeholder="0" value={form.deposit} onChange={e => set('deposit', e.target.value)} />
            </div>
            <div>
              <label className="label">Monthly rent (₹)</label>
              <input className="input" type="number" placeholder="0" value={form.actual_rent} onChange={e => set('actual_rent', e.target.value)} />
            </div>
            <div className="col-span-2">
              <label className="label">Deposit status</label>
              <select className="input" value={form.deposit_status} onChange={e => set('deposit_status', e.target.value)}>
                {DEPOSIT_STATUSES.map(s => <option key={s}>{s}</option>)}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Right panel — Personal details */}
      <div className="space-y-3">
        <div className="card p-4">
          <p className="section-title">Personal details</p>
          <div className="space-y-3">
            <div>
              <label className="label">Full name *</label>
              <input className="input" placeholder="Tenant name" value={form.name} onChange={e => set('name', e.target.value)} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="label">Phone *</label>
                <input className="input" placeholder="10-digit" value={form.phone} onChange={e => set('phone', e.target.value)} />
              </div>
              <div>
                <label className="label">Aadhar / DL</label>
                <input className="input" placeholder="ID number" value={form.aadhar} onChange={e => set('aadhar', e.target.value)} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="label">Check-in *</label>
                <input className="input" type="date" value={form.check_in} onChange={e => set('check_in', e.target.value)} />
              </div>
              <div>
                <label className="label">Expected check-out</label>
                <input className="input" type="date" value={form.check_out} onChange={e => set('check_out', e.target.value)} />
              </div>
            </div>
            <div>
              <label className="label">Notes</label>
              <textarea className="input resize-none" rows={3} placeholder="Any special notes…" value={form.notes} onChange={e => set('notes', e.target.value)} />
            </div>
          </div>
        </div>

        <button onClick={handleSave} disabled={saving} className="btn-primary w-full py-3 text-base">
          {saving ? 'Saving…' : 'Add tenant'}
        </button>
      </div>
    </div>
  );
}

export default function Tenants() {
  const [tab, setTab]           = useState('active');
  const [search, setSearch]     = useState('');
  const [refreshKey, setRefreshKey] = useState(0);
  const { show }                = useToast();

  const { data: hostels }        = useApi('/hostels');
  const { data: activeTenants }  = useApi('/tenants?active=1', [refreshKey]);
  const { data: history }        = useApi('/tenants/history', [refreshKey]);

  const refresh = () => setRefreshKey(k => k + 1);

  const handleCheckout = async (tenant) => {
    if (!window.confirm(`Mark ${tenant.name} as checked out?`)) return;
    try {
      await apiPut(`/tenants/${tenant.id}/checkout`, {});
      show(`${tenant.name} checked out`);
      refresh();
    } catch (e) {
      show(e.message, 'error');
    }
  };

  const filtered = (list) => {
    if (!list || !search) return list || [];
    const s = search.toLowerCase();
    return list.filter(t =>
      t.name.toLowerCase().includes(s) ||
      t.bed_id?.toLowerCase().includes(s) ||
      t.phone?.includes(s)
    );
  };

  const tabs = [
    { key: 'add',     label: 'Add new' },
    { key: 'active',  label: `Active (${activeTenants?.length ?? '…'})` },
    { key: 'history', label: 'History' },
  ];

  return (
    <div className="page-container">
      <h2 className="page-heading">Tenants</h2>

      {/* Tabs */}
      <div className="flex gap-1 mb-5 bg-gray-100 dark:bg-gray-800 rounded-xl p-1">
        {tabs.map(t => (
          <button key={t.key} onClick={() => setTab(t.key)}
            className={`flex-1 py-2 text-xs font-medium rounded-lg transition-colors ${
              tab === t.key
                ? 'bg-white dark:bg-[#1e1e1e] text-[#185FA5] shadow-sm'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
            }`}>
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'add' && (
        <AddTenantForm hostels={hostels} onSaved={() => { refresh(); setTab('active'); }} />
      )}

      {(tab === 'active' || tab === 'history') && (
        <>
          <input className="input mb-4" placeholder="Search by name, bed ID or phone…"
            value={search} onChange={e => setSearch(e.target.value)} />

          {tab === 'active' && (
            filtered(activeTenants).length === 0
              ? <EmptyState icon="👤" title="No active tenants" sub="Add a tenant to get started" />
              : <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {filtered(activeTenants).map(t => (
                    <TenantCard key={t.id} tenant={t} onCheckout={handleCheckout} />
                  ))}
                </div>
          )}

          {tab === 'history' && (
            filtered(history).length === 0
              ? <EmptyState icon="📋" title="No history yet" />
              : <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {filtered(history).map(t => (
                    <TenantCard key={t.id} tenant={t} readOnly />
                  ))}
                </div>
          )}
        </>
      )}
    </div>
  );
}
