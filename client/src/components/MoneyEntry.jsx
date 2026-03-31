import React from 'react';

const CATEGORY_COLORS = {
  'Rent': 'badge-blue',
  'EB': 'badge-amber',
  'House Keeping Salary': 'badge-green',
  'Garbage Man': 'badge-gray',
  'Hostel Clean Material': 'badge-gray',
  'Service': 'badge-gray',
  'Hostel Food Order': 'badge-amber',
  'Drinking Water Can': 'badge-blue',
  'Wifi Setup': 'badge-blue',
  'Poster & Gum': 'badge-gray',
  'Ads Expenses': 'badge-amber',
  'Bed': 'badge-green',
  'Team Outing': 'badge-green',
  'Refund': 'badge-red',
  'Bank Penalty': 'badge-red',
  'Referal Bonus': 'badge-amber',
  'Others': 'badge-gray',
  'Investment Advance': 'badge-blue',
  'Bed Investment': 'badge-green',
  'Building Advance': 'badge-blue',
  'AC/Washing Machine': 'badge-amber',
  'Broker Commission': 'badge-amber',
  'Interior': 'badge-green',
  'Furniture': 'badge-green',
  'Electrical Work': 'badge-gray',
  'Jio Fiber': 'badge-blue',
};

export default function MoneyEntry({ entry, type }) {
  const colorClass = CATEGORY_COLORS[entry.category] || 'badge-gray';

  return (
    <div className="flex items-center justify-between py-3 border-b border-gray-100 dark:border-gray-800 last:border-0">
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-0.5">
          <span className={colorClass}>{entry.category}</span>
          {entry.hostel_name && (
            <span className="text-xs text-gray-400 dark:text-gray-500">{entry.hostel_name}</span>
          )}
          {type === 'investment' && entry.investor && (
            <span className="badge-blue">{entry.investor}</span>
          )}
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-400 dark:text-gray-500">
          <span>{entry.date}</span>
          {entry.notes && <span className="truncate">· {entry.notes}</span>}
        </div>
      </div>
      <span className={`font-semibold text-sm ml-3 ${type === 'expense' ? 'text-[#993C1D]' : 'text-[#3B6D11]'}`}>
        ₹{entry.amount.toLocaleString()}
      </span>
    </div>
  );
}
