import { Link } from 'react-router-dom'
import useReveal from '../hooks/useReveal'

const expertise = [
  {
    icon: 'fa-layer-group', color: 'cyan',
    title: 'عیب‌یابی لایه به لایه بردهای الکترونیکی',
    body: 'با استفاده از اسیلوسکوپ دیجیتال و میلی‌اهم‌متر دقیق، هر مسیر برد را از لایه زمین تا خطوط تغذیه بررسی می‌کنیم. مشکلاتی که دیاگ معمولی قادر به شناسایی آن‌ها نیست را در سطح سخت‌افزار شناسایی و رفع می‌کنیم.',
    tags: ['Oscilloscope', 'Milliohm Meter', 'Thermal Camera'],
  },
  {
    icon: 'fa-gauge-high', color: 'green',
    title: 'ریمپ و کالیبراسیون با تجهیزات اورجینال اروپایی',
    body: 'با استفاده از نرم‌افزارهای اورجینال WinOLS، ECM Titanium و Alientech K-TAG، نقشه‌های سوخت و احتراق را با دقت مهندسی اصلاح می‌کنیم. نه فایل‌های دانلودی ناشناخته، بلکه کالیبراسیون از روی داده خام اصلی.',
    tags: ['WinOLS', 'K-TAG', 'Alientech'],
  },
  {
    icon: 'fa-code-branch', color: 'cyan',
    title: 'مهندسی معکوس و آپدیت فِرمور ایسیوها',
    body: 'برای ECUهایی که فرمور به‌روز یا جایگزین ندارند، از تکنیک‌های مهندسی معکوس استفاده می‌کنیم. خواندن و تحلیل فایل HEX خام، شناسایی ساختار جداول و بازنویسی هدفمند بدون آسیب به پارامترهای اصلی.',
    tags: ['BDM Programmer', 'JTAG Interface', 'HEX Analysis'],
  },
  {
    icon: 'fa-heart-pulse', color: 'green',
    title: 'تضمین پایداری و سلامت کامل موتور',
    body: 'هر تحویل با تست رانش واقعی و خوانش لایو دیتا روی جاده تأیید می‌شود. مقادیر Lambda، زاویه احتراق، درصد بار موتور و دمای خنک‌کننده همه بررسی می‌شوند تا از پایداری ۱۰۰٪ اطمینان حاصل شود.',
    tags: ['Live Data OBD2', 'Lambda Test', 'Road Validation'],
  },
]

