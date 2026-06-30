import { createContext, useContext, useState, useCallback, useRef } from 'react'

const ToastContext = createContext(null)

export function ToastProvider({ children }) {
  const [toast, setToast] = useState({ message: '', visible: false })
  const timerRef = useRef(null)

  const showToast = useCallback((message, duration = 4000) => {
    if (timerRef.current) clearTimeout(timerRef.current)
    setToast({ message, visible: true })
    timerRef.current = setTimeout(() => {
      setToast(t => ({ ...t, visible: false }))
    }, duration)
  }, [])

  return (
    <ToastContext.Provider value={showToast}>
      {children}
      <div
        role="alert"
        aria-live="polite"
        className={`toast-container${toast.visible ? ' show' : ''}`}
      >
        <i className="fa-solid fa-circle-check ml-2" />
        {toast.message}
      </div>
    </ToastContext.Provider>
  )
}

export function useToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used inside <ToastProvider>')
  return ctx
}
