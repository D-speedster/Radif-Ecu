import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useToast } from '../components/Toast'
import { useAuth } from '../context/AuthContext'
import api from '../utils/api'

/* ---------- Password visibility toggle ---------- */
function PwInput({ id, placeholder, value, onChange, label, icon }) {
  const [show, setShow] = useState(false)
  return (
    <div>
      <label className="block text-brand-muted text-xs mb-1.5">
        <i className={`fa-solid ${icon} ml-1 text-brand-green`} />{label}
      </label>
      <div className="relative">
        <input
          type={show ? 'text' : 'password'}
          id={id}
          className="form-input pl-10"
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          required
          dir="ltr"
        />
        <button type="button" onClick={() => setShow(s => !s)}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-muted hover:text-brand-green transition-colors"
          aria-label="نمایش/پنهان رمز">
          <i className={`fa-solid ${show ? 'fa-eye-slash' : 'fa-eye'} text-sm`} />
        </button>
      </div>
    </div>
  )
}

/* ---------- Password strength ---------- */
function PwStrength({ value }) {
  let score = 0
  if (value.length >= 8)            score++
  if (/[A-Z]/.test(value))          score++
  if (/[0-9]/.test(value))          score++
  if (/[^A-Za-z0-9]/.test(value))   score++
  const levels = [
    { w: '0%',   color: 'transparent', label: '' },
    { w: '25%',  color: '#ff4444',     label: 'ضعیف' },
    { w: '50%',  color: '#ffaa00',     label: 'متوسط' },
    { w: '75%',  color: '#00f0ff',     label: 'خوب' },
    { w: '100%', color: '#39ff14',     label: 'عالی' },
  ]
  const lvl = levels[score] || levels[0]
  return (
    <div className="mt-2">
      <div className="h-1 rounded-full bg-brand-muted/15 overflow-hidden">
        <div className="h-full rounded-full transition-all duration-500" style={{ width: lvl.w, background: lvl.color }} />
      </div>
      {lvl.label && <p className="text-xs mt-1" style={{ color: lvl.color }}>{lvl.label}</p>}
    </div>
  )
}

