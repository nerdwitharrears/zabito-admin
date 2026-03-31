import React from 'react';
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import EmptyState from '../EmptyState.jsx';

export default function RevenueArea({ data, dark }) {
  if (!data || data.length === 0) return <EmptyState icon="📈" title="No revenue data" />;

  const textColor = dark ? '#9ca3af' : '#6b7280';
  const gridColor = dark ? '#374151' : '#e5e7eb';

  const formatINR = (v) => v >= 1000 ? `₹${(v / 1000).toFixed(0)}k` : `₹${v}`;

  return (
    <ResponsiveContainer width="100%" height={180}>
      <AreaChart data={data} margin={{ top: 4, right: 4, left: -10, bottom: 0 }}>
        <defs>
          <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#185FA5" stopOpacity={0.3} />
            <stop offset="95%" stopColor="#185FA5" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="expGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#993C1D" stopOpacity={0.3} />
            <stop offset="95%" stopColor="#993C1D" stopOpacity={0} />
          </linearGradient>
        </defs>
        <XAxis
          dataKey="month"
          tick={{ fill: textColor, fontSize: 11 }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          tick={{ fill: textColor, fontSize: 10 }}
          axisLine={false}
          tickLine={false}
          tickFormatter={formatINR}
        />
        <Tooltip
          formatter={(v, name) => [`₹${v.toLocaleString()}`, name === 'revenue' ? 'Revenue' : 'Expenses']}
          contentStyle={{
            background: dark ? '#1e1e1e' : '#fff',
            border: `1px solid ${gridColor}`,
            borderRadius: 8,
            fontSize: 12,
            color: dark ? '#f0f0f0' : '#1a1a1a',
          }}
        />
        <Legend
          wrapperStyle={{ fontSize: 11, color: textColor }}
          formatter={(v) => v === 'revenue' ? 'Revenue' : 'Expenses'}
        />
        <Area type="monotone" dataKey="revenue" stroke="#185FA5" strokeWidth={2} fill="url(#revGrad)" dot={false} />
        <Area type="monotone" dataKey="expenses" stroke="#993C1D" strokeWidth={2} fill="url(#expGrad)" dot={false} />
      </AreaChart>
    </ResponsiveContainer>
  );
}
