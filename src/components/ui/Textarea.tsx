import React from 'react';

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export default function Textarea({ label, error, className = '', ...props }: TextareaProps) {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-[var(--color-text)] mb-2">
          {label}
        </label>
      )}
      <textarea
        className={`w-full px-4 py-3 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg text-[var(--color-text)] placeholder:text-[var(--color-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] transition-all resize-vertical min-h-[120px] ${className}`}
        {...props}
      />
      {error && (
        <p className="mt-1 text-sm text-[var(--color-accent)]">{error}</p>
      )}
    </div>
  );
}
