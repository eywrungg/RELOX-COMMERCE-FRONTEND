import React, { useState, useRef, useEffect } from 'react'
import { getCart, updateCartItem, removeFromCart } from '../services/cartService'

const IntroVideoSection = ({
  srcPublic = '/media/relux-intro.mp4',
  isAuthenticated,
  currentUser,
  onLogout,
  onShowAuth,
  logoSrc = '/images/RW.png',
  hoverLogoSrc = '/images/R.png', // alternate colored logo
  logoSize = 180,
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

  // state for logo swap
  const [isLogoHovered, setIsLogoHovered] = useState(false)

  const searchRef = useRef(null)
  const userRef = useRef(null)

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
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  useEffect(() => {
    const handleScroll = () => {
      if (showSearch) setShowSearch(false)
      if (showCart) setShowCart(false)
      if (openUser) setOpenUser(false)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [showSearch, showCart, openUser])

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

  const scrollToNext = () => {
    const nextSection = document.querySelector('#home')
    if (nextSection) {
      nextSection.scrollIntoView({ behavior: 'smooth' })
    }
  }

  // choose logo based on nav hover/focus/touch
  const activeLogoSrc = isLogoHovered && hoverLogoSrc ? hoverLogoSrc : logoSrc

  return (
    <>
      <section className="intro-video-section">
        <video
          className="intro-video"
          src={srcPublic}
          autoPlay
          loop
          muted
          playsInline
          poster="/media/relux-intro-poster.jpg"
        />

        <div className="intro-overlay" />

        {/* topbar: whole nav controls the logo swap */}
        <div
          className="intro-topbar"
          // mouse hover over nav triggers logo swap
          onMouseEnter={() => setIsLogoHovered(true)}
          onMouseLeave={() => setIsLogoHovered(false)}
          // keyboard focus within the nav triggers logo swap (focusin/focusout behavior)
          onFocus={() => setIsLogoHovered(true)}
          onBlur={() => setIsLogoHovered(false)}
          // touch support
          onTouchStart={() => setIsLogoHovered(true)}
          onTouchEnd={() => setIsLogoHovered(false)}
          // make container focusable so keyboard users can trigger the effect
          tabIndex={0}
        >
          <div className="intro-left-spacer" />

          <div className="intro-brand">
            <img
              src={activeLogoSrc}
              alt="Relux"
              className="intro-brand-logo"
              style={{
                width: `${logoSize}px`,
                height: `${logoSize}px`,
                transition: 'opacity 180ms ease, transform 180ms ease'
              }}
              width={logoSize}
              height={logoSize}
              decoding="async"
            />
          </div>

          <div className="intro-actions">
            <div className="search-container" ref={searchRef}>
              <button 
                className="intro-icon-btn" 
                aria-label="Search"
                onClick={() => setShowSearch(!showSearch)}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path
                    d="M21 21l-5.6-5.6M10.5 17a6.5 6.5 0 1 1 0-13 6.5 6.5 0 0 1 0 13Z"
                    strokeLinecap="round"
                  />
                </svg>
              </button>

              {showSearch && (
                <div className="search-dropdown-modern intro-search-modern">
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
                    {/* Luxury Brands Grid */}
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

                    {/* Sort Collection */}
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

                    {/* Quick Search Tags */}
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

            <div className="cart-container">
              <button 
                className="intro-icon-btn badge-btn" 
                aria-label="Cart"
                onClick={handleCartClick}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path
                    d="M3 3h2l.6 3M7 13h10l3-7H6M7 13L5.8 6M7 13l-2 2h12M9 21a1 1 0 1 1 0-2 1 1 0 0 1 0 2Zm8 0a1 1 0 1 1 0-2 1 1 0 0 1 0 2Z"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                {isAuthenticated && getTotalItems() > 0 && (
                  <span className="badge">{getTotalItems()}</span>
                )}
              </button>
            </div>

            {isAuthenticated ? (
              <div className="intro-user-menu" ref={userRef}>
                <button
                  className="intro-icon-btn"
                  aria-label="Account"
                  onClick={() => setOpenUser(v => !v)}
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path
                      d="M12 14a7 7 0 0 0-7 7h14a7 7 0 0 0-7-7Zm0-2a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
                {openUser && (
                  <div className="intro-user-pop">
                    <div className="intro-user-id">
                      <div className="name">{currentUser?.full_name || currentUser?.name}</div>
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
                      className="intro-danger-btn"
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
              <button
                className="intro-icon-btn intro-icon-btn--label"
                onClick={onShowAuth}
                aria-label="Login"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path
                    d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4M10 17l5-5-5-5M15 12H3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <span className="intro-btn-text">LOGIN</span>
              </button>
            )}
          </div>
        </div>

        <div className="intro-center">
          <h1 className="intro-h1">Timeless Craft, Modern Edge</h1>
          <p className="intro-kicker">
            Discover the latest in luxury watchmaking. Precision. Presence. Personality.
          </p>

          <a
            href="#home"
            className="scroll-indicator"
            aria-label="Scroll to content"
            onClick={(e) => {
              e.preventDefault()
              scrollToNext()
            }}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </a>
        </div>
      </section>

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

export default IntroVideoSection
