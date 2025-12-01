import React, { useEffect, useRef, useState } from 'react'
import axios from 'axios'

const API_URL = 'https://reloxapi.online/api'

/**
 * RELUX — Explore (third section)
 * - Own stacking context (isolation) so nothing bleeds in/out
 * - Safe paddings so it never sits under the fixed header
 * - IntersectionObserver reveal + soft parallax
 * - Left progress rail
 * - Now fetches real products from API
 */
export default function ExploreSection() {
  const rootRef = useRef(null)
  const [collections, setCollections] = useState([])
  const [loading, setLoading] = useState(true)

  // Fetch Rolex watches for the Explore section
  useEffect(() => {
    const fetchCollections = async () => {
      try {
        setLoading(true);

        const variants = ['default', 'tall', 'default', 'wide', 'default', 'default'];
        const speeds = [0.12, 0.18, 0.10, 0.16, 0.14, 0.20];

        // Local images for collections
        const localImages = [
          '/images/relux1.webp',
          '/images/relux2.webp',
          '/images/relux3.webp',
          '/images/relux4.webp',
          '/images/relux11.webp',
          '/images/relux12.webp',
        ];

        // Fetch Rolex products
        const { data } = await axios.get(`${API_URL}/products`, {
          params: { 
            brand: 'Relox',
            per_page: 6
          }
        });

        console.log('API Response:', data);

        const products = data.data || data;

        // Map up to 6 Rolex watches to collection cards
        const collections = products.slice(0, 6).map((product, index) => {
          return {
            id: product.id,
            title: product.name,
            subtitle: `${product.brand} · Premium Collection`,
            image: localImages[index % localImages.length],
            link: '#shop',
            speed: speeds[index],
            variant: variants[index]
          };
        });

        console.log('Mapped Collections:', collections);
        setCollections(collections);

      } catch (error) {
        console.error('Error fetching collections:', error);
        console.error('Error details:', error.response?.data);
        setCollections([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCollections();
  }, []);

  useEffect(() => {
    const root = rootRef.current
    if (!root) return

    // Reveal on enter
    const items = Array.from(root.querySelectorAll('.rx-card, .rx-header, .rx-copy'))
    const io = new IntersectionObserver(
      entries => {
        entries.forEach(e => {
          if (e.isIntersecting) e.target.classList.add('in-view')
        })
      },
      { root: null, threshold: 0.2, rootMargin: '0px 0px -10% 0px' }
    )
    items.forEach(el => io.observe(el))

    // Soft parallax while section is visible
    let raf = 0
    const cards = Array.from(root.querySelectorAll('[data-speed]'))
    const onScroll = () => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => {
        const rect = root.getBoundingClientRect()
        const vh = window.innerHeight || 1
        const progress = 1 - Math.min(Math.max((rect.bottom - 0) / (rect.height + vh), 0), 1)
        root.style.setProperty('--progress', progress.toFixed(3))

        cards.forEach(c => {
          const speed = parseFloat(c.dataset.speed || '0.15')
          const y = rect.top * -speed
          c.style.setProperty('--y', `${y.toFixed(1)}px`)
        })
      })
    }

    const vis = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          document.addEventListener('scroll', onScroll, { passive: true })
          onScroll()
        } else {
          document.removeEventListener('scroll', onScroll)
        }
      },
      { threshold: 0.01 }
    )
    vis.observe(root)
    onScroll()

    return () => {
      io.disconnect()
      vis.disconnect()
      document.removeEventListener('scroll', onScroll)
      cancelAnimationFrame(raf)
    }
  }, [collections])

  return (
    <section id="explore" ref={rootRef} className="rx-explore" aria-label="Explore collections">
      {/* side progress rail */}
      <div className="rx-rail" aria-hidden="true">
        <span className="rx-rail__fill" />
      </div>

      <div className="rx-shell container">
        <header className="rx-header">
          <span className="rx-eyebrow">Collections</span>
          <h3 className="rx-title">Explore Our Signature Lines</h3>
          <p className="rx-copy">
            From deep-sea resilience to metropolitan finesse — discover precision that suits your pace.
          </p>
        </header>

        {loading ? (
          <div className="rx-loading">
            <div className="rx-spinner"></div>
            <p>Curating collections...</p>
          </div>
        ) : collections.length === 0 ? (
          <div className="rx-empty">
            <p>No collections available at the moment.</p>
          </div>
        ) : (
          <div className="rx-grid">
            {collections.map((collection, index) => (
              <article 
                key={collection.id} 
                className={`rx-card ${collection.variant === 'tall' ? 'rx-card--tall' : ''} ${collection.variant === 'wide' ? 'rx-card--wide' : ''}`}
                data-speed={collection.speed} 
                style={{ '--img': `url(${collection.image})` }}
              >
                <a href={collection.link} className="rx-card__link" aria-label={collection.title}>
                  <div className="rx-card__image" />
                  <div className="rx-card__body">
                    <h4>{collection.title}</h4>
                    <p>{collection.subtitle}</p>
                  </div>
                </a>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}