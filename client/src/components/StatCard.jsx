import React from 'react';

export default function StatCard({ label, value, sub, accent }) {
  return (
    <div className="card p-4 flex flex-col gap-1">
      <span className="text-xs text-gray-500 dark:text-gray-400">{label}</span>
      <span
        className="text-2xl font-bold"
        style={accent ? { color: accent } : {}}
      >
        {value ?? '—'}
      </span>
      {sub && <span className="text-xs text-gray-400 dark:text-gray-500">{sub}</span>}
    </div>
  );
}
