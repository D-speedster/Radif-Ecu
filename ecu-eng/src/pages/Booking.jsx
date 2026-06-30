import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { useToast } from '../components/Toast'
import { useAuth } from '../context/AuthContext'
import api from '../utils/api'

/* ── Booking constants ── */
const SERVICES = [
  {
    id: 'hardware',
    icon: 'fa-screwdriver-wrench', color: 'cyan',
    title: 'تعمیرات سخت‌افزار',  sub: 'ECU Hardware Repair',
    desc: 'تعمیر کامپوننت‌سطح، تعویض آی‌سی، رفع قطعی منفی',
    duration: '۱ تا ۶ ساعت',
  },
  {
    id: 'remap',
    icon: 'fa-gauge-high', color: 'green',
    title: 'ریمپ تخصصی',  sub: 'Remap & Calibration',
    desc: 'رفع کپ گاز، حذف سنسور O2، بهینه‌سازی جدول سوخت',
    duration: '۲ تا ۴ ساعت',
  },
  {
    id: 'network',
    icon: 'fa-circle-nodes', color: 'cyan',
    title: 'عیب‌یابی شبکه', sub: 'Multiplex / CAN Diagnosis',
    desc: 'آنالیز CAN Bus، تعمیر نود BSI، بررسی سیم‌کشی',
    duration: '۱ تا ۳ ساعت',
  },
]

const DAYS_FA   = ['ش', 'ی', 'د', 'س', 'چ', 'پ', 'ج']
const TIME_SLOTS = ['۰۹:۰۰', '۱۰:۳۰', '۱۲:۰۰', '۱۳:۳۰', '۱۵:۰۰', '۱۶:۳۰']
const BUSY_SLOTS = new Set(['۱۲:۰۰', '۱۶:۳۰'])

/* Generate 21 days from today (3 full weeks) */
function buildCalendar() {
  const today = new Date()
  return Array.from({ length: 21 }, (_, i) => {
    const d = new Date(today)
    d.setDate(today.getDate() + i)
    return {
      iso:      d.toISOString().slice(0, 10),
      dayNum:   d.getDate(),
      dayName:  DAYS_FA[d.getDay()],
      isToday:  i === 0,
      disabled: d.getDay() === 5, // Friday = closed
    }
  })
}

/** Extract the Persian error message from an Axios error response */
const extractError = (err) =>
  err?.response?.data?.message || 'خطایی رخ داد. لطفاً دوباره تلاش کنید.'

/* ============================================================
   SUB-COMPONENTS
   ============================================================ */

/* --- Step indicator bar --- */
function StepBar({ current }) {
  const steps = [
    { num: 1, label: 'انتخاب خدمت' },
    { num: 2, label: 'زمان‌بندی' },
    { num: 3, label: 'اطلاعات خودرو' },
  ]
  return (
    <div className="flex items-center justify-between mb-12 max-w-lg mx-auto w-full">
      {steps.map((s, i) => (
        <div key={s.num} className="flex items-center flex-1">
          <div className="flex flex-col items-center gap-1.5 flex-shrink-0">
            <div className={`step-circle${current === s.num ? ' active' : current > s.num ? ' done' : ''}`}>
              {current > s.num
                ? <i className="fa-solid fa-check text-sm" />
                : s.num}
            </div>
            <span className={`text-xs font-semibold whitespace-nowrap ${
              current >= s.num ? 'text-white' : 'text-brand-muted'
            }`}>{s.label}</span>
          </div>
          {i < steps.length - 1 && (
            <div className={`stepper-line mx-2 mb-5${current > s.num ? ' done' : ''}`} />
          )}
        </div>
      ))}
    </div>
  )
}

