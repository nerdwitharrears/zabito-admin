import React from 'react';
import { NavLink } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext.jsx';

const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: '▣' },
  { to: '/beds',      label: 'Bed lookup', icon: '🛏' },
  { to: '/tenants',   label: 'Tenants',    icon: '👤' },
  { to: '/money',     label: 'Money',      icon: '₹' },
  { to: '/settings',  label: 'Settings',   icon: '⚙' },
];

export default function Sidebar() {
  const { dark, toggle } = useTheme();

  return (
    <aside className="fixed left-0 top-0 bottom-0 w-56 bg-white dark:bg-[#1e1e1e] border-r border-gray-100 dark:border-gray-800 flex flex-col z-30">
      {/* Brand */}
      <div className="px-5 pt-6 pb-5 border-b border-gray-100 dark:border-gray-800">
        <div className="flex items-center gap-2 mb-1">
          <div className="w-7 h-7 rounded-lg bg-[#185FA5] flex items-center justify-center text-white text-xs font-bold">Z</div>
          <h1 className="text-base font-bold text-[#185FA5]">Zabito Admin</h1>
        </div>
        <p className="text-xs text-gray-400 dark:text-gray-500 ml-9">Anna Nagar, Chennai</p>
      </div>

      {/* Nav links */}
      <nav className="flex-1 px-3 py-4 flex flex-col gap-0.5 overflow-y-auto">
        {navItems.map(item => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-blue-50 dark:bg-blue-900/20 text-[#185FA5]'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-200'
              }`
            }
          >
            <span className="text-base w-5 text-center">{item.icon}</span>
            {item.label}
          </NavLink>
        ))}
      </nav>

      {/* Theme toggle */}
      <div className="px-4 py-4 border-t border-gray-100 dark:border-gray-800">
        <button
          onClick={toggle}
          className="flex items-center gap-2.5 w-full px-3 py-2 rounded-lg text-sm text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
        >
          <span>{dark ? '☀️' : '🌙'}</span>
          <span>{dark ? 'Light mode' : 'Dark mode'}</span>
        </button>
      </div>
    </aside>
  );
}
