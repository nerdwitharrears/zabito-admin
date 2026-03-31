import React from 'react';

export default function EmptyState({ icon = '📭', title, sub }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <span className="text-4xl mb-3">{icon}</span>
      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{title || 'Nothing here yet'}</p>
      {sub && <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">{sub}</p>}
    </div>
  );
}
