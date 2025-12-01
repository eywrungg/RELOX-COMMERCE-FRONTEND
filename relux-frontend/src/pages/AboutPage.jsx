import React, { useEffect, useRef, useState } from 'react';

const AboutPage = () => {
  const [heroTextSplit, setHeroTextSplit] = useState(0);
  const [valuesProgress, setValuesProgress] = useState(0);
  const [galleryProgress, setGalleryProgress] = useState(0);
  const [whyReluxProgress, setWhyReluxProgress] = useState(0);
  const [timelineProgress, setTimelineProgress] = useState(0);
  
  const aboutWrapperRef = useRef(null);
  const heroAboutRef = useRef(null);
  const valuesSectionRef = useRef(null);
  const timelineRef = useRef(null);
  const gallerySectionRef = useRef(null);
  const whyReluxSectionRef = useRef(null);
  const storyRef = useRef(null);
  
  // Scroll lock state management
  const scrollLockState = useRef({
    isLocked: false,
    lockedSection: null,
    galleryProgress: 0,
    whyReluxProgress: 0,
    lastScrollTime: 0
  });

  // Scroll to top on mount
  useEffect(() => {
    if (aboutWrapperRef.current) {
      aboutWrapperRef.current.scrollTop = 0;
    }
  }, []);

  // Hero text split
  useEffect(() => {
    const wrapper = aboutWrapperRef.current;
    if (!wrapper) return;

    const handleScroll = () => {
      const scrolled = wrapper.scrollTop;
      const heroHeight = heroAboutRef.current?.offsetHeight || 0;
      const progress = Math.min(Math.max(scrolled / (heroHeight * 0.6), 0), 1);
      setHeroTextSplit(progress);
    };

    wrapper.addEventListener('scroll', handleScroll, { passive: true });
    return () => wrapper.removeEventListener('scroll', handleScroll);
  }, []);

  // Values - Smooth parallax reveal
  useEffect(() => {
    const valuesSection = valuesSectionRef.current;
    const wrapper = aboutWrapperRef.current;
    if (!valuesSection || !wrapper) return;

    const handleScroll = () => {
      const rect = valuesSection.getBoundingClientRect();
      const sectionTop = rect.top;
      const sectionHeight = rect.height;
      const viewportHeight = window.innerHeight;
      
      const scrollProgress = Math.max(0, Math.min(1, 
        (viewportHeight - sectionTop) / (sectionHeight + viewportHeight * 0.5)
      ));
      
      setValuesProgress(scrollProgress);
    };

    wrapper.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    
    return () => wrapper.removeEventListener('scroll', handleScroll);
  }, []);

  // IMPROVED GALLERY SCROLL LOCK
  useEffect(() => {
    const gallerySection = gallerySectionRef.current;
    const wrapper = aboutWrapperRef.current;
    if (!gallerySection || !wrapper) return;

    const handleWheel = (e) => {
      const rect = gallerySection.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      
      // Check if section is in viewport (more generous range)
      const isInViewport = rect.top < viewportHeight * 0.7 && rect.bottom > viewportHeight * 0.3;
      
      if (!isInViewport) return;

      const state = scrollLockState.current;
      const currentProgress = state.galleryProgress;
      
      // Check if animation is complete
      const isComplete = currentProgress >= 100;
      const isAtStart = currentProgress <= 0;
      
      // Determine if we should lock
      const shouldLock = (!isComplete && e.deltaY > 0) || (!isAtStart && e.deltaY < 0);
      
      if (shouldLock) {
        e.preventDefault();
        
        // Prevent scroll propagation
        state.isLocked = true;
        state.lockedSection = 'gallery';
        
        // Smoother increment (adjust sensitivity)
        const increment = e.deltaY * 0.15; // Reduced from 0.15 for smoother control
        const newProgress = Math.max(0, Math.min(100, currentProgress + increment));
        
        state.galleryProgress = newProgress;
        setGalleryProgress(newProgress);
        
        // Release lock after animation completes
        if (newProgress >= 100 || newProgress <= 0) {
          setTimeout(() => {
            state.isLocked = false;
            state.lockedSection = null;
          }, 300);
        }
      }
    };

    wrapper.addEventListener('wheel', handleWheel, { passive: false });
    
    return () => {
      wrapper.removeEventListener('wheel', handleWheel);
      scrollLockState.current.isLocked = false;
      scrollLockState.current.lockedSection = null;
    };
  }, []);

  // IMPROVED WHY RELUX SCROLL LOCK
  useEffect(() => {
    const whyReluxSection = whyReluxSectionRef.current;
    const wrapper = aboutWrapperRef.current;
    if (!whyReluxSection || !wrapper) return;

    const handleWheel = (e) => {
      const rect = whyReluxSection.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      
      // Check if section is in viewport
      const isInViewport = rect.top < viewportHeight * 0.7 && rect.bottom > viewportHeight * 0.3;
      
      if (!isInViewport) return;

      const state = scrollLockState.current;
      const currentProgress = state.whyReluxProgress;
      
      const isComplete = currentProgress >= 100;
      const isAtStart = currentProgress <= 0;
      
      const shouldLock = (!isComplete && e.deltaY > 0) || (!isAtStart && e.deltaY < 0);
      
      if (shouldLock) {
        e.preventDefault();
        
        state.isLocked = true;
        state.lockedSection = 'whyrelux';
        
        const increment = e.deltaY * 0.15;
        const newProgress = Math.max(0, Math.min(100, currentProgress + increment));
        
        state.whyReluxProgress = newProgress;
        setWhyReluxProgress(newProgress);
        
        if (newProgress >= 100 || newProgress <= 0) {
          setTimeout(() => {
            state.isLocked = false;
            state.lockedSection = null;
          }, 300);
        }
      }
    };

    wrapper.addEventListener('wheel', handleWheel, { passive: false });
    
    return () => {
      wrapper.removeEventListener('wheel', handleWheel);
    };
  }, []);

  // Timeline
  useEffect(() => {
    const wrapper = aboutWrapperRef.current;
    if (!wrapper) return;

    const handleScroll = () => {
      if (!timelineRef.current) return;
      
      const rect = timelineRef.current.getBoundingClientRect();
      const sectionTop = rect.top;
      const sectionHeight = rect.height;
      const viewportHeight = window.innerHeight;
      
      const progress = Math.max(0, Math.min(1, 
        (viewportHeight - sectionTop) / (sectionHeight + viewportHeight * 0.2)
      ));
      
      setTimelineProgress(progress);
      timelineRef.current.style.setProperty('--timeline-progress', progress);
    };

    wrapper.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => wrapper.removeEventListener('scroll', handleScroll);
  }, []);

  // Fade-in observer
  useEffect(() => {
    const fadeElements = aboutWrapperRef.current?.querySelectorAll('.fade-on-scroll');
    if (!fadeElements) return;
    
    const fadeObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('fade-visible');
          } else {
            entry.target.classList.remove('fade-visible');
          }
        });
      },
      { 
        threshold: 0.15,
        rootMargin: '0px 0px -80px 0px'
      }
    );

    fadeElements.forEach((el) => fadeObserver.observe(el));
    return () => fadeObserver.disconnect();
  }, []);

  return (
    <div className="about-page-wrapper" ref={aboutWrapperRef}>
      <div className="about-page">
        {/* 1. HERO WITH VIDEO */}
        <section className="hero-about-section" ref={heroAboutRef}>
          <div className="hero-video-container">
            <video 
              className="hero-video-bg" 
              autoPlay 
              muted 
              loop 
              playsInline 
              preload="auto"
            >
              <source src="/media/about-videoko.mp4" type="video/mp4" />
            </video>
            <div className="hero-video-overlay"></div>
          </div>

          <div className="hero-about-content">
            <h1 className="hero-about-title split-text" style={{ '--split': heroTextSplit }}>
              <span className="text-left">RE</span>
              <span className="text-right">LOX</span>
            </h1>
            <p className="hero-about-subtitle" style={{ opacity: heroTextSplit }}>
              Where Luxury Meets Innovation
            </p>
          </div>
          <div className="scroll-hint-about">Scroll to explore</div>
        </section>

        {/* 2. OUR STORY */}
        <section className="story-section fade-on-scroll" ref={storyRef}>
          <div className="story-container">
            <div className="story-content">
              <span className="story-badge">EST. 2025</span>
              <h2 className="story-title">
                Our Story
                <span className="highlight">Redefining Luxury</span>
              </h2>
              <p className="story-description">
                Founded in 2025, Relox has revolutionized the luxury market by making premium products accessible to everyone, everywhere. We believe that true luxury isn't just about exclusivity—it's about exceptional quality, timeless design, and experiences that last a lifetime.
              </p>
              <div className="story-decorative-line"></div>
              <div className="story-stats-mini">
                <div className="story-stat">
                  <span className="story-stat-number">2025</span>
                  <span className="story-stat-label">Founded</span>
                </div>
                <div className="story-stat">
                  <span className="story-stat-number">No.1</span>
                  <span className="story-stat-label">Mindanao</span>
                </div>
                <div className="story-stat">
                  <span className="story-stat-number">50K+</span>
                  <span className="story-stat-label">Customers</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 3. OUR VALUES */}
        <section className="values-section fade-on-scroll" ref={valuesSectionRef}>
          <div className="values-container">
            <div className="values-header">
              <h2 className="values-title">Our Core Values</h2>
              <p className="values-subtitle">The principles that drive everything we do</p>
            </div>
            
            <div className="values-grid">
              {[
                { icon: '💡', title: 'Innovation', desc: 'Constantly pushing boundaries to create groundbreaking luxury experiences' },
                { icon: '⭐', title: 'Quality', desc: 'Uncompromising standards in every product we craft and deliver' },
                { icon: '🤝', title: 'Trust', desc: 'Building lasting relationships through transparency and reliability' },
                { icon: '❤️', title: 'Passion', desc: 'Dedicated artisans who pour their heart into every detail' }
              ].map((value, i) => (
                <div 
                  key={i}
                  className="value-card"
                  style={{
                    opacity: valuesProgress,
                    transform: `translateY(${(1 - valuesProgress) * 50}px) scale(${0.9 + valuesProgress * 0.1})`,
                    transitionDelay: `${i * 0.1}s`
                  }}
                >
                  <div className="value-icon-wrapper">
                    <div className="value-icon">{value.icon}</div>
                  </div>
                  <h3 className="value-title">{value.title}</h3>
                  <p className="value-desc">{value.desc}</p>
                  <div className="value-shine"></div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 4. GALLERY - 5 Cards with Scroll Lock */}
        <section className="gallery-section fade-on-scroll" ref={gallerySectionRef}>
          <div className="gallery-container">
            <div className="gallery-header">
              <h2>Signature Collection</h2>
              <p>Precision engineered timepieces</p>
            </div>
            <div className="gallery-grid">
              {[
                { icon: '⌚', name: 'Classic Chronograph' },
                { icon: '💎', name: 'Diamond Edition' },
                { icon: '👑', name: 'Royal Heritage' },
                { icon: '🌙', name: 'Moon Phase' },
                { icon: '⚡', name: 'Sport Elite' }
              ].map((item, i) => {
                const cardStart = i * 20;
                const cardEnd = (i + 1) * 20;
                const cardProgress = Math.max(0, Math.min(1, 
                  (galleryProgress - cardStart) / (cardEnd - cardStart)
                ));
                
                const getTransform = () => {
                  switch(i % 3) {
                    case 0:
                      return `translateY(${(1 - cardProgress) * 100}px) scale(${0.8 + cardProgress * 0.2})`;
                    case 1:
                      return `translateX(${(1 - cardProgress) * 100}px) scale(${0.8 + cardProgress * 0.2})`;
                    case 2:
                      return `scale(${0.5 + cardProgress * 0.5}) rotate(${(1 - cardProgress) * 180}deg)`;
                    default:
                      return `translateY(${(1 - cardProgress) * 100}px)`;
                  }
                };
                
                return (
                  <div 
                    key={i}
                    className="gallery-item"
                    style={{
                      transform: getTransform(),
                      opacity: cardProgress,
                      transition: 'transform 0.3s ease, opacity 0.3s ease'
                    }}
                  >
                    <div className="gallery-icon">{item.icon}</div>
                    <div className="gallery-name">{item.name}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* 5. WHY RELUX - Scroll Lock Cards */}
        <section className="why-relux-section fade-on-scroll" ref={whyReluxSectionRef}>
          <div className="why-relux-container">
            <div className="why-relux-header">
              <h2>Why Choose Relox?</h2>
              <p>What sets us apart in the world of luxury</p>
            </div>
            <div className="why-relux-grid">
              {[
                { 
                  icon: '🎯', 
                  title: 'Precision Engineering', 
                  desc: 'Every timepiece is crafted with Swiss precision, ensuring accuracy within ±2 seconds per day.',
                  color: '#fbbf24'
                },
                { 
                  icon: '🌍', 
                  title: 'Global Accessibility', 
                  desc: 'Luxury shouldn\'t be exclusive. We deliver premium quality to 120+ countries worldwide.',
                  color: '#60a5fa'
                },
                { 
                  icon: '♻️', 
                  title: 'Sustainable Luxury', 
                  desc: 'Ethically sourced materials and carbon-neutral shipping. Luxury with a conscience.',
                  color: '#34d399'
                },
                { 
                  icon: '🔐', 
                  title: 'Lifetime Guarantee', 
                  desc: 'Your investment is protected forever. Free servicing and repairs for life.',
                  color: '#f472b6'
                }
              ].map((reason, i) => {
                const cardStart = i * 25;
                const cardEnd = (i + 1) * 25;
                const cardProgress = Math.max(0, Math.min(1, 
                  (whyReluxProgress - cardStart) / (cardEnd - cardStart)
                ));
                
                const scale = 0.3 + cardProgress * 0.7;
                const rotation = (1 - cardProgress) * 90;
                const opacity = cardProgress;
                
                return (
                  <div 
                    key={i}
                    className="why-relux-card"
                    style={{
                      transform: `scale(${scale}) rotate(${rotation}deg)`,
                      opacity: opacity,
                      transition: 'transform 0.4s ease, opacity 0.4s ease',
                      '--accent-color': reason.color
                    }}
                  >
                    <div className="why-icon" style={{ background: reason.color }}>
                      {reason.icon}
                    </div>
                    <h3>{reason.title}</h3>
                    <p>{reason.desc}</p>
                    <div className="card-glow" style={{ background: `${reason.color}33` }}></div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* 6. TIMELINE */}
        <section className="timeline-section fade-on-scroll" ref={timelineRef}>
          <div className="timeline-header">
            <h2>Our Journey</h2>
            <p>Milestones that shaped who we are</p>
          </div>
          <div className="timeline">
            <div className="timeline-line"></div>
            <div className="timeline-item" data-year="2020">
              <div className="timeline-dot"></div>
              <div className="timeline-content">
                <h3>The Beginning</h3>
                <p>Relox was founded with a vision to democratize luxury</p>
              </div>
            </div>
            <div className="timeline-item" data-year="2021">
              <div className="timeline-dot"></div>
              <div className="timeline-content">
                <h3>Global Expansion</h3>
                <p>Reached 50 countries worldwide</p>
              </div>
            </div>
            <div className="timeline-item" data-year="2022">
              <div className="timeline-dot"></div>
              <div className="timeline-content">
                <h3>1M Customers</h3>
                <p>Celebrated our millionth happy customer</p>
              </div>
            </div>
            <div className="timeline-item" data-year="2023">
              <div className="timeline-dot"></div>
              <div className="timeline-content">
                <h3>Award Winning</h3>
                <p>Recognized as Best Luxury E-commerce Platform</p>
              </div>
            </div>
            <div className="timeline-item" data-year="2024">
              <div className="timeline-dot"></div>
              <div className="timeline-content">
                <h3>Innovation Hub</h3>
                <p>Launched AI-powered personal shopping assistant</p>
              </div>
            </div>
          </div>
        </section>

{/* 7. TEAM */}
<section className="team-section fade-on-scroll">
  <div className="team-header">
    <h2>Meet The Team</h2>
    <p>The visionaries behind Relox</p>
  </div>
  <div className="team-grid">
    {[
      { 
        name: 'Charles Arone Alcebar', 
        role: 'Main Developer', 
        initial: 'CA',
        image: '/media/charles.jpg' // ✅ Add your image here
      },
      { 
        name: 'John Alfonsus Taruc', 
        role: 'Creative Director', 
        initial: 'JT',
        image: '/media/ruc.jpg' // ✅ Add your image here
      },
      { 
        name: 'Jacklyn Soriano', 
        role: 'Documentation Specialist', 
        initial: 'JS',
        image: '/media/jac.jpg' // ✅ Add your image here
      },
      { 
        name: 'Ceasar Taclahan', 
        role: 'Asset Provider', 
        initial: 'CT',
        image: '/media/sar.jpg' // ✅ Add your image here
      },
      { 
        name: 'Jhyzie Cano', 
        role: 'President', 
        initial: 'JC',
        image: 'public/media/jhy.jpg' // ✅ Add your image here
      }
    ].map((member, i) => (
      <div key={i} className="team-card zoom-on-scroll" style={{ '--index': i }}>
        <div className="team-avatar">
          {member.image ? (
            <img 
              src={member.image} 
              alt={member.name}
              className="team-avatar-image"
              onError={(e) => {
                // Fallback to initials if image fails to load
                e.target.style.display = 'none';
                e.target.nextElementSibling.style.display = 'flex';
              }}
            />
          ) : null}
          <div 
            className="team-avatar-initials" 
            style={{ display: member.image ? 'none' : 'flex' }}
          >
            {member.initial}
          </div>
        </div>
        <h3>{member.name}</h3>
        <p>{member.role}</p>
        <div className="card-shine"></div>
      </div>
    ))}
  </div>
</section>
        {/* 8. CTA */}
        <section className="cta-section fade-on-scroll">
          <div className="cta-content">
            <h2>Ready to Experience<br/><span className="highlight">True Luxury?</span></h2>
            <p>Join thousands of satisfied customers worldwide</p>
            <div className="cta-buttons">
              <a href="#shop" className="btn-primary">
                Start Shopping
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </a>
              <a href="#contact" className="btn-secondary">Contact Us</a>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default AboutPage;