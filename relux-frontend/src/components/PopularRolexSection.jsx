import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { addToCart } from '../services/cartService';

const API_URL = 'https://reloxapi.online/api';

// Local images array - you can customize these paths
const LOCAL_IMAGES = [
  '/images/relux1.webp',
  '/images/relux2.webp', // add more as needed
  '/images/relux3.webp',
  '/images/relux4.webp',
];

const PopularRolexSection = ({ isAuthenticated, onShowAuth, onCartUpdate }) => {
  const sectionRef = useRef(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [isChanging, setIsChanging] = useState(false);
  const [direction, setDirection] = useState('');
  const [watches, setWatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [addingToCart, setAddingToCart] = useState(false);

  // Fetch Omega watches
  useEffect(() => {
    const fetchOmegaWatches = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get(`${API_URL}/products`, {
          params: {
            brand: 'Omega',
            per_page: 4
          }
        });

        console.log('Omega API Response:', data);

        const products = data.data || data;
        const mappedProducts = products.slice(0, 4).map((product, index) => {
          // Use local image instead of API image
          const localImage = LOCAL_IMAGES[index] || LOCAL_IMAGES[0];

          // Calculate discount
          const originalPrice = Math.round(product.price * 1.2);
          const discountPercent = Math.round(((originalPrice - product.price) / originalPrice) * 100);

          return {
            id: product.id,
            name: product.name,
            brand: product.brand,
            category: index % 2 === 0 ? "MEN'S WATCHES" : "WOMEN'S WATCHES",
            price: product.price,
            originalPrice: originalPrice,
            discount: `-${discountPercent}%`,
            image: localImage, // ✅ Using local image
            featured: index === 0 || index === 2,
            stock: product.stock || 10
          };
        });

        setWatches(mappedProducts);
      } catch (error) {
        console.error('Error fetching Omega watches:', error);
        // Fallback data with local image
        setWatches([
          {
            id: 1,
            name: 'Seamaster Diver 300M',
            brand: 'Omega',
            category: "MEN'S WATCHES",
            price: 899000,
            originalPrice: 1099000,
            discount: '-18%',
            image: '/images/relux1.webp', // ✅ Local fallback
            featured: true,
            stock: 5
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchOmegaWatches();
  }, []);

  // Intersection Observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        } else {
          setIsVisible(false);
        }
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const nextSlide = () => {
    if (isChanging || watches.length === 0) return;
    setDirection('next');
    setIsChanging(true);
    
    setTimeout(() => {
      setCurrentSlide((prev) => (prev + 1) % watches.length);
    }, 300);
    
    setTimeout(() => {
      setIsChanging(false);
      setDirection('');
    }, 650);
  };

  const prevSlide = () => {
    if (isChanging || watches.length === 0) return;
    setDirection('prev');
    setIsChanging(true);
    
    setTimeout(() => {
      setCurrentSlide((prev) => (prev - 1 + watches.length) % watches.length);
    }, 300);
    
    setTimeout(() => {
      setIsChanging(false);
      setDirection('');
    }, 650);
  };

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      alert('Please login to add items to cart');
      if (onShowAuth) onShowAuth();
      return;
    }

    if (addingToCart || watches.length === 0) return;

    const currentWatch = watches[currentSlide];

    try {
      setAddingToCart(true);
      await addToCart(currentWatch.id, 1);
      
      // Trigger cart update
      if (onCartUpdate) {
        onCartUpdate();
      }

      alert(`${currentWatch.name} added to cart!`);
    } catch (error) {
      console.error('Error adding to cart:', error);
      alert('Failed to add to cart. Please try again.');
    } finally {
      setAddingToCart(false);
    }
  };

  if (loading) {
    return (
      <section ref={sectionRef} className="popular-rolex-section">
        <div className="showcase-loading">
          <div className="loading-ring"></div>
          <p>Loading collection...</p>
        </div>
      </section>
    );
  }

  if (watches.length === 0) {
    return (
      <section ref={sectionRef} className="popular-rolex-section">
        <div className="showcase-empty">
          <p>No watches available at the moment.</p>
        </div>
      </section>
    );
  }

  const currentWatch = watches[currentSlide];
  const totalSlides = watches.length;

  return (
    <section 
      ref={sectionRef}
      className={`popular-rolex-section ${isVisible ? 'visible' : ''}`}
    >
      <div className="popular-rolex-container">
        
        {/* Center Watch Display with Left Info */}
        <div className="popular-watch-display">
          <div className="watch-display-wrapper">
            {/* Left Info beside circle */}
            <div className={`watch-left-info ${isChanging ? `slide-${direction}` : ''}`}>
              {/* Discount Badge */}
              <div className="popular-badge">
                <span className={`discount-tag ${isChanging ? 'changing' : ''}`}>
                  {currentWatch.discount}
                </span>
              </div>

              {/* Category */}
              <h3 className={`popular-category ${isChanging ? 'changing' : ''}`}>
                {currentWatch.category}
              </h3>
            </div>

            {/* Watch Circle */}
            <div className="watch-circle">
              <img 
                src={currentWatch.image} 
                alt={currentWatch.name}
                className={`watch-image ${isChanging ? `changing-${direction}` : ''}`}
                style={{ width: '70%', height: '70%', objectFit: 'contain' }}
              />
            </div>
          </div>
          
          {/* Navigation Below Watch */}
          <div className="slide-counter-container">
            {/* Previous Button */}
            <button 
              className={`counter-nav-btn ${currentSlide > 0 ? 'active' : 'inactive'}`}
              onClick={prevSlide}
              disabled={isChanging || currentSlide === 0}
              aria-label="Previous watch"
            >
              <svg viewBox="0 0 24 24" fill="none">
                <path 
                  d="M15 18l-6-6 6-6" 
                  stroke="currentColor" 
                  strokeWidth="2.5" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                />
              </svg>
            </button>

            {/* Counter Display */}
            <div className="counter-display">
              {/* Current Number */}
              <div className="counter-current">
                <span className={isChanging ? 'pop' : ''}>
                  {currentSlide + 1}
                </span>
              </div>

              {/* Circular Progress */}
              <div className="counter-progress">
                <svg width="48" height="48">
                  <defs>
                    <linearGradient id="progress-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#fbbf24" />
                      <stop offset="100%" stopColor="#f59e0b" />
                    </linearGradient>
                  </defs>
                  <circle
                    cx="24"
                    cy="24"
                    r="20"
                    className="counter-progress-bg"
                  />
                  <circle
                    cx="24"
                    cy="24"
                    r="20"
                    className="counter-progress-fill"
                    strokeDasharray={2 * Math.PI * 20}
                    strokeDashoffset={2 * Math.PI * 20 * (1 - (currentSlide + 1) / totalSlides)}
                  />
                </svg>
                <div className={`counter-center-dot ${isChanging ? 'pulse' : ''}`} />
              </div>

              {/* Total Number */}
              <div className="counter-total">
                {totalSlides}
              </div>
            </div>

            {/* Next Button */}
            <button 
              className={`counter-nav-btn ${currentSlide < totalSlides - 1 ? 'active' : 'inactive'}`}
              onClick={nextSlide}
              disabled={isChanging || currentSlide === totalSlides - 1}
              aria-label="Next watch"
            >
              <svg viewBox="0 0 24 24" fill="none">
                <path 
                  d="M9 18l6-6-6-6" 
                  stroke="currentColor" 
                  strokeWidth="2.5" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Right Content - Title, Price, Actions */}
        <div className={`popular-right ${isChanging ? `slide-${direction}` : ''}`}>
          <h2 className="popular-title">
            <span className="title-the">The</span>
            <span className="title-name">{currentWatch.name}</span>
          </h2>

          <div className="popular-price">
            <span className="current-price">₱{currentWatch.price.toLocaleString()}</span>
            <span className="original-price">₱{currentWatch.originalPrice.toLocaleString()}</span>
          </div>

          <div className="popular-actions">
            <button 
              className="add-to-cart-btn"
              onClick={handleAddToCart}
              disabled={addingToCart}
            >
              {addingToCart ? (
                <>
                  <span>ADDING...</span>
                  <div className="btn-spinner"></div>
                </>
              ) : (
                <>
                  <span>ADD TO CART</span>
                  <svg viewBox="0 0 24 24" width="20" height="20">
                    <path 
                      d="M3 3h2l.6 3M7 13h10l3-7H6M7 13L5.8 6M7 13l-2 2h12" 
                      fill="none" 
                      stroke="currentColor" 
                      strokeWidth="2.5" 
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PopularRolexSection;