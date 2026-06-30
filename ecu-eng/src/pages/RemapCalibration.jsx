import { Link } from 'react-router-dom'
import useReveal from '../hooks/useReveal'

const advantages = [
  {
    icon: 'fa-forward-fast', color: 'green',
    title: 'رفع کپ اولیه و تاخیر پدال گاز', sub: 'E-Gas Delay Fix',
    body: 'گاز الکترونیکی (E-Gas) در بسیاری از خودروهای ایرانی دارای تاخیر عمدی در نقشه throttle است. با ویرایش جدول Pedal Map و حذف محدودیت اولیه، پاسخ‌دهی پدال بلافاصله و خطی می‌شود.',
    checks: ['حذف Throttle Lag در دور پایین موتور', 'بازنویسی جدول Pedal-to-Throttle Map', 'سازگار با ایسیوهای Siemens، Bosch ME17'],
    pct: '92', pctLabel: '۹۲٪ بهبود',
  },
  {
    icon: 'fa-temperature-arrow-down', color: 'cyan',
    title: 'کاهش دمای روشن شدن فن', sub: 'Fan Activation Threshold',
    body: 'دمای پیش‌فرض روشن شدن فن در اکثر ایسیوهای ایرانی ۹۵ تا ۱۰۰ درجه است. با کاهش این آستانه به ۸۵ تا ۸۸ درجه، واشر سرسیلندر در شرایط ترافیکی تابستان محافظت می‌شود.',
    checks: ['کاهش دمای کارکرد ۱۰ تا ۱۵ درجه', 'محافظت از واشر سرسیلندر', 'ویرایش Fan On/Off Map در حافظه ECU'],
    pct: '88', pctLabel: '۸۸٪ بهبود',
  },
  {
    icon: 'fa-sliders', color: 'green',
    title: 'حذف سنسور اکسیژن دوم و میل‌سوپاپ', sub: 'De-Cat / Euro 2 Calibration',
    body: 'در خودروهایی که کاتالیست آن‌ها تعویض یا حذف شده، سنسور اکسیژن دوم (Downstream O2) خطای دائمی ایجاد می‌کند. حذف نرم‌افزاری این سنسور و تنظیم نسبت سوخت روی Loop Open، چراغ خطا را برای همیشه خاموش می‌کند.',
    checks: ['حذف O2 Sensor Downstream از حلقه بسته', 'غیرفعال‌سازی میل‌سوپاپ متغیر (VVT) در صورت خرابی', 'بدون خطای DTC پس از تعمیر'],
    pct: '100', pctLabel: '۱۰۰٪ موفق',
  },
  {
    icon: 'fa-explosion', color: 'cyan',
    title: 'افزایش کات‌آف و رگباری', sub: 'Hard Cut-off / Pop & Bang',
    body: 'برای کاربرد نیمه‌اسپورت، محدودیت RPM Cut-off افزایش و نقشه احتراق در دور بالا بهینه می‌شود. افکت Pop & Bang با تنظیم ایگنیشن ریتارد در حین overrun اعمال می‌شود — فقط روی خودروهای مجاز.',
    checks: ['افزایش Rev Limiter تا ۳۰۰ RPM بالاتر', 'Overrun Ignition Retard برای Pop & Bang', 'بدون آسیب به موتور با تنظیم صحیح'],
    pct: '85', pctLabel: '۸۵٪ رضایت',
  },
]

const brands = [
  { icon: 'fa-gear',         iconColor: 'text-brand-cyan',  name: 'Bosch',   models: 'ME7.4 / ME17\nEDC15 / EDC17', count: '۱۲ مدل' },
  { icon: 'fa-microchip',    iconColor: 'text-brand-green', name: 'Valeo',   models: 'J34P / J34U\nVD46 / VD56',   count: '۸ مدل' },
  { icon: 'fa-network-wired',iconColor: 'text-brand-cyan',  name: 'Siemens', models: 'MS43 / S110\nSID201 / VDO',  count: '۷ مدل' },
  { icon: 'fa-cpu',          iconColor: 'text-brand-green', name: 'Sagem',   models: 'S2000 / 3000\n7000 / SL96',  count: '۶ مدل' },
  { icon: 'fa-bolt',         iconColor: 'text-brand-cyan',  name: 'Delco',   models: 'MULTEC / E39\nGM Family II', count: '۴ مدل' },
  { icon: 'fa-circle-nodes', iconColor: 'text-brand-green', name: 'Marelli', models: 'IAW 4AF / 5NF\nIAW 59F',     count: '۵ مدل' },
]

