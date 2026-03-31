import React, { useState } from 'react';
import { useApi, apiPost } from '../hooks/useApi.js';
import { useToast } from '../context/ToastContext.jsx';
import MoneyEntry from '../components/MoneyEntry.jsx';
import EmptyState from '../components/EmptyState.jsx';

const EXPENSE_CATEGORIES = [
  'Rent','EB','House Keeping Salary','Garbage Man','Hostel Clean Material',
  'Service','Hostel Food Order','Drinking Water Can','Wifi Setup','Poster & Gum',
  'Ads Expenses','Bed','Team Outing','Refund','Bank Penalty','Referal Bonus','Others',
];
const INVESTMENT_CATEGORIES = [
  'Investment Advance','Bed Investment','Building Advance','AC/Washing Machine',
  'Broker Commission','Interior','Furniture','Electrical Work','Jio Fiber','Others',
];
const INVESTORS = ['Muthu', 'Naveen', 'Both Split', 'Other'];

function SummaryBanner({ items }) {
  return (
    <div className="grid grid-cols-3 gap-3 mb-5">
      {items.map(item => (
        <div key={item.label} className="card p-4 text-center">
          <p className="text-xs text-gray-400 dark:text-gray-500 mb-1">{item.label}</p>
          <p className={`text-base font-bold ${item.color || ''}`}>₹{(item.value || 0).toLocaleString()}</p>
        </div>
      ))}
    </div>
  );
}

function GroupedList({ entries, type }) {
  if (!entries || entries.length === 0) return <EmptyState icon="📭" title="No entries yet" />;

  const groups = {};
  entries.forEach(e => {
    const key = e.date?.slice(0, 7) || 'Unknown';
    if (!groups[key]) groups[key] = { entries: [], total: 0 };
    groups[key].entries.push(e);
    groups[key].total += e.amount;
  });

  return (
    <div className="space-y-4">
      {Object.entries(groups).sort((a, b) => b[0].localeCompare(a[0])).map(([month, group]) => (
        <div key={month} className="card overflow-hidden">
          <div className="flex items-center justify-between px-4 py-2.5 bg-gray-50 dark:bg-gray-800/60 border-b border-gray-100 dark:border-gray-800">
            <span className="text-xs font-semibold text-gray-500 dark:text-gray-400">
              {month !== 'Unknown' ? new Date(`${month}-01`).toLocaleString('default', { month: 'long', year: 'numeric' }) : 'Unknown'}
            </span>
            <span className={`text-sm font-bold ${type === 'expense' ? 'text-[#993C1D]' : 'text-[#3B6D11]'}`}>
              ₹{group.total.toLocaleString()}
            </span>
          </div>
          <div className="px-4">
            {group.entries.map(e => <MoneyEntry key={e.id} entry={e} type={type} />)}
          </div>
        </div>
      ))}
    </div>
  );
}

function ExpenseTab({ hostels }) {
  const { show } = useToast();
  const [refreshKey, setRefreshKey] = useState(0);
  const { data } = useApi('/expenses', [refreshKey]);
  const [form, setForm] = useState({ date: new Date().toISOString().split('T')[0], hostel_id: '', category: 'Rent', amount: '', notes: '' });
  const [saving, setSaving] = useState(false);
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSave = async () => {
    if (!form.date || !form.category || !form.amount) { show('Date, category and amount are required', 'error'); return; }
    setSaving(true);
    try {
      await apiPost('/expenses', { ...form, amount: Number(form.amount) });
      show('Expense added');
      setForm({ date: new Date().toISOString().split('T')[0], hostel_id: '', category: 'Rent', amount: '', notes: '' });
      setRefreshKey(k => k + 1);
    } catch (e) { show(e.message, 'error'); }
    finally { setSaving(false); }
  };

  return (
    <div className="md:grid md:grid-cols-[340px_1fr] md:gap-6 space-y-5 md:space-y-0">
      {/* Left: summary + add form */}
      <div className="space-y-4">
        {data?.summary && (
          <SummaryBanner items={[
            { label: 'This month', value: data.summary.thisMonth, color: 'text-[#993C1D]' },
            { label: 'Last month', value: data.summary.lastMonth, color: 'text-amber-600' },
            { label: 'All time',   value: data.summary.allTime,   color: 'text-gray-600 dark:text-gray-300' },
          ]} />
        )}

        <div className="card p-4 space-y-3">
          <p className="section-title">Add expense</p>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label">Date *</label>
              <input className="input" type="date" value={form.date} onChange={e => set('date', e.target.value)} />
            </div>
            <div>
              <label className="label">Hostel</label>
              <select className="input" value={form.hostel_id} onChange={e => set('hostel_id', e.target.value)}>
                <option value="">Every hostel</option>
                {hostels?.map(h => <option key={h.id} value={h.id}>{h.id} · {h.name}</option>)}
              </select>
            </div>
            <div className="col-span-2">
              <label className="label">Category *</label>
              <select className="input" value={form.category} onChange={e => set('category', e.target.value)}>
                {EXPENSE_CATEGORIES.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="label">Amount *</label>
              <input className="input" type="number" placeholder="₹" value={form.amount} onChange={e => set('amount', e.target.value)} />
            </div>
            <div>
              <label className="label">Notes</label>
              <input className="input" placeholder="Optional" value={form.notes} onChange={e => set('notes', e.target.value)} />
            </div>
          </div>
          <button onClick={handleSave} disabled={saving} className="btn-primary w-full py-2.5">
            {saving ? 'Saving…' : 'Add expense'}
          </button>
        </div>
      </div>

      {/* Right: history */}
      <div>
        <p className="section-title mb-3">History</p>
        <GroupedList entries={data?.expenses} type="expense" />
      </div>
    </div>
  );
}

function InvestmentTab({ hostels }) {
  const { show } = useToast();
  const [refreshKey, setRefreshKey] = useState(0);
  const { data } = useApi('/investments', [refreshKey]);
  const [form, setForm] = useState({ date: new Date().toISOString().split('T')[0], hostel_id: '', category: 'Investment Advance', investor: 'Muthu', amount: '', notes: '' });
  const [saving, setSaving] = useState(false);
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSave = async () => {
    if (!form.date || !form.category || !form.amount) { show('Date, category and amount are required', 'error'); return; }
    setSaving(true);
    try {
      await apiPost('/investments', { ...form, amount: Number(form.amount) });
      show('Investment added');
      setForm({ date: new Date().toISOString().split('T')[0], hostel_id: '', category: 'Investment Advance', investor: 'Muthu', amount: '', notes: '' });
      setRefreshKey(k => k + 1);
    } catch (e) { show(e.message, 'error'); }
    finally { setSaving(false); }
  };

  return (
    <div className="md:grid md:grid-cols-[340px_1fr] md:gap-6 space-y-5 md:space-y-0">
      <div className="space-y-4">
        {data?.summary && (
          <SummaryBanner items={[
            { label: 'Total invested', value: data.summary.total,  color: 'text-[#185FA5]' },
            { label: 'Muthu share',   value: data.summary.muthu,  color: 'text-[#3B6D11]' },
            { label: 'Naveen share',  value: data.summary.naveen, color: 'text-[#854F0B]' },
          ]} />
        )}

        <div className="card p-4 space-y-3">
          <p className="section-title">Add investment</p>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label">Date *</label>
              <input className="input" type="date" value={form.date} onChange={e => set('date', e.target.value)} />
            </div>
            <div>
              <label className="label">Hostel</label>
              <select className="input" value={form.hostel_id} onChange={e => set('hostel_id', e.target.value)}>
                <option value="">—</option>
                {hostels?.map(h => <option key={h.id} value={h.id}>{h.id} · {h.name}</option>)}
              </select>
            </div>
            <div className="col-span-2">
              <label className="label">Category *</label>
              <select className="input" value={form.category} onChange={e => set('category', e.target.value)}>
                {INVESTMENT_CATEGORIES.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="label">Investor</label>
              <select className="input" value={form.investor} onChange={e => set('investor', e.target.value)}>
                {INVESTORS.map(i => <option key={i}>{i}</option>)}
              </select>
            </div>
            <div>
              <label className="label">Amount *</label>
              <input className="input" type="number" placeholder="₹" value={form.amount} onChange={e => set('amount', e.target.value)} />
            </div>
            <div className="col-span-2">
              <label className="label">Notes</label>
              <input className="input" placeholder="Optional" value={form.notes} onChange={e => set('notes', e.target.value)} />
            </div>
          </div>
          <button onClick={handleSave} disabled={saving} className="btn-primary w-full py-2.5">
            {saving ? 'Saving…' : 'Add investment'}
          </button>
        </div>
      </div>

      <div>
        <p className="section-title mb-3">History</p>
        <GroupedList entries={data?.investments} type="investment" />
      </div>
    </div>
  );
}

export default function Money() {
  const [tab, setTab] = useState('expenses');
  const { data: hostels } = useApi('/hostels');

  return (
    <div className="page-container">
      <h2 className="page-heading">Money</h2>

      <div className="flex gap-1 mb-5 bg-gray-100 dark:bg-gray-800 rounded-xl p-1">
        {[{ key: 'expenses', label: 'Expenses' }, { key: 'investments', label: 'Investments' }].map(t => (
          <button key={t.key} onClick={() => setTab(t.key)}
            className={`flex-1 py-2 text-xs font-medium rounded-lg transition-colors ${
              tab === t.key
                ? 'bg-white dark:bg-[#1e1e1e] text-[#185FA5] shadow-sm'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
            }`}>
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'expenses'    && <ExpenseTab hostels={hostels} />}
      {tab === 'investments' && <InvestmentTab hostels={hostels} />}
    </div>
  );
}
