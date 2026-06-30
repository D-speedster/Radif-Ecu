import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import useReveal from '../hooks/useReveal'
import { useToast } from '../components/Toast'

/* ---------- data ---------- */
const services = [
  {
    icon: 'fa-screwdriver-wrench', color: 'cyan', badge: null,
    title: 'تعمیرات سخت‌افزار', sub: 'ECU Hardware Repair',
    items: [
      'رفع خطاهای دائمی برد (Permanent Fault Fix)',
      'تعویض آی‌سی و رگولاتور ولتاژ',
      'رفع مشکل قطعی منفی و اتصال زمین',
      'رفع خطای سنسور دما و فشار',
    ],
    link: '/hardware-repair',
  },
  {
    icon: 'fa-gauge-high', color: 'green', badge: 'محبوب‌ترین',
    title: 'ریمپ و کالیبراسیون', sub: 'Remap & Calibration',
    items: [
      'رفع کپ اولیه و تاخیر گاز (Throttle Lag Fix)',
      'حذف سنسور اکسیژن و میل‌سوپاپ',
      'آپدیت و بهینه‌سازی جداول سوخت',
      'تنظیم نقشه احتراق و بهره‌وری سوخت',
    ],
    link: '/remap-calibration',
  },
  {
    icon: 'fa-circle-nodes', color: 'cyan', badge: null,
    title: 'مالتی‌پلکس و نودها', sub: 'Multiplex & Network Nodes',
    items: [
      'تعمیر و برنامه‌ریزی نودهای CAN/LIN',
      'رفع مشکلات شبکه مالتی‌پلکس',
      'بررسی و تعمیر سیم‌کشی تخصصی',
      'آنالیز Bus CAN با ابزار تخصصی',
    ],
    link: '/hardware-repair',
  },
]

const articles = [
  { icon: 'fa-microchip',       glowColor: '#00f0ff', mono: 'IC_REGULATOR.ECU',   cat: 'تعمیرات سخت‌افزار', catColor: 'green',
    title: 'علائم سوختن آی‌سی رگولاتور ایسیوهای خانواده پژو و سمند',
    desc: 'بررسی کامل نشانه‌های خرابی IC رگولاتور در ECUهای سری سیمنس و ددیکا.' },
  { icon: 'fa-bolt',            glowColor: '#39ff14', mono: 'VALEO_GROUND.FIX',  cat: 'شبکه مالتی‌پلکس',   catColor: 'cyan',
    title: 'رفع مشکل قطع شدن منفی دائم در ایسیوهای خانواده والئو',
    desc: 'آموزش گام‌به‌گام تشخیص و رفع قطعی زمین دائم در ECU والئو J34P.' },
  { icon: 'fa-diagram-project', glowColor: '#00f0ff', mono: 'SIEMENS_PINOUT.PDF', cat: 'راهنمای فنی',        catColor: 'green',
    title: 'راهنمای کامل خواندن پین‌اوت ایسیوهای زیمنس قدیمی',
    desc: 'فایل کامل پین‌اوت برای ECUهای سری Siemens MS43، S2000 و S110.' },
]

/* ---------- stat counter ---------- */
function StatCounter({ target, suffix = '', prefix = '' }) {
  const [val, setVal] = useState(0)
  const ref = useRef(null)
  const ran = useRef(false)
  useEffect(() => {
    const el = ref.current; if (!el) return
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !ran.current) {
        ran.current = true
        const dur = 1800; const start = performance.now()
        const step = now => {
          const t = Math.min((now - start) / dur, 1)
          const ease = t * (2 - t)
          setVal(Math.round(ease * target))
          if (t < 1) requestAnimationFrame(step)
        }
        requestAnimationFrame(step)
      }
    }, { threshold: 0.3 })
    obs.observe(el)
    return () => obs.disconnect()
  }, [target])
  return (
    <div ref={ref} className="stat-number">
      {prefix}{val.toLocaleString('fa-IR')}{suffix}
    </div>
  )
}