/* --- Step 1: Service selector --- */
function Step1({ selected, onSelect }) {
  return (
    <div>
      <h2 className="text-white text-2xl font-extrabold mb-2 text-center">انتخاب نوع خدمت</h2>
      <p className="text-brand-muted text-sm text-center mb-8">خدمت مورد نیاز خود را انتخاب کنید</p>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        {SERVICES.map(s => (
          <button
            key={s.id}
            type="button"
            className={`service-select-card${selected === s.id ? ' selected' : ''}`}
            onClick={() => onSelect(s.id)}
          >
            <div className="service-sel-icon">
              <i className={`fa-solid ${s.icon}`} />
            </div>
            <h3 className="text-white font-bold text-base mb-1">{s.title}</h3>
            <p className={`text-xs font-semibold uppercase tracking-wider mb-3 ${s.color === 'green' ? 'text-brand-green' : 'text-brand-cyan'}`}>
              {s.sub}
            </p>
            <p className="text-brand-muted text-xs leading-relaxed mb-3">{s.desc}</p>
            <div className="flex items-center justify-center gap-1.5 text-xs text-brand-muted">
              <i className="fa-solid fa-clock text-brand-cyan text-xs" />
              <span>{s.duration}</span>
            </div>
            {selected === s.id && (
              <div className="mt-3 flex items-center justify-center gap-1 text-brand-green text-xs font-bold">
                <i className="fa-solid fa-check-circle" /> انتخاب شد
              </div>
            )}
          </button>
        ))}
      </div>
    </div>
  )
}

/* --- Step 2: Calendar + Time --- */
function Step2({ selectedDate, onDate, selectedTime, onTime }) {
  const calendar = useMemo(buildCalendar, [])

  return (
    <div>
      <h2 className="text-white text-2xl font-extrabold mb-2 text-center">انتخاب تاریخ و ساعت</h2>
      <p className="text-brand-muted text-sm text-center mb-8">روز و ساعت مورد نظر خود را انتخاب کنید</p>

      {/* Month label */}
      <div className="flex items-center justify-between mb-4 px-1">
        <span className="text-white font-bold text-sm">
          <i className="fa-solid fa-calendar-days text-brand-cyan ml-2" />
          {new Date().toLocaleDateString('fa-IR', { month: 'long', year: 'numeric' })}
        </span>
        <span className="text-brand-muted text-xs flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-brand-green inline-block" /> روز باز
          <span className="w-2 h-2 rounded-full bg-brand-muted/40 inline-block mr-1" /> تعطیل
        </span>
      </div>

      {/* Day-of-week header */}
      <div className="grid grid-cols-7 gap-2 mb-2">
        {DAYS_FA.map(d => (
          <div key={d} className="text-center text-brand-muted text-xs font-semibold py-1">{d}</div>
        ))}
      </div>

      {/* Calendar grid — 3 weeks */}
      <div className="grid grid-cols-7 gap-2 mb-8">
        {calendar.map(day => (
          <button
            key={day.iso}
            type="button"
            disabled={day.disabled}
            onClick={() => !day.disabled && onDate(day.iso)}
            className={[
              'cal-day',
              day.disabled            ? 'disabled'  : '',
              day.isToday             ? 'today'      : '',
              selectedDate === day.iso ? 'selected' : '',
            ].join(' ')}
          >
            <span className="text-sm font-bold leading-none">{day.dayNum}</span>
            {day.isToday && (
              <span className="text-[9px] font-semibold text-brand-green leading-none">امروز</span>
            )}
          </button>
        ))}
      </div>

      {/* Time slots */}
      <div>
        <p className="text-white font-semibold text-sm mb-4">
          <i className="fa-solid fa-clock text-brand-cyan ml-2" />انتخاب ساعت
          {!selectedDate && <span className="text-brand-muted text-xs mr-2">(ابتدا روز انتخاب کنید)</span>}
        </p>
        <div className="flex flex-wrap gap-3">
          {TIME_SLOTS.map(t => {
            const busy = BUSY_SLOTS.has(t)
            return (
              <button
                key={t}
                type="button"
                disabled={!selectedDate || busy}
                onClick={() => selectedDate && !busy && onTime(t)}
                className={[
                  'time-slot',
                  busy                   ? 'busy'     : '',
                  selectedTime === t     ? 'selected' : '',
                  !selectedDate && !busy ? 'opacity-40 cursor-not-allowed' : '',
                ].join(' ')}
              >
                {t}
                {busy && <span className="text-[9px] block text-center opacity-60">رزرو شده</span>}
              </button>
            )
          })}
        </div>
      </div>

      {selectedDate && selectedTime && (
        <div className="mt-6 p-4 rounded-xl bg-brand-cyan/5 border border-brand-cyan/20 flex items-center gap-3">
          <i className="fa-solid fa-circle-check text-brand-green text-xl flex-shrink-0" />
          <p className="text-white text-sm font-semibold">
            {new Date(selectedDate).toLocaleDateString('fa-IR', { weekday: 'long', month: 'long', day: 'numeric' })}
            <span className="text-brand-cyan mr-2">ساعت {selectedTime}</span>
          </p>
        </div>
      )}
    </div>
  )
}

