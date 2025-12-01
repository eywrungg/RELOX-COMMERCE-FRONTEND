import React, { useEffect, useRef, useState } from 'react'
import axios from 'axios'

const API_URL = 'https://reloxapi.online/api'

export default function BrandsAndNew({ onFilterChange }) {
  const ref = useRef(null)
  const [freshPicks, setFreshPicks] = useState([])
  const [loading, setLoading] = useState(true)

  // Fetch Rado watches (ref 122-125)
  useEffect(() => {
    const fetchRadoWatches = async () => {
      try {
        setLoading(true)
        const { data } = await axios.get(`${API_URL}/products`, {
          params: {
            brand: 'Relox',
            per_page: 10
          }
        })

        console.log('Rado API Response:', data)

        const products = data.data || data
        
        const filteredProducts = products.filter(p => 
          p.id >= 122 && p.id <= 125
        )
        
        const productsToMap = filteredProducts.length >= 4 
          ? filteredProducts.slice(0, 4) 
          : products.slice(0, 4)
        
        const localImages = [
          '/images/relux5.webp',
          '/images/relux7.webp',
          '/images/relux8.webp',
          '/images/relux9.webp',
          '/images/relux10.webp'
        ];

        const mappedProducts = productsToMap.map((product, index) => {
          return {
            id: product.id,
            name: product.name,
            model: product.brand,
            price: product.price,
            image: localImages[index % localImages.length],
            badge:
              index === 0 ? 'New' :
              index === 1 ? 'Popular' :
              index === 3 ? 'Limited' :
              null
          };
        });

        setFreshPicks(mappedProducts)
      } catch (error) {
        console.error('Error fetching Rado watches:', error)
        setFreshPicks([])
      } finally {
        setLoading(false)
      }
    }

    fetchRadoWatches()
  }, [])

  // ENHANCED: Smooth scroll-triggered animations - butter smooth!
  useEffect(() => {
    const root = ref.current
    if (!root) return

    const cards = Array.from(root.querySelectorAll('.curated-card'))
    
    // Detect mobile for optimized animations
    const isMobile = window.innerWidth <= 768
    const delayIncrement = isMobile ? 100 : 120 // Faster on mobile
    
    // Pre-set delays to avoid calculation during intersection
    cards.forEach((card, i) => {
      card.style.setProperty('--delay', `${i * delayIncrement}ms`)
    })

    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          const el = entry.target
          
          if (entry.isIntersecting) {
            // Simple, instant class add - no RAF needed
            if (!el.classList.contains('is-visible')) {
              el.classList.add('is-visible')
            }
          }
          // Don't reset on scroll out - keep them visible once shown
        })
      },
      {
        root: null,
        rootMargin: isMobile ? '0px 0px -5% 0px' : '0px 0px -10% 0px', // Earlier trigger on mobile
        threshold: isMobile ? 0.1 : 0.15 // Lower threshold for mobile
      }
    )

    cards.forEach(c => observer.observe(c))

    return () => observer.disconnect()
  }, [freshPicks])

  const handleViewCollection = () => {
    window.location.hash = 'shop'
    
    setTimeout(() => {
      if (onFilterChange) {
        onFilterChange('brand', 'Rado')
      }
    }, 100)
  }

  return (
    <section id="brands" ref={ref} className="curated-showcase section--with-rail">
      <div className="section-inner">
        {/* Floating Brand Marquee */}
        <div className="showcase-marquee" aria-hidden="true">
          <div className="marquee-track">
            {['Relox','Omega','Patek Philippe','Audemars Piguet','Tag Heuer','IWC','Longines','Seiko','Tissot','Rado']
              .concat(['Relox','Omega','Patek Philippe','Audemars Piguet','Tag Heuer','IWC','Longines','Seiko','Tissot','Rado'])
              .map((brand, i) => (
                <span key={i} className="brand-chip">{brand}</span>
              ))
            }
          </div>
        </div>

        <div className="showcase-container container">
          {/* Premium Title Section */}
          <div className="showcase-title-section">
            <div className="title-content">
              <span className="title-badge">Curated Selection</span>
              <h3 className="showcase-main-title">
                Handpicked Excellence from <span className="title-highlight">Relox</span>
              </h3>
              <p className="showcase-description">
                Discover our meticulously curated collection of premium timepieces, 
                each representing the pinnacle of Swiss craftsmanship and timeless design.
              </p>
            </div>
            <button 
              className="collection-cta"
              onClick={handleViewCollection}
              aria-label="View full Rado collection"
            >
              <span>Explore Collection</span>
              <svg viewBox="0 0 24 24" width="20" height="20">
                <path d="M5 12h14M12 5l7 7-7 7" 
                      fill="none" 
                      stroke="currentColor" 
                      strokeWidth="2.5" 
                      strokeLinecap="round" 
                      strokeLinejoin="round"/>
              </svg>
            </button>
          </div>

          {loading ? (
            <div className="showcase-loading">
              <div className="loading-ring"></div>
              <p>Curating your selection...</p>
            </div>
          ) : freshPicks.length === 0 ? (
            <div className="showcase-empty">
              <svg viewBox="0 0 24 24" width="64" height="64" fill="none" stroke="currentColor" strokeWidth="1.5">
                <circle cx="12" cy="12" r="10"/>
                <path d="M12 6v6l4 2"/>
              </svg>
              <p>No timepieces available at the moment.</p>
            </div>
          ) : (
            <div className="curated-grid">
              {freshPicks.map((product) => (
                <article className="curated-card" key={product.id}>
                  <a href={`#product/${product.id}`} className="card-link" aria-label={product.name}>
                    <div className="card-visual">
                      {product.badge && (
                        <div className="premium-badge">{product.badge}</div>
                      )}
                      <div className="image-glow"></div>
                      <img 
                        src={product.image} 
                        alt={product.name}
                        className="timepiece-image"
                        loading="lazy"
                      />
                    </div>
                    <div className="card-details">
                      <div className="details-content">
                        <h4 className="timepiece-name">{product.name}</h4>
                        <span className="timepiece-brand">{product.model}</span>
                      </div>
                      <div className="price-tag">₱{product.price.toLocaleString()}</div>
                    </div>
                  </a>
                </article>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}