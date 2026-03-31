import React from 'react';

function statusBadge(status) {
  if (status === 'Occupied')    return <span className="badge-green">{status}</span>;
  if (status === 'Vacant')      return <span className="badge-gray">Vacant</span>;
  if (status === 'Temporary')   return <span className="badge-amber">{status}</span>;
  if (status === 'Maintenance') return <span className="badge-red">{status}</span>;
  return <span className="badge-gray">{status}</span>;
}

function RentPill({ entry }) {
  if (entry.status === 'no_tenant') return null;
  const month = entry.month.slice(5); // MM
  const label = new Date(`${entry.month}-01`).toLocaleString('default', { month: 'short' });
  if (entry.status === 'paid') {
    return (
      <span className="inline-flex items-center gap-1 bg-green-100 dark:bg-green-900/30 text-[#3B6D11] dark:text-green-400 text-xs px-2 py-0.5 rounded-full">
        {label} ₹{(entry.amount || 0).toLocaleString()}
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 bg-red-100 dark:bg-red-900/30 text-[#993C1D] dark:text-red-400 text-xs px-2 py-0.5 rounded-full">
      {label} Nil
    </span>
  );
}

export default function BedCard({ bed, onClick }) {
  const daysToCheckout = bed.check_out
    ? Math.ceil((new Date(bed.check_out) - new Date()) / 86400000)
    : null;

  const isVacatingSoon = daysToCheckout !== null && daysToCheckout <= 7 && daysToCheckout >= 0;
  const isOverdue = daysToCheckout !== null && daysToCheckout < 0;

  return (
    <div
      className="card p-4 cursor-pointer active:opacity-80 transition-opacity"
      onClick={() => onClick && onClick(bed)}
    >
      {/* Header row */}
      <div className="flex items-start justify-between mb-2">
        <div>
          <span className="font-bold text-sm">{bed.id}</span>
          <span className="text-xs text-gray-400 dark:text-gray-500 ml-2">{bed.hostel_name}</span>
          {bed.floor && <span className="text-xs text-gray-400 dark:text-gray-500 ml-1">· {bed.floor}</span>}
        </div>
        <div className="flex gap-1.5">
          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${bed.ac_type === 'AC' ? 'badge-blue' : 'badge-gray'}`}>
            {bed.ac_type}
          </span>
          {statusBadge(bed.status)}
        </div>
      </div>

      {/* Tenant info */}
      {bed.tenant_name ? (
        <div className="mb-2">
          <p className="text-sm font-medium">{bed.tenant_name}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400">{bed.tenant_phone}</p>
        </div>
      ) : (
        <p className="text-xs text-gray-400 dark:text-gray-500 mb-2 italic">No tenant</p>
      )}

      {/* Rent info row */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex gap-3 text-xs text-gray-500 dark:text-gray-400">
          {bed.bed_amount && <span>Listed: ₹{bed.bed_amount}</span>}
          {bed.actual_rent ? <span className="text-[#185FA5] font-medium">Actual: ₹{bed.actual_rent.toLocaleString()}</span> : null}
        </div>
        {isVacatingSoon && (
          <span className="badge-amber">Vacating in {daysToCheckout}d</span>
        )}
        {isOverdue && (
          <span className="badge-red">Overdue {Math.abs(daysToCheckout)}d</span>
        )}
      </div>

      {/* Rent pills */}
      {bed.rent_history && bed.rent_history.some(r => r.status !== 'no_tenant') && (
        <div className="flex flex-wrap gap-1.5">
          {bed.rent_history.map(r => <RentPill key={r.month} entry={r} />)}
        </div>
      )}
    </div>
  );
}
