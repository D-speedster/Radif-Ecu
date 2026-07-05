import { useState, useMemo, useEffect } from 'react'
import { Link } from 'react-router-dom'
import useReveal from '../hooks/useReveal'
import { useToast } from '../components/Toast'
import { useAuth } from '../context/AuthContext'
import api from '../utils/api'

/* Category metadata — maps backend enum values to display props */
const CAT_META = {
  ecu: {
    label:    'ایسیوها',
    color:    'cyan',
    icon:     'fa-microchip',
    glow:     '#00f0ff',
  },
  multiplex: {
    label:    'مالتی‌پلکس',
    color:    'cyan',
    icon:     'fa-circle-nodes',
    glow:     '#00f0ff',
  },
  dtc: {
    label:    'کدهای خطا',
    color:    'green',
    icon:     'fa-triangle-exclamation',
    glow:     '#39ff14',
  },
  dump: {
    label:    'فایل‌های دامپ',
    color:    'cyan',
    icon:     'fa-database',
    glow:     '#00f0ff',
  },
}

const FILTERS = [
  { key: 'all',       label: 'همه' },
  { key: 'ecu',       label: 'ایسیوها' },
  { key: 'multiplex', label: 'مالتی‌پلکس' },
  { key: 'dtc',       label: 'کدهای خطا' },
  { key: 'dump',      label: 'فایل‌های دامپ' },
]

/* Persian numeral + Arabic digit normaliser for search */
function normalise(str) {
  return (str || '')
    .replace(/[\u06F0-\u06F9]/g, d => String.fromCharCode(d.charCodeAt(0) - 1728))
    .replace(/[\u0660-\u0669]/g, d => String.fromCharCode(d.charCodeAt(0) - 1584))
    .toLowerCase()
    .trim()
}

/** Format an ISO date string into Persian locale date */
function formatDate(iso) {
  if (!iso) return null
  try {
    return new Date(iso).toLocaleDateString('fa-IR', {
      year: 'numeric', month: '2-digit', day: '2-digit',
    })
  } catch {
    return null
  }
}

