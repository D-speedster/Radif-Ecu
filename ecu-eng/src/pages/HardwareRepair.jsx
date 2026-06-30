import { useState } from 'react'
import { Link } from 'react-router-dom'
import useReveal from '../hooks/useReveal'

/* ---------- Accordion data ---------- */
const faults = [
  {
    iconBg: 'bg-red-500/10 border-red-500/20', iconClass: 'fa-circle-exclamation text-red-400',
    title: 'خطای دائم سنسور اکسیژن روی برد (Permanent O2 Sensor Fault)',
    diagnosis: 'با اسیلوسکوپ، سیگنال Lambda روی پایه‌های IC پردازنده را بررسی می‌کنیم. در اغلب موارد مقاومت‌های SMD سری ۴۷Ω یا ۱۰۰Ω مسیر ورودی سوخته‌اند و پایه‌های MCU شورت به زمین دارند.',
    parts: ['مقاومت SMD 0402 — 47Ω / 100Ω', 'خازن فیلتر 100nF / X7R', 'در صورت نیاز: IC مرتبط با ADC پردازنده'],
    time: '۱ تا ۳ ساعت کاری — نرخ موفقیت ۹۸٪',
  },
  {
    iconBg: 'bg-yellow-500/10 border-yellow-500/20', iconClass: 'fa-bolt text-yellow-400',
    title: 'قطع شدن منفی دائم والئو (Valeo Permanent Ground Loss)',
    diagnosis: 'با میلی‌اهم‌متر دقیق، مقاومت مسیرهای GND داخلی برد بررسی می‌شود. در ایسیوهای والئو J34P و J34U معمولاً موسفت کلید GND (MOSFET Q7 یا Q12) به دلیل اتصال کوتاه خارجی سوخته است.',
    parts: ['MOSFET: IRF7304 / SI4420DY', 'دیود Schottky محافظ: B0540W', 'فیوز داخلی SMD 2A'],
    time: '۲ تا ۴ ساعت — نیاز به تست بار کامل پس از تعمیر',
  },
  {
    iconBg: 'bg-orange-500/10 border-orange-500/20', iconClass: 'fa-fire text-orange-400',
    title: 'سوختن آی‌سی رگولاتور ولتاژ (Voltage Regulator IC Failure)',
    diagnosis: 'دوربین حرارتی هات‌اسپات‌های روی برد را شناسایی می‌کند. رگولاتور معیوب گرم می‌شود و ولتاژ خروجی ۵ ولت یا ۳.۳ ولت از رنج خارج است.',
    parts: ['LDO Reg: L78L05 / LM2940CT-5', 'LDO 3.3V: MIC5219 / LP2985', 'خازن تنظیم: 10µF Tantalum'],
    time: '۱ ساعت — ضروری است پس از تعویض، ریپروگرم نیز انجام شود',
  },
  {
    iconBg: 'bg-purple-500/10 border-purple-500/20', iconClass: 'fa-plug-circle-xmark text-purple-400',
    title: 'عدم ارتباط با دیاگ — No Communication with Diagnostic Tool',
    diagnosis: 'ابتدا سیگنال CAN-H و CAN-L با اسیلوسکوپ بررسی می‌شود. IC ترانسیور CAN (TJA1040/1050) یا مقاومت ۱۲۰Ω ترمینیشن بررسی می‌شود. در ایسیوهای K-Line فقط، IC درایور K-Line (L9637D) معمول‌ترین عامل خرابی است.',
    parts: ['CAN Transceiver: TJA1040T / TJA1050T', 'K-Line Driver: L9637D / MC33290', 'مقاومت ترمینیشن SMD: 120Ω 1%'],
    time: '۱ تا ۲ ساعت — ارتباط با دستگاه پس از تعمیر تست می‌شود',
  },
  {
    iconBg: 'bg-blue-500/10 border-blue-500/20', iconClass: 'fa-memory text-blue-400',
    title: 'خرابی حافظه EEPROM یا Flash — Memory Corruption / CRC Error',
    diagnosis: 'با پروگرامر BDM، محتوای حافظه خوانده می‌شود. آدرس‌های خراب با مقادیر FF یا 00 پر شده‌اند. بازنویسی با فایل اورجینال از آرشیو تخصصی ما انجام می‌شود.',
    parts: ['Flash: MX25L3206E / W25Q32', 'EEPROM: 95160 / 95320 SPI', 'ابزار: BDM Programmer + SOIC8 Clip'],
    time: '۲ تا ۶ ساعت بسته به دسترسی به فایل اورجینال',
  },
]