/* --- Step 3: Vehicle info --- */
function Step3({ form, onChange }) {
  const fields = [
    { key: 'name',     label: 'نام و نام خانوادگی',   icon: 'fa-user',      placeholder: 'علی احمدی',                dir: 'rtl' },
    { key: 'phone',    label: 'شماره تماس',             icon: 'fa-phone',     placeholder: '۰۹۱۲ ...',                dir: 'ltr' },
    { key: 'carModel', label: 'مدل خودرو',              icon: 'fa-car',       placeholder: 'پژو ۴۰۵ — EF7 — 1398',   dir: 'rtl' },
    { key: 'ecuModel', label: 'مدل ایسیو (اختیاری)',   icon: 'fa-microchip', placeholder: 'Bosch ME7.4 / Valeo J34P', dir: 'ltr' },
  ]
  return (
    <div>
      <h2 className="text-white text-2xl font-extrabold mb-2 text-center">اطلاعات خودرو و صاحب آن</h2>
      <p className="text-brand-muted text-sm text-center mb-8">برای ثبت نوبت، اطلاعات زیر را تکمیل کنید</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {fields.map(f => (
          <div key={f.key}>
            <label className="block text-brand-muted text-xs mb-1.5">
              <i className={`fa-solid ${f.icon} ml-1 text-brand-cyan`} />{f.label}
            </label>
            <input
              className="form-input"
              dir={f.dir}
              placeholder={f.placeholder}
              value={form[f.key]}
              onChange={e => onChange(f.key, e.target.value)}
            />
          </div>
        ))}
        <div className="sm:col-span-2">
          <label className="block text-brand-muted text-xs mb-1.5">
            <i className="fa-regular fa-comment-dots ml-1 text-brand-cyan" />توضیحات اضافه (اختیاری)
          </label>
          <textarea
            className="form-input resize-none"
            rows={3}
            placeholder="مشکل خودرو یا توضیحات خاص را بنویسید..."
            value={form.notes}
            onChange={e => onChange('notes', e.target.value)}
          />
        </div>
      </div>
    </div>
  )
}

