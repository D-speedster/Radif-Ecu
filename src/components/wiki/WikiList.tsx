'use client';

import React, { useState, useEffect } from 'react';
import { BookOpen } from 'lucide-react';
import SearchBar from '@/components/wiki/SearchBar';
import CategoryFilter from '@/components/wiki/CategoryFilter';
import ArticleCard from '@/components/wiki/ArticleCard';
import { Article } from '@/types';
import api from '@/lib/api';

export default function WikiList() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [filteredArticles, setFilteredArticles] = useState<Article[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // دریافت مقالات از API
  useEffect(() => {
    const fetchArticles = async () => {
      try {
        setLoading(true);
        const response = await api.get('/articles');
        const data = response.data.articles || response.data;
        
        setArticles(data);
        setFilteredArticles(data);

        // استخراج دسته‌بندی‌های یونیک
        const uniqueCategories = [...new Set(data.map((article: Article) => article.category))];
        setCategories(uniqueCategories as string[]);
      } catch (err: any) {
        setError(err.response?.data?.message || 'خطا در دریافت مقالات');
        console.error('خطا در دریافت مقالات:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, []);

  // فیلتر کردن مقالات بر اساس جستجو و دسته‌بندی
  useEffect(() => {
    let filtered = articles;

    // فیلتر دسته‌بندی
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(
        (article) => article.category === selectedCategory
      );
    }

    // فیلتر جستجو
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (article) =>
          article.title.toLowerCase().includes(query) ||
          article.content.toLowerCase().includes(query) ||
          (article.excerpt && article.excerpt.toLowerCase().includes(query))
      );
    }

    setFilteredArticles(filtered);
  }, [searchQuery, selectedCategory, articles]);

  return (
    <div className="min-h-screen bg-[var(--color-bg)] overflow-x-hidden">
      <div className="container mx-auto px-4 py-12 md:py-16 max-w-full overflow-x-hidden">
        {/* هدر */}
        <div className="text-center mb-12 max-w-full">
          <div className="flex items-center justify-center gap-3 mb-4 flex-wrap">
            <BookOpen className="w-10 h-10 text-[var(--color-primary-light)] flex-shrink-0" />
            <h1 className="text-3xl md:text-4xl font-bold text-[var(--color-text)] break-words">
              دانشنامه ECU
            </h1>
          </div>
          <p className="text-[var(--color-muted)] text-lg max-w-2xl mx-auto break-words px-4">
            آموزش‌های تخصصی، نکات کاربردی و راهنمای کامل تعمیرات ECU
          </p>
        </div>

        {/* جستجو */}
        <div className="mb-8">
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="جستجو در مقالات..."
          />
        </div>

        {/* فیلتر دسته‌بندی */}
        {categories.length > 0 && (
          <div className="mb-12 max-w-full overflow-x-hidden">
            <h2 className="text-lg font-bold text-[var(--color-text)] mb-4">دسته‌بندی:</h2>
            <CategoryFilter
              categories={categories}
              selectedCategory={selectedCategory}
              onSelectCategory={setSelectedCategory}
            />
          </div>
        )}

        {/* لودینگ */}
        {loading && (
          <div className="text-center py-20">
            <div className="inline-block w-12 h-12 border-4 border-[var(--color-primary)] border-t-transparent rounded-full animate-spin"></div>
            <p className="text-[var(--color-muted)] mt-4">در حال بارگذاری...</p>
          </div>
        )}

        {/* خطا */}
        {error && !loading && (
          <div className="bg-red-900/20 border border-[var(--color-accent)] text-[var(--color-accent)] rounded-lg p-6 text-center">
            <p className="text-lg font-medium mb-2">خطا در بارگذاری مقالات</p>
            <p className="text-sm">{error}</p>
          </div>
        )}

        {/* گرید مقالات */}
        {!loading && !error && (
          <>
            {/* تعداد نتایج */}
            <div className="mb-6 max-w-full">
              <p className="text-[var(--color-muted)] break-words">
                {filteredArticles.length} مقاله یافت شد
                {searchQuery && ` برای "${searchQuery}"`}
              </p>
            </div>

            {/* لیست مقالات */}
            {filteredArticles.length === 0 ? (
              <div className="text-center py-20">
                <BookOpen className="w-16 h-16 text-[var(--color-muted)] mx-auto mb-4" />
                <p className="text-[var(--color-muted)] text-lg break-words px-4">
                  {searchQuery || selectedCategory !== 'all'
                    ? 'نتیجه‌ای یافت نشد'
                    : 'هنوز مقاله‌ای منتشر نشده است'}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-full">
                {filteredArticles.map((article) => (
                  <ArticleCard key={article._id} article={article} />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