/* ---------- booking form ---------- */
function BookingForm() {
  const showToast = useToast()
  const [form, setForm] = useState({ name: '', phone: '', carModel: '', serviceType: '', description: '' })
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)

  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }))

  const submit = async e => {
    e.preventDefault()
    if (!form.name || !form.phone || !form.carModel || !form.serviceType) {
      showToast('لطفاً تمام فیلدهای اجباری را تکمیل کنید.')
      return
    }
    setLoading(true)
    await new Promise(r => setTimeout(r, 1500))
    const code = 'ECU-' + Math.random().toString(36).slice(2, 8).toUpperCase()
    showToast(`✔ درخواست ثبت شد! کد پیگیری: ${code}`, 6000)
    setDone(true); setLoading(false)
    setForm({ name: '', phone: '', carModel: '', serviceType: '', description: '' })
    setTimeout(() => setDone(false), 3000)
  }

  return (
    <form onSubmit={submit} noValidate>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 md:gap-6 mb-6">
        <div className="space-y-1.5">
          <label className="block text-brand-muted text-xs"><i className="fa-regular fa-user ml-1 text-brand-cyan" />نام و نام خانوادگی</label>
          <input className="form-input" placeholder="علی احمدی" value={form.name} onChange={set('name')} required />
        </div>
        <div className="space-y-1.5">
          <label className="block text-brand-muted text-xs"><i className="fa-solid fa-phone ml-1 text-brand-cyan" />شماره تماس</label>
          <input className="form-input" dir="ltr" placeholder="۰۹۱۲ ..." value={form.phone} onChange={set('phone')} required />
        </div>
        <div className="space-y-1.5">
          <label className="block text-brand-muted text-xs"><i className="fa-solid fa-car ml-1 text-brand-cyan" />نوع خودرو</label>
          <input className="form-input" placeholder="پژو ۴۰۵ مدل ۱۳۹۸" value={form.carModel} onChange={set('carModel')} required />
        </div>
        <div className="space-y-1.5">
          <label className="block text-brand-muted text-xs"><i className="fa-solid fa-list-check ml-1 text-brand-cyan" />نوع خدمت</label>
          <select className="form-input" value={form.serviceType} onChange={set('serviceType')} required>
            <option value="" disabled>انتخاب کنید...</option>
            <option value="hardware">تعمیرات سخت‌افزار ECU</option>
            <option value="remap">ریمپ و کالیبراسیون</option>
            <option value="multiplex">مالتی‌پلکس و نود</option>
            <option value="diagnostic">عیب‌یابی تخصصی</option>
            <option value="other">سایر خدمات</option>
          </select>
        </div>
        <div className="sm:col-span-2 space-y-1.5">
          <label className="block text-brand-muted text-xs"><i className="fa-regular fa-comment-dots ml-1 text-brand-cyan" />توضیحات مشکل (اختیاری)</label>
          <textarea className="form-input resize-none" rows={3} placeholder="مشکل خودروی خود را شرح دهید..." value={form.description} onChange={set('description')} />
        </div>
      </div>
      <button type="submit" disabled={loading || done}
        className={`btn-neon-green animate-pulse-green w-full py-4 text-base font-bold rounded-xl gap-3 transition-all${done ? ' opacity-80' : ''}`}
        style={done ? { background: '#00f0ff', color: '#000' } : {}}>
        {loading ? <><i className="fa-solid fa-spinner fa-spin text-lg" /> در حال ثبت...</>
          : done   ? <><i className="fa-solid fa-check-circle text-lg" /> ثبت شد!</>
          : <><i className="fa-solid fa-paper-plane text-lg" /> ثبت درخواست و دریافت کد پیگیری</>}
      </button>
      <p className="text-center text-brand-muted text-xs mt-5">
        <i className="fa-solid fa-lock ml-1 text-brand-cyan/50" />اطلاعات شما محرمانه است.
      </p>
    </form>
  )
}