/* ---------- Process steps ---------- */
const steps = [
  {
    num: '۱', color: 'cyan', icon: 'fa-computer', title: 'تست روی تستر پیشرفته ایسیو',
    sub: 'ECU Tester Simulation',
    body: 'قبل از هر اقدامی، ایسیو را روی تستر تخصصی سوار می‌کنیم. تستر، تمام سیگنال‌های ورودی سنسورها را شبیه‌سازی می‌کند و خروجی‌های ECU را تحت بار واقعی اندازه می‌گیرد.',
    tags: ['ECU Test Bench', 'Breakout Box', 'Load Simulation'],
  },
  {
    num: '۲', color: 'green', icon: 'fa-wave-square', title: 'عیب‌یابی لایه به لایه با اسیلوسکوپ و مولتی‌متر',
    sub: 'Layer-by-Layer Diagnosis',
    body: 'با اسیلوسکوپ دو کاناله ۱۰۰MHz، سیگنال‌های دیجیتال SPI، I²C، CAN و سیگنال‌های آنالوگ سنسورها را بررسی می‌کنیم.',
    tags: ['Oscilloscope 100MHz', 'Thermal Camera', 'ESR Meter'],
  },
  {
    num: '۳', color: 'cyan', icon: 'fa-temperature-high', title: 'تعویض قطعات با هویه هوای گرم و شابلون‌زنی تخصصی',
    sub: 'Hot Air Rework & Stenciling',
    body: 'با استفاده از ایستگاه هویه هوای گرم دیجیتال JBC و شابلون‌های SMD اختصاصی، قطعات معیوب به روش BGA Rework جدا و جایگزین می‌شوند. پیش‌گرم کردن برد تا ۱۵۰ درجه الزامی است.',
    tags: ['JBC Hot Air', 'SMD Stencil', 'Preheater'],
  },
  {
    num: '۴', color: 'green', icon: 'fa-shield-halved', title: 'تست نهایی پایداری حرارتی و جریان‌کشی',
    sub: 'Thermal & Current Stress Test',
    body: 'ایسیوی تعمیرشده ۴۸ ساعت تحت تست بار حرارتی قرار می‌گیرد. جریان‌کشی هر ریل ولتاژ با آمپرمتر دقیق اندازه‌گیری و با مشخصات اورجینال مقایسه می‌شود.',
    tags: ['48h Burn-In Test', 'Live OBD2 Data', 'Current Clamp'],
  },
]

