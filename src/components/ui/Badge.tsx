import React from 'react';

type BadgeColor = 'default' | 'green' | 'yellow' | 'red' | 'blue' | 'purple' | 'primary';

interface BadgeProps {
  children: React.ReactNode;
  color?: BadgeColor;
  variant?: BadgeColor;
  className?: string;
}

export default function Badge({ children, color, variant, className = '' }: BadgeProps) {
  // support both `color` and `variant` props; `variant` takes precedence if both given
  const resolved: BadgeColor = variant ?? color ?? 'default';
  const colorStyles: Record<BadgeColor, string> = {
    default: 'bg-[var(--color-surface)] text-[var(--color-text-secondary)] border border-[var(--color-border)]',
    green: 'bg-green-50 text-green-700 border border-green-200',
    yellow: 'bg-yellow-50 text-yellow-700 border border-yellow-200',
    red: 'bg-red-50 text-red-700 border border-red-200',
    blue: 'bg-blue-50 text-blue-700 border border-blue-200',
    purple: 'bg-purple-50 text-purple-700 border border-purple-200',
    primary: 'bg-[var(--color-surface)] text-[var(--color-text)] border border-[var(--color-border)]',
  };
  
  return (
    <span 
      className={`inline-block px-3 py-1 text-xs font-medium rounded-full ${colorStyles[resolved]} ${className}`}
    >
      {children}
    </span>
  );
}