export default function RemapCalibration() {
  useReveal()
  return (
    <>
      {/* HERO */}
      <section className="hero-grid-bg pt-36 pb-24 px-6 lg:px-12">
        <div className="max-w-5xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-brand-green/30 bg-brand-green/5 text-brand-green text-xs font-semibold mb-10 animate-fade-in-up">
            <span className="w-2 h-2 rounded-full bg-brand-green animate-pulse-green inline-block" />
            Performance Calibration — کالیبراسیون تخصصی با ابزار اروپایی
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div>
              <h1 className="text-4xl md:text-5xl font-extrabold leading-tight mb-6 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
                ریمپ تخصصی، اپتیمایز<br />
                <span className="text-brand-green text-glow-green">جدول سوخت و راندمان موتور</span>
              </h1>
              <p className="text-brand-muted text-base md:text-lg leading-relaxed mb-8 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                بهینه‌سازی نقشه‌های اصلی ECU — نه فایل دانلودی. هر خودرو
                <strong className="text-white"> جداگانه روی تستر کالیبره می‌شود</strong> تا پایداری و ایمنی تضمین شود.
              </p>
              <div className="grid grid-cols-2 gap-3 mb-8 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
                {[
                  { icon: 'fa-arrow-trend-up', color: 'green', label: 'افزایش قدرت موتور' },
                  { icon: 'fa-droplet',        color: 'cyan',  label: 'بهینه‌سازی مصرف سوخت' },
                  { icon: 'fa-gauge',          color: 'green', label: 'رفع کپ و تاخیر گاز' },
                  { icon: 'fa-thermometer-half', color: 'cyan', label: 'کنترل دمای فن' },
                ].map((v, i) => (
                  <div key={i} className={`flex items-center gap-2 p-3 rounded-xl ${v.color === 'green' ? 'bg-brand-green/5 border border-brand-green/15' : 'bg-brand-cyan/5 border border-brand-cyan/15'}`}>
                    <i className={`fa-solid ${v.icon} ${v.color === 'green' ? 'text-brand-green' : 'text-brand-cyan'} flex-shrink-0`} />
                    <span className="text-white text-xs font-semibold">{v.label}</span>
                  </div>
                ))}
              </div>
              <div className="flex flex-wrap gap-3 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
                <Link to="/contact" className="btn-neon-green animate-pulse-green px-6 py-3 text-sm font-bold rounded-xl gap-2">
                  <i className="fa-solid fa-bolt ml-2" />درخواست ریمپ
                </Link>
                <a href="#brands" className="btn-outline-cyan px-6 py-3 text-sm font-semibold rounded-xl gap-2">
                  <i className="fa-solid fa-microchip ml-2" />ایسیوهای پشتیبانی‌شده
                </a>
              </div>
            </div>
            {/* Fuel map visual */}
            <div className="animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
              <div className="circuit-visual min-h-[320px]">
                <svg className="absolute inset-0 w-full h-full opacity-20" viewBox="0 0 420 320" fill="none">
                  {[60,120,180,240,300,360].map((x,i) => <line key={`vl${i}`} x1={x} y1="60" x2={x} y2="260" stroke="#39ff14" strokeWidth={i===0||i===5?1:0.5} opacity={i===0||i===5?1:0.4}/>)}
                  {[60,110,160,210,260].map((y,i) => <line key={`hl${i}`} x1="60" y1={y} x2="360" y2={y} stroke="#39ff14" strokeWidth={i===0||i===4?1:0.5} opacity={i===0||i===4?1:0.4}/>)}
                  <path d="M 60 240 Q 120 180 180 130 Q 240 90 300 75 Q 330 68 360 65" stroke="#00f0ff" strokeWidth="2.5" fill="none"/>
                  <path d="M 60 250 Q 120 200 180 155 Q 240 115 300 95 Q 330 85 360 80" stroke="#39ff14" strokeWidth="1.5" fill="none" strokeDasharray="5 3"/>
                  <circle cx="180" cy="130" r="4" fill="#00f0ff"/>
                  <circle cx="240" cy="100" r="4" fill="#00f0ff"/>
                  <circle cx="300" cy="75"  r="4" fill="#39ff14"/>
                </svg>
                <div className="relative z-10 flex flex-col items-center gap-3">
                  <i className="fa-solid fa-gauge-high text-brand-green text-5xl animate-float" style={{ textShadow: '0 0 20px rgba(57,255,20,0.5)' }} />
                  <span className="font-mono text-brand-green/50 text-xs tracking-widest">FUEL_MAP.CALIBRATION</span>
                  <div className="flex gap-2 flex-wrap justify-center mt-1">
                    {['WinOLS', 'K-TAG v2', 'ECM Titanium'].map(t => (
                      <span key={t} className="bg-brand-green/10 border border-brand-green/20 text-brand-green text-xs px-2 py-0.5 rounded font-mono">{t}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ADVANTAGES */}
      <section className="py-16 md:py-24 px-6 lg:px-12">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 reveal">
            <p className="text-brand-green text-sm font-semibold uppercase tracking-widest mb-4">
              <i className="fa-solid fa-star ml-2" />مزایای ریمپ تخصصی
            </p>
            <h2 className="section-title text-3xl md:text-4xl font-extrabold text-white inline-block">چه تفاوتی در خودرو احساس می‌کنید؟</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-8">
            {advantages.map((a, i) => (
              <div key={i} className="advantage-card reveal" style={{ animationDelay: `${i * 0.1}s` }}>
                <div className="flex items-center gap-4 mb-6">
                  <div className={`w-12 h-12 rounded-xl flex-shrink-0 flex items-center justify-center ${a.color === 'green' ? 'bg-brand-green/10 border border-brand-green/25' : 'bg-brand-cyan/10 border border-brand-cyan/25'}`}>
                    <i className={`fa-solid ${a.icon} text-2xl ${a.color === 'green' ? 'text-brand-green' : 'text-brand-cyan'}`} />
                  </div>
                  <div>
                    <h3 className="text-white font-bold text-lg">{a.title}</h3>
                    <p className={`text-xs font-semibold uppercase tracking-widest ${a.color === 'green' ? 'text-brand-green' : 'text-brand-cyan'}`}>{a.sub}</p>
                  </div>
                </div>
                <p className="text-brand-muted text-sm leading-relaxed mb-5">{a.body}</p>
                <ul className="space-y-2">
                  {a.checks.map(c => (
                    <li key={c} className="flex items-start gap-2 text-brand-muted text-sm">
                      <i className={`fa-solid fa-check text-xs mt-0.5 flex-shrink-0 ${a.color === 'green' ? 'text-brand-green' : 'text-brand-cyan'}`} />{c}
                    </li>
                  ))}
                </ul>
                <div className="mt-5 flex items-center gap-3">
                  <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ background: 'rgba(122,132,153,0.15)' }}>
                    <div className="h-full rounded-full" style={{ width: `${a.pct}%`, background: a.color === 'green' ? '#39ff14' : '#00f0ff', boxShadow: a.color === 'green' ? '0 0 8px rgba(57,255,20,0.5)' : '0 0 8px rgba(0,240,255,0.5)' }} />
                  </div>
                  <span className={`text-xs font-bold flex-shrink-0 ${a.color === 'green' ? 'text-brand-green' : 'text-brand-cyan'}`}>{a.pctLabel}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* BRANDS */}
      <section id="brands" className="py-16 md:py-24 px-6 lg:px-12" style={{ background: 'rgba(57,255,20,0.015)' }}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 reveal">
            <p className="text-brand-green text-sm font-semibold uppercase tracking-widest mb-4">
              <i className="fa-solid fa-microchip ml-2" />سازگاری با برندها
            </p>
            <h2 className="section-title text-3xl md:text-4xl font-extrabold text-white inline-block">ایسیوهای پشتیبانی‌شده</h2>
            <p className="text-brand-muted mt-6 max-w-xl mx-auto text-sm leading-relaxed">
              بیش از ۴۰ مدل ایسیو از ۶ برند اصلی اروپایی و آمریکایی — همگی با فایل اورجینال در آرشیو ما موجود است.
            </p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-5 md:gap-6 reveal" style={{ animationDelay: '0.1s' }}>
            {brands.map(b => (
              <div key={b.name} className="brand-badge">
                <div className="brand-badge-icon"><i className={`fa-solid ${b.icon} ${b.iconColor} text-2xl`} /></div>
                <span className="text-white font-bold text-sm">{b.name}</span>
                <span className="text-brand-muted text-xs text-center leading-snug whitespace-pre-line">{b.models}</span>
                <span className="bg-brand-green/10 text-brand-green border border-brand-green/20 text-xs px-2 py-0.5 rounded-full font-semibold">{b.count}</span>
              </div>
            ))}
          </div>
          <div className="text-center mt-16 reveal" style={{ animationDelay: '0.2s' }}>
            <div className="glass-card p-8 md:p-10 max-w-xl mx-auto" style={{ borderColor: 'rgba(57,255,20,0.15)' }}>
              <p className="text-brand-muted text-sm leading-relaxed mb-6">مدل ایسیوی خودروی شما در لیست نیست؟ با ما تماس بگیرید — احتمالاً فایل اورجینال در آرشیو داریم.</p>
              <Link to="/contact" className="btn-neon-green animate-pulse-green px-8 py-3 text-sm font-bold rounded-xl inline-flex items-center gap-2">
                <i className="fa-solid fa-magnifying-glass ml-2" />استعلام مدل ایسیو
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