/* ============================================================ */
/* ---------- Cybernetic Background SVG Schematic ----------- */
function CyberneticBackground() {
  return (
    <svg
      className="hero-schematic-canvas"
      viewBox="0 0 1440 900"
      preserveAspectRatio="xMidYMid slice"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <defs>
        {/* Cyan glow filter */}
        <filter id="glow-cyan" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="2.5" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
        {/* Green glow filter */}
        <filter id="glow-green" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="2" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
        {/* Strong glow for accent nodes */}
        <filter id="glow-strong" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="4" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
        {/* ECU board pattern tile */}
        <pattern id="ecu-tile" x="0" y="0" width="120" height="120" patternUnits="userSpaceOnUse">
          {/* PCB trace horizontals */}
          <line x1="0" y1="20"  x2="120" y2="20"  stroke="rgba(0,240,255,0.07)" strokeWidth="1" />
          <line x1="0" y1="60"  x2="120" y2="60"  stroke="rgba(0,240,255,0.05)" strokeWidth="1" />
          <line x1="0" y1="100" x2="120" y2="100" stroke="rgba(57,255,20,0.05)"  strokeWidth="1" />
          {/* PCB trace verticals */}
          <line x1="30"  y1="0" x2="30"  y2="120" stroke="rgba(0,240,255,0.06)" strokeWidth="1" />
          <line x1="75"  y1="0" x2="75"  y2="120" stroke="rgba(0,240,255,0.04)" strokeWidth="1" />
          <line x1="105" y1="0" x2="105" y2="120" stroke="rgba(57,255,20,0.04)"  strokeWidth="1" />
          {/* Via dots */}
          <circle cx="30"  cy="20"  r="2.5" fill="rgba(0,240,255,0.15)" />
          <circle cx="75"  cy="60"  r="2"   fill="rgba(57,255,20,0.12)" />
          <circle cx="105" cy="100" r="2.5" fill="rgba(0,240,255,0.12)" />
          <circle cx="30"  cy="100" r="2"   fill="rgba(57,255,20,0.10)" />
          {/* SMD component silhouettes */}
          <rect x="42" y="14" width="18" height="10" rx="1" fill="none" stroke="rgba(0,240,255,0.10)" strokeWidth="0.8" />
          <rect x="82" y="54" width="14" height="8"  rx="1" fill="none" stroke="rgba(57,255,20,0.09)"  strokeWidth="0.8" />
        </pattern>

        {/* Chassis outline gradient */}
        <linearGradient id="chassis-grad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%"   stopColor="#00f0ff" stopOpacity="0" />
          <stop offset="30%"  stopColor="#00f0ff" stopOpacity="0.35" />
          <stop offset="70%"  stopColor="#39ff14" stopOpacity="0.25" />
          <stop offset="100%" stopColor="#39ff14" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="chassis-grad2" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%"   stopColor="#00f0ff" stopOpacity="0" />
          <stop offset="50%"  stopColor="#00f0ff" stopOpacity="0.2" />
          <stop offset="100%" stopColor="#00f0ff" stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* ── ECU PCB tile fill ── */}
      <rect width="1440" height="900" fill="url(#ecu-tile)" opacity="0.9" />

      {/* ── LAYER 2: Left ECU board block ── */}
      <g opacity="0.22" filter="url(#glow-cyan)">
        {/* Board outline */}
        <rect x="30" y="120" width="280" height="180" rx="6"
          fill="none" stroke="#00f0ff" strokeWidth="1.2" />
        {/* Mounting holes */}
        <circle cx="48"  cy="138" r="5" fill="none" stroke="#00f0ff" strokeWidth="1" />
        <circle cx="294" cy="138" r="5" fill="none" stroke="#00f0ff" strokeWidth="1" />
        <circle cx="48"  cy="282" r="5" fill="none" stroke="#00f0ff" strokeWidth="1" />
        <circle cx="294" cy="282" r="5" fill="none" stroke="#00f0ff" strokeWidth="1" />
        {/* IC chip center */}
        <rect x="110" y="165" width="100" height="90" rx="4"
          fill="rgba(0,240,255,0.04)" stroke="#00f0ff" strokeWidth="1" />
        <text x="160" y="218" textAnchor="middle" fontSize="9" fill="#00f0ff" fontFamily="monospace" opacity="0.7">ECU-SIM43</text>
        {/* IC pins left */}
        {[0,1,2,3,4,5].map(i => (
          <line key={`pl${i}`} x1="110" y1={172 + i*13} x2="95" y2={172 + i*13}
            stroke="#00f0ff" strokeWidth="0.8" />
        ))}
        {/* IC pins right */}
        {[0,1,2,3,4,5].map(i => (
          <line key={`pr${i}`} x1="210" y1={172 + i*13} x2="225" y2={172 + i*13}
            stroke="#00f0ff" strokeWidth="0.8" />
        ))}
        {/* Capacitors row */}
        <rect x="60"  y="200" width="20" height="12" rx="2" fill="none" stroke="#39ff14" strokeWidth="0.8" />
        <rect x="60"  y="220" width="20" height="12" rx="2" fill="none" stroke="#39ff14" strokeWidth="0.8" />
        <rect x="255" y="200" width="20" height="12" rx="2" fill="none" stroke="#00f0ff" strokeWidth="0.8" />
        {/* Connector block */}
        <rect x="265" y="155" width="30" height="90" rx="2"
          fill="none" stroke="#39ff14" strokeWidth="0.9" />
        {[0,1,2,3,4,5,6,7].map(i => (
          <line key={`cn${i}`} x1="270" y1={163 + i*11} x2="291" y2={163 + i*11}
            stroke="#39ff14" strokeWidth="0.5" />
        ))}
        {/* Voltage regulator */}
        <rect x="62" y="155" width="24" height="35" rx="2"
          fill="none" stroke="#00f0ff" strokeWidth="0.9" />
        <text x="74" y="178" textAnchor="middle" fontSize="7" fill="#00f0ff" fontFamily="monospace" opacity="0.8">VR</text>
        {/* PCB trace routes */}
        <path d="M86 172 L110 172" fill="none" stroke="#00f0ff" strokeWidth="0.8" />
        <path d="M86 185 L95 185 L95 178 L110 178" fill="none" stroke="#00f0ff" strokeWidth="0.8" />
        <path d="M225 185 L255 185 L255 206 L265 206" fill="none" stroke="#39ff14" strokeWidth="0.8" />
        <path d="M225 172 L240 172 L240 163 L265 163" fill="none" stroke="#39ff14" strokeWidth="0.7" />
        <path d="M160 255 L160 280 L80 280" fill="none" stroke="#00f0ff" strokeWidth="0.8" />
        <path d="M160 255 L160 280 L240 280 L240 265 L265 265" fill="none" stroke="#00f0ff" strokeWidth="0.7" />
      </g>

      {/* ── LAYER 3: Right ECU board block ── */}
      <g opacity="0.18" filter="url(#glow-green)" transform="translate(1130, 480)">
        <rect x="0" y="0" width="260" height="170" rx="6"
          fill="none" stroke="#39ff14" strokeWidth="1.2" />
        <circle cx="16"  cy="16"  r="4.5" fill="none" stroke="#39ff14" strokeWidth="0.9" />
        <circle cx="244" cy="16"  r="4.5" fill="none" stroke="#39ff14" strokeWidth="0.9" />
        <circle cx="16"  cy="154" r="4.5" fill="none" stroke="#39ff14" strokeWidth="0.9" />
        <circle cx="244" cy="154" r="4.5" fill="none" stroke="#39ff14" strokeWidth="0.9" />
        <rect x="80" y="40" width="100" height="80" rx="4"
          fill="rgba(57,255,20,0.03)" stroke="#39ff14" strokeWidth="0.9" />
        <text x="130" y="84" textAnchor="middle" fontSize="8" fill="#39ff14" fontFamily="monospace" opacity="0.7">BOSCH-MS6</text>
        {[0,1,2,3,4].map(i => (
          <line key={`rpl${i}`} x1="80" y1={48 + i*14} x2="65" y2={48 + i*14}
            stroke="#39ff14" strokeWidth="0.7" />
        ))}
        {[0,1,2,3,4].map(i => (
          <line key={`rpr${i}`} x1="180" y1={48 + i*14} x2="195" y2={48 + i*14}
            stroke="#39ff14" strokeWidth="0.7" />
        ))}
        <rect x="10" y="55" width="40" height="55" rx="2"
          fill="none" stroke="#00f0ff" strokeWidth="0.8" />
        {[0,1,2,3,4,5,6].map(i => (
          <line key={`rc${i}`} x1="14" y1={63 + i*8} x2="46" y2={63 + i*8}
            stroke="#00f0ff" strokeWidth="0.4" />
        ))}
      </g>

      {/* ── LAYER 4: Supercar chassis outline (left side, ghosted) ── */}
      <g opacity="0.13" filter="url(#glow-cyan)">
        {/* Car side silhouette — stylized supercar profile */}
        <path
          d="M -20 680
             L 80  680
             L 160 640
             L 220 590
             L 300 558
             L 420 540
             L 560 535
             L 680 540
             L 760 558
             L 820 590
             L 870 630
             L 920 655
             L 1000 668
             L 1100 672
             L 1200 668
             L 1260 655
             L 1300 645
             L 1340 655
             L 1380 668
             L 1460 672"
          fill="none" stroke="url(#chassis-grad)" strokeWidth="1.5" />
        {/* Roof arc */}
        <path
          d="M 380 540 Q 560 480 720 538"
          fill="none" stroke="#00f0ff" strokeWidth="1.2" opacity="0.5" />
        {/* Windshield line */}
        <path d="M 380 540 L 300 558" fill="none" stroke="#00f0ff" strokeWidth="1" opacity="0.4" />
        <path d="M 720 538 L 820 590" fill="none" stroke="#00f0ff" strokeWidth="1" opacity="0.4" />
        {/* Front/rear wheel arches */}
        <path d="M 160 640 Q 220 620 260 640 Q 300 660 330 680"
          fill="none" stroke="#00f0ff" strokeWidth="1.2" opacity="0.5" />
        <path d="M 960 650 Q 1020 628 1060 648 Q 1100 668 1120 680"
          fill="none" stroke="#00f0ff" strokeWidth="1.2" opacity="0.5" />
        {/* Wheel circles */}
        <circle cx="240" cy="700" r="42" fill="none" stroke="#00f0ff" strokeWidth="1" opacity="0.6" />
        <circle cx="240" cy="700" r="26" fill="none" stroke="#39ff14" strokeWidth="0.7" opacity="0.4" />
        <circle cx="240" cy="700" r="8"  fill="rgba(0,240,255,0.15)" />
        <circle cx="1040" cy="700" r="42" fill="none" stroke="#00f0ff" strokeWidth="1" opacity="0.6" />
        <circle cx="1040" cy="700" r="26" fill="none" stroke="#39ff14" strokeWidth="0.7" opacity="0.4" />
        <circle cx="1040" cy="700" r="8"  fill="rgba(0,240,255,0.15)" />
        {/* Undercarriage line */}
        <path d="M 130 720 L 1340 720" fill="none" stroke="rgba(0,240,255,0.2)" strokeWidth="0.8" />
        {/* Spoiler */}
        <path d="M 1240 570 L 1320 555 L 1340 560 L 1260 578 Z"
          fill="none" stroke="#39ff14" strokeWidth="0.9" opacity="0.5" />
        {/* Air intake duct marks */}
        <path d="M 320 560 L 360 555 L 360 568 L 320 572 Z"
          fill="none" stroke="#00f0ff" strokeWidth="0.7" opacity="0.5" />
        {/* Side skirt line */}
        <path d="M 330 680 L 960 680" fill="none" stroke="rgba(0,240,255,0.3)" strokeWidth="0.9" />
        {/* Door panel lines */}
        <path d="M 440 545 L 430 672" fill="none" stroke="rgba(0,240,255,0.2)" strokeWidth="0.7" />
        <path d="M 680 540 L 680 672" fill="none" stroke="rgba(0,240,255,0.2)" strokeWidth="0.7" />
      </g>

      {/* ── LAYER 5: Top-right chassis architectural lines ── */}
      <g opacity="0.10">
        {/* Abstract performance car top-down view fragments */}
        <path d="M 900 20 L 1100 20 L 1200 80 L 1200 200 L 1100 260 L 900 260 L 800 200 L 800 80 Z"
          fill="none" stroke="#39ff14" strokeWidth="1" />
        <path d="M 920 50 L 1080 50 L 1160 100 L 1160 180 L 1080 230 L 920 230 L 840 180 L 840 100 Z"
          fill="none" stroke="#00f0ff" strokeWidth="0.7" />
        {/* Engine bay schematic */}
        <rect x="920" y="90" width="240" height="140" rx="4"
          fill="none" stroke="#00f0ff" strokeWidth="0.8" />
        <text x="1040" y="168" textAnchor="middle" fontSize="8" fill="#00f0ff" fontFamily="monospace" opacity="0.6">ENGINE_BAY</text>
        {/* Intake runners */}
        {[0,1,2,3].map(i => (
          <rect key={`ir${i}`} x={930 + i*52} y="105" width="38" height="60" rx="3"
            fill="none" stroke="#39ff14" strokeWidth="0.6" opacity="0.7" />
        ))}
        {/* CAN bus lines radiating from center */}
        <path d="M 1040 160 L 980 260 L 940 320"  fill="none" stroke="#00f0ff" strokeWidth="0.7" opacity="0.5" />
        <path d="M 1040 160 L 1100 260 L 1140 340" fill="none" stroke="#39ff14" strokeWidth="0.7" opacity="0.5" />
        <path d="M 800 140 L 700 180 L 600 200"   fill="none" stroke="#00f0ff" strokeWidth="0.7" opacity="0.4" />
      </g>

      {/* ── LAYER 6: Animated trace routes ── */}
      <g filter="url(#glow-cyan)">
        {/* Horizontal main bus trace */}
        <path className="hero-trace"
          d="M 0 350 L 200 350 L 240 320 L 400 320 L 440 350 L 700 350 L 740 380 L 1000 380 L 1040 350 L 1200 350 L 1440 350"
          fill="none" stroke="#00f0ff" strokeWidth="1.2" opacity="0" />
        {/* Diagonal power trace */}
        <path className="hero-trace-slow"
          d="M 0 550 L 150 550 L 200 500 L 400 500 L 480 450 L 700 450 L 780 500 L 900 500 L 950 550 L 1440 550"
          fill="none" stroke="#39ff14" strokeWidth="1" opacity="0" style={{ animationDelay: '1.5s' }} />
        {/* CAN bus diagonal */}
        <path className="hero-trace"
          d="M 200 120 L 200 300 L 280 380 L 280 580 L 360 660"
          fill="none" stroke="#00f0ff" strokeWidth="0.9" opacity="0" style={{ animationDelay: '2.2s' }} />
        {/* Right board escape trace */}
        <path className="hero-trace-slow"
          d="M 1130 480 L 1080 450 L 1020 450 L 980 420 L 900 420 L 860 450"
          fill="none" stroke="#39ff14" strokeWidth="0.9" opacity="0" style={{ animationDelay: '0.8s' }} />
      </g>

      {/* ── LAYER 7: Junction nodes (glowing dots) ── */}
      <g filter="url(#glow-strong)">
        <circle className="hero-node" cx="240"  cy="320" r="3" fill="#00f0ff" style={{ animationDelay: '0s' }} />
        <circle className="hero-node" cx="440"  cy="350" r="3" fill="#39ff14" style={{ animationDelay: '0.4s' }} />
        <circle className="hero-node" cx="740"  cy="380" r="3" fill="#00f0ff" style={{ animationDelay: '0.8s' }} />
        <circle className="hero-node" cx="1040" cy="350" r="3" fill="#39ff14" style={{ animationDelay: '1.2s' }} />
        <circle className="hero-node" cx="280"  cy="380" r="3" fill="#00f0ff" style={{ animationDelay: '1.6s' }} />
        <circle className="hero-node" cx="480"  cy="450" r="3" fill="#39ff14" style={{ animationDelay: '2.0s' }} />
        <circle className="hero-node" cx="780"  cy="500" r="3" fill="#00f0ff" style={{ animationDelay: '0.3s' }} />
        <circle className="hero-node" cx="980"  cy="420" r="3" fill="#39ff14" style={{ animationDelay: '1.8s' }} />
        <circle className="hero-node" cx="1080" cy="450" r="3" fill="#00f0ff" style={{ animationDelay: '2.5s' }} />
        <circle className="hero-node" cx="200"  cy="550" r="2.5" fill="#39ff14" style={{ animationDelay: '0.6s' }} />
        <circle className="hero-node" cx="950"  cy="550" r="2.5" fill="#00f0ff" style={{ animationDelay: '1.1s' }} />
      </g>

      {/* ── LAYER 8: Telemetry readout labels (corner dressing) ── */}
      <g opacity="0.18" fontFamily="monospace" fontSize="8" fill="#00f0ff">
        <text x="40"  y="80">SYS.BOOT  [ OK ]</text>
        <text x="40"  y="95">ECU.LINK  [ 128kbps ]</text>
        <text x="40"  y="110">CAN.BUS   [ ACTIVE ]</text>
        <text x="40"  y="125">V_SUPPLY  [ 12.6V ]</text>
      </g>
      <g opacity="0.15" fontFamily="monospace" fontSize="8" fill="#39ff14" textAnchor="end">
        <text x="1400" y="80">THROTTLE  [ 0% ]</text>
        <text x="1400" y="95">BOOST.PSI [ 0.0 ]</text>
        <text x="1400" y="110">RPM       [ 0000 ]</text>
        <text x="1400" y="125">LAMBDA    [ 1.00 ]</text>
      </g>
      <g opacity="0.14" fontFamily="monospace" fontSize="8" fill="#00f0ff">
        <text x="40"  y="840">BDM.PORT  [ READY ]</text>
        <text x="40"  y="855">JTAG.CLK  [ 4MHz  ]</text>
        <text x="40"  y="870">FLASH.VER [ 3.1.4 ]</text>
      </g>
      <g opacity="0.12" fontFamily="monospace" fontSize="8" fill="#39ff14" textAnchor="end">
        <text x="1400" y="840">KNOCK.SNS [ NORM ]</text>
        <text x="1400" y="855">O2.SENSOR [ 0.45V ]</text>
        <text x="1400" y="870">IAT.TEMP  [ 24°C ]</text>
      </g>

      {/* ── LAYER 9: Corner bracket dressing ── */}
      <g stroke="#00f0ff" strokeWidth="1.2" fill="none" opacity="0.25">
        {/* Top-left bracket */}
        <path d="M 20 20 L 20 60 M 20 20 L 60 20" />
        {/* Top-right bracket */}
        <path d="M 1420 20 L 1420 60 M 1420 20 L 1380 20" />
        {/* Bottom-left bracket */}
        <path d="M 20 880 L 20 840 M 20 880 L 60 880" />
        {/* Bottom-right bracket */}
        <path d="M 1420 880 L 1420 840 M 1420 880 L 1380 880" />
      </g>

      {/* ── LAYER 10: Center-zone ambient darkening so text stays legible ── */}
      <radialGradient id="center-mask" cx="50%" cy="45%" r="40%">
        <stop offset="0%"   stopColor="#0d0e12" stopOpacity="0.55" />
        <stop offset="100%" stopColor="#0d0e12" stopOpacity="0" />
      </radialGradient>
      <rect width="1440" height="900" fill="url(#center-mask)" />
    </svg>
  )
}

/* ============================================================ */
export default function Home() {
  useReveal()
  return (
    <>
      {/* HERO */}
      <section className="hero-grid-bg min-h-screen flex items-center justify-center text-center px-6 lg:px-12 pt-28 pb-20">
        {/* Layered cybernetic schematic background */}
        <CyberneticBackground />
        {/* Horizontal scan-line sweep */}
        <div className="hero-scan-line" aria-hidden="true" />
        <div className="max-w-5xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-brand-cyan/30 bg-brand-cyan/5 text-brand-cyan text-xs font-semibold mb-10 animate-fade-in-up">
            <span className="w-2 h-2 rounded-full bg-brand-green animate-pulse-green inline-block" />
            مرکز تخصصی ایسیو — خدمات حرفه‌ای
          </div>
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-extrabold leading-loose tracking-wide mb-8 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
            <span className="text-white">مرکز فوق‌تخصصی مهندسی و</span><br />
            <span className="text-glow-cyan text-brand-cyan">تعمیرات الکترونیک خودرو</span>
            <span className="text-brand-muted text-2xl md:text-3xl font-semibold block mt-3">(ECU)</span>
          </h1>
          <p className="text-brand-muted text-base md:text-lg leading-relaxed max-w-2xl mx-auto mt-8 mb-12 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            عیب‌یابی سخت‌افزاری، ریمپ پیشرفته و کالیبراسیون نرم‌افزاری شبکه‌های مالتی‌پلکس
            <strong className="text-white font-semibold"> با استانداردهای کارخانه‌ای.</strong>
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-12 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
            <Link to="/contact" className="btn-neon-green animate-pulse-green px-8 py-4 text-base font-bold rounded-xl w-full sm:w-auto gap-2">
              <i className="fa-solid fa-bolt ml-2" />دریافت نوبت سریع
            </Link>
            <Link to="/hardware-repair" className="btn-outline-cyan px-8 py-4 text-base font-semibold rounded-xl w-full sm:w-auto gap-2">
              <i className="fa-solid fa-circle-nodes ml-2" />مشاهده خدمات
            </Link>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-6 mt-16 text-xs text-brand-muted animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
            {['تجهیزات اسکوپ و OSC', 'پروگرامر تخصصی BDM/JTAG', 'گواهی ISO 9001'].map((t, i) => (
              <span key={i} className="flex items-center gap-2">
                <i className="fa-solid fa-check-circle text-brand-green text-sm" />{t}
                {i < 2 && <span className="w-px h-4 bg-brand-muted/30 mr-2" />}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <section className="py-16 md:py-24 px-6 lg:px-12">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 reveal">
            <p className="text-brand-cyan text-sm font-semibold uppercase tracking-widest mb-4">
              <i className="fa-solid fa-gear ml-2" />خدمات تخصصی
            </p>
            <h2 className="section-title text-3xl md:text-4xl font-extrabold text-white inline-block">راه‌حل‌های مهندسی جامع</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {services.map((s, i) => (
              <div key={i} className="glass-card p-6 md:p-8 reveal" style={{ animationDelay: `${i * 0.1}s` }}>
                {s.badge && (
                  <div className="absolute top-4 left-4">
                    <span className="bg-brand-green text-black text-xs font-bold px-3 py-1 rounded-full">{s.badge}</span>
                  </div>
                )}
                <div className={`service-icon-circle mb-7${s.color === 'green' ? ' !bg-brand-green/8 !border-brand-green/30' : ''}`}>
                  <i className={`fa-solid ${s.icon} text-2xl ${s.color === 'green' ? 'text-brand-green' : 'text-brand-cyan'}`} />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">{s.title}</h3>
                <p className={`text-xs font-semibold uppercase tracking-widest mb-6 ${s.color === 'green' ? 'text-brand-green' : 'text-brand-cyan'}`}>{s.sub}</p>
                <ul className="space-y-3 mb-8">
                  {s.items.map((item, j) => (
                    <li key={j} className="flex items-start gap-3 text-brand-muted text-sm leading-relaxed">
                      <i className={`fa-solid fa-circle-dot text-xs flex-shrink-0 mt-1 ${s.color === 'green' ? 'text-brand-cyan' : 'text-brand-green'}`} />
                      {item}
                    </li>
                  ))}
                </ul>
                <Link to={s.link} className={`text-sm font-semibold transition-colors duration-300 flex items-center gap-2 group ${s.color === 'green' ? 'text-brand-green hover:text-brand-cyan' : 'text-brand-cyan hover:text-brand-green'}`}>
                  مشاهده جزئیات خدمات
                  <i className="fa-solid fa-arrow-left group-hover:-translate-x-1 transition-transform duration-300" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="py-16 md:py-20 px-6 lg:px-12">
        <div className="max-w-7xl mx-auto">
          <div className="glass-card rounded-2xl overflow-hidden reveal" style={{ background: 'rgba(0,240,255,0.03)', borderColor: 'rgba(0,240,255,0.1)' }}>
            <div className="grid grid-cols-1 md:grid-cols-3">
              <div className="stat-block">
                <StatCounter target={40} prefix="+" suffix=" مدل" />
                <p className="text-white font-semibold mt-3 mb-2">ایسیوهای پشتیبانی سخت‌افزاری</p>
                <p className="text-brand-muted text-xs leading-relaxed">پوشش کامل برندهای سیمنس، بوش، دلفی، کنتیننتال و والئو</p>
              </div>
              <div className="stat-block">
                <StatCounter target={1200} prefix="+" suffix=" نوبت" />
                <p className="text-white font-semibold mt-3 mb-2">موفق پذیرش و تحویل فوری</p>
                <p className="text-brand-muted text-xs leading-relaxed">میانگین زمان تحویل ۲۴ تا ۴۸ ساعت کاری</p>
              </div>
              <div className="stat-block">
                <StatCounter target={100} suffix="٪" />
                <p className="text-white font-semibold mt-3 mb-2">عیب‌یابی دقیق با تجهیزات به‌روز</p>
                <p className="text-brand-muted text-xs leading-relaxed">اسیلوسکوپ دیجیتال، پروگرامر BDM/JTAG و نرم‌افزار OBD2</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ARTICLES */}
      <section className="py-16 md:py-24 px-6 lg:px-12">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-14 reveal">
            <div>
              <p className="text-brand-cyan text-sm font-semibold uppercase tracking-widest mb-4">
                <i className="fa-solid fa-book-open ml-2" />دانشنامه تخصصی — آموزش و مقالات
              </p>
              <h2 className="section-title text-3xl md:text-4xl font-extrabold text-white inline-block">آخرین مقالات فنی</h2>
            </div>
            <Link to="/wiki" className="btn-outline-cyan px-5 py-2.5 text-sm mt-8 md:mt-0">
              مشاهده همه مقالات <i className="fa-solid fa-arrow-left mr-2" />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {articles.map((a, i) => (
              <div key={i} className="glass-card reveal" style={{ animationDelay: `${i * 0.1}s` }}>
                <div className="article-card-img" style={{ height: 190 }}>
                  <div className="relative z-10 flex flex-col items-center gap-3">
                    <i className={`fa-solid ${a.icon} text-4xl`} style={{ color: a.glowColor, textShadow: `0 0 15px ${a.glowColor}` }} />
                    <span className="text-xs font-mono" style={{ color: `${a.glowColor}40` }}>{a.mono}</span>
                  </div>
                </div>
                <div className="p-6 md:p-7">
                  <span className={`text-xs font-semibold uppercase tracking-widest ${a.catColor === 'green' ? 'text-brand-green' : 'text-brand-cyan'}`}>{a.cat}</span>
                  <h3 className="text-white font-bold text-base mt-3 mb-3 leading-snug">{a.title}</h3>
                  <p className="text-brand-muted text-sm leading-relaxed mb-6">{a.desc}</p>
                  <Link to="/wiki" className="flex items-center gap-2 text-brand-cyan text-sm font-semibold hover:text-brand-green transition-colors duration-300 group">
                    <i className="fa-solid fa-file-arrow-down text-base" />
                    مطالعه مقاله و دانلود فایل
                    <i className="fa-solid fa-arrow-left group-hover:-translate-x-1 transition-transform duration-300 mr-auto" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* BOOKING FORM */}
      <section className="py-16 md:py-24 px-6 lg:px-12">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-12 reveal">
            <p className="text-brand-cyan text-sm font-semibold uppercase tracking-widest mb-4">
              <i className="fa-solid fa-calendar-plus ml-2" />نوبت‌دهی آنلاین
            </p>
            <h2 className="section-title text-3xl md:text-4xl font-extrabold text-white inline-block">ثبت درخواست سریع</h2>
            <p className="text-brand-muted mt-6 text-sm leading-relaxed">فرم را تکمیل کنید، کارشناسان ما در کمتر از ۲ ساعت با شما تماس می‌گیرند.</p>
          </div>
          <div className="glass-card p-6 md:p-10 reveal" style={{ borderColor: 'rgba(57,255,20,0.15)' }}>
            <BookingForm />
          </div>
        </div>
      </section>
    </>
  )
}
