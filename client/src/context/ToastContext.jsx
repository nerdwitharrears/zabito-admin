import React, { createContext, useContext, useState, useCallback } from 'react';

const ToastContext = createContext();

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const show = useCallback((message, type = 'success') => {
    const id = Date.now();
    setToasts(t => [...t, { id, message, type }]);
    setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), 2500);
  }, []);

  return (
    <ToastContext.Provider value={{ show }}>
      {children}
      <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 flex flex-col gap-2 w-[320px] max-w-[90vw]">
        {toasts.map(t => (
          <div
            key={t.id}
            className={`px-4 py-3 rounded-lg text-white text-sm font-medium shadow-lg animate-fade-in
              ${t.type === 'error' ? 'bg-[#993C1D]' : t.type === 'warning' ? 'bg-[#854F0B]' : 'bg-[#3B6D11]'}`}
          >
            {t.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export const useToast = () => useContext(ToastContext);