/* --- Success screen --- */
function SuccessScreen({ trackingCode, service, date, time, onReset }) {
  const svc = SERVICES.find(s => s.id === service)
  return (
    <div className="booking-success max-w-xl mx-auto">
      {/* Animated checkmark */}
      <div className="w-24 h-24 rounded-full border-2 border-brand-green/50 bg-brand-green/10 flex items-center justify-center mx-auto mb-6 animate-pulse-green">
        <i className="fa-solid fa-check text-brand-green text-4xl" style={{ textShadow: '0 0 20px rgba(57,255,20,0.6)' }} />
      </div>

      <h2 className="text-white text-2xl md:text-3xl font-extrabold mb-2">نوبت شما ثبت شد!</h2>
      <p className="text-brand-muted text-sm mb-6">کد پیگیری زیر را حفظ کنید. در تماس‌های بعدی به آن نیاز دارید.</p>

      {/* Real tracking code from server — styled neon monospace box */}
      <div className="tracking-code">{trackingCode}</div>

      {/* Summary */}
      <div className="mt-8 glass-card p-5 text-right space-y-3">
        {[
          { icon: 'fa-wrench',   label: 'خدمت انتخابی', value: svc?.title },
          { icon: 'fa-calendar', label: 'تاریخ',         value: date ? new Date(date).toLocaleDateString('fa-IR', { weekday: 'long', month: 'long', day: 'numeric' }) : '—' },
          { icon: 'fa-clock',    label: 'ساعت',          value: time || '—' },
        ].map(r => (
          <div key={r.label} className="flex items-center justify-between text-sm">
            <span className="text-brand-muted flex items-center gap-2">
              <i className={`fa-solid ${r.icon} text-brand-cyan text-xs`} />{r.label}
            </span>
            <span className="text-white font-semibold">{r.value}</span>
          </div>
        ))}
      </div>

      <p className="text-brand-muted text-xs mt-6 leading-relaxed">
        کارشناسان ما پیش از موعد با شما تماس می‌گیرند. در صورت نیاز به تغییر با شماره تماس کلینیک تماس بگیرید.
      </p>

      <div className="flex flex-col sm:flex-row gap-4 mt-8 justify-center">
        <button onClick={onReset}
          className="btn-neon-green animate-pulse-green px-8 py-3 text-sm font-bold rounded-xl gap-2">
          <i className="fa-solid fa-plus ml-2" />رزرو نوبت جدید
        </button>
        <Link to="/" className="btn-outline-cyan px-8 py-3 text-sm font-semibold rounded-xl gap-2">
          <i className="fa-solid fa-house ml-2" />بازگشت به خانه
        </Link>
      </div>
    </div>
  )
}

