import { useState } from 'react'
import { Link } from 'react-router-dom'
import useReveal from '../hooks/useReveal'
import { useToast } from '../components/Toast'
import api from '../utils/api'

export default function Contact() {
  useReveal()
  const showToast = useToast()
  const [form, setForm] = useState({ name: '', phone: '', subject: '', message: '' })
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)
  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }))

  const submit = async e => {
    e.preventDefault()
    if (!form.name || !form.phone || !form.subject || !form.message) {
      showToast('لطفاً تمام فیلدهای اجباری را تکمیل کنید.'); return
    }
    setLoading(true)
    try {
      const { data } = await api.post('/contact', {
        name:    form.name.trim(),
        phone:   form.phone.trim(),
        subject: form.subject.trim(),
        message: form.message.trim(),
      })
      showToast(data.message || '✔ پیام شما ارسال شد.', 5000)
      setDone(true)
      setForm({ name: '', phone: '', subject: '', message: '' })
      setTimeout(() => setDone(false), 3000)
    } catch (err) {
      const msg = err?.response?.data?.message || 'خطا در ارسال پیام. لطفاً دوباره تلاش کنید.'
      showToast(msg, 5000)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      {/* HERO */}
      <section className="hero-grid-bg pt-36 pb-16 px-6 lg:px-12 text-center">
        <div className="max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-brand-cyan/30 bg-brand-cyan/5 text-brand-cyan text-xs font-semibold mb-8 animate-fade-in-up">
            <span className="w-2 h-2 rounded-full bg-brand-green animate-pulse-green inline-block" />
            پذیرش خودرو و ارتباط مستقیم با تیم فنی
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold leading-tight mb-5 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
            ارتباط با ما و <span className="text-brand-cyan text-glow-cyan"> پذیرش خودرو</span>
          </h1>
          <p className="text-brand-muted text-base leading-relaxed animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            سوال، مشاوره یا پذیرش خودرو — از هر مسیری که راحت‌تر هستید با ما در ارتباط باشید.
          </p>
        </div>
      </section>

      {/* TWO-COLUMN */}
      <section className="py-20 px-6 lg:px-12">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">

            {/* INFO CARDS */}
            <div className="space-y-6">
              {/* Address */}
              <div className="contact-info-card reveal">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl flex-shrink-0 flex items-center justify-center bg-brand-cyan/10 border border-brand-cyan/20">
                    <i className="fa-solid fa-location-dot text-brand-cyan text-xl" />
                  </div>
                  <div>
                    <h3 className="text-white font-bold text-base mb-1">آدرس کلینیک</h3>
                    <p className="text-brand-muted text-sm leading-relaxed">
                      تهران، خیابان ایران‌خودرو، نبش کوچه چهارم، پلاک ۱۲<br />
                      ساختمان مهندسان، طبقه همکف، واحد ۲
                    </p>
                    <a href="#map" className="inline-flex items-center gap-1.5 text-brand-cyan text-xs font-semibold mt-3 hover:text-brand-green transition-colors">
                      <i className="fa-solid fa-map text-xs" />نمایش روی نقشه
                    </a>
                  </div>
                </div>
              </div>

              {/* Phone */}
              <div className="contact-info-card reveal" style={{ animationDelay: '0.1s' }}>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl flex-shrink-0 flex items-center justify-center bg-brand-green/10 border border-brand-green/20">
                    <i className="fa-solid fa-headset text-brand-green text-xl" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-white font-bold text-base mb-3">شماره‌های تماس و پشتیبانی</h3>
                    {[
                      { label: 'خط مستقیم پذیرش', num: '۰۲۱-XXXX-XXXX', icon: 'fa-phone', iconColor: 'text-brand-green', bg: 'bg-brand-green/10 border-brand-green/20' },
                      { label: 'موبایل و واتساپ',  num: '۰۹۱۲-XXX-XXXX', icon: 'fa-brands fa-whatsapp', iconColor: 'text-brand-cyan', bg: 'bg-brand-cyan/10 border-brand-cyan/20' },
                      { label: 'کانال تلگرام',     num: '@ECUENG_Official', icon: 'fa-brands fa-telegram', iconColor: 'text-brand-cyan', bg: 'bg-brand-cyan/10 border-brand-cyan/20' },
                    ].map((row, i) => (
                      <div key={i}>
                        {i > 0 && <div className="h-px bg-brand-cyan/6 my-3" />}
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-brand-muted text-xs mb-0.5">{row.label}</p>
                            <p className="text-white font-semibold text-sm" dir="ltr">{row.num}</p>
                          </div>
                          <a href="#" className={`w-9 h-9 rounded-lg flex items-center justify-center border transition-colors ${row.bg} hover:opacity-80`}>
                            <i className={`fa-solid ${row.icon} ${row.iconColor} text-sm`} />
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Hours */}
              <div className="contact-info-card reveal" style={{ animationDelay: '0.2s' }}>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl flex-shrink-0 flex items-center justify-center bg-brand-cyan/10 border border-brand-cyan/20">
                    <i className="fa-solid fa-clock text-brand-cyan text-xl" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-white font-bold text-base mb-4">ساعات کاری</h3>
                    <div>
                      {[
                        { day: 'شنبه تا چهارشنبه', time: '۹:۰۰ — ۱۸:۰۰', color: 'text-brand-green' },
                        { day: 'پنجشنبه',           time: '۹:۰۰ — ۱۴:۰۰', color: 'text-brand-cyan' },
                        { day: 'جمعه',              time: 'تعطیل',          color: 'text-red-400' },
                      ].map(r => (
                        <div key={r.day} className="hours-row">
                          <span className={r.color === 'text-red-400' ? 'text-brand-muted' : 'text-white font-medium'}>{r.day}</span>
                          <span className={`font-semibold ${r.color}`}>{r.time}</span>
                        </div>
                      ))}
                    </div>
                    <div className="flex items-center gap-2 mt-4 p-3 rounded-lg bg-brand-green/5 border border-brand-green/15">
                      <span className="w-2 h-2 bg-brand-green rounded-full animate-pulse-green flex-shrink-0" />
                      <p className="text-brand-muted text-xs">اکنون باز است — زمان بسته شدن: ۱۸:۰۰</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* MAP + FORM */}
            <div className="space-y-8">
              {/* Map placeholder */}
              <div id="map" className="map-placeholder reveal" style={{ height: 280 }}>
                <div className="relative z-10 flex flex-col items-center justify-center h-full gap-4">
                  <div className="relative">
                    <div className="w-16 h-16 rounded-full border-2 border-brand-cyan/50 bg-brand-cyan/10 flex items-center justify-center animate-float"
                      style={{ boxShadow: '0 0 30px rgba(0,240,255,0.25)' }}>
                      <i className="fa-solid fa-location-dot text-brand-cyan text-3xl text-glow-cyan" />
                    </div>
                    <div className="absolute inset-0 rounded-full border border-brand-cyan/20 animate-ping" />
                  </div>
                  <div className="text-center">
                    <p className="text-white font-semibold text-sm">کلینیک ردیف | Radif</p>
                    <p className="text-brand-muted text-xs mt-1">تهران، خیابان ایران‌خودرو، پلاک ۱۲</p>
                    <a href="https://maps.google.com/?q=Tehran,Iran" target="_blank" rel="noreferrer"
                      className="inline-flex items-center gap-1.5 mt-3 text-brand-cyan text-xs font-semibold border border-brand-cyan/30 px-4 py-1.5 rounded-full hover:bg-brand-cyan/10 transition-colors">
                      <i className="fa-solid fa-arrow-up-right-from-square text-xs" />باز کردن در Google Maps
                    </a>
                  </div>
                </div>
              </div>

              {/* Message form */}
              <div className="glass-card p-7 reveal" style={{ animationDelay: '0.2s' }}>
                <h3 className="text-white font-bold text-lg mb-1">ارسال پیام مستقیم</h3>
                <p className="text-brand-muted text-sm mb-6">به مهندسی فنی — پاسخ در کمتر از ۲ ساعت</p>
                <form onSubmit={submit} noValidate>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-5">
                    <div>
                      <label className="block text-brand-muted text-xs mb-1.5"><i className="fa-regular fa-user ml-1 text-brand-cyan" />نام شما</label>
                      <input className="form-input" placeholder="علی احمدی" value={form.name} onChange={set('name')} required />
                    </div>
                    <div>
                      <label className="block text-brand-muted text-xs mb-1.5"><i className="fa-solid fa-phone ml-1 text-brand-cyan" />شماره تماس</label>
                      <input className="form-input" dir="ltr" placeholder="۰۹۱۲ ..." value={form.phone} onChange={set('phone')} required />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-brand-muted text-xs mb-1.5"><i className="fa-solid fa-tag ml-1 text-brand-cyan" />موضوع پیام</label>
                      <input className="form-input" placeholder="سوال درباره ریمپ پژو ۴۰۵..." value={form.subject} onChange={set('subject')} required />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-brand-muted text-xs mb-1.5"><i className="fa-regular fa-comment-dots ml-1 text-brand-cyan" />متن پیام</label>
                      <textarea className="form-input resize-none" rows={4} placeholder="سوال یا مشکل خود را توضیح دهید..." value={form.message} onChange={set('message')} required />
                    </div>
                  </div>
                  <button type="submit" disabled={loading || done}
                    className="btn-neon-green animate-pulse-green w-full py-3.5 text-sm font-bold rounded-xl gap-2 transition-all"
                    style={done ? { background: '#00f0ff', color: '#000' } : {}}>
                    {loading ? <><i className="fa-solid fa-spinner fa-spin" /> در حال ارسال...</>
                      : done   ? <><i className="fa-solid fa-check-circle" /> پیام ارسال شد!</>
                      : <><i className="fa-solid fa-paper-plane" /> ارسال پیام به تیم فنی</>}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
