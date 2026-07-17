import { useState, useRef, useEffect, useCallback } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useToast } from '../components/Toast'
import { useAuth } from '../context/AuthContext'
import api from '../utils/api'

/* ── Status metadata ── */
const STATUS_META = {
  'Pending':     { label: 'در انتظار',    cls: 'status-pending',    icon: 'fa-clock' },
  'In Progress': { label: 'در حال انجام', cls: 'status-inprogress', icon: 'fa-spinner fa-spin' },
  'Completed':   { label: 'تکمیل شده',    cls: 'status-completed',  icon: 'fa-check-circle' },
}
/** Advance status cyclically */
const STATUS_CYCLE = {
  'Pending':     'In Progress',
  'In Progress': 'Completed',
  'Completed':   'Pending',
}

const CAT_LABELS = {
  ecu: 'ایسیوها', multiplex: 'مالتی‌پلکس',
  dump: 'فایل‌های دامپ', dtc: 'کدهای خطا',
}

const ACTIVITY_LOG = [
  { color: '#39ff14', icon: 'fa-calendar-check',      text: 'نوبت جدید ثبت شد — علی احمدی',          time: '۲ دقیقه پیش' },
  { color: '#00f0ff', icon: 'fa-file-arrow-down',      text: 'دانلود فایل: Bosch_ME74.bin',            time: '۱۵ دقیقه پیش' },
  { color: '#39ff14', icon: 'fa-user-plus',            text: 'کاربر جدید ثبت‌نام کرد',                time: '۳۲ دقیقه پیش' },
  { color: '#ffaa00', icon: 'fa-triangle-exclamation', text: 'نوبت رضا محمدی تغییر وضعیت داد',         time: '۱ ساعت پیش' },
  { color: '#00f0ff', icon: 'fa-book-open',            text: 'مقاله جدید منتشر شد',                   time: '۳ ساعت پیش' },
]

/** Extract backend Persian error message */
const extractError = (err) =>
  err?.response?.data?.message || 'خطای سرور. لطفاً دوباره تلاش کنید.'

const SIDEBAR_LINKS = [
  { id: 'overview',     icon: 'fa-gauge',         label: 'داشبورد اصلی',    sub: 'نمای کلی' },
  { id: 'appointments', icon: 'fa-calendar-check', label: 'مدیریت نوبت‌ها', sub: 'نوبت‌دهی' },
  { id: 'contact',      icon: 'fa-envelope',       label: 'پیام‌های تماس',  sub: 'درخواست‌ها' },
  { id: 'wiki',         icon: 'fa-database',       label: 'مدیریت دانشنامه', sub: 'فایل‌ها و مقالات' },
]

