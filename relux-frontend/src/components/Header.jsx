import React, { useState, useEffect, useRef } from 'react'
import { getCart, updateCartItem, removeFromCart } from '../services/cartService'

const Header = ({
  visible = false,
  isAuthenticated,
  currentUser,
  onLogout,
  onShowAuth,
  logoSrc = '/images/R.png',
  logoAlt = 'Relux',
  onSearch,
  onFilterChange,
  searchQuery = '',
  filters = {},
  cartTrigger = 0
}) => {
  const [openUser, setOpenUser] = useState(false)
  const [showSearch, setShowSearch] = useState(false)
  const [showCart, setShowCart] = useState(false)
  const [localSearch, setLocalSearch] = useState(searchQuery)
  const [cartData, setCartData] = useState(null)
  const [loadingCart, setLoadingCart] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const searchRef = useRef(null)
  const userRef = useRef(null)
  const mobileMenuRef = useRef(null)
  const burgerRef = useRef(null)

  const brands = [
    'Relox', 
    'Omega', 
    'Patek Philippe', 
    'Audemars Piguet',
    'Breguet',
    'Breitling',
    'Maurice Lacroix',
    'Rado',
    'Vacheron Constantin',
    'Tissot'
  ]

  useEffect(() => {
    if (isAuthenticated) {
      fetchCart()
    }
  }, [isAuthenticated, cartTrigger])

  const fetchCart = async () => {
    try {
      setLoadingCart(true)
      const data = await getCart()
      setCartData(data)
    } catch (error) {
      console.error('Error fetching cart:', error)
      if (error.message === 'Not authenticated') {
        setCartData(null)
      }
    } finally {
      setLoadingCart(false)
    }
  }

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSearch(false)
      }
      if (userRef.current && !userRef.current.contains(event.target)) {
        setOpenUser(false)
      }
      // Close mobile menu when clicking outside
      if (mobileMenuRef.current && burgerRef.current &&
          !mobileMenuRef.current.contains(event.target) &&
          !burgerRef.current.contains(event.target) &&
          mobileMenuOpen) {
        setMobileMenuOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [mobileMenuOpen])

  useEffect(() => {
    const handleScroll = () => {
      if (showSearch) setShowSearch(false)
      if (showCart) setShowCart(false)
      if (openUser) setOpenUser(false)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [showSearch, showCart, openUser])

  // Close mobile menu on window resize to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768 && mobileMenuOpen) {
        setMobileMenuOpen(false)
      }
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [mobileMenuOpen])

  const handleSearchSubmit = (e) => {
    e.preventDefault()
    onSearch(localSearch)
  }

  const handleSearchChange = (value) => {
    setLocalSearch(value)
    onSearch(value)
  }

  const handleBrandFilter = (brand) => {
    onFilterChange('brand', brand)
    setShowSearch(false)
  }

  const handleSortChange = (sort) => {
    onFilterChange('sort', sort)
  }

  const handleUpdateQuantity = async (cartItemId, newQuantity) => {
    if (newQuantity < 1) return
    
    try {
      await updateCartItem(cartItemId, newQuantity)
      await fetchCart()
    } catch (error) {
      console.error('Error updating quantity:', error)
      alert('Failed to update quantity')
    }
  }

  const handleRemoveFromCart = async (cartItemId) => {
    try {
      await removeFromCart(cartItemId)
      await fetchCart()
    } catch (error) {
      console.error('Error removing item:', error)
      alert('Failed to remove item')
    }
  }

  const getTotalPrice = () => {
    return cartData?.total || 0
  }

  const getTotalItems = () => {
    return cartData?.item_count || 0
  }

  const handleCartClick = () => {
    if (!isAuthenticated) {
      alert('Please login to view your cart')
      onShowAuth()
      return
    }
    setShowCart(true)
  }

  return (
    <>
      <style>{`
        /* Burger menu animation */
        .burger-line {
          transition: all 0.3s ease-in-out;
          transform-origin: center;
        }

        .burger-active .burger-line:nth-child(1) {
          transform: translateY(8px) rotate(45deg);
        }

        .burger-active .burger-line:nth-child(2) {
          opacity: 0;
          transform: scaleX(0);
        }

        .burger-active .burger-line:nth-child(3) {
          transform: translateY(-8px) rotate(-45deg);
        }

        /* Mobile menu animation */
        .mobile-menu-header {
          max-height: 0;
          overflow: hidden;
          transition: max-height 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .mobile-menu-header.active {
          max-height: 600px;
        }

        /* Menu item fade in */
        @keyframes fadeInDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .mobile-menu-header.active .mobile-menu-item {
          animation: fadeInDown 0.3s ease-out forwards;
        }

        .mobile-menu-header.active .mobile-menu-item:nth-child(1) { animation-delay: 0.1s; }
        .mobile-menu-header.active .mobile-menu-item:nth-child(2) { animation-delay: 0.15s; }
        .mobile-menu-header.active .mobile-menu-item:nth-child(3) { animation-delay: 0.2s; }
        .mobile-menu-header.active .mobile-menu-item:nth-child(4) { animation-delay: 0.25s; }
        .mobile-menu-header.active .mobile-menu-item:nth-child(5) { animation-delay: 0.3s; }

        /* Hide desktop nav on mobile */
        @media (max-width: 767px) {
          .header-nav {
            display: none;
          }
        }

        /* Burger menu styles */
        .burger-btn {
          display: none;
          padding: 0.5rem;
          border-radius: 0.5rem;
          background: transparent;
          border: none;
          cursor: pointer;
          transition: background-color 0.2s;
        }

        .burger-btn:hover {
          background-color: rgba(255, 255, 255, 0.1);
        }

        @media (max-width: 767px) {
          .burger-btn {
            display: flex;
            align-items: center;
            justify-content: center;
          }
        }

        .burger-icon {
          width: 24px;
          height: 20px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
        }

        .burger-line {
          width: 100%;
          height: 2px;
          background-color: currentColor;
          border-radius: 2px;
        }

        /* Mobile menu styling */
        .mobile-menu-header {
          background: rgba(255, 255, 255, 0.98);
          backdrop-filter: blur(10px);
          border-top: 1px solid rgba(0, 0, 0, 0.1);
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }

        .mobile-menu-item {
          opacity: 0;
          display: block;
          padding: 1rem;
          color: #000000;
          text-decoration: none;
          border-radius: 0.5rem;
          transition: background-color 0.2s;
          font-weight: 500;
        }

        .mobile-menu-item:hover {
          background: rgba(0, 0, 0, 0.05);
        }
      `}</style>

      <header className={`chrome ${visible ? 'chrome--in' : 'chrome--out'}`}>
        <div className="container">
          
          <a href="#intro" className="logo-wrap" aria-label="Relux Home">
            <img
              src={logoSrc}
              alt={logoAlt}
              className="logo-img"
              width={160}
              height={160}
              decoding="async"
            />
          </a>

          {/* Desktop Navigation */}
          <nav className="header-nav">
            <a href="#intro">HOME</a>
            <a href="#shop">SHOP</a>
            <a href="#about">ABOUT</a>
            <a href="#contact">CONTACT</a>
          </nav>

          <div className="actions">
            {/* Search Button */}
            <div className="search-container" ref={searchRef}>
              <button 
                className="glass-btn" 
                aria-label="Search"
                onClick={() => setShowSearch(!showSearch)}
              >
                <svg viewBox="0 0 24 24">
                  <path
                    d="M21 21l-5.6-5.6M10.5 17a6.5 6.5 0 1 1 0-13 6.5 6.5 0 0 1 0 13Z"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
              </button>

              {showSearch && (
                <div className="search-dropdown-modern">
                  <div className="search-header-modern">
                    <div className="search-icon-wrapper">
                      <svg viewBox="0 0 24 24" width="24" height="24">
                        <path
                          d="M21 21l-5.6-5.6M10.5 17a6.5 6.5 0 1 1 0-13 6.5 6.5 0 0 1 0 13Z"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                        />
                      </svg>
                    </div>
                    <input
                      type="text"
                      placeholder="Search luxury timepieces..."
                      value={localSearch}
                      onChange={(e) => handleSearchChange(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleSearchSubmit(e)}
                      className="search-input-modern"
                      autoFocus
                    />
                    {localSearch && (
                      <button 
                        className="clear-search-btn"
                        onClick={() => handleSearchChange('')}
                      >
                        <svg viewBox="0 0 24 24" width="18" height="18">
                          <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                        </svg>
                      </button>
                    )}
                  </div>

                  <div className="search-body-modern">
                    <div className="brands-section-modern">
                      <div className="section-title-modern">
                        <span className="title-bar"></span>
                        <h4>LUXURY BRANDS</h4>
                      </div>
                      <div className="brands-grid-modern">
                        {brands.map(brand => (
                          <button
                            key={brand}
                            className={`brand-card-modern ${filters.brand === brand ? 'active' : ''}`}
                            onClick={() => handleBrandFilter(brand)}
                          >
                            <span className="brand-name">{brand}</span>
                            <svg className="brand-arrow" viewBox="0 0 24 24" width="16" height="16">
                              <path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                          </button>
                        ))}
                      </div>
                      {filters.brand && (
                        <button
                          className="clear-filter-btn-modern"
                          onClick={() => handleBrandFilter('')}
                        >
                          <svg viewBox="0 0 24 24" width="16" height="16">
                            <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                          </svg>
                          Clear Brand Filter
                        </button>
                      )}
                    </div>

                    <div className="sort-section-modern">
                      <div className="section-title-modern">
                        <span className="title-bar"></span>
                        <h4>SORT COLLECTION</h4>
                      </div>
                      <div className="sort-options-modern">
                        <button
                          className={`sort-option-modern ${filters.sort === '' ? 'active' : ''}`}
                          onClick={() => handleSortChange('')}
                        >
                          <div className="sort-visual">
                            <svg viewBox="0 0 24 24" width="20" height="20">
                              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" 
                                    fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/>
                            </svg>
                          </div>
                          <span className="sort-label">Featured Pieces</span>
                          {filters.sort === '' && (
                            <div className="active-indicator"></div>
                          )}
                        </button>

                        <button
                          className={`sort-option-modern ${filters.sort === 'price_asc' ? 'active' : ''}`}
                          onClick={() => handleSortChange('price_asc')}
                        >
                          <div className="sort-visual">
                            <svg viewBox="0 0 24 24" width="20" height="20">
                              <path d="M12 19V5M5 12l7-7 7 7" 
                                    fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                          </div>
                          <span className="sort-label">Price: Low to High</span>
                          {filters.sort === 'price_asc' && (
                            <div className="active-indicator"></div>
                          )}
                        </button>

                        <button
                          className={`sort-option-modern ${filters.sort === 'price_desc' ? 'active' : ''}`}
                          onClick={() => handleSortChange('price_desc')}
                        >
                          <div className="sort-visual">
                            <svg viewBox="0 0 24 24" width="20" height="20">
                              <path d="M12 5v14M5 12l7 7 7-7" 
                                    fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                          </div>
                          <span className="sort-label">Price: High to Low</span>
                          {filters.sort === 'price_desc' && (
                            <div className="active-indicator"></div>
                          )}
                        </button>

                        <button
                          className={`sort-option-modern ${filters.sort === 'newest' ? 'active' : ''}`}
                          onClick={() => handleSortChange('newest')}
                        >
                          <div className="sort-visual">
                            <svg viewBox="0 0 24 24" width="20" height="20">
                              <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" 
                                    fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                          </div>
                          <span className="sort-label">Latest Arrivals</span>
                          {filters.sort === 'newest' && (
                            <div className="active-indicator"></div>
                          )}
                        </button>
                      </div>
                    </div>

                    <div className="quick-search-modern">
                      <span className="quick-label">Popular Searches:</span>
                      {['Chronograph', 'Automatic', 'Diver', 'Skeleton'].map(term => (
                        <button
                          key={term}
                          className="quick-tag-modern"
                          onClick={() => handleSearchChange(term)}
                        >
                          {term}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Cart Button */}
            <div className="cart-container">
              <button 
                className="glass-btn badge-btn" 
                aria-label="Cart"
                onClick={handleCartClick}
              >
                <svg viewBox="0 0 24 24">
                  <path
                    d="M3 3h2l.6 3M7 13h10l3-7H6M7 13L5.8 6M7 13l-2 2h12M9 21a1 1 0 1 1 0-2 1 1 0 0 1 0 2Zm8 0a1 1 0 1 1 0-2 1 1 0 0 1 0 2Z"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                {isAuthenticated && getTotalItems() > 0 && (
                  <span className="badge">{getTotalItems()}</span>
                )}
              </button>
            </div>

            {/* User Menu (Desktop) */}
            {isAuthenticated ? (
              <div className="user-menu" ref={userRef}>
                <button
                  className="glass-btn"
                  aria-label="Account"
                  onClick={() => setOpenUser(v => !v)}
                >
                  <svg viewBox="0 0 24 24">
                    <path
                      d="M12 14a7 7 0 0 0-7 7h14a7 7 0 0 0-7-7Zm0-2a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
                {openUser && (
                  <div className="user-pop">
                    <div className="user-id">
                      <div className="name">{currentUser?.name}</div>
                      <div className="mail">{currentUser?.email}</div>
                    </div>
                    <a 
                      href="#orders" 
                      className="orders-link"
                      onClick={() => setOpenUser(false)}
                    >
                      <svg viewBox="0 0 24 24" width="18" height="18">
                        <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" 
                              fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      My Orders
                    </a>
                    <button
                      className="danger-btn"
                      onClick={() => {
                        setOpenUser(false)
                        onLogout()
                      }}
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="auth-pills">
                <button className="pill ghost" onClick={onShowAuth}>Login</button>
                <button className="pill solid" onClick={onShowAuth}>Sign Up</button>
              </div>
            )}

            {/* Burger Menu Button (Mobile Only) */}
            <button 
              ref={burgerRef}
              className={`burger-btn ${mobileMenuOpen ? 'burger-active' : ''}`}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              <div className="burger-icon">
                <span className="burger-line"></span>
                <span className="burger-line"></span>
                <span className="burger-line"></span>
              </div>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div 
          ref={mobileMenuRef}
          className={`mobile-menu-header ${mobileMenuOpen ? 'active' : ''}`}
        >
          <div style={{ padding: '1rem' }}>
            <a 
              href="#intro" 
              className="mobile-menu-item"
              onClick={() => setMobileMenuOpen(false)}
            >
              HOME
            </a>
            <a 
              href="#shop" 
              className="mobile-menu-item"
              onClick={() => setMobileMenuOpen(false)}
            >
              SHOP
            </a>
            <a 
              href="#about" 
              className="mobile-menu-item"
              onClick={() => setMobileMenuOpen(false)}
            >
              ABOUT
            </a>
            <a 
              href="#contact" 
              className="mobile-menu-item"
              onClick={() => setMobileMenuOpen(false)}
            >
              CONTACT
            </a>
            {isAuthenticated ? (
              <button
                className="mobile-menu-item"
                onClick={() => {
                  setMobileMenuOpen(false)
                  onLogout()
                }}
                style={{ width: '100%', textAlign: 'left', background: 'transparent', border: 'none', cursor: 'pointer' }}
              >
                LOGOUT
              </button>
            ) : (
              <button
                className="mobile-menu-item"
                onClick={() => {
                  setMobileMenuOpen(false)
                  onShowAuth()
                }}
                style={{ width: '100%', textAlign: 'left', background: 'transparent', border: 'none', cursor: 'pointer' }}
              >
                LOGIN / SIGN UP
              </button>
            )}
          </div>
        </div>
      </header>

      {showCart && (
        <div className="cart-modal-overlay" onClick={() => setShowCart(false)}>
          <div className="cart-modal" onClick={(e) => e.stopPropagation()}>
            <div className="cart-header">
              <h3>Your Collection</h3>
              <button 
                className="close-btn"
                onClick={() => setShowCart(false)}
              >
                <svg viewBox="0 0 24 24" width="20" height="20">
                  <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </button>
            </div>

            <div className="cart-content">
              {loadingCart ? (
                <div className="loading-cart">
                  <div className="loading-spinner"></div>
                  <p>Loading your collection...</p>
                </div>
              ) : !cartData || cartData.items.length === 0 ? (
                <div className="empty-cart">
                  <svg viewBox="0 0 24 24" width="48" height="48">
                    <path d="M3 3h2l.6 3M7 13h10l3-7H6M7 13L5.8 6M7 13l-2 2h12M9 21a1 1 0 1 1 0-2 1 1 0 0 1 0 2Zm8 0a1 1 0 1 1 0-2 1 1 0 0 1 0 2Z" 
                          fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <p>Your collection is empty</p>
                  <button 
                    className="continue-shopping"
                    onClick={() => setShowCart(false)}
                  >
                    Explore Timepieces
                  </button>
                </div>
              ) : (
                <>
                  <div className="cart-items">
                    {cartData.items.map(item => (
                      <div key={item.id} className="cart-item">
                        <img 
                          src={item.product?.image || '/placeholder.jpg'} 
                          alt={item.name} 
                          className="cart-item-image" 
                        />
                        <div className="cart-item-details">
                          <h4>{item.product?.brand}</h4>
                          <p>{item.name}</p>
                          <p className="cart-item-price">₱{item.unit_price.toLocaleString()}</p>
                        </div>
                        <div className="cart-item-controls">
                          <div className="quantity-controls">
                            <button 
                              onClick={() => handleUpdateQuantity(item.id, item.qty - 1)}
                              disabled={item.qty <= 1}
                            >
                              −
                            </button>
                            <span>{item.qty}</span>
                            <button 
                              onClick={() => handleUpdateQuantity(item.id, item.qty + 1)}
                              disabled={item.qty >= (item.product?.stock || 0)}
                            >
                              +
                            </button>
                          </div>
                          <button 
                            className="remove-btn"
                            onClick={() => handleRemoveFromCart(item.id)}
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="cart-footer">
                    <div className="cart-total">
                      <span>Total Investment:</span>
                      <span className="total-price">₱{getTotalPrice().toLocaleString()}</span>
                    </div>
                    <div className="cart-actions">
                      <button className="continue-shopping" onClick={() => setShowCart(false)}>
                        Continue Browsing
                      </button>
                      <button 
                        className="checkout-btn"
                        onClick={() => {
                          setShowCart(false);
                          if (window.onCheckoutClick) {
                            window.onCheckoutClick();
                          }
                        }}
                      >
                        Proceed to Checkout
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default Header