'use client';

import React from 'react';

interface CategoryFilterProps {
  categories: string[];
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
}

export default function CategoryFilter({ 
  categories, 
  selectedCategory, 
  onSelectCategory 
}: CategoryFilterProps) {
  return (
    <div className="flex flex-wrap gap-3">
      {/* دکمه همه */}
      <button
        onClick={() => onSelectCategory('all')}
        className={`px-4 py-2 rounded-lg font-medium transition-all ${
          selectedCategory === 'all'
            ? 'bg-[var(--color-primary)] text-white'
            : 'bg-[var(--color-surface)] text-[var(--color-muted)] hover:bg-[var(--color-primary)] hover:text-white border border-[var(--color-border)]'
        }`}
      >
        همه
      </button>

      {/* دکمه‌های دسته‌بندی */}
      {categories.map((category) => (
        <button
          key={category}
          onClick={() => onSelectCategory(category)}
          className={`px-4 py-2 rounded-lg font-medium transition-all ${
            selectedCategory === category
              ? 'bg-[var(--color-primary)] text-white'
              : 'bg-[var(--color-surface)] text-[var(--color-muted)] hover:bg-[var(--color-primary)] hover:text-white border border-[var(--color-border)]'
          }`}
        >
          {category}
        </button>
      ))}
    </div>
  );
}