/* ── Overview Panel ── */
function OverviewPanel({ appts, articles }) {
  const pubArticles = articles.filter(a => a.published).length
  const totalDl     = articles.reduce((s, a) => s + (a.downloads || 0), 0)

  const stats = [
    { icon: 'fa-calendar-day',    color: 'cyan',  label: 'کل نوبت‌های ثبت شده',  value: appts.length.toLocaleString('fa-IR') },
    { icon: 'fa-book-open',       color: 'green', label: 'مقالات منتشر شده',      value: pubArticles.toLocaleString('fa-IR') },
    { icon: 'fa-cloud-arrow-down', color: 'cyan', label: 'فایل‌های دانلود شده',   value: `+${totalDl.toLocaleString('fa-IR')}` },
  ]

  return (
    <div>
      <h2 className="text-white text-xl font-extrabold mb-6">داشبورد اصلی</h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-10">
        {stats.map((s, i) => (
          <div key={i} className="dash-stat-card">
            <div className="flex items-start justify-between mb-3">
              <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${s.color === 'green' ? 'bg-brand-green/10 border border-brand-green/20' : 'bg-brand-cyan/10 border border-brand-cyan/20'}`}>
                <i className={`fa-solid ${s.icon} text-lg ${s.color === 'green' ? 'text-brand-green' : 'text-brand-cyan'}`} />
              </div>
              <i className="fa-solid fa-arrow-trend-up text-brand-green text-xs opacity-60" />
            </div>
            <p className={`text-3xl font-extrabold mb-1 ${s.color === 'green' ? 'text-brand-green' : 'text-brand-cyan'}`}>{s.value}</p>
            <p className="text-brand-muted text-xs">{s.label}</p>
          </div>
        ))}
      </div>
      <div className="glass-card p-6">
        <h3 className="text-white font-bold text-base mb-5 flex items-center gap-2">
          <i className="fa-solid fa-bolt text-brand-cyan" />آخرین فعالیت‌ها
        </h3>
        <div>
          {ACTIVITY_LOG.map((a, i) => (
            <div key={i} className="activity-row">
              <div className="activity-dot" style={{ background: a.color, boxShadow: `0 0 8px ${a.color}60` }} />
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-3">
                  <p className="text-white text-sm font-medium flex items-center gap-2 flex-wrap">
                    <i className={`fa-solid ${a.icon} text-xs flex-shrink-0`} style={{ color: a.color }} />
                    {a.text}
                  </p>
                  <span className="text-brand-muted text-xs flex-shrink-0 whitespace-nowrap">{a.time}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

/* ── Appointments Panel ── */
function AppointmentsPanel({ appts, loading, onChangeStatus, onDelete }) {
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-white text-xl font-extrabold">مدیریت نوبت‌ها</h2>
        <span className="text-brand-muted text-sm">{appts.length.toLocaleString('fa-IR')} نوبت</span>
      </div>
      <div className="glass-card overflow-hidden">
        {loading ? (
          <div className="text-center py-16">
            <i className="fa-solid fa-spinner fa-spin text-brand-cyan text-3xl mb-3 block" />
            <p className="text-brand-muted text-sm">در حال بارگذاری نوبت‌ها...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="dash-table">
              <thead>
                <tr>
                  {['کد پیگیری', 'نام', 'تلفن', 'خودرو / ایسیو', 'نوع خدمت', 'وضعیت', 'عملیات'].map(h => (
                    <th key={h}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {appts.map(a => {
                  const meta = STATUS_META[a.status] || STATUS_META['Pending']
                  return (
                    <tr key={a._id}>
                      <td>
                        <span className="font-mono text-xs text-brand-green tracking-wider">
                          {a.trackingCode}
                        </span>
                      </td>
                      <td>
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full bg-brand-cyan/10 border border-brand-cyan/20 flex items-center justify-center flex-shrink-0">
                            <i className="fa-solid fa-user text-brand-cyan text-xs" />
                          </div>
                          <span className="font-medium text-white whitespace-nowrap">{a.name}</span>
                        </div>
                      </td>
                      <td><span dir="ltr" className="font-mono text-xs text-brand-muted">{a.phone}</span></td>
                      <td>
                        <span className="text-brand-muted text-xs">
                          {a.carModel}{a.ecuModel ? ` — ${a.ecuModel}` : ''}
                        </span>
                      </td>
                      <td><span className="text-white text-xs">{a.serviceLabel || a.serviceType}</span></td>
                      <td>
                        <span className={`status-badge ${meta.cls}`}>
                          <i className={`fa-solid ${meta.icon} text-xs`} />{meta.label}
                        </span>
                      </td>
                      <td>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => onChangeStatus(a._id, a.status)}
                            className="flex items-center gap-1 text-xs text-brand-cyan border border-brand-cyan/25 bg-brand-cyan/5 px-2.5 py-1.5 rounded-lg hover:bg-brand-cyan/15 transition-colors whitespace-nowrap"
                          >
                            <i className="fa-solid fa-arrows-rotate text-xs" />تغییر وضعیت
                          </button>
                          <button
                            onClick={() => onDelete(a._id)}
                            className="flex items-center gap-1 text-xs text-red-400 border border-red-400/20 bg-red-400/5 px-2.5 py-1.5 rounded-lg hover:bg-red-400/15 transition-colors"
                          >
                            <i className="fa-solid fa-trash text-xs" />حذف
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
            {appts.length === 0 && (
              <div className="text-center py-12">
                <i className="fa-solid fa-calendar-xmark text-brand-muted text-4xl opacity-30 mb-3 block" />
                <p className="text-brand-muted text-sm">هیچ نوبتی ثبت نشده است</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

/* ── Contact Messages Panel ── */
function ContactMessagesPanel({ messages, loading, onUpdateStatus }) {
  const STATUS_META_CONTACT = {
    'New':     { label: 'جدید',        cls: 'status-pending',    icon: 'fa-envelope' },
    'Read':    { label: 'خوانده شده',  cls: 'status-inprogress', icon: 'fa-envelope-open' },
    'Replied': { label: 'پاسخ داده شده', cls: 'status-completed', icon: 'fa-reply' },
  }

  const STATUS_CYCLE_CONTACT = {
    'New': 'Read',
    'Read': 'Replied',
    'Replied': 'New',
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-white text-xl font-extrabold">پیام‌های تماس</h2>
        <span className="text-brand-muted text-sm">{messages.length.toLocaleString('fa-IR')} پیام</span>
      </div>
      <div className="glass-card overflow-hidden">
        {loading ? (
          <div className="text-center py-16">
            <i className="fa-solid fa-spinner fa-spin text-brand-cyan text-3xl mb-3 block" />
            <p className="text-brand-muted text-sm">در حال بارگذاری پیام‌ها...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="dash-table">
              <thead>
                <tr>
                  {['نام', 'تلفن', 'موضوع', 'پیام', 'وضعیت', 'زمان', 'عملیات'].map(h => (
                    <th key={h}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {messages.map(m => {
                  const meta = STATUS_META_CONTACT[m.status] || STATUS_META_CONTACT['New']
                  return (
                    <tr key={m._id}>
                      <td>
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full bg-brand-cyan/10 border border-brand-cyan/20 flex items-center justify-center flex-shrink-0">
                            <i className="fa-solid fa-user text-brand-cyan text-xs" />
                          </div>
                          <span className="font-medium text-white whitespace-nowrap">{m.name}</span>
                        </div>
                      </td>
                      <td><span dir="ltr" className="font-mono text-xs text-brand-muted">{m.phone}</span></td>
                      <td><span className="text-white text-xs max-w-[200px] truncate block">{m.subject}</span></td>
                      <td><span className="text-brand-muted text-xs max-w-[300px] truncate block">{m.message}</span></td>
                      <td>
                        <span className={`status-badge ${meta.cls}`}>
                          <i className={`fa-solid ${meta.icon} text-xs`} />{meta.label}
                        </span>
                      </td>
                      <td>
                        <span className="text-brand-muted text-xs">
                          {new Date(m.createdAt).toLocaleDateString('fa-IR')}
                        </span>
                      </td>
                      <td>
                        <button
                          onClick={() => onUpdateStatus(m._id, m.status)}
                          className="flex items-center gap-1 text-xs text-brand-cyan border border-brand-cyan/25 bg-brand-cyan/5 px-2.5 py-1.5 rounded-lg hover:bg-brand-cyan/15 transition-colors whitespace-nowrap"
                        >
                          <i className="fa-solid fa-arrows-rotate text-xs" />تغییر وضعیت
                        </button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
            {messages.length === 0 && (
              <div className="text-center py-12">
                <i className="fa-solid fa-envelope-open text-brand-muted text-4xl opacity-30 mb-3 block" />
                <p className="text-brand-muted text-sm">هیچ پیام تماسی دریافت نشده است</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

/* ── Wiki & Dump Manager Panel ── */
function WikiPanel({ articles, articlesLoading, onArticleCreated }) {
  const showToast = useToast()
  const fileRef   = useRef(null)
  const [dragover,   setDragover]   = useState(false)
  const [fileName,   setFileName]   = useState(null)
  const [uploading,  setUploading]  = useState(false)
  const [togglingId, setTogglingId] = useState(null)
  const [deletingId, setDeletingId] = useState(null)
  const [localArticles, setLocalArticles] = useState(articles)

  // Sync local list when parent re-fetches
  useEffect(() => { setLocalArticles(articles) }, [articles])

  const [form, setForm] = useState({
    title: '', category: 'ecu', access: 'locked', downloadUrl: '', content: '',
  })
  const setF = k => e => setForm(f => ({ ...f, [k]: e.target.value }))

  const handleFile = files => {
    if (!files?.[0]) return
    const f   = files[0]
    const ext = f.name.slice(f.name.lastIndexOf('.')).toLowerCase()
    const allowed = ['.bin', '.hex', '.pdf', '.zip', '.rar']
    if (!allowed.includes(ext)) {
      showToast('فرمت فایل پشتیبانی نمی‌شود. (.bin .hex .pdf .zip .rar)')
      return
    }
    setFileName(f.name)
    // Mock a download URL path from the filename so it persists in the DB
    setForm(f => ({ ...f, downloadUrl: `/uploads/${files[0].name}` }))
  }

  /* ── POST /articles ─────────────────────────────────────── */
  const handleSubmit = async e => {
    e.preventDefault()
    if (!form.title.trim()) { showToast('عنوان مقاله یا فایل الزامی است.'); return }
    setUploading(true)
    try {
      const payload = {
        title:       form.title.trim(),
        category:    form.category,
        content:     form.content.trim(),
        isPrivate:   form.access === 'locked',
        published:   true,
        downloadUrl: form.downloadUrl.trim() || null,
      }
      const { data } = await api.post('/articles', payload)
      setLocalArticles(prev => [data.article, ...prev])
      onArticleCreated(data.article)
      showToast(`✔ "${form.title}" با موفقیت ثبت شد.`, 5000)
      setForm({ title: '', category: 'ecu', access: 'locked', downloadUrl: '', content: '' })
      setFileName(null)
    } catch (err) {
      showToast(extractError(err), 5000)
    } finally {
      setUploading(false)
    }
  }

  /* ── PATCH /articles/:id — toggle published ─────────────── */
  const togglePublish = async (id, currentPublished) => {
    setTogglingId(id)
    try {
      const { data } = await api.patch(`/articles/${id}`, { published: !currentPublished })
      setLocalArticles(prev =>
        prev.map(a => a._id === id ? { ...a, published: data.article.published } : a)
      )
    } catch (err) {
      showToast(extractError(err), 5000)
    } finally {
      setTogglingId(null)
    }
  }

  /* ── DELETE /articles/:id ───────────────────────────────── */
  const deleteArticle = async id => {
    setDeletingId(id)
    try {
      await api.delete(`/articles/${id}`)
      setLocalArticles(prev => prev.filter(a => a._id !== id))
      showToast('آیتم حذف شد.')
    } catch (err) {
      showToast(extractError(err), 5000)
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <div>
      <h2 className="text-white text-xl font-extrabold mb-6">مدیریت دانشنامه و فایل‌های دامپ</h2>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

        {/* ── Upload / Create form ── */}
        <div className="glass-card p-6">
          <h3 className="text-white font-bold text-base mb-5 flex items-center gap-2">
            <i className="fa-solid fa-cloud-arrow-up text-brand-cyan" />آپلود مقاله / فایل جدید
          </h3>
          <form onSubmit={handleSubmit} noValidate>
            <div className="space-y-4 mb-5">
              <div>
                <label className="block text-brand-muted text-xs mb-1.5">
                  <i className="fa-solid fa-heading ml-1 text-brand-cyan" />عنوان
                </label>
                <input className="form-input" placeholder="عنوان مقاله یا فایل دامپ..."
                  value={form.title} onChange={setF('title')} required />
              </div>
              <div>
                <label className="block text-brand-muted text-xs mb-1.5">
                  <i className="fa-solid fa-align-right ml-1 text-brand-cyan" />توضیحات (اختیاری)
                </label>
                <textarea className="form-input resize-none" rows={2}
                  placeholder="توضیح کوتاه مقاله یا فایل..."
                  value={form.content} onChange={setF('content')} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-brand-muted text-xs mb-1.5">
                    <i className="fa-solid fa-tag ml-1 text-brand-cyan" />دسته‌بندی
                  </label>
                  <select className="form-input" value={form.category} onChange={setF('category')}>
                    <option value="ecu">ایسیوها</option>
                    <option value="multiplex">مالتی‌پلکس</option>
                    <option value="dtc">کدهای خطا</option>
                    <option value="dump">فایل‌های دامپ</option>
                  </select>
                </div>
                <div>
                  <label className="block text-brand-muted text-xs mb-1.5">
                    <i className="fa-solid fa-lock ml-1 text-brand-cyan" />دسترسی
                  </label>
                  <select className="form-input" value={form.access} onChange={setF('access')}>
                    <option value="locked">نیاز به ورود</option>
                    <option value="free">رایگان</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-brand-muted text-xs mb-1.5">
                  <i className="fa-solid fa-link ml-1 text-brand-cyan" />آدرس دانلود (اختیاری — یا فایل بکشید)
                </label>
                <input className="form-input" dir="ltr" placeholder="https://... یا /uploads/file.bin"
                  value={form.downloadUrl} onChange={setF('downloadUrl')} />
              </div>
              {/* Drop zone */}
              <div
                className={`file-dropzone${dragover ? ' dragover' : ''}`}
                onClick={() => fileRef.current?.click()}
                onDragOver={e => { e.preventDefault(); setDragover(true) }}
                onDragLeave={() => setDragover(false)}
                onDrop={e => { e.preventDefault(); setDragover(false); handleFile(e.dataTransfer.files) }}
              >
                <input ref={fileRef} type="file" className="hidden"
                  accept=".bin,.hex,.pdf,.zip,.rar"
                  onChange={e => handleFile(e.target.files)} />
                {fileName ? (
                  <div className="flex items-center justify-center gap-2 text-brand-green text-sm font-semibold">
                    <i className="fa-solid fa-file-circle-check text-xl" />
                    <span className="font-mono text-xs truncate max-w-[200px]">{fileName}</span>
                  </div>
                ) : (
                  <>
                    <i className="fa-solid fa-cloud-arrow-up text-brand-cyan text-3xl mb-3 block opacity-60" />
                    <p className="text-white text-sm font-semibold mb-1">فایل را اینجا بکشید</p>
                    <p className="text-brand-muted text-xs">یا کلیک کنید برای انتخاب</p>
                    <p className="text-brand-muted/60 text-xs mt-2 font-mono">.bin .hex .pdf .zip .rar</p>
                  </>
                )}
              </div>
            </div>
            <button type="submit" disabled={uploading}
              className="btn-neon-green animate-pulse-green w-full py-3 text-sm font-bold rounded-xl gap-2 disabled:opacity-70">
              {uploading
                ? <><i className="fa-solid fa-spinner fa-spin ml-2" />در حال ثبت...</>
                : <><i className="fa-solid fa-cloud-arrow-up ml-2" />ثبت در پایگاه داده</>}
            </button>
          </form>
        </div>

        {/* ── Articles list ── */}
        <div className="glass-card p-6">
          <h3 className="text-white font-bold text-base mb-5 flex items-center gap-2">
            <i className="fa-solid fa-list text-brand-green" />
            آرشیو ({localArticles.length.toLocaleString('fa-IR')} آیتم)
          </h3>
          {articlesLoading ? (
            <div className="text-center py-10">
              <i className="fa-solid fa-spinner fa-spin text-brand-cyan text-2xl block mb-2" />
              <p className="text-brand-muted text-xs">در حال بارگذاری...</p>
            </div>
          ) : (
            <div className="space-y-2 max-h-[520px] overflow-y-auto pl-1"
              style={{ scrollbarWidth: 'thin', scrollbarColor: '#00f0ff #0d0e12' }}>
              {localArticles.map(a => (
                <div key={a._id}
                  className="flex items-center justify-between gap-3 p-3 rounded-xl border border-brand-cyan/8 hover:border-brand-cyan/20 transition-colors bg-brand-bg/40">
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-xs font-semibold truncate">{a.title}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-brand-cyan/60 text-xs font-mono">{CAT_LABELS[a.category] || a.category}</span>
                      <span className="text-brand-muted/40 text-xs">·</span>
                      <span className="text-brand-muted text-xs">{(a.downloads || 0).toLocaleString('fa-IR')} دانلود</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 flex-shrink-0">
                    <button
                      disabled={togglingId === a._id}
                      onClick={() => togglePublish(a._id, a.published)}
                      className={`text-xs px-2 py-1 rounded-lg border font-semibold transition-colors disabled:opacity-50 ${
                        a.published
                          ? 'text-brand-green border-brand-green/30 bg-brand-green/8 hover:bg-brand-green/15'
                          : 'text-brand-muted border-brand-muted/20 hover:border-brand-cyan/30 hover:text-brand-cyan'
                      }`}>
                      {togglingId === a._id
                        ? <i className="fa-solid fa-spinner fa-spin text-xs" />
                        : a.published
                          ? <><i className="fa-solid fa-eye text-xs ml-1" />منتشر</>
                          : <><i className="fa-solid fa-eye-slash text-xs ml-1" />پیش‌نویس</>}
                    </button>
                    <button
                      disabled={deletingId === a._id}
                      onClick={() => deleteArticle(a._id)}
                      className="text-red-400 border border-red-400/20 bg-red-400/5 text-xs px-2 py-1 rounded-lg hover:bg-red-400/15 transition-colors disabled:opacity-50">
                      {deletingId === a._id
                        ? <i className="fa-solid fa-spinner fa-spin text-xs" />
                        : <i className="fa-solid fa-trash text-xs" />}
                    </button>
                  </div>
                </div>
              ))}
              {localArticles.length === 0 && (
                <div className="text-center py-10">
                  <i className="fa-solid fa-database text-brand-muted text-3xl opacity-20 block mb-2" />
                  <p className="text-brand-muted text-xs">هیچ مقاله‌ای ثبت نشده است</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

/* ── Sidebar ── */
function SidebarContent({ active, onSelect, appointments, contactMessages, user, onLogout }) {
  const pendingCount = appointments.filter(a => a.status === 'Pending').length
  const newMessagesCount = contactMessages.filter(m => m.status === 'New').length

  return (
    <>
      <div className="flex items-center gap-2 mb-8 px-1">
        <div className="w-8 h-8 rounded-lg flex items-center justify-center border border-brand-cyan/30 bg-brand-cyan/10">
          <i className="fa-solid fa-microchip text-brand-cyan text-xs" />
        </div>
        <div>
          <p className="text-white text-sm font-extrabold tracking-widest leading-none">رَدیف | RADIF</p>
          <p className="text-brand-muted text-[10px] font-mono mt-0.5">سامانه فرمان ردیف | نسخه ۱.۰</p>
        </div>
      </div>

      <p className="text-brand-muted/50 text-[10px] font-bold uppercase tracking-widest mb-3 px-1">
        ناوبری اصلی
      </p>

      <nav className="space-y-1 flex-1">
        {SIDEBAR_LINKS.map(link => (
          <button key={link.id} onClick={() => onSelect(link.id)}
            className={`dash-sidebar-link${active === link.id ? ' active' : ''}`}>
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors ${
              active === link.id
                ? 'bg-brand-cyan/15 border border-brand-cyan/30'
                : 'bg-brand-muted/10 border border-transparent'
            }`}>
              <i className={`fa-solid ${link.icon} text-sm ${active === link.id ? 'text-brand-cyan' : 'text-brand-muted'}`} />
            </div>
            <div className="flex-1 text-right min-w-0">
              <div className="flex items-center justify-between">
                <span className="text-xs text-brand-muted/60 font-mono leading-none">{link.sub}</span>
                {link.id === 'appointments' && pendingCount > 0 && (
                  <span className="bg-brand-green text-black text-[9px] font-extrabold px-1.5 py-0.5 rounded-full leading-none">
                    {pendingCount}
                  </span>
                )}
                {link.id === 'contact' && newMessagesCount > 0 && (
                  <span className="bg-brand-cyan text-black text-[9px] font-extrabold px-1.5 py-0.5 rounded-full leading-none">
                    {newMessagesCount}
                  </span>
                )}
              </div>
              <p className="text-sm font-semibold leading-snug mt-0.5">{link.label}</p>
            </div>
          </button>
        ))}
      </nav>

      <div className="border-t border-brand-cyan/10 mt-6 pt-5 space-y-1">
        <p className="text-brand-muted/50 text-[10px] font-bold uppercase tracking-widest mb-3 px-1">
          لینک‌های سریع
        </p>
        {[
          { icon: 'fa-house',     label: 'صفحه اصلی', to: '/' },
          { icon: 'fa-calendar',  label: 'رزرو نوبت', to: '/booking' },
          { icon: 'fa-book-open', label: 'دانشنامه',   to: '/wiki' },
        ].map(l => (
          <Link key={l.to} to={l.to}
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-brand-muted text-sm hover:text-brand-cyan hover:bg-brand-cyan/5 transition-all duration-200">
            <i className={`fa-solid ${l.icon} text-xs w-4 text-center`} />
            {l.label}
          </Link>
        ))}
      </div>

      <div className="mt-6 p-3 rounded-xl bg-brand-green/5 border border-brand-green/15">
        <div className="flex items-center gap-2 mb-1.5">
          <span className="w-2 h-2 rounded-full bg-brand-green animate-pulse-green flex-shrink-0" />
          <span className="text-brand-green text-xs font-bold">سیستم فعال</span>
        </div>
        <p className="text-brand-muted text-[10px] leading-relaxed">
          همه سرویس‌ها آنلاین هستند.<br />
          آخرین همگام‌سازی: لحظاتی پیش
        </p>
      </div>
    </>
  )
}

