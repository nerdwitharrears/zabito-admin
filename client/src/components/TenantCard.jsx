import React from 'react';

export default function TenantCard({ tenant, onCheckout, readOnly }) {
  const daysIn = tenant.check_in
    ? Math.floor((new Date() - new Date(tenant.check_in)) / 86400000)
    : null;
  const daysLeft = tenant.check_out
    ? Math.ceil((new Date(tenant.check_out) - new Date()) / 86400000)
    : null;

  return (
    <div className="card p-4">
      <div className="flex items-start justify-between mb-2">
        <div>
          <p className="font-semibold text-sm">{tenant.name}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400">{tenant.phone}</p>
        </div>
        <div className="flex flex-col items-end gap-1">
          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
            tenant.deposit_status === 'Collected'
              ? 'badge-green'
              : 'badge-red'
          }`}>
            Deposit {tenant.deposit_status || 'Not Collected'}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs text-gray-500 dark:text-gray-400 mb-3">
        <span>Bed: <span className="text-[#185FA5] font-medium">{tenant.bed_id}</span></span>
        <span>Hostel: <span className="font-medium text-[#1a1a1a] dark:text-[#f0f0f0]">{tenant.hostel_name || tenant.hostel_id}</span></span>
        {tenant.actual_rent && <span>Rent: <span className="font-medium text-[#1a1a1a] dark:text-[#f0f0f0]">₹{tenant.actual_rent.toLocaleString()}</span></span>}
        {tenant.check_in && <span>Check-in: <span className="font-medium text-[#1a1a1a] dark:text-[#f0f0f0]">{tenant.check_in}</span></span>}
        {daysIn !== null && <span>Stay: <span className="font-medium text-[#1a1a1a] dark:text-[#f0f0f0]">{daysIn}d</span></span>}
        {daysLeft !== null && (
          <span>
            {daysLeft >= 0
              ? <span className={daysLeft <= 7 ? 'text-amber-600 font-medium' : ''}>Leaves in {daysLeft}d</span>
              : <span className="text-red-600 font-medium">Overdue {Math.abs(daysLeft)}d</span>
            }
          </span>
        )}
      </div>

      {!readOnly && (
        <button
          onClick={() => onCheckout && onCheckout(tenant)}
          className="w-full text-xs py-2 rounded-lg border border-red-200 dark:border-red-900 text-[#993C1D] dark:text-red-400 active:bg-red-50 dark:active:bg-red-900/20 transition-colors"
        >
          Mark check-out
        </button>
      )}

      {readOnly && tenant.check_out && (
        <p className="text-xs text-gray-400">Checked out: {tenant.check_out}</p>
      )}
    </div>
  );
}
