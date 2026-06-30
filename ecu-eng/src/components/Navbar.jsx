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

  // Body scroll lock — prevents background from shifting while drawer is open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : 'unset'
    return () => { document.body.style.overflow = 'unset' }
  }, [mobileOpen])

  const closeMobile = () => setMobileOpen(false)

  const handleLogout = () => {
    logout()
    closeMobile()
    navigate('/')
  }

  return (
    <nav
      id="navbar"
      dir="rtl"
      className={`w-full fixed top-0 left-0 right-0 z-[999] transition-all duration-400${
        scrolled ? ' navbar-scrolled' : ''
      }`}
    >
      {/* ── MOBILE HEADER BAR (< md) ─────────────────────────────────────── */}
      <div className="md:hidden relative flex flex-row items-center justify-between w-full h-16 px-4">

        {/* FAR RIGHT (RTL start): Hamburger */}
        <button
          className="text-brand-muted hover:text-brand-cyan transition-colors p-2 flex-shrink-0"
          onClick={() => setMobileOpen(o => !o)}
          aria-label="منو"
        >
          <i className="fa-solid fa-bars text-xl" />
        </button>

        {/* ABSOLUTE CENTER: Logo */}
        <Link
          to="/"
          className="absolute left-1/2 -translate-x-1/2 flex items-center gap-2 no-underline group"
          onClick={closeMobile}
        >
          <div className="w-8 h-8 rounded-lg flex items-center justify-center border border-brand-cyan/30 bg-brand-cyan/10">
            <i className="fa-solid fa-microchip text-brand-cyan text-xs" />
          </div>
          <span className="text-lg font-extrabold tracking-widest whitespace-nowrap">
            <span className="text-white">رَدیف</span>
            <span className="text-brand-cyan"> | RADIF</span>
          </span>
        </Link>

        {/* FAR LEFT (RTL end): Single compact action button */}
        {user ? (
          <button
            onClick={handleLogout}
            className="btn-outline-cyan px-3 py-1.5 text-xs font-semibold rounded-lg inline-flex items-center gap-1.5 flex-shrink-0"
          >
            <i className="fa-solid fa-right-from-bracket" /> خروج
          </button>
        ) : (
          <Link
            to="/auth"
            className="btn-outline-cyan px-3 py-1.5 text-xs font-semibold rounded-lg inline-flex items-center gap-1.5 flex-shrink-0"
          >
            <i className="fa-solid fa-user-circle" /> ورود
          </Link>
        )}
      </div>

      {/* ── DESKTOP HEADER BAR (≥ md) ────────────────────────────────────── */}
      <div className="hidden md:flex max-w-7xl mx-auto items-center justify-between py-4 px-6 lg:px-12">
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
        <div className="flex items-center gap-8">
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

        {/* Desktop CTAs */}
        <div className="flex items-center gap-3">
          {user ? (
            <div className="flex items-center gap-2">
              {user.role === 'admin' && (
                <Link
                  to="/admin/dashboard"
                  className="px-2.5 py-1 text-xs font-bold rounded-md border border-brand-green/50 bg-brand-green/10 text-brand-green hover:bg-brand-green/20 transition-all"
                  title="پنل مدیریت"
                >
                  <i className="fa-solid fa-shield-halved ml-1" />ادمین
                </Link>
              )}
              <span className="text-sm text-white font-semibold px-2 flex items-center gap-1.5">
                <i className="fa-solid fa-circle-user text-brand-cyan" />
                {user.name}
              </span>
              <button
                onClick={handleLogout}
                className="btn-outline-cyan px-4 py-2 text-sm font-semibold rounded-lg inline-flex items-center gap-2"
              >
                <i className="fa-solid fa-right-from-bracket" /> خروج
              </button>
            </div>
          ) : (
            <Link
              to="/auth"
              className="btn-outline-cyan px-4 py-2 text-sm font-semibold rounded-lg inline-flex items-center gap-2"
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
        </div>
      </div>

      {/* ── MOBILE DRAWER BACKDROP ───────────────────────────────────────── */}
      <div
        className={`fixed inset-0 bg-black/60 z-40 transition-all duration-500 ease-out ${
          mobileOpen
            ? 'opacity-100 pointer-events-auto'
            : 'opacity-0 pointer-events-none'
        }`}
        onClick={closeMobile}
        aria-hidden="true"
      />

      {/* ── MOBILE DRAWER PANEL ──────────────────────────────────────────── */}
      <div
        dir="rtl"
        className={`md:hidden fixed inset-y-0 right-0 z-50 h-screen w-3/4 max-w-xs
          bg-zinc-950 backdrop-blur-lg
          border-l border-slate-800
          shadow-[-8px_0_32px_rgba(0,0,0,0.6)]
          flex flex-col
          transition-all duration-500 ease-out
          ${mobileOpen
            ? 'translate-x-0 opacity-100 pointer-events-auto'
            : 'translate-x-full opacity-0 pointer-events-none'
          }`}
      >
        {/* Close button */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800">
          <span className="text-sm font-bold tracking-widest text-white/60 uppercase">منو</span>
          <button
            onClick={closeMobile}
            aria-label="بستن منو"
            className="w-8 h-8 flex items-center justify-center rounded-lg
              text-brand-muted hover:text-brand-cyan hover:bg-brand-cyan/10
              transition-colors duration-200"
          >
            <i className="fa-solid fa-xmark text-lg" />
          </button>
        </div>

        {/* Nav links */}
        <nav className="flex flex-col space-y-1 px-4 py-6 text-right overflow-y-auto flex-1">
          {navLinks.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              className={({ isActive }) =>
                `nav-link text-base px-3 py-3 rounded-lg${isActive ? ' active' : ''}`
              }
              onClick={closeMobile}
            >
              {label}
            </NavLink>
          ))}

          {/* Divider */}
          <div className="border-t border-slate-800 my-3" />

          {user ? (
            <>
              {/* User info */}
              <span className="text-sm text-white/70 font-semibold flex items-center justify-end gap-2 px-3 py-2">
                <span>{user.name}</span>
                <i className="fa-solid fa-circle-user text-brand-cyan" />
              </span>

              {/* Admin link */}
              {user.role === 'admin' && (
                <NavLink
                  to="/admin/dashboard"
                  className={({ isActive }) =>
                    `nav-link text-base px-3 py-3 rounded-lg${isActive ? ' active' : ''}`
                  }
                  onClick={closeMobile}
                >
                  <i className="fa-solid fa-shield-halved ml-1 text-brand-green" />پنل مدیریت
                </NavLink>
              )}

              {/* Logout */}
              <button
                onClick={handleLogout}
                className="nav-link text-base text-right w-full px-3 py-3 rounded-lg"
              >
                <i className="fa-solid fa-right-from-bracket ml-1" />خروج
              </button>
            </>
          ) : (
            <NavLink
              to="/auth"
              className={({ isActive }) =>
                `nav-link text-base px-3 py-3 rounded-lg${isActive ? ' active' : ''}`
              }
              onClick={closeMobile}
            >
              ورود / ثبت‌نام
            </NavLink>
          )}

          {/* Booking CTA */}
          <div className="pt-4">
            <NavLink
              to="/booking"
              className={({ isActive }) =>
                `btn-neon-green animate-pulse-green w-full flex items-center justify-center gap-2
                 px-4 py-3 text-sm font-bold rounded-lg${isActive ? ' active' : ''}`
              }
              onClick={closeMobile}
            >
              <i className="fa-solid fa-calendar-check" />رزرو آنلاین نوبت
            </NavLink>
          </div>
        </nav>
      </div>
    </nav>
  )
}
