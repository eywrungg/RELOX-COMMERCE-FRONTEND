import React, { useEffect, useRef } from 'react'

export default function HeroSection() {
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) el.classList.add('in-view')
    }, { threshold: 0.25 })
    io.observe(el)
    return () => io.disconnect()
  }, [])

  return (
    <section id="home" ref={ref} className="relux-hero section--with-rail">
      {/* inner shifts right; background stays full-bleed */}
      <div className="section-inner">
        <div className="relux-hero__container">
          {/* Left: Copy */}
          <div className="relux-hero__copy">
            <h2 className="relux-hero__title">Timeless Craft, Modern Edge</h2>
            <p className="relux-hero__subtitle">
              Discover precision engineering and contemporary design, built to
              keep perfect time — and perfect presence.
            </p>

            <div className="relux-hero__ctas">
              <a href="#shop" className="rh-btn rh-btn--gold">Shop Watches</a>
              <a href="#about" className="rh-btn rh-btn--ghost">About Our Craft</a>
            </div>

            <ul className="relux-hero__badges" aria-label="Highlights">
              <li><span>Swiss Movement</span></li>
              <li><span>5-Year Warranty</span></li>
              <li><span>Insured Shipping</span></li>
            </ul>
          </div>

          {/* Right: Visual */}
          <div className="relux-hero__visual" aria-hidden="true">
            <div className="rh-ring rh-ring--outer" />
            <div className="rh-ring rh-ring--mid" />
            <div className="rh-ring rh-ring--inner" />
            <div className="rh-gem">RLX</div>

            <div className="rh-card">
              <div className="rh-card__eyebrow">Featured</div>
              <div className="rh-card__name">Relox SeaOne</div>
              <div className="rh-card__meta">41&nbsp;mm · 300&nbsp;m · Ceramic Bezel</div>
              <div className="rh-card__price">₱30,990</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
