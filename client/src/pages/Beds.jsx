import React, { useState, useCallback } from 'react';
import { useApi, apiPost } from '../hooks/useApi.js';
import { useToast } from '../context/ToastContext.jsx';
import SlidePanel from '../components/SlidePanel.jsx';
import EmptyState from '../components/EmptyState.jsx';

// ─── Bed detail slide panel ────────────────────────────────────────────────────
function BedDetail({ bed, onClose, onRentPaid }) {
  const { show } = useToast();
  const [paying, setPaying] = useState(false);
  const [rentAmt, setRentAmt] = useState(bed.actual_rent || '');
  const now = new Date();
  const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;

  const handlePayRent = async () => {
    if (!bed.tenant_id) return;
    setPaying(true);
    try {
      await apiPost('/rent', { tenant_id: bed.tenant_id, bed_id: bed.id, month: currentMonth, amount: Number(rentAmt) });
      show('Rent marked as paid');
      onRentPaid();
      onClose();
    } catch (e) {
      show(e.message, 'error');
    } finally {
      setPaying(false);
    }
  };

  const Row = ({ label, value, highlight }) => (
    <div className="flex items-start justify-between py-2 border-b border-gray-50 dark:border-gray-800 last:border-0">
      <span className="text-xs text-gray-400 dark:text-gray-500 w-28 flex-shrink-0">{label}</span>
      <span className={`text-sm font-medium text-right ${highlight || ''}`}>{value || '—'}</span>
    </div>
  );

  return (
    <div className="space-y-4">
      <div className="card p-4">
        <p className="section-title">Bed info</p>
        <Row label="Bed ID"      value={bed.id}          highlight="text-[#185FA5]" />
        <Row label="Hostel"      value={bed.hostel_name} />
        <Row label="Room"        value={bed.room_id} />
        <Row label="Floor"       value={bed.floor} />
        <Row label="AC type"     value={bed.ac_type} />
        <Row label="Position"    value={bed.position} />
        <Row label="Listed rent" value={bed.bed_amount ? `₹${bed.bed_amount}` : null} />
        <Row label="Status"      value={bed.status} />
      </div>

      {bed.tenant_id ? (
        <div className="card p-4">
          <p className="section-title">Current tenant</p>
          <Row label="Name"           value={bed.tenant_name} />
          <Row label="Phone"          value={bed.tenant_phone} />
          <Row label="Check-in"       value={bed.check_in} />
          <Row label="Check-out"      value={bed.check_out} />
          <Row label="Deposit"        value={bed.deposit ? `₹${bed.deposit}` : null} />
          <Row label="Monthly rent"   value={bed.actual_rent ? `₹${bed.actual_rent.toLocaleString()}` : null} highlight="text-[#185FA5]" />
          <Row label="Deposit status" value={bed.deposit_status}
            highlight={bed.deposit_status === 'Collected' ? 'text-[#3B6D11]' : 'text-[#993C1D]'} />
        </div>
      ) : (
        <EmptyState icon="🛏️" title="No active tenant" sub="This bed is currently unoccupied" />
      )}

      {bed.rent_history?.some(r => r.status !== 'no_tenant') && (
        <div className="card p-4">
          <p className="section-title">All rent payments</p>
          <div className="flex flex-wrap gap-2">
            {[...bed.rent_history].reverse().map(r => (
              <div key={r.month} className={`text-xs px-3 py-2 rounded-lg ${
                r.status === 'paid'
                  ? 'bg-green-50 dark:bg-green-900/20 text-[#3B6D11] dark:text-green-400'
                  : 'bg-red-50 dark:bg-red-900/20 text-[#993C1D] dark:text-red-400'
              }`}>
                <p className="font-semibold">{new Date(`${r.month}-01`).toLocaleString('default', { month: 'short', year: '2-digit' })}</p>
                <p>{r.status === 'paid' ? `₹${r.amount?.toLocaleString()}` : 'Unpaid'}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {bed.tenant_id && (
        <div className="card p-4">
          <p className="section-title">Mark rent paid — {currentMonth}</p>
          <div className="flex gap-2">
            <input className="input flex-1" type="number" placeholder="Amount ₹"
              value={rentAmt} onChange={e => setRentAmt(e.target.value)} />
            <button onClick={handlePayRent} disabled={paying} className="btn-primary whitespace-nowrap">
              {paying ? 'Saving…' : 'Mark paid'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Status badge ──────────────────────────────────────────────────────────────
function StatusBadge({ status }) {
  if (status === 'Occupied')    return <span className="badge-green">Occupied</span>;
  if (status === 'Vacant')      return <span className="badge-gray">Vacant</span>;
  if (status === 'Temporary')   return <span className="badge-amber">Temporary</span>;
  if (status === 'Maintenance') return <span className="badge-red">Maintenance</span>;
  return <span className="badge-gray">{status}</span>;
}

// ─── Rent cell ─────────────────────────────────────────────────────────────────
function RentCell({ entry }) {
  if (!entry || entry.status === 'no_tenant')
    return <span className="text-gray-200 dark:text-gray-700 text-xs">—</span>;
  if (entry.status === 'paid')
    return (
      <span className="inline-block bg-green-100 dark:bg-green-900/30 text-[#3B6D11] dark:text-green-400 text-xs px-2 py-0.5 rounded font-medium whitespace-nowrap">
        ₹{(entry.amount || 0).toLocaleString()}
      </span>
    );
  return (
    <span className="inline-block bg-red-100 dark:bg-red-900/30 text-[#993C1D] dark:text-red-400 text-xs px-2 py-0.5 rounded font-medium">
      Nil
    </span>
  );
}

// ─── Main page ─────────────────────────────────────────────────────────────────
export default function Beds() {
  const [search, setSearch]         = useState('');
  const [hostelFilter, setHostel]   = useState('');
  const [statusFilter, setStatus]   = useState('');
  const [acFilter, setAC]           = useState('');
  const [selected, setSelected]     = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const buildQuery = useCallback(() => {
    const p = new URLSearchParams();
    if (hostelFilter) p.set('hostel_id', hostelFilter);
    if (statusFilter) p.set('status', statusFilter);
    if (acFilter)     p.set('ac_type', acFilter);
    if (search)       p.set('search', search);
    return `/beds?${p.toString()}`;
  }, [search, hostelFilter, statusFilter, acFilter]);

  const { data: beds, loading } = useApi(buildQuery(), [refreshKey]);
  const { data: hostels }       = useApi('/hostels');

  // Dynamic month columns from first bed's rent_history, newest first
  const months = beds?.[0]?.rent_history
    ? [...beds[0].rent_history].reverse()
    : [];

  const now = new Date();
  const currentMonthKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;

  const thBase = "px-3 py-2.5 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide whitespace-nowrap select-none";
  const thMonth = "px-3 py-2.5 text-center text-xs font-semibold uppercase tracking-wide whitespace-nowrap select-none";
  const td = "px-3 py-2.5 text-sm align-middle";

  return (
    <div className="page-container">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="page-heading mb-0">Bed lookup</h2>
        {beds && (
          <div className="flex gap-3 text-xs">
            <span className="text-[#3B6D11] font-medium">{beds.filter(b => b.status === 'Occupied').length} occupied</span>
            <span className="text-gray-300 dark:text-gray-700">·</span>
            <span className="text-[#185FA5] font-medium">{beds.filter(b => b.status === 'Vacant').length} vacant</span>
            <span className="text-gray-300 dark:text-gray-700">·</span>
            <span className="text-gray-400 dark:text-gray-500">{beds.length} total</span>
          </div>
        )}
      </div>

      {/* Search + filters */}
      <div className="flex flex-col gap-2 mb-4 md:flex-row">
        <input
          className="input flex-1"
          placeholder="Search by tenant name, phone or bed ID…"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <div className="flex gap-2 flex-wrap">
          <select className="input w-auto" value={hostelFilter} onChange={e => setHostel(e.target.value)}>
            <option value="">All hostels</option>
            {hostels?.map(h => <option key={h.id} value={h.id}>{h.id} · {h.name}</option>)}
          </select>
          <select className="input w-auto" value={statusFilter} onChange={e => setStatus(e.target.value)}>
            <option value="">All status</option>
            <option value="Occupied">Occupied</option>
            <option value="Vacant">Vacant</option>
            <option value="Temporary">Temporary</option>
            <option value="Maintenance">Maintenance</option>
          </select>
          <select className="input w-auto" value={acFilter} onChange={e => setAC(e.target.value)}>
            <option value="">All types</option>
            <option value="AC">AC</option>
            <option value="NON AC">Non-AC</option>
          </select>
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <div className="card overflow-hidden">
          {[1,2,3,4,5].map(i => (
            <div key={i} className="flex gap-4 px-4 py-3 border-b border-gray-50 dark:border-gray-800 animate-pulse">
              <div className="h-3 bg-gray-100 dark:bg-gray-700 rounded w-20" />
              <div className="h-3 bg-gray-100 dark:bg-gray-700 rounded w-28" />
              <div className="h-3 bg-gray-100 dark:bg-gray-700 rounded w-24" />
              <div className="h-3 bg-gray-100 dark:bg-gray-700 rounded w-16" />
            </div>
          ))}
        </div>
      ) : !beds?.length ? (
        <EmptyState icon="🔍" title="No beds found" sub="Try adjusting your search or filters" />
      ) : (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse" style={{ minWidth: `${600 + months.length * 100}px` }}>

              {/* ── Header ── */}
              <thead className="bg-gray-50 dark:bg-gray-800/60 border-b-2 border-gray-100 dark:border-gray-700 sticky top-0 z-10">
                <tr>
                  <th className={thBase}>Bed ID</th>
                  <th className={thBase}>Room · Floor</th>
                  <th className={thBase}>AC</th>
                  <th className={thBase}>Status</th>
                  <th className={thBase}>Tenant name</th>
                  <th className={thBase}>Phone</th>
                  <th className={`${thBase} text-right`}>Rent</th>
                  {/* Dynamic month columns — newest first */}
                  {months.map(m => {
                    const isCurrent = m.month === currentMonthKey;
                    return (
                      <th
                        key={m.month}
                        className={`${thMonth} ${
                          isCurrent
                            ? 'text-[#185FA5] bg-blue-50/60 dark:bg-blue-900/10'
                            : 'text-gray-500 dark:text-gray-400'
                        }`}
                      >
                        {new Date(`${m.month}-01`).toLocaleString('default', { month: 'short' })}
                        {' '}
                        <span className="font-normal opacity-60">
                          {new Date(`${m.month}-01`).getFullYear().toString().slice(2)}
                        </span>
                        {isCurrent && (
                          <span className="block text-[10px] font-normal normal-case tracking-normal opacity-70">current</span>
                        )}
                      </th>
                    );
                  })}
                </tr>
              </thead>

              {/* ── Rows ── */}
              <tbody className="divide-y divide-gray-50 dark:divide-gray-800/60">
                {beds.map(bed => {
                  // Reverse rent_history to match newest-first month columns
                  const rentByMonth = {};
                  bed.rent_history?.forEach(r => { rentByMonth[r.month] = r; });

                  const daysLeft = bed.check_out
                    ? Math.ceil((new Date(bed.check_out) - new Date()) / 86400000)
                    : null;
                  const rowHighlight =
                    bed.status === 'Vacant'
                      ? 'bg-gray-50/40 dark:bg-gray-800/20'
                      : '';

                  return (
                    <tr
                      key={bed.id}
                      onClick={() => setSelected(bed)}
                      className={`cursor-pointer transition-colors hover:bg-blue-50/60 dark:hover:bg-blue-900/10 group ${rowHighlight}`}
                    >
                      {/* Bed ID */}
                      <td className={td}>
                        <span className="font-bold text-[#185FA5] group-hover:underline whitespace-nowrap">
                          {bed.id}
                        </span>
                      </td>

                      {/* Room · Floor */}
                      <td className={`${td} text-gray-500 dark:text-gray-400 whitespace-nowrap`}>
                        {bed.room_id}{bed.floor ? ` · ${bed.floor}` : ''}
                      </td>

                      {/* AC */}
                      <td className={td}>
                        <span className={bed.ac_type === 'AC' ? 'badge-blue' : 'badge-gray'}>
                          {bed.ac_type === 'AC' ? 'AC' : 'Non-AC'}
                        </span>
                      </td>

                      {/* Status */}
                      <td className={td}>
                        <StatusBadge status={bed.status} />
                      </td>

                      {/* Tenant name */}
                      <td className={`${td} whitespace-nowrap`}>
                        {bed.tenant_name
                          ? <span className="font-medium">{bed.tenant_name}</span>
                          : <span className="text-gray-300 dark:text-gray-600 italic text-xs">—</span>
                        }
                      </td>

                      {/* Phone */}
                      <td className={`${td} text-gray-500 dark:text-gray-400 whitespace-nowrap`}>
                        {bed.tenant_phone || <span className="text-gray-300 dark:text-gray-600">—</span>}
                      </td>

                      {/* Rent */}
                      <td className={`${td} text-right font-semibold whitespace-nowrap`}>
                        {bed.actual_rent
                          ? `₹${bed.actual_rent.toLocaleString()}`
                          : <span className="text-gray-300 dark:text-gray-600 font-normal">—</span>
                        }
                      </td>

                      {/* One cell per dynamic month */}
                      {months.map(m => {
                        const isCurrent = m.month === currentMonthKey;
                        return (
                          <td
                            key={m.month}
                            className={`${td} text-center ${
                              isCurrent ? 'bg-blue-50/40 dark:bg-blue-900/5' : ''
                            }`}
                          >
                            <RentCell entry={rentByMonth[m.month]} />
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Footer */}
          <div className="px-4 py-2 border-t border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/40 flex items-center justify-between">
            <p className="text-xs text-gray-400 dark:text-gray-500">
              {beds.length} beds{hostelFilter || statusFilter || acFilter || search ? ' (filtered)' : ''}
            </p>
            <p className="text-xs text-gray-400 dark:text-gray-500">
              {months.length} month{months.length !== 1 ? 's' : ''} of data · scroll right to see all →
            </p>
          </div>
        </div>
      )}

      {/* Detail panel */}
      <SlidePanel
        open={!!selected}
        onClose={() => setSelected(null)}
        title={selected ? `${selected.id} — ${selected.hostel_name}` : ''}
      >
        {selected && (
          <BedDetail
            bed={selected}
            onClose={() => setSelected(null)}
            onRentPaid={() => setRefreshKey(k => k + 1)}
          />
        )}
      </SlidePanel>
    </div>
  );
}
