import { useState, useEffect } from 'react'
import { NavLink, Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const navLinks = [
  { to: '/',                   label: 'صفحه اصلی' },
  { to: '/hardware-repair',    label: 'تعمیرات سخت‌افزار' },
  { to: '/remap-calibration',  label: 'ریمپ و کالیبراسیون' },
  { to: '/wiki',               label: 'دانشنامه تخصصی' },
  { to: '/about',              label: 'درباره ما' },
  { to: '/contact',            label: 'تماس' },
]

export default function Navbar() {
  const [scrolled,   setScrolled]   = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const { user, logout }            = useAuth()
  const navigate                    = useNavigate()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const closeMobile = () => setMobileOpen(false)

  const handleLogout = () => {
    logout()
    closeMobile()
    navigate('/')
  }

  return (
    <nav
      id="navbar"
      className={`w-full py-4 px-6 lg:px-12 fixed top-0 left-0 right-0 z-[999] transition-all duration-400${
        scrolled ? ' navbar-scrolled' : ''
      }`}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 no-underline group" onClick={closeMobile}>
          <div className="w-9 h-9 rounded-lg flex items-center justify-center border border-brand-cyan/30 bg-brand-cyan/10 group-hover:bg-brand-cyan/20 transition-all duration-300">
            <i className="fa-solid fa-microchip text-brand-cyan text-sm" />
          </div>
          <span className="text-xl font-extrabold tracking-widest">
            <span className="text-white">رَدیف</span>
            <span className="text-brand-cyan"> | RADIF</span>
          </span>
        </Link>

        {/* Desktop nav links */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}
            >
              {label}
            </NavLink>
          ))}
        </div>

        {/* Right CTAs */}
        <div className="flex items-center gap-3">
          {user ? (
            /* ── Logged-in state ─────────────────────────── */
            <div className="hidden sm:flex items-center gap-2">
              {/* Admin badge */}
              {user.role === 'admin' && (
                <Link
                  to="/admin/dashboard"
                  className="px-2.5 py-1 text-xs font-bold rounded-md border border-brand-green/50 bg-brand-green/10 text-brand-green hover:bg-brand-green/20 transition-all"
                  title="پنل مدیریت"
                >
                  <i className="fa-solid fa-shield-halved ml-1" />ادمین
                </Link>
              )}
              {/* User name */}
              <span className="text-sm text-white font-semibold px-2 flex items-center gap-1.5">
                <i className="fa-solid fa-circle-user text-brand-cyan" />
                {user.name}
              </span>
              {/* Logout */}
              <button
                onClick={handleLogout}
                className="btn-outline-cyan px-4 py-2 text-sm font-semibold rounded-lg inline-flex items-center gap-2"
              >
                <i className="fa-solid fa-right-from-bracket" /> خروج
              </button>
            </div>
          ) : (
            /* ── Guest state ─────────────────────────────── */
            <Link
              to="/auth"
              className="btn-outline-cyan px-4 py-2 text-sm font-semibold rounded-lg hidden sm:inline-flex items-center gap-2"
            >
              <i className="fa-solid fa-user-circle" /> ورود
            </Link>
          )}

          <Link
            to="/booking"
            className="btn-neon-green animate-pulse-green px-5 py-2.5 text-sm font-bold rounded-lg"
          >
            <i className="fa-solid fa-calendar-check ml-2" />رزرو آنلاین نوبت
          </Link>

          {/* Mobile hamburger */}
          <button
            className="md:hidden text-brand-muted hover:text-brand-cyan transition-colors p-2"
            onClick={() => setMobileOpen(o => !o)}
            aria-label="منو"
          >
            <i className={`fa-solid ${mobileOpen ? 'fa-xmark text-brand-cyan' : 'fa-bars'} text-xl`} />
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden mt-4 px-4 pb-4 border-t border-brand-cyan/10">
          <div className="flex flex-col gap-4 pt-4">
            {navLinks.map(({ to, label }) => (
              <NavLink
                key={to}
                to={to}
                end={to === '/'}
                className={({ isActive }) => `nav-link text-base${isActive ? ' active' : ''}`}
                onClick={closeMobile}
              >
                {label}
              </NavLink>
            ))}

            {user ? (
              <>
                {/* User info row */}
                <span className="text-sm text-white font-semibold flex items-center gap-1.5">
                  <i className="fa-solid fa-circle-user text-brand-cyan" />
                  {user.name}
                </span>
                {/* Admin link */}
                {user.role === 'admin' && (
                  <NavLink
                    to="/admin/dashboard"
                    className={({ isActive }) => `nav-link text-base${isActive ? ' active' : ''}`}
                    onClick={closeMobile}
                  >
                    <i className="fa-solid fa-shield-halved ml-1 text-brand-green" />پنل مدیریت
                  </NavLink>
                )}
                {/* Logout */}
                <button
                  onClick={handleLogout}
                  className="nav-link text-base text-right w-full"
                >
                  <i className="fa-solid fa-right-from-bracket ml-1" />خروج
                </button>
              </>
            ) : (
              <NavLink
                to="/auth"
                className={({ isActive }) => `nav-link text-base${isActive ? ' active' : ''}`}
                onClick={closeMobile}
              >
                ورود / ثبت‌نام
              </NavLink>
            )}

            <NavLink
              to="/booking"
              className={({ isActive }) => `nav-link text-base${isActive ? ' active' : ''}`}
              onClick={closeMobile}
            >
              رزرو نوبت
            </NavLink>
          </div>
        </div>
      )}
    </nav>
  )
}
