import React from 'react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell
} from 'recharts';
import EmptyState from '../EmptyState.jsx';

function barColor(pct) {
  if (pct >= 80) return '#3B6D11';
  if (pct >= 50) return '#854F0B';
  return '#993C1D';
}

export default function OccupancyBar({ data, dark }) {
  if (!data || data.length === 0) return <EmptyState icon="📊" title="No occupancy data" />;

  const textColor = dark ? '#9ca3af' : '#6b7280';
  const gridColor = dark ? '#374151' : '#e5e7eb';

  return (
    <ResponsiveContainer width="100%" height={180}>
      <BarChart data={data} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
        <XAxis
          dataKey="hostel"
          tick={{ fill: textColor, fontSize: 11 }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          domain={[0, 100]}
          tick={{ fill: textColor, fontSize: 10 }}
          axisLine={false}
          tickLine={false}
          tickFormatter={v => `${v}%`}
        />
        <Tooltip
          formatter={(v) => [`${v}%`, 'Occupancy']}
          contentStyle={{
            background: dark ? '#1e1e1e' : '#fff',
            border: `1px solid ${gridColor}`,
            borderRadius: 8,
            fontSize: 12,
            color: dark ? '#f0f0f0' : '#1a1a1a',
          }}
          cursor={{ fill: dark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)' }}
        />
        <Bar dataKey="pct" radius={[4, 4, 0, 0]} maxBarSize={36}>
          {data.map((entry, i) => (
            <Cell key={i} fill={barColor(entry.pct)} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