/* ── Main Dashboard Page ── */
export default function Dashboard() {
  const showToast              = useToast()
  const { user, logout, loading: authLoading } = useAuth()
  const navigate               = useNavigate()

  /* ── Route guard ── */
  useEffect(() => {
    if (authLoading) return
    if (!user || user.role !== 'admin') {
      showToast('شما به این بخش دسترسی ندارید', 5000)
      navigate('/', { replace: true })
    }
  }, [user, authLoading, navigate, showToast])

  const [activePanel, setActivePanel] = useState('overview')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [appointments,    setAppointments]    = useState([])
  const [apptsLoading,    setApptsLoading]    = useState(false)
  const [articles,        setArticles]        = useState([])
  const [articlesLoading, setArticlesLoading] = useState(false)
  const [contactMessages, setContactMessages] = useState([])
  const [contactLoading,  setContactLoading]  = useState(false)

  const fetchAppointments = useCallback(async () => {
    setApptsLoading(true)
    try {
      const { data } = await api.get('/appointments')
      setAppointments(data.appointments || [])
    } catch (err) {
      showToast(extractError(err), 5000)
    } finally {
      setApptsLoading(false)
    }
  }, [showToast])

  const fetchArticles = useCallback(async () => {
    setArticlesLoading(true)
    try {
      const { data } = await api.get('/articles')
      setArticles(data.articles || [])
    } catch (err) {
      showToast(extractError(err), 5000)
    } finally {
      setArticlesLoading(false)
    }
  }, [showToast])

  const fetchContactMessages = useCallback(async () => {
    setContactLoading(true)
    try {
      const { data } = await api.get('/contact')
      setContactMessages(data.messages || [])
    } catch (err) {
      showToast(extractError(err), 5000)
    } finally {
      setContactLoading(false)
    }
  }, [showToast])

  /* Fetch on mount once admin is confirmed */
  useEffect(() => {
    if (!user || user.role !== 'admin') return
    fetchAppointments()
    fetchArticles()
    fetchContactMessages()
  }, [user, fetchAppointments, fetchArticles, fetchContactMessages])

  const handleChangeStatus = async (id, currentStatus) => {
    const nextStatus = STATUS_CYCLE[currentStatus] || 'Pending'
    setAppointments(prev => prev.map(a => a._id === id ? { ...a, status: nextStatus } : a))
    try {
      await api.patch(`/appointments/${id}/status`, { status: nextStatus })
      showToast('وضعیت نوبت تغییر کرد.')
    } catch (err) {
      setAppointments(prev => prev.map(a => a._id === id ? { ...a, status: currentStatus } : a))
      showToast(extractError(err), 5000)
    }
  }

  const handleDeleteAppointment = id => {
    setAppointments(prev => prev.filter(a => a._id !== id))
    showToast('نوبت از لیست حذف شد.')
  }

  const handleArticleCreated = newArticle => {
    setArticles(prev => [newArticle, ...prev])
  }

  const handleUpdateContactStatus = async (id, currentStatus) => {
    const STATUS_CYCLE_CONTACT = {
      'New': 'Read',
      'Read': 'Replied', 
      'Replied': 'New',
    }
    const nextStatus = STATUS_CYCLE_CONTACT[currentStatus] || 'New'
    
    setContactMessages(prev => prev.map(m => m._id === id ? { ...m, status: nextStatus } : m))
    try {
      await api.patch(`/contact/${id}/status`, { status: nextStatus })
      showToast('وضعیت پیام تغییر کرد.')
    } catch (err) {
      setContactMessages(prev => prev.map(m => m._id === id ? { ...m, status: currentStatus } : m))
      showToast(extractError(err), 5000)
    }
  }

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  /* Block render until auth resolves */
  if (authLoading || !user || user.role !== 'admin') return null

  const pendingCount = appointments.filter(a => a.status === 'Pending').length

  return (
    <div className="min-h-screen bg-brand-bg pt-20">

      {/* ── Two-Column Layout ── */}
      <div className="max-w-screen-xl mx-auto flex min-h-[calc(100vh-120px)]">

        {/* Desktop sidebar */}
        <aside className="flex-shrink-0 w-64 border-l border-brand-cyan/10 px-4 py-6 hidden lg:flex flex-col"
          style={{ background: 'rgba(13,14,18,0.7)' }}>
          <SidebarContent
            active={activePanel}
            onSelect={setActivePanel}
            appointments={appointments}
            contactMessages={contactMessages}
            user={user}
            onLogout={handleLogout}
          />
        </aside>

        {/* Mobile sidebar overlay */}
        {sidebarOpen && (
          <div className="lg:hidden fixed inset-0 z-50 flex">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setSidebarOpen(false)} />
            <aside className="relative w-72 flex flex-col px-4 py-6 border-l border-brand-cyan/15 z-10"
              style={{ background: 'rgba(13,14,18,0.97)' }}>
              <button className="self-end mb-6 text-brand-muted hover:text-brand-cyan p-1"
                onClick={() => setSidebarOpen(false)}>
                <i className="fa-solid fa-xmark text-xl" />
              </button>
              <SidebarContent
                active={activePanel}
                onSelect={id => { setActivePanel(id); setSidebarOpen(false) }}
                appointments={appointments}
                contactMessages={contactMessages}
                user={user}
                onLogout={handleLogout}
              />
            </aside>
          </div>
        )}

        {/* ── Main content ── */}
        <main className="flex-1 px-6 lg:px-10 py-8 min-w-0">
          {activePanel === 'overview' && (
            <OverviewPanel appts={appointments} articles={articles} />
          )}
          {activePanel === 'appointments' && (
            <AppointmentsPanel
              appts={appointments}
              loading={apptsLoading}
              onChangeStatus={handleChangeStatus}
              onDelete={handleDeleteAppointment}
            />
          )}
          {activePanel === 'contact' && (
            <ContactMessagesPanel
              messages={contactMessages}
              loading={contactLoading}
              onUpdateStatus={handleUpdateContactStatus}
            />
          )}
          {activePanel === 'wiki' && (
            <WikiPanel
              articles={articles}
              articlesLoading={articlesLoading}
              onArticleCreated={handleArticleCreated}
            />
          )}
        </main>
      </div>
    </div>
  )
}
