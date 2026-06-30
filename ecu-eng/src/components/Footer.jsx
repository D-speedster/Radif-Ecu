import { Link } from 'react-router-dom'

const quickLinks = [
  { to: '/',                  label: 'صفحه اصلی' },
  { to: '/hardware-repair',   label: 'تعمیرات سخت‌افزار' },
  { to: '/remap-calibration', label: 'ریمپ و کالیبراسیون' },
  { to: '/wiki',              label: 'دانشنامه تخصصی' },
  { to: '/about',             label: 'درباره ما' },
]

export default function Footer() {
  return (
    <footer className="border-t border-brand-cyan/10 pt-12 pb-8 px-6 lg:px-12"
      style={{ background: 'rgba(13,14,18,0.95)' }}>
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-10">

          {/* Brand */}
          <div>
            <Link to="/" className="flex items-center gap-2 mb-4 no-underline">
              <div className="w-9 h-9 rounded-lg flex items-center justify-center border border-brand-cyan/30 bg-brand-cyan/10">
                <i className="fa-solid fa-microchip text-brand-cyan text-sm" />
              </div>
              <span className="text-xl font-extrabold tracking-widest">
                <span className="text-white">رَدیف</span>
                <span className="text-brand-cyan"> | RADIF</span>
              </span>
            </Link>
            <p className="text-brand-muted text-sm leading-relaxed mb-4">
              مرکز فوق‌تخصصی مهندسی و تعمیرات الکترونیک خودرو — عیب‌یابی سخت‌افزاری، ریمپ و مالتی‌پلکس.
            </p>
            <div className="flex items-center gap-3">
              <a href="#" className="footer-social-link" aria-label="Instagram">
                <i className="fa-brands fa-instagram text-lg" />
              </a>
              <a href="#" className="footer-social-link" aria-label="Telegram">
                <i className="fa-brands fa-telegram text-lg" />
              </a>
              <a href="#" className="footer-social-link" aria-label="WhatsApp">
                <i className="fa-brands fa-whatsapp text-lg" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-bold mb-5 text-sm uppercase tracking-widest">دسترسی سریع</h4>
            <ul className="space-y-3">
              {quickLinks.map(({ to, label }) => (
                <li key={to}>
                  <Link to={to} className="text-brand-muted text-sm hover:text-brand-cyan transition-colors duration-200">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-bold mb-5 text-sm uppercase tracking-widest">اطلاعات تماس</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-brand-muted text-sm">
                <i className="fa-solid fa-phone text-brand-cyan mt-0.5 flex-shrink-0" />
                <span dir="ltr">۰۹۱۲-XXX-XXXX</span>
              </li>
              <li className="flex items-start gap-3 text-brand-muted text-sm">
                <i className="fa-solid fa-location-dot text-brand-cyan mt-0.5 flex-shrink-0" />
                <span>تهران، خیابان ایران‌خودرو، پلاک ...</span>
              </li>
              <li className="flex items-start gap-3 text-brand-muted text-sm">
                <i className="fa-solid fa-clock text-brand-cyan mt-0.5 flex-shrink-0" />
                <span>شنبه تا پنجشنبه — ۸ صبح تا ۷ شب</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-brand-cyan/10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-brand-muted text-xs">&copy; ۲۰۲۶ ردیف | Radif. تمامی حقوق محفوظ است.</p>
          <p className="text-brand-muted text-xs flex items-center gap-1">
            ساخته شده با
            <i className="fa-solid fa-heart text-brand-green text-xs mx-1" />
            برای مهندسان خودرو
          </p>
        </div>
      </div>
    </footer>
  )
}
