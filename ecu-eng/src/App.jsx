import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { ToastProvider } from './components/Toast'
import { AuthProvider } from './context/AuthContext'
import Navbar from './components/Navbar'
import Footer from './components/Footer'

import Home             from './pages/Home'
import About            from './pages/About'
import Contact          from './pages/Contact'
import Auth             from './pages/Auth'
import HardwareRepair   from './pages/HardwareRepair'
import RemapCalibration from './pages/RemapCalibration'
import Wiki             from './pages/Wiki'
import Booking          from './pages/Booking'
import Dashboard        from './pages/Dashboard'

export default function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <BrowserRouter>
          <div className="min-h-screen bg-brand-bg text-white font-vazir" dir="rtl">
            <Navbar />
            <Routes>
              <Route path="/"                    element={<Home />} />
              <Route path="/about"               element={<About />} />
              <Route path="/contact"             element={<Contact />} />
              <Route path="/auth"                element={<Auth />} />
              <Route path="/hardware-repair"     element={<HardwareRepair />} />
              <Route path="/remap-calibration"   element={<RemapCalibration />} />
              <Route path="/wiki"                element={<Wiki />} />
              <Route path="/booking"             element={<Booking />} />
              <Route path="/admin/dashboard"     element={<Dashboard />} />
              {/* fallback */}
              <Route path="*"                    element={<Home />} />
            </Routes>
            <Footer />
          </div>
        </BrowserRouter>
      </AuthProvider>
    </ToastProvider>
  )
}