export default function Auth() {
  const showToast        = useToast()
  const { login }        = useAuth()
  const navigate         = useNavigate()
  const [tab, setTab]    = useState('login') // 'login' | 'register'

  /* ── login state ── */
  const [loginId,      setLoginId]      = useState('')
  const [loginPw,      setLoginPw]      = useState('')
  const [loginLoading, setLoginLoading] = useState(false)

  /* ── register state ── */
  const [reg, setReg] = useState({ name: '', mobile: '', email: '', pw: '', confirm: '' })
  const [terms,      setTerms]      = useState(false)
  const [regLoading, setRegLoading] = useState(false)

  const setR = k => e => setReg(r => ({ ...r, [k]: e.target.value }))

  const extractError = (err) =>
    err?.response?.data?.message || 'خطایی رخ داد. لطفاً دوباره تلاش کنید.'

  const handleLogin = async e => {
    e.preventDefault()
    if (!loginId || !loginPw) {
      showToast('لطفاً اطلاعات ورود را وارد کنید.')
      return
    }

    setLoginLoading(true)
    try {
      const { data } = await api.post('/auth/login', {        identifier: loginId.trim(),
        password:   loginPw,
      })

      // Cookie is set by the server; store user state locally
      login(data.user)

      showToast('✔ ورود موفقیت‌آمیز! در حال انتقال...', 4000)

    // Redirect admin to dashboard, others to home
    setTimeout(() => {
        navigate(data.user.role === 'admin' ? '/admin/dashboard' : '/')
      }, 800)

    } catch (err) {
      showToast(extractError(err), 5000)
    } finally {
      setLoginLoading(false)
    }
  }

  const handleRegister = async e => {
    e.preventDefault()

    if (!reg.name || !reg.mobile || !reg.pw || !reg.confirm) {
      showToast('لطفاً تمام فیلدهای اجباری را تکمیل کنید.')
      return
    }
    if (reg.pw !== reg.confirm) {
      showToast('رمز عبور و تکرار آن یکسان نیستند.')
      return
    }
    if (!terms) {
      showToast('برای ادامه باید قوانین را بپذیرید.')
      return
    }

    setRegLoading(true)
    try {
      await api.post('/auth/register', {
        name:       reg.name.trim(),
        identifier: reg.mobile.trim(),
        password:   reg.pw,
      })

      showToast('✔ ثبت‌نام موفقیت‌آمیز بود! اکنون وارد شوید.', 5000)
      setReg({ name: '', mobile: '', email: '', pw: '', confirm: '' })
      setTerms(false)
      setTab('login')

    } catch (err) {
      showToast(extractError(err), 5000)
    } finally {
      setRegLoading(false)
    }
  }

  return (
    <div className="hero-grid-bg min-h-screen flex items-center justify-center px-6 py-24">
      <div className="w-full max-w-md">

        {/* Top label */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-brand-cyan/30 bg-brand-cyan/5 text-brand-cyan text-xs font-semibold mb-6 animate-fade-in-up">
            <i className="fa-solid fa-lock text-xs" />دسترسی امن — SSL/TLS Encrypted
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
            پنل تخصصی ردیف | Radif
          </h1>
          <p className="text-brand-muted text-sm mt-2 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            ورود به دانشنامه، مشاهده وضعیت سفارش و دریافت فایل‌های فنی
          </p>
        </div>

        {/* Auth box */}
        <div className="glass-card p-8 md:p-10 animate-fade-in-up" style={{ animationDelay: '0.3s', borderColor: 'rgba(0,240,255,0.18)', boxShadow: '0 0 60px rgba(0,240,255,0.06)' }}>

          {/* Tabs */}
          <div className="flex gap-2 p-1.5 rounded-xl mb-8" style={{ background: 'rgba(13,14,18,0.7)', border: '1px solid rgba(0,240,255,0.1)' }}>
            <button className={`auth-tab${tab === 'login' ? ' active-login' : ''}`} onClick={() => setTab('login')}>
              <i className="fa-solid fa-right-to-bracket ml-2" />ورود به حساب
            </button>
            <button className={`auth-tab${tab === 'register' ? ' active-register' : ''}`} onClick={() => setTab('register')}>
              <i className="fa-solid fa-user-plus ml-2" />عضویت در دانشنامه
            </button>
          </div>

          {/* ── LOGIN ──────────────────────────────────────────── */}
          {tab === 'login' && (
            <form onSubmit={handleLogin} noValidate>
              <div className="space-y-5 mb-8">
                <div>
                  <label className="block text-brand-muted text-xs mb-1.5">
                    <i className="fa-solid fa-mobile-screen-button ml-1 text-brand-cyan" />شماره موبایل یا ایمیل
                  </label>
                  <input className="form-input" dir="ltr" placeholder="۰۹۱۲XXXXXXX یا email@example.com"
                    value={loginId} onChange={e => setLoginId(e.target.value)} required />
                </div>
                <div>
                  <label className="block text-brand-muted text-xs mb-1.5">
                    <i className="fa-solid fa-key ml-1 text-brand-cyan" />رمز عبور
                  </label>
                  <div className="relative">
                    <input className="form-input pl-10" type="password" dir="ltr" placeholder="••••••••"
                      value={loginPw} onChange={e => setLoginPw(e.target.value)} required />
                  </div>
                </div>
              </div>

              <button type="submit" disabled={loginLoading}
                className="w-full py-4 text-base font-bold rounded-xl flex items-center justify-center gap-3 transition-all duration-300 animate-pulse-cyan"
                style={{ background: 'var(--accent-cyan)', color: '#000', border: 'none', cursor: loginLoading ? 'wait' : 'pointer', borderRadius: 10, opacity: loginLoading ? 0.8 : 1 }}>
                {loginLoading
                  ? <><i className="fa-solid fa-spinner fa-spin text-lg" /> در حال بررسی...</>
                  : <><i className="fa-solid fa-right-to-bracket text-lg" /> ورود به پنل تخصصی</>}
              </button>

              <p className="text-center text-brand-muted text-sm mt-8">
                حساب کاربری ندارید؟
                <button type="button" onClick={() => setTab('register')} className="text-brand-cyan font-semibold hover:text-brand-green transition-colors mr-1">
                  همین الان عضو شوید
                </button>
              </p>
            </form>
          )}

          {/* ── REGISTER ───────────────────────────────────────── */}
          {tab === 'register' && (
            <form onSubmit={handleRegister} noValidate>
              <div className="space-y-5 mb-8">
                <div>
                  <label className="block text-brand-muted text-xs mb-1.5"><i className="fa-regular fa-user ml-1 text-brand-green" />نام و نام خانوادگی</label>
                  <input className="form-input" placeholder="علی احمدی" value={reg.name} onChange={setR('name')} required />
                </div>
                <div>
                  <label className="block text-brand-muted text-xs mb-1.5"><i className="fa-solid fa-mobile-screen-button ml-1 text-brand-green" />شماره موبایل</label>
                  <input className="form-input" dir="ltr" placeholder="۰۹۱۲XXXXXXX" value={reg.mobile} onChange={setR('mobile')} required />
                </div>
                <div>
                  <label className="block text-brand-muted text-xs mb-1.5">
                    <i className="fa-regular fa-envelope ml-1 text-brand-green" />ایمیل <span className="text-brand-muted/60 mr-1">(اختیاری)</span>
                  </label>
                  <input className="form-input" dir="ltr" type="email" placeholder="example@mail.com" value={reg.email} onChange={setR('email')} />
                </div>
                <div>
                  <PwInput id="reg-pw" placeholder="حداقل ۸ کاراکتر" value={reg.pw} onChange={setR('pw')} label="رمز عبور" icon="fa-key" />
                  <PwStrength value={reg.pw} />
                </div>
                <PwInput id="reg-confirm" placeholder="••••••••" value={reg.confirm} onChange={setR('confirm')} label="تکرار رمز عبور" icon="fa-lock" />
                <label className="flex items-start gap-3 cursor-pointer group">
                  <input type="checkbox" checked={terms} onChange={e => setTerms(e.target.checked)}
                    className="w-4 h-4 mt-0.5 flex-shrink-0 cursor-pointer" />
                  <span className="text-brand-muted text-xs leading-relaxed group-hover:text-white transition-colors">
                    با <a href="#" className="text-brand-green hover:underline">قوانین و مقررات</a> دانشنامه ردیف | Radif موافقم.
                  </span>
                </label>
              </div>

              <button type="submit" disabled={regLoading}
                className="btn-neon-green animate-pulse-green w-full py-4 text-base font-bold rounded-xl gap-3 transition-all"
                style={{ opacity: regLoading ? 0.8 : 1, cursor: regLoading ? 'wait' : 'pointer' }}>
                {regLoading
                  ? <><i className="fa-solid fa-spinner fa-spin text-lg" /> در حال ثبت...</>
                  : <><i className="fa-solid fa-user-plus text-lg" /> ایجاد حساب کاربری</>}
              </button>

              <p className="text-center text-brand-muted text-sm mt-8">
                قبلاً ثبت‌نام کرده‌اید؟
                <button type="button" onClick={() => setTab('login')} className="text-brand-cyan font-semibold hover:text-brand-green transition-colors mr-1">
                  وارد شوید
                </button>
              </p>
            </form>
          )}
        </div>

        {/* Trust badges */}
        <div className="flex items-center justify-center gap-6 mt-10 text-xs text-brand-muted">
          {[['fa-shield-halved', 'text-brand-green', 'رمزنگاری SSL'], ['fa-user-secret', 'text-brand-cyan', 'حریم خصوصی کامل'], ['fa-database', 'text-brand-green', 'دسترسی به آرشیو فنی']].map(([ic, cl, lb], i) => (
            <span key={i} className="flex items-center gap-1.5">
              <i className={`fa-solid ${ic} ${cl} text-sm`} />{lb}
              {i < 2 && <span className="w-px h-4 bg-brand-muted/30 mr-2" />}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}