/* ── Main Page ── */
export default function Booking() {
  const showToast              = useToast()
  const { user }               = useAuth()   // token attached automatically by interceptor
  const [step,         setStep]         = useState(1)
  const [service,      setService]      = useState(null)
  const [selectedDate, setSelectedDate] = useState(null)
  const [selectedTime, setSelectedTime] = useState(null)
  const [form,         setForm]         = useState({ name: '', phone: '', carModel: '', ecuModel: '', notes: '' })
  const [trackingCode, setTrackingCode] = useState(null)
  const [submitting,   setSubmitting]   = useState(false)

  const setField = (k, v) => setForm(f => ({ ...f, [k]: v }))

  /* Navigation guards */
  const canNext = () => {
    if (step === 1) return !!service
    if (step === 2) return !!selectedDate && !!selectedTime
    if (step === 3) return form.name.trim() && form.phone.trim() && form.carModel.trim()
    return false
  }

  const goNext = () => {
    if (!canNext()) {
      const msgs = {
        1: 'لطفاً یک نوع خدمت انتخاب کنید.',
        2: 'لطفاً روز و ساعت را انتخاب کنید.',
        3: 'لطفاً نام، شماره و مدل خودرو را وارد کنید.',
      }
      showToast(msgs[step])
      return
    }
    setStep(s => s + 1)
  }

  const submit = async () => {
    if (!canNext()) {
      showToast('لطفاً تمام فیلدهای اجباری را تکمیل کنید.')
      return
    }

    setSubmitting(true)
    try {
      const { data } = await api.post('/appointments', {
        name:        form.name.trim(),
        phone:       form.phone.trim(),
        carModel:    form.carModel.trim(),
        ecuModel:    form.ecuModel.trim(),
        serviceType: service,       // 'hardware' | 'remap' | 'network'
        date:        selectedDate,  // ISO date string e.g. "2025-07-01"
        timeSlot:    selectedTime,  // Persian time string e.g. "۱۰:۳۰"
        notes:       form.notes.trim(),
      })

      const code = data.appointment.trackingCode
      setTrackingCode(code)
      showToast(`✔ نوبت ثبت شد! کد پیگیری: ${code}`, 6000)

    } catch (err) {
      showToast(extractError(err), 5000)
    } finally {
      setSubmitting(false)
    }
  }

  const reset = () => {
    setStep(1); setService(null); setSelectedDate(null)
    setSelectedTime(null); setForm({ name: '', phone: '', carModel: '', ecuModel: '', notes: '' })
    setTrackingCode(null)
  }

  return (
    <>
      {/* HERO */}
      <section className="hero-grid-bg pt-36 pb-16 px-6 lg:px-12 text-center">
        <div className="max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-brand-green/30 bg-brand-green/5 text-brand-green text-xs font-semibold mb-8 animate-fade-in-up">
            <span className="w-2 h-2 rounded-full bg-brand-green animate-pulse-green inline-block" />
            سامانه هوشمند پذیرش — ۲۴ ساعته
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold leading-tight mb-5 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
            سامانه هوشمند رزرو آنلاین
            <span className="text-brand-green text-glow-green block mt-1">پذیرش و کالیبراسیون</span>
          </h1>
          <p className="text-brand-muted text-base leading-relaxed animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            در سه مرحله ساده نوبت خود را ثبت کنید — کارشناسان ما پیش از موعد با شما تماس می‌گیرند.
          </p>
        </div>
      </section>

      {/* BOOKING CARD */}
      <section className="py-16 px-6 lg:px-12 pb-28">
        <div className="max-w-3xl mx-auto">
          {trackingCode ? (
            <SuccessScreen
              trackingCode={trackingCode}
              service={service}
              date={selectedDate}
              time={selectedTime}
              onReset={reset}
            />
          ) : (
            <div className="glass-card p-8 md:p-10" style={{ borderColor: 'rgba(0,240,255,0.18)' }}>
              <StepBar current={step} />

              {/* Step content */}
              <div className="min-h-[340px]">
                {step === 1 && <Step1 selected={service} onSelect={setService} />}
                {step === 2 && (
                  <Step2
                    selectedDate={selectedDate} onDate={setSelectedDate}
                    selectedTime={selectedTime} onTime={setSelectedTime}
                  />
                )}
                {step === 3 && <Step3 form={form} onChange={setField} />}
              </div>

              {/* Navigation buttons */}
              <div className="flex items-center justify-between mt-10 pt-6 border-t border-brand-cyan/10">
                <button
                  type="button"
                  onClick={() => setStep(s => Math.max(1, s - 1))}
                  disabled={step === 1}
                  className="btn-outline-cyan px-6 py-3 text-sm font-semibold rounded-xl disabled:opacity-30 disabled:cursor-not-allowed gap-2"
                >
                  <i className="fa-solid fa-arrow-right ml-2" />مرحله قبل
                </button>

                {/* Progress dots */}
                <div className="flex gap-2">
                  {[1, 2, 3].map(n => (
                    <div key={n}
                      className={`w-2 h-2 rounded-full transition-all duration-300 ${
                        step === n ? 'bg-brand-cyan w-5' : step > n ? 'bg-brand-green' : 'bg-brand-muted/30'
                      }`}
                    />
                  ))}
                </div>

                {step < 3 ? (
                  <button type="button" onClick={goNext}
                    className="btn-neon-green animate-pulse-green px-6 py-3 text-sm font-bold rounded-xl gap-2">
                    مرحله بعد <i className="fa-solid fa-arrow-left mr-2" />
                  </button>
                ) : (
                  <button type="button" onClick={submit} disabled={submitting}
                    className="btn-neon-green animate-pulse-green px-6 py-3 text-sm font-bold rounded-xl gap-2 disabled:opacity-70">
                    {submitting
                      ? <><i className="fa-solid fa-spinner fa-spin ml-2" />در حال ثبت...</>
                      : <><i className="fa-solid fa-circle-check ml-2" />تایید و ثبت نوبت</>}
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  )
}