/* ---------- Accordion item ---------- */
function AccordionItem({ fault, isOpen, onToggle }) {
  return (
    <div className={`accordion-item${isOpen ? ' open' : ''}`}>
      <button className="accordion-trigger" onClick={onToggle} aria-expanded={isOpen}>
        <div className="flex items-center gap-3">
          <span className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 border ${fault.iconBg}`}>
            <i className={`fa-solid ${fault.iconClass} text-sm`} />
          </span>
          <span className="text-white font-semibold text-sm md:text-base">{fault.title}</span>
        </div>
        <span className="accordion-icon"><i className="fa-solid fa-plus text-xs" /></span>
      </button>
      <div className={`accordion-body${isOpen ? ' open' : ''}`}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-1">
          <div>
            <h4 className="text-brand-cyan font-semibold text-sm mb-3"><i className="fa-solid fa-magnifying-glass ml-2" />روش تشخیص</h4>
            <p className="text-brand-muted text-sm leading-relaxed">{fault.diagnosis}</p>
          </div>
          <div>
            <h4 className="text-brand-green font-semibold text-sm mb-3"><i className="fa-solid fa-microchip ml-2" />قطعات جایگزین</h4>
            <ul className="space-y-1.5 text-brand-muted text-sm">
              {fault.parts.map(p => (
                <li key={p} className="flex items-center gap-2">
                  <i className="fa-solid fa-circle-dot text-brand-green text-xs" />{p}
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="mt-4 p-3 rounded-lg bg-brand-cyan/5 border border-brand-cyan/10">
          <p className="text-brand-muted text-xs">
            <i className="fa-solid fa-clock text-brand-cyan ml-2" /><strong className="text-white">زمان تعمیر:</strong> {fault.time}
          </p>
        </div>
      </div>
    </div>
  )
}

export default function HardwareRepair() {
  useReveal()
  const [openIdx, setOpenIdx] = useState(null)
  const toggle = i => setOpenIdx(prev => prev === i ? null : i)

  return (
    <>
      {/* HERO */}
      <section className="hero-grid-bg pt-36 pb-24 px-6 lg:px-12">
        <div className="max-w-5xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-brand-cyan/30 bg-brand-cyan/5 text-brand-cyan text-xs font-semibold mb-10 animate-fade-in-up">
            <span className="w-2 h-2 rounded-full bg-brand-cyan animate-pulse-cyan inline-block" />
            Component-Level Repair — تعمیر در سطح کامپوننت
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div>
              <h1 className="text-4xl md:text-5xl font-extrabold leading-tight mb-6 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
                جراحی الکترونیک و<br />
                <span className="text-brand-cyan text-glow-cyan">تعمیرات سخت‌افزاری ایسیو</span>
              </h1>
              <p className="text-brand-muted text-base md:text-lg leading-relaxed mb-8 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                تعمیر در سطح کامپوننت — نه تعویض کل برد. هر آی‌سی، هر رگولاتور، هر مسیر اتصال را
                <strong className="text-white"> با اسیلوسکوپ و هویه هوای گرم اروپایی</strong> ترمیم می‌کنیم.
              </p>
              <div className="flex flex-wrap gap-3 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
                <Link to="/contact" className="btn-neon-green animate-pulse-green px-6 py-3 text-sm font-bold rounded-xl gap-2">
                  <i className="fa-solid fa-wrench ml-2" />ارسال ایسیو جهت عیب‌یابی
                </Link>
                <a href="#process" className="btn-outline-cyan px-6 py-3 text-sm font-semibold rounded-xl gap-2">
                  <i className="fa-solid fa-list-check ml-2" />مراحل تعمیر
                </a>
              </div>
            </div>
            {/* Hero visual */}
            <div className="animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
              <div className="circuit-visual min-h-[320px]">
                <svg className="absolute inset-0 w-full h-full opacity-25" viewBox="0 0 420 320" fill="none">
                  <rect x="60" y="60" width="300" height="200" rx="8" stroke="#00f0ff" strokeWidth="1.5" strokeDasharray="6 4" />
                  <line x1="60"  y1="160" x2="20"  y2="160" stroke="#00f0ff" strokeWidth="1.5" />
                  <line x1="360" y1="160" x2="400" y2="160" stroke="#39ff14" strokeWidth="1.5" />
                  <line x1="210" y1="60"  x2="210" y2="20"  stroke="#00f0ff" strokeWidth="1.5" />
                  <line x1="210" y1="260" x2="210" y2="300" stroke="#39ff14" strokeWidth="1.5" />
                  <rect x="170" y="120" width="80" height="80" rx="6" stroke="#00f0ff" strokeWidth="2" fill="rgba(0,240,255,0.05)" />
                  <text x="210" y="165" textAnchor="middle" fill="#00f0ff" fontSize="11" fontFamily="monospace">ECU</text>
                  <circle cx="60"  cy="160" r="5" fill="#00f0ff" />
                  <circle cx="360" cy="160" r="5" fill="#39ff14" />
                  <circle cx="210" cy="60"  r="5" fill="#00f0ff" />
                  <circle cx="210" cy="260" r="5" fill="#39ff14" />
                  <rect x="20"  y="80"  width="30" height="18" rx="3" stroke="#00f0ff" strokeWidth="1" fill="rgba(0,240,255,0.05)" />
                  <rect x="370" y="80"  width="30" height="18" rx="3" stroke="#39ff14" strokeWidth="1" fill="rgba(57,255,20,0.05)" />
                  <rect x="20"  y="220" width="30" height="18" rx="3" stroke="#39ff14" strokeWidth="1" fill="rgba(57,255,20,0.05)" />
                  <rect x="370" y="220" width="30" height="18" rx="3" stroke="#00f0ff" strokeWidth="1" fill="rgba(0,240,255,0.05)" />
                </svg>
                <div className="relative z-10 flex flex-col items-center gap-3">
                  <i className="fa-solid fa-screwdriver-wrench text-brand-cyan text-5xl animate-float" style={{ textShadow: '0 0 20px #00f0ff' }} />
                  <span className="font-mono text-brand-cyan/50 text-xs tracking-widest">COMPONENT_LEVEL.REPAIR</span>
                  <div className="flex gap-2 flex-wrap justify-center mt-1">
                    {['BGA Rework', 'Hot Air', 'SMD Replace'].map(t => (
                      <span key={t} className="bg-brand-cyan/10 border border-brand-cyan/20 text-brand-cyan text-xs px-2 py-0.5 rounded font-mono">{t}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ACCORDION */}
      <section className="py-16 md:py-24 px-6 lg:px-12">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16 reveal">
            <p className="text-brand-cyan text-sm font-semibold uppercase tracking-widest mb-4">
              <i className="fa-solid fa-triangle-exclamation ml-2" />عیب‌های شایع ایسیو
            </p>
            <h2 className="section-title text-3xl md:text-4xl font-extrabold text-white inline-block">خرابی‌های متداول و روش ترمیم</h2>
            <p className="text-brand-muted mt-6 text-sm leading-relaxed">هر مورد را باز کنید تا روش دقیق تشخیص و قطعات جایگزین را ببینید.</p>
          </div>
          <div className="space-y-4 reveal" style={{ animationDelay: '0.1s' }}>
            {faults.map((f, i) => (
              <AccordionItem key={i} fault={f} isOpen={openIdx === i} onToggle={() => toggle(i)} />
            ))}
          </div>
        </div>
      </section>

      {/* TIMELINE */}
      <section id="process" className="py-16 md:py-24 px-6 lg:px-12" style={{ background: 'rgba(0,240,255,0.015)' }}>
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16 reveal">
            <p className="text-brand-cyan text-sm font-semibold uppercase tracking-widest mb-4">
              <i className="fa-solid fa-diagram-next ml-2" />فرآیند تعمیر
            </p>
            <h2 className="section-title text-3xl md:text-4xl font-extrabold text-white inline-block">گام به گام تا تحویل سالم</h2>
          </div>
          <div>
            {steps.map((s, i) => (
              <div key={i} className="timeline-step reveal" style={{ animationDelay: `${i * 0.1}s` }}>
                <div className="timeline-num">{s.num}</div>
                <div className="glass-card p-6 md:p-8" style={i === 3 ? { borderColor: 'rgba(57,255,20,0.2)' } : {}}>
                  <div className="flex items-start gap-5">
                    <div className={`w-12 h-12 rounded-xl flex-shrink-0 flex items-center justify-center ${s.color === 'cyan' ? 'bg-brand-cyan/10 border border-brand-cyan/20' : 'bg-brand-green/10 border border-brand-green/20'}`}>
                      <i className={`fa-solid ${s.icon} text-xl ${s.color === 'cyan' ? 'text-brand-cyan' : 'text-brand-green'}`} />
                    </div>
                    <div>
                      <h3 className="text-white font-bold text-lg mb-1">{s.title}</h3>
                      <p className={`text-xs font-semibold uppercase tracking-widest mb-3 ${s.color === 'cyan' ? 'text-brand-cyan' : 'text-brand-green'}`}>{s.sub}</p>
                      <p className="text-brand-muted text-sm leading-relaxed">{s.body}</p>
                      <div className="flex flex-wrap gap-2 mt-3">
                        {s.tags.map(t => (
                          <span key={t} className={`text-xs px-2 py-0.5 rounded-lg border font-mono ${s.color === 'cyan' ? 'bg-brand-cyan/10 text-brand-cyan border-brand-cyan/20' : 'bg-brand-green/10 text-brand-green border-brand-green/20'}`}>{t}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 md:py-24 px-6 lg:px-12">
        <div className="max-w-3xl mx-auto reveal">
          <div className="glass-card p-10 md:p-14 text-center relative overflow-hidden" style={{ borderColor: 'rgba(57,255,20,0.2)' }}>
            <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse 60% 40% at 50% 100%, rgba(57,255,20,0.06), transparent)' }} />
            <div className="relative z-10">
              <div className="w-16 h-16 rounded-2xl bg-brand-green/10 border border-brand-green/30 flex items-center justify-center mx-auto mb-6">
                <i className="fa-solid fa-truck-fast text-brand-green text-3xl" style={{ textShadow: '0 0 15px rgba(57,255,20,0.5)' }} />
              </div>
              <h3 className="text-white text-2xl md:text-3xl font-extrabold mb-3">ارسال ایسیو معیوب جهت عیب‌یابی رایگان</h3>
              <p className="text-brand-muted text-sm leading-relaxed mb-8 max-w-lg mx-auto">
                ایسیوی خودروی خود را با پست سفارشی برای ما ارسال کنید. عیب‌یابی اولیه <strong className="text-white">کاملاً رایگان</strong> است.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/contact" className="btn-neon-green animate-pulse-green px-8 py-3.5 text-sm font-bold rounded-xl gap-2">
                  <i className="fa-solid fa-box-open ml-2" />آدرس ارسال و راهنما
                </Link>
                <Link to="/#booking" className="btn-outline-cyan px-8 py-3.5 text-sm font-semibold rounded-xl gap-2">
                  <i className="fa-solid fa-calendar-check ml-2" />نوبت حضوری
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
