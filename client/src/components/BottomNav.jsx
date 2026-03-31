import React from 'react';
import { NavLink } from 'react-router-dom';

const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: (active) => (
    <svg viewBox="0 0 24 24" fill={active ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth={active ? 0 : 1.8} className="w-5 h-5">
      <rect x="3" y="3" width="7" height="7" rx="1.5"/>
      <rect x="14" y="3" width="7" height="7" rx="1.5"/>
      <rect x="3" y="14" width="7" height="7" rx="1.5"/>
      <rect x="14" y="14" width="7" height="7" rx="1.5"/>
    </svg>
  )},
  { to: '/beds', label: 'Beds', icon: (active) => (
    <svg viewBox="0 0 24 24" fill={active ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth={1.8} className="w-5 h-5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"/>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 22V12h6v10"/>
    </svg>
  )},
  { to: '/tenants', label: 'Tenants', icon: (active) => (
    <svg viewBox="0 0 24 24" fill={active ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth={1.8} className="w-5 h-5">
      <circle cx="12" cy="8" r="4"/>
      <path strokeLinecap="round" d="M4 20c0-3.314 3.582-6 8-6s8 2.686 8 6"/>
    </svg>
  )},
  { to: '/money', label: 'Money', icon: (active) => (
    <svg viewBox="0 0 24 24" fill={active ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth={1.8} className="w-5 h-5">
      <rect x="2" y="6" width="20" height="14" rx="2"/>
      <circle cx="12" cy="13" r="2.5"/>
      <path strokeLinecap="round" d="M6 10h.01M18 10h.01"/>
    </svg>
  )},
  { to: '/settings', label: 'Settings', icon: (active) => (
    <svg viewBox="0 0 24 24" fill={active ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth={1.8} className="w-5 h-5">
      <circle cx="12" cy="12" r="3"/>
      <path strokeLinecap="round" d="M12 2v2M12 20v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M2 12h2M20 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/>
    </svg>
  )},
];

export default function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white dark:bg-[#1e1e1e] border-t border-gray-100 dark:border-gray-800 z-30 safe-area-bottom">
      <div className="flex items-center justify-around h-16 max-w-[480px] mx-auto px-2">
        {navItems.map(item => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex flex-col items-center gap-0.5 px-3 py-2 rounded-lg transition-colors ${
                isActive
                  ? 'text-[#185FA5]'
                  : 'text-gray-400 dark:text-gray-500'
              }`
            }
          >
            {({ isActive }) => (
              <>
                {item.icon(isActive)}
                <span className="text-[10px] font-medium">{item.label}</span>
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
