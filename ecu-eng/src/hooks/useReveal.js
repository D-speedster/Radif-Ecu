import { useEffect } from 'react'

export default function useReveal() {
  useEffect(() => {
    const targets = document.querySelectorAll('.reveal')
    if (!targets.length) return

    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible')
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    )

    targets.forEach(el => observer.observe(el))
    return () => observer.disconnect()
  }, [])
}
