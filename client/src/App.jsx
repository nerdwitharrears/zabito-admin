import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import BottomNav from './components/BottomNav.jsx';
import Sidebar from './components/Sidebar.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Beds from './pages/Beds.jsx';
import Tenants from './pages/Tenants.jsx';
import Money from './pages/Money.jsx';
import Settings from './pages/Settings.jsx';

export default function App() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#141414] text-[#1a1a1a] dark:text-[#f0f0f0]">
      {/* Desktop layout — sidebar + content */}
      <div className="hidden md:flex min-h-screen">
        <Sidebar />
        <main className="flex-1 ml-56 overflow-y-auto">
          <div className="max-w-5xl mx-auto px-6 py-6">
            <AppRoutes />
          </div>
        </main>
      </div>

      {/* Mobile layout — bottom nav */}
      <div className="md:hidden min-h-screen">
        <main className="pb-20">
          <AppRoutes />
        </main>
        <BottomNav />
      </div>
    </div>
  );
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/beds"      element={<Beds />} />
      <Route path="/tenants"   element={<Tenants />} />
      <Route path="/money"     element={<Money />} />
      <Route path="/settings"  element={<Settings />} />
    </Routes>
  );
}
