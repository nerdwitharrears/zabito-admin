import React from 'react';
import { useApi } from '../hooks/useApi.js';
import { useTheme } from '../context/ThemeContext.jsx';
import StatCard from '../components/StatCard.jsx';
import HostelScroller from '../components/HostelScroller.jsx';
import OccupancyBar from '../components/charts/OccupancyBar.jsx';
import RevenueArea from '../components/charts/RevenueArea.jsx';
import RentProgress from '../components/charts/RentProgress.jsx';
import EmptyState from '../components/EmptyState.jsx';

function VacancyItem({ tenant, urgency }) {
  const colors = {
    red:   'border-l-[3px] border-red-400 bg-red-50 dark:bg-red-900/10',
    amber: 'border-l-[3px] border-amber-400 bg-amber-50 dark:bg-amber-900/10',
    blue:  'border-l-[3px] border-blue-400 bg-blue-50 dark:bg-blue-900/10',
  };
  return (
    <div className={`rounded-lg p-3 ${colors[urgency]}`}>
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="text-sm font-medium truncate">{tenant.name}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400">{tenant.bed_id} · {tenant.hostel_name}</p>
        </div>
        <div className="text-right flex-shrink-0">
          {tenant.actual_rent && <p className="text-xs font-medium">₹{tenant.actual_rent.toLocaleString()}</p>}
          <p className="text-xs text-gray-500 dark:text-gray-400">{tenant.check_out}</p>
        </div>
      </div>
    </div>
  );
}

function VacatingSection({ data }) {
  if (!data) return null;
  const { already_vacant, this_week, this_month } = data;
  const hasAny = (already_vacant?.length || 0) + (this_week?.length || 0) + (this_month?.length || 0) > 0;

  return (
    <div className="card p-4">
      <p className="section-title">Upcoming vacancies</p>
      {!hasAny ? (
        <EmptyState icon="✅" title="No upcoming vacancies" sub="All tenants have future checkout dates" />
      ) : (
        <div className="space-y-4">
          {already_vacant?.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-red-500 mb-2">Already vacant ({already_vacant.length})</p>
              <div className="space-y-2">{already_vacant.map(t => <VacancyItem key={t.id} tenant={t} urgency="red" />)}</div>
            </div>
          )}
          {this_week?.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-amber-600 mb-2">This week ({this_week.length})</p>
              <div className="space-y-2">{this_week.map(t => <VacancyItem key={t.id} tenant={t} urgency="amber" />)}</div>
            </div>
          )}
          {this_month?.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-blue-500 mb-2">This month ({this_month.length})</p>
              <div className="space-y-2">{this_month.map(t => <VacancyItem key={t.id} tenant={t} urgency="blue" />)}</div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function Dashboard() {
  const { dark } = useTheme();
  const { data: stats }     = useApi('/dashboard/stats');
  const { data: hostelOcc } = useApi('/dashboard/hostel-occ');
  const { data: revenue }   = useApi('/dashboard/revenue');
  const { data: vacating }  = useApi('/dashboard/vacating');
  const { data: rentPct }   = useApi('/dashboard/rent-pct');

  return (
    <div className="page-container">
      {/* Header — mobile only; desktop has sidebar brand */}
      <div className="flex items-center justify-between mb-5 md:hidden">
        <div>
          <h1 className="text-xl font-bold">Zabito Admin</h1>
          <p className="text-xs text-gray-400 dark:text-gray-500">8 hostels · Anna Nagar</p>
        </div>
        <ThemeToggle />
      </div>

      {/* Desktop page title row */}
      <div className="hidden md:flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="text-sm text-gray-400 dark:text-gray-500 mt-0.5">Overview of all 8 hostels</p>
        </div>
        <ThemeToggle />
      </div>

      {/* Stats — 2 col mobile, 4 col desktop */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
        <StatCard label="Total beds"  value={stats?.total} />
        <StatCard label="Occupied"    value={stats?.occupied}  accent="#3B6D11" />
        <StatCard label="Vacant"      value={stats?.vacant}    accent="#993C1D" />
        <StatCard label="Occupancy"   value={stats ? `${stats.occupancy}%` : null}
          accent={stats?.occupancy >= 80 ? '#3B6D11' : stats?.occupancy >= 50 ? '#854F0B' : '#993C1D'} />
      </div>

      {/* Charts — stacked mobile, side-by-side desktop */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
        <div className="card p-4">
          <p className="section-title">Hostel occupancy</p>
          <OccupancyBar data={hostelOcc} dark={dark} />
        </div>
        <div className="card p-4">
          <p className="section-title">Revenue vs expenses (6 months)</p>
          <RevenueArea data={revenue} dark={dark} />
        </div>
      </div>

      {/* Rent collection + hostel scroller — stacked mobile, side-by-side desktop */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
        <RentProgress data={rentPct} />

        <div className="card p-4">
          <p className="section-title">All hostels</p>
          {hostelOcc
            ? <HostelScroller hostels={hostelOcc} />
            : <EmptyState icon="🏠" title="Loading hostels…" />
          }
        </div>
      </div>

      {/* Vacating — full width, but on desktop split into 3 cols if many */}
      <VacatingSection data={vacating} />
    </div>
  );
}

function ThemeToggle() {
  const { dark, toggle } = useTheme();
  return (
    <button
      onClick={toggle}
      className="text-xl p-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 transition-colors"
      title={dark ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      {dark ? '☀️' : '🌙'}
    </button>
  );
}