/* ── Article Card ── */
function ArticleCard({ article, onLockedDownload }) {
  const meta     = CAT_META[article.category] || CAT_META.ecu
  const hasFile  = !!article.downloadUrl          // null when backend stripped it (guest + isPrivate)
  const isDump   = article.category === 'dump'
  const dateStr  = formatDate(article.createdAt)
  const dlCount  = (article.downloads || 0).toLocaleString('fa-IR')

  return (
    <div className="glass-card">
      {/* Visual header */}
      <div className="article-card-img" style={{ height: 160 }}>
        <div className="relative z-10 flex flex-col items-center gap-2">
          <i
            className={`fa-solid ${meta.icon} text-3xl`}
            style={{ color: meta.glow, textShadow: `0 0 15px ${meta.glow}` }}
          />
          <span className="text-xs font-mono opacity-40" style={{ color: meta.glow }}>
            {article.category.toUpperCase()}
          </span>
        </div>
      </div>

      <div className="p-5">
        {/* Category badge + auth badge */}
        <div className="flex items-center justify-between mb-3">
          <span
            className={`text-xs px-2 py-0.5 rounded-lg border font-semibold ${
              meta.color === 'green'
                ? 'bg-brand-green/10 text-brand-green border-brand-green/20'
                : 'bg-brand-cyan/10 text-brand-cyan border-brand-cyan/20'
            }`}
          >
            {meta.label}
          </span>

          {/* Lock badge — only when backend explicitly flagged downloadLocked (guest + private article) */}
          {article.downloadLocked
            ? (
              <span className="auth-badge">
                <i className="fa-solid fa-lock text-xs" />نیاز به ورود
              </span>
            ) : (
              <span className="bg-brand-muted/10 text-brand-muted border border-brand-muted/20 text-xs px-2 py-0.5 rounded-lg font-semibold">
                رایگان
              </span>
            )
          }
        </div>

        {/* Title */}
        <h3 className="text-white font-bold text-sm leading-snug mb-2">{article.title}</h3>

        {/* Description (content excerpt) */}
        {article.content && (
          <p className="text-brand-muted text-xs leading-relaxed mb-4 line-clamp-2">
            {article.content}
          </p>
        )}

        {/* Meta row — date / read-time OR file info / download count */}
        <div className="flex items-center justify-between mb-4 text-xs text-brand-muted">
          {isDump ? (
            <>
              <span><i className="fa-solid fa-file-code ml-1" />فایل دامپ</span>
              <span><i className="fa-solid fa-download ml-1" />{dlCount} دانلود</span>
            </>
          ) : (
            <>
              {dateStr && <span><i className="fa-regular fa-calendar ml-1" />{dateStr}</span>}
              {!dateStr && <span />}
              <span><i className="fa-solid fa-download ml-1" />{dlCount} دانلود</span>
            </>
          )}
        </div>

        {/* Action button */}
        {hasFile ? (
          /* Authenticated user — real download link */
          <a
            href={article.downloadUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-neon-green animate-pulse-green w-full py-2.5 text-xs font-bold rounded-lg flex items-center justify-center gap-2"
          >
            <i className="fa-solid fa-file-arrow-down" />دانلود فایل تخصصی
          </a>
        ) : (
          /* Guest / locked — show toast on click */
          <button
            type="button"
            onClick={onLockedDownload}
            className="btn-neon-green animate-pulse-green w-full py-2.5 text-xs font-bold rounded-lg flex items-center justify-center gap-2"
          >
            {article.downloadLocked
              ? <><i className="fa-solid fa-lock" />مطالعه و دانلود فایل تخصصی</>
              : <><i className="fa-solid fa-file-slash" />فایل هنوز آپلود نشده</>
            }
          </button>
        )}
      </div>
    </div>
  )
}

/* ── Skeleton Card — shown while fetching ── */
function SkeletonCard() {
  return (
    <div className="glass-card animate-pulse">
      <div className="rounded-t-xl bg-brand-muted/10" style={{ height: 160 }} />
      <div className="p-5 space-y-3">
        <div className="flex justify-between">
          <div className="h-4 w-16 rounded bg-brand-muted/15" />
          <div className="h-4 w-16 rounded bg-brand-muted/15" />
        </div>
        <div className="h-4 w-full rounded bg-brand-muted/15" />
        <div className="h-3 w-5/6 rounded bg-brand-muted/10" />
        <div className="h-3 w-4/6 rounded bg-brand-muted/10" />
        <div className="h-8 w-full rounded-lg bg-brand-muted/10 mt-4" />
      </div>
    </div>
  )
}

/* ── Main Page ── */
export default function Wiki() {
  useReveal()
  const showToast            = useToast()
  const { user }             = useAuth()

  const [articles,  setArticles]  = useState([])
  const [loading,   setLoading]   = useState(true)
  const [fetchError, setFetchError] = useState(null)
  const [query,     setQuery]     = useState('')
  const [category,  setCategory]  = useState('all')

  useEffect(() => {
    const fetchArticles = async () => {
      setLoading(true)
      setFetchError(null)
      try {
        const { data } = await api.get('/articles')
        setArticles(data.articles || [])
      } catch (err) {
        setFetchError('خطا در بارگذاری مقالات. لطفاً صفحه را رفرش کنید.')
      } finally {
        setLoading(false)
      }
    }
    fetchArticles()
    // Re-fetch when user logs in/out so download URLs update instantly
  }, [user])

  const handleLockedDownload = (isLocked) => {
    if (isLocked) {
      showToast('برای دانلود فایل‌های تخصصی ابتدا باید وارد حساب خود شوید', 5000)
    } else {
      showToast('این مقاله فایل دانلودی ندارد یا هنوز آپلود نشده است', 4000)
    }
  }

  const filtered = useMemo(() => {
    const q = normalise(query)
    return articles.filter(a => {
      const catOk  = category === 'all' || a.category === category
      const srchOk = !q
        || normalise(a.title).includes(q)
        || normalise(a.content).includes(q)
        || normalise(a.category).includes(q)
      return catOk && srchOk
    })
  }, [articles, query, category])

  return (
    <>
      {/* HERO */}
      <section className="hero-grid-bg pt-36 pb-16 px-6 lg:px-12 text-center">
        <div className="max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-brand-cyan/30 bg-brand-cyan/5 text-brand-cyan text-xs font-semibold mb-8 animate-fade-in-up">
            <span className="w-2 h-2 rounded-full bg-brand-green animate-pulse-green inline-block" />
            دانشنامه آزاد — آرشیو فنی تخصصی
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold leading-tight mb-5 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
            دانشنامه و <span className="text-brand-cyan text-glow-cyan"> آرشیو مقالات فنی</span>
          </h1>
          <p className="text-brand-muted text-base leading-relaxed mb-10 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            راهنماهای عملی، فایل‌های دامپ، پین‌اوت و تحلیل‌های کد خطا — همه در یک جا، برای مهندسان واقعی.
          </p>
          <div className="flex items-center justify-center gap-8 text-sm animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
            {[
              { val: '+۸۰',  label: 'مقاله فنی',   color: 'text-brand-green text-glow-green' },
              { val: '+۱۵۰', label: 'فایل دامپ',   color: 'text-brand-cyan text-glow-cyan' },
              { val: '+۴۰',  label: 'پین‌اوت کامل', color: 'text-brand-green text-glow-green' },
            ].map((s, i) => (
              <div key={i} className="flex items-center gap-4">
                {i > 0 && <div className="w-px h-10 bg-brand-muted/20" />}
                <div className="text-center">
                  <p className={`text-2xl font-extrabold ${s.color}`}>{s.val}</p>
                  <p className="text-brand-muted text-xs mt-1">{s.label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* STICKY SEARCH + FILTER */}
      <div
        className="py-6 px-6 lg:px-12 sticky top-[72px] z-40"
        style={{ background: 'rgba(13,14,18,0.92)', backdropFilter: 'blur(16px)', borderBottom: '1px solid rgba(0,240,255,0.08)' }}
      >
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-5 items-start md:items-center">
          {/* Search */}
          <div className="relative flex-1 w-full">
            <i className="fa-solid fa-magnifying-glass absolute right-3.5 top-1/2 -translate-y-1/2 text-brand-muted text-sm pointer-events-none" />
            <input
              className="wiki-search"
              placeholder="جستجو در مقالات فنی..."
              value={query}
              onChange={e => setQuery(e.target.value)}
            />
            {query && (
              <button
                onClick={() => setQuery('')}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-muted hover:text-brand-cyan transition-colors"
                aria-label="پاک کردن"
              >
                <i className="fa-solid fa-xmark text-sm" />
              </button>
            )}
          </div>
          {/* Filter pills */}
          <div className="flex items-center gap-2 flex-wrap">
            {FILTERS.map(f => (
              <button
                key={f.key}
                className={`filter-pill${category === f.key ? ' active' : ''}`}
                onClick={() => setCategory(f.key)}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* GRID */}
      <section className="py-16 px-6 lg:px-12">
        <div className="max-w-7xl mx-auto">

          {/* Count row */}
          <div className="flex items-center justify-between mb-10 reveal">
            <p className="text-brand-muted text-sm">
              {loading
                ? <span className="text-brand-muted animate-pulse">در حال بارگذاری...</span>
                : <><span className="text-white font-semibold">{filtered.length.toLocaleString('fa-IR')}</span> مقاله یافت شد</>}
            </p>
            <div className="flex items-center gap-2 text-brand-muted text-xs">
              <i className="fa-solid fa-sort text-brand-cyan" />مرتب‌سازی: جدیدترین
            </div>
          </div>

          {/* Error state */}
          {fetchError && (
            <div className="text-center py-20">
              <i className="fa-solid fa-triangle-exclamation text-brand-muted text-5xl mb-6 block opacity-40" />
              <p className="text-white font-semibold text-lg mb-2">{fetchError}</p>
            </div>
          )}

          {/* Loading skeletons */}
          {loading && !fetchError && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-7">
              {Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)}
            </div>
          )}

          {/* Article grid */}
          {!loading && !fetchError && filtered.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-7">
              {filtered.map(a => (
                <ArticleCard
                  key={a._id}
                  article={a}
                  onLockedDownload={() => handleLockedDownload(!!a.downloadLocked)}
                />
              ))}
            </div>
          )}

          {/* Empty state */}
          {!loading && !fetchError && filtered.length === 0 && (
            <div className="text-center py-20">
              <i className="fa-solid fa-search text-brand-muted text-5xl mb-6 block opacity-30" />
              <p className="text-white font-semibold text-lg mb-2">نتیجه‌ای یافت نشد</p>
              <p className="text-brand-muted text-sm">عبارت دیگری جستجو کنید یا فیلتر را تغییر دهید.</p>
            </div>
          )}

          {/* Auth banner — only show to guests */}
          {!user && (
            <div className="mt-14 reveal">
              <div
                className="glass-card p-8 flex flex-col md:flex-row items-center justify-between gap-6"
                style={{ borderColor: 'rgba(57,255,20,0.15)', background: 'rgba(57,255,20,0.02)' }}
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl flex-shrink-0 flex items-center justify-center bg-brand-green/10 border border-brand-green/25">
                    <i className="fa-solid fa-lock-open text-brand-green text-xl" />
                  </div>
                  <div>
                    <h4 className="text-white font-bold text-base mb-1">دسترسی به آرشیو کامل</h4>
                    <p className="text-brand-muted text-sm leading-relaxed">
                      برای دانلود فایل‌های دامپ، پین‌اوت و مقالات پیشرفته، حساب کاربری رایگان ایجاد کنید.
                    </p>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-3 flex-shrink-0">
                  <Link to="/auth" className="btn-neon-green animate-pulse-green px-6 py-3 text-sm font-bold rounded-xl whitespace-nowrap gap-2">
                    <i className="fa-solid fa-user-plus ml-2" />ثبت‌نام رایگان
                  </Link>
                  <Link to="/auth" className="btn-outline-cyan px-6 py-3 text-sm font-semibold rounded-xl whitespace-nowrap gap-2">
                    <i className="fa-solid fa-right-to-bracket ml-2" />ورود به حساب
                  </Link>
                </div>
              </div>
            </div>
          )}

        </div>
      </section>
    </>
  )
}
