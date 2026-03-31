import React from 'react';

function OccBar({ pct }) {
  const color = pct >= 80 ? '#3B6D11' : pct >= 50 ? '#854F0B' : '#993C1D';
  return (
    <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-1 mt-1">
      <div className="h-1 rounded-full transition-all" style={{ width: `${pct}%`, backgroundColor: color }} />
    </div>
  );
}

export default function HostelScroller({ hostels }) {
  if (!hostels || hostels.length === 0) return null;

  return (
    <div className="flex gap-3 overflow-x-auto no-scrollbar pb-1">
      {hostels.map(h => (
        <div key={h.hostel} className="card p-3 min-w-[120px] flex-shrink-0">
          <p className="text-xs font-bold text-[#185FA5]">{h.hostel}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{h.name}</p>
          <p className="text-sm font-semibold mt-1">{h.occupied}/{h.total}</p>
          <OccBar pct={h.pct} />
          <p className="text-xs text-gray-400 mt-0.5">{h.pct}% full</p>
        </div>
      ))}
    </div>
  );
}
