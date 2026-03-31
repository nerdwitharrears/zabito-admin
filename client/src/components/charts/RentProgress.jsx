import React from 'react';

export default function RentProgress({ data }) {
  if (!data) return null;

  const { month, paid, total, pct } = data;
  const color = pct >= 80 ? '#3B6D11' : pct >= 50 ? '#854F0B' : '#993C1D';

  return (
    <div className="card p-4">
      <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Rent collection</p>
      <p className="text-xs font-medium text-gray-400 dark:text-gray-500 mb-2">{month}</p>
      <div className="flex items-end gap-2 mb-3">
        <span className="text-4xl font-bold" style={{ color }}>{pct}%</span>
        <span className="text-sm text-gray-400 dark:text-gray-500 mb-1">collected</span>
      </div>
      <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-2 mb-2">
        <div
          className="h-2 rounded-full transition-all"
          style={{ width: `${pct}%`, backgroundColor: color }}
        />
      </div>
      <p className="text-xs text-gray-400 dark:text-gray-500">{paid} of {total} beds paid</p>
    </div>
  );
}
