import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export default function Input({ label, error, className = '', ...props }: InputProps) {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-[var(--color-text)] mb-2">
          {label}
        </label>
      )}
      <input
        className={`w-full px-4 py-3 bg-white border ${
          error ? 'border-red-500' : 'border-[var(--color-border)]'
        } rounded-lg text-[var(--color-text)] placeholder:text-[var(--color-text-muted)] focus:outline-none focus:border-[var(--color-btn-primary)] focus:ring-1 focus:ring-[var(--color-btn-primary)] disabled:bg-[var(--color-surface)] transition-colors ${className}`}
        {...props}
      />
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
}