export default function About() {
  useReveal()
  return (
    <>
      {/* HERO */}
      <section className="hero-grid-bg pt-36 pb-24 px-6 lg:px-12 text-center">
        <div className="max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-brand-cyan/30 bg-brand-cyan/5 text-brand-cyan text-xs font-semibold mb-10 animate-fade-in-up">
            <span className="w-2 h-2 rounded-full bg-brand-green animate-pulse-green inline-block" />
            رویکرد مهندسی — نه صرفاً تعمیر مکانیکی
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight mb-8 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
            درباره <span className="text-brand-cyan text-glow-cyan"> کلینیک مهندسی ایسیو</span>
          </h1>
          <p className="text-brand-muted text-base md:text-lg leading-relaxed animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            ما الکترونیک خودرو را در عمیق‌ترین لایه‌های آن درک می‌کنیم — از سطح سیلیکون تا پروتکل‌های شبکه.
          </p>
        </div>
      </section>

      {/* STORY */}
      <section className="py-16 md:py-24 px-6 lg:px-12">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            {/* Text */}
            <div className="reveal">
              <p className="text-brand-cyan text-sm font-semibold uppercase tracking-widest mb-5">
                <i className="fa-solid fa-scroll ml-2" />داستان و دیدگاه ما
              </p>
              <h2 className="section-title text-3xl md:text-4xl font-extrabold text-white mb-10 inline-block">
                وقتی مهندسی جای مکانیک را می‌گیرد
              </h2>
              <div className="space-y-6 text-brand-muted text-sm md:text-base leading-relaxed">
                <p>در دنیای خودروهای امروزی، <strong className="text-white">واحد کنترل الکترونیکی (ECU)</strong> دیگر یک قطعه جانبی نیست — مغز اصلی موتور است. هر تصمیم احتراقی، هر لحظه کنترل سوخت، هر فرمان سنسور، از فیلدهای داده‌ای عبور می‌کند که تنها با ابزار تخصصی قابل خواندن و تفسیر است.</p>
                <p>کلینیک ردیف | Radif با این باور شکل گرفت که <strong className="text-brand-cyan">تعمیر واقعی یعنی درک واقعی</strong>. نه تعویض کورکورانه قطعات، نه استفاده از تجربه‌های قدیمی برای سخت‌افزار جدید.</p>
                <p>با استفاده از تجهیزات اروپایی اورجینال — از پروگرامرهای <span className="text-brand-green font-semibold">BDM و JTAG</span> گرفته تا آنالایزر شبکه CAN Bus — هر ECU را لایه به لایه بررسی می‌کنیم.</p>
                <p><strong className="text-white">پایداری طولانی‌مدت، عملکرد کارخانه‌ای، و خیال راحت مالک خودرو.</strong></p>
              </div>
              <div className="grid grid-cols-2 gap-4 mt-10">
                {[
                  { icon: 'fa-microscope', color: 'cyan', label: 'تشخیص دقیق لایه‌ای' },
                  { icon: 'fa-shield-halved', color: 'green', label: 'تضمین کامل خروجی' },
                  { icon: 'fa-euro-sign', color: 'cyan', label: 'تجهیزات اروپایی اورجینال' },
                  { icon: 'fa-clock-rotate-left', color: 'green', label: 'سابقه بیش از ۱۰ سال' },
                ].map((v, i) => (
                  <div key={i} className={`flex items-center gap-3 p-4 rounded-xl ${v.color === 'cyan' ? 'bg-brand-cyan/5 border border-brand-cyan/10' : 'bg-brand-green/5 border border-brand-green/10'}`}>
                    <i className={`fa-solid ${v.icon} text-xl flex-shrink-0 ${v.color === 'cyan' ? 'text-brand-cyan' : 'text-brand-green'}`} />
                    <span className="text-sm text-white font-medium">{v.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Circuit Visual */}
            <div className="reveal" style={{ animationDelay: '0.2s' }}>
              <div className="circuit-visual min-h-[460px]">
                <svg className="absolute inset-0 w-full h-full opacity-20" viewBox="0 0 400 450" fill="none">
                  <line x1="40" y1="100" x2="360" y2="100" stroke="#00f0ff" strokeWidth="1.5" />
                  <line x1="40" y1="225" x2="360" y2="225" stroke="#39ff14" strokeWidth="1.5" />
                  <line x1="40" y1="350" x2="360" y2="350" stroke="#00f0ff" strokeWidth="1.5" />
                  <line x1="100" y1="100" x2="100" y2="350" stroke="#00f0ff" strokeWidth="1" />
                  <line x1="200" y1="100" x2="200" y2="350" stroke="#39ff14" strokeWidth="1" />
                  <line x1="300" y1="100" x2="300" y2="350" stroke="#00f0ff" strokeWidth="1" />
                  <rect x="80" y="80" width="40" height="40" rx="4" stroke="#00f0ff" strokeWidth="1.5" fill="rgba(0,240,255,0.05)" />
                  <rect x="180" y="205" width="40" height="40" rx="4" stroke="#39ff14" strokeWidth="1.5" fill="rgba(57,255,20,0.05)" />
                  <rect x="280" y="80" width="40" height="40" rx="4" stroke="#00f0ff" strokeWidth="1.5" fill="rgba(0,240,255,0.05)" />
                  <rect x="80" y="330" width="40" height="40" rx="4" stroke="#39ff14" strokeWidth="1.5" fill="rgba(57,255,20,0.05)" />
                  <rect x="280" y="330" width="40" height="40" rx="4" stroke="#00f0ff" strokeWidth="1.5" fill="rgba(0,240,255,0.05)" />
                  <circle cx="100" cy="100" r="5" fill="#00f0ff" opacity="0.7" />
                  <circle cx="200" cy="225" r="5" fill="#39ff14" opacity="0.7" />
                  <circle cx="300" cy="100" r="5" fill="#00f0ff" opacity="0.7" />
                  <circle cx="100" cy="350" r="5" fill="#39ff14" opacity="0.7" />
                  <circle cx="300" cy="350" r="5" fill="#00f0ff" opacity="0.7" />
                </svg>
                <div className="relative z-10 flex flex-col items-center gap-5">
                  <div className="w-24 h-24 rounded-2xl border-2 border-brand-cyan/50 bg-brand-cyan/10 flex items-center justify-center animate-float"
                    style={{ boxShadow: '0 0 40px rgba(0,240,255,0.2)' }}>
                    <i className="fa-solid fa-microchip text-brand-cyan text-4xl text-glow-cyan" />
                  </div>
                  <span className="font-mono text-brand-cyan/60 text-xs tracking-widest">ECU — CORE.IC</span>
                  <div className="flex gap-3 flex-wrap justify-center mt-2">
                    {['VCC 5V', 'GND', 'CAN-H', 'CAN-L', 'JTAG'].map(tag => (
                      <span key={tag} className="bg-brand-green/10 border border-brand-green/30 text-brand-green text-xs px-2 py-0.5 rounded font-mono">{tag}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* EXPERTISE */}
      <section className="py-16 md:py-24 px-6 lg:px-12" style={{ background: 'rgba(0,240,255,0.015)' }}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 reveal">
            <p className="text-brand-cyan text-sm font-semibold uppercase tracking-widest mb-4">
              <i className="fa-solid fa-layer-group ml-2" />حوزه‌های تخصص ما
            </p>
            <h2 className="section-title text-3xl md:text-4xl font-extrabold text-white inline-block">عمق مهندسی در هر لایه</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-8">
            {expertise.map((e, i) => (
              <div key={i} className="expertise-block reveal" style={{ animationDelay: `${i * 0.1}s` }}>
                <div className="flex items-start gap-6">
                  <div className={`w-14 h-14 rounded-xl flex-shrink-0 flex items-center justify-center ${e.color === 'cyan' ? 'bg-brand-cyan/10 border border-brand-cyan/20' : 'bg-brand-green/10 border border-brand-green/20'}`}>
                    <i className={`fa-solid ${e.icon} text-2xl ${e.color === 'cyan' ? 'text-brand-cyan' : 'text-brand-green'}`} />
                  </div>
                  <div>
                    <h3 className="text-white text-xl font-bold mb-3">{e.title}</h3>
                    <p className="text-brand-muted text-sm leading-relaxed">{e.body}</p>
                    <div className="flex flex-wrap gap-2 mt-5">
                      {e.tags.map(t => (
                        <span key={t} className={`text-xs px-3 py-1 rounded-lg border font-mono ${e.color === 'cyan' ? 'bg-brand-cyan/10 text-brand-cyan border-brand-cyan/20' : 'bg-brand-green/10 text-brand-green border-brand-green/20'}`}>{t}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 md:py-24 px-6 lg:px-12 text-center">
        <div className="max-w-2xl mx-auto reveal">
          <div className="glass-card p-10 md:p-14" style={{ borderColor: 'rgba(57,255,20,0.15)' }}>
            <i className="fa-solid fa-handshake text-brand-green text-4xl mb-8 block" style={{ textShadow: '0 0 20px rgba(57,255,20,0.5)' }} />
            <h3 className="text-white text-2xl md:text-3xl font-extrabold mb-5">آماده همکاری هستیم</h3>
            <p className="text-brand-muted text-sm leading-relaxed mb-10">خودروی شما لایق بهترین مراقبت الکترونیکی است. همین الان نوبت آنلاین دریافت کنید.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/contact" className="btn-neon-green animate-pulse-green px-8 py-3.5 text-sm font-bold rounded-xl gap-2">
                <i className="fa-solid fa-bolt ml-2" />دریافت نوبت
              </Link>
              <Link to="/contact" className="btn-outline-cyan px-8 py-3.5 text-sm font-semibold rounded-xl gap-2">
                <i className="fa-solid fa-phone ml-2" />تماس با ما
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
