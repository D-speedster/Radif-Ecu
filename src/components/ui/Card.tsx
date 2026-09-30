import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  style?: React.CSSProperties;
}

export default function Card({ children, className = '', hover = false, style }: CardProps) {
  const hoverStyles = hover ? 'hover:border-[var(--color-text)] hover:shadow-md transition-all duration-300' : '';
  
  return (
    <div 
      className={`border rounded-lg p-6 ${hoverStyles} ${className}`}
      style={{
        backgroundColor: 'var(--color-surface)',
        borderColor: 'var(--color-border)',
        ...style,
      }}
    >
      {children}
    </div>
  );
}
