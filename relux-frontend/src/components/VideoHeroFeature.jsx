import React, { useEffect, useRef, useState } from 'react';

const VideoHeroFeature = ({ 
  videoSrc = '/media/video1.mp4',
  posterImage = '/media/sand-gold-poster.jpg'
}) => {
  const sectionRef = useRef(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isInView, setIsInView] = useState(false);

  // Intersection Observer to detect when section is in viewport
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsInView(true);
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '0px'
      }
    );

    observer.observe(section);

    return () => {
      if (section) {
        observer.unobserve(section);
      }
    };
  }, []);

  // Scroll progress tracking - more aggressive
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const handleScroll = () => {
      const rect = section.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const sectionTop = rect.top;
      const sectionHeight = rect.height;
      
      // Calculate progress from when section enters viewport
      if (sectionTop < windowHeight && sectionTop + sectionHeight > 0) {
        // More aggressive progress calculation
        const scrolled = windowHeight - sectionTop;
        const total = windowHeight + sectionHeight;
        const progress = Math.max(0, Math.min(1, scrolled / total));
        
        setScrollProgress(progress);
        section.style.setProperty('--scroll-progress', progress);
      }
    };

    // Listen on both window and document
    window.addEventListener('scroll', handleScroll, { passive: true });
    document.addEventListener('scroll', handleScroll, { passive: true });
    
    // Initial call
    handleScroll();
    
    // Delayed initial call to ensure proper calculation
    setTimeout(handleScroll, 100);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Force animations after mount with delay
  useEffect(() => {
    if (isInView) {
      // Gradually increase progress to trigger animations
      const timer1 = setTimeout(() => setScrollProgress(0.1), 100);
      const timer2 = setTimeout(() => setScrollProgress(0.3), 300);
      const timer3 = setTimeout(() => setScrollProgress(0.5), 500);
      const timer4 = setTimeout(() => setScrollProgress(0.7), 700);
      const timer5 = setTimeout(() => setScrollProgress(1), 900);
      
      return () => {
        clearTimeout(timer1);
        clearTimeout(timer2);
        clearTimeout(timer3);
        clearTimeout(timer4);
        clearTimeout(timer5);
      };
    }
  }, [isInView]);

  // Calculate animation states - more lenient thresholds
  const eyebrowVisible = scrollProgress > 0.02 || isInView;
  const titleSplit = Math.max(0, Math.min(1, scrollProgress));
  const subtitleVisible = scrollProgress > 0.15 || isInView;
  const featuresVisible = scrollProgress > 0.25 || isInView;

  const handleShopNow = () => {
    window.location.hash = 'shop';
  };

  // Feature items
  const features = [
    { 
      image: '/images/sside.webp',
      title: 'Flying Tourbillon', 
      desc: 'Gravity-defying precision',
      delay: 0
    },
    { 
      image: '/images/sand.webp',
      title: 'Sand Gold Alloy', 
      desc: 'Exclusive 18K composition',
      delay: 0.15
    },
    { 
      image: '/images/sandunder.webp',
      title: 'Openworked Dial', 
      desc: 'Skeletonized artistry',
      delay: 0.3
    }
  ];

  return (
    <section 
      className="videohero-section"
      ref={sectionRef}
      style={{ '--scroll-progress': scrollProgress }}
    >
      {/* Video Background */}
      <div className="videohero-video-container">
        <video 
          className="videohero-video-bg" 
          autoPlay 
          muted 
          loop 
          playsInline 
          poster={posterImage}
        >
          <source src={videoSrc} type="video/mp4" />
        </video>
        
        {/* Overlay System */}
        <div className="videohero-overlay">
          <div className="videohero-overlay-base"></div>
          <div className="videohero-overlay-glow"></div>
          <div className="videohero-overlay-vignette"></div>
        </div>
      </div>

      {/* Content */}
      <div className="videohero-content-wrapper">
        <div className="videohero-content">
          
          {/* Eyebrow */}
          <div className={`videohero-eyebrow ${eyebrowVisible ? 'visible' : ''}`}>
            <span className="videohero-eyebrow-text">NEW RELEASE 2024</span>
          </div>
          
          {/* Split Title */}
          <h2 
            className="videohero-title split-text" 
            style={{ '--split': titleSplit }}
          >
            <span className="text-left">SAND</span>
            <span className="text-right">GOLD</span>
          </h2>
          
          {/* Subtitle */}
          <p className={`videohero-subtitle ${subtitleVisible ? 'visible' : ''}`}>
            A revolutionary 18-carat gold alloy with a unique granular finish 
            that captures the essence of desert sands at golden hour.
          </p>
          
          {/* Feature Cards with Images */}
          <div className={`videohero-features ${featuresVisible ? 'visible' : ''}`}>
            {features.map((feature, i) => (
              <div 
                key={i}
                className="videohero-feature-card"
                style={{ '--delay': `${feature.delay}s` }}
              >
                <div className="videohero-feature-image">
                  <img 
                    src={feature.image} 
                    alt={feature.title}
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextElementSibling.style.display = 'flex';
                    }}
                  />
                  <div className="videohero-feature-image-placeholder">
                    <span className="placeholder-icon">🕰</span>
                  </div>
                </div>
                <div className="videohero-feature-content">
                  <h4 className="videohero-feature-title">{feature.title}</h4>
                  <p className="videohero-feature-desc">{feature.desc}</p>
                </div>
                <div className="videohero-feature-shine"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default VideoHeroFeature;