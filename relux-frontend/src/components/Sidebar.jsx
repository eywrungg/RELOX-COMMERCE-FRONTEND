import React, { useEffect } from 'react'

export default function Sidebar({ visible = false }) {
  const nav = [
    { label: 'MEN', href: '#men' },
    { label: 'WOMEN', href: '#women' },
    { label: 'SALE', href: '#sale' },
    { label: 'MORE', href: '#more' },
  ]

  const socials = [
    {
      name: 'Facebook',
      href: '#',
      svg: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M24 12.073C24 5.446 18.627.073 12 .073S0 5.446 0 12.073c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953h-1.512c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
        </svg>
      ),
    },
    {
      name: 'Instagram',
      href: '#',
      svg: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0 3.675a6.163 6.163 0 100 12.325 6.163 6.163 0 000-12.325zm6.406-1.358a1.44 1.44 0 100 2.88 1.44 1.44 0 000-2.88z"/>
        </svg>
      ),
    },
    {
      name: 'Twitter',
      href: '#',
      svg: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
        </svg>
      ),
    },
  ]

  useEffect(() => {
    const navEls = Array.from(document.querySelectorAll('.sidebar-fixed .nav-item'))
    const socEls = Array.from(document.querySelectorAll('.sidebar-social-bottom .social-icon'))

    if (!visible) {
      navEls.forEach((el) => { el.classList.remove('enter'); el.style.removeProperty('--delay') })
      socEls.forEach((el) => { el.classList.remove('enter'); el.style.removeProperty('--delay') })
      return
    }

    navEls.forEach((el, i) => {
      el.style.setProperty('--delay', `${120 + i * 100}ms`)
      void el.offsetWidth
      el.classList.add('enter')
    })

    socEls.forEach((el, i) => {
      el.style.setProperty('--delay', `${220 + i * 120}ms`)
      void el.offsetWidth
      el.classList.add('enter')
    })
  }, [visible])

  // CRITICAL FIX: Don't render sidebar at all when not visible
  if (!visible) {
    return null
  }

  return (
    <aside className="sidebar-fixed sidebar--on" aria-label="Sidebar">
      <nav aria-label="Primary">
        {nav.map((n) => (
          <a key={n.label} href={n.href} className="nav-item">
            {n.label}
          </a>
        ))}
      </nav>

      <div className="sidebar-social-bottom" aria-label="Social links">
        {socials.map((s) => (
          <a key={s.name} href={s.href} className="social-icon" title={s.name} aria-label={s.name}>
            {s.svg}
          </a>
        ))}
      </div>
    </aside>
  )
}