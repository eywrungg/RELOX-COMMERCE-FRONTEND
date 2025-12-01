import React, { useState, useEffect, useRef } from 'react'
import axios from 'axios'
import { addToCart } from '../services/cartService'

const API_URL = 'https://reloxapi.online/api'

function ShopPage({ searchQuery = '', filters = {}, isAuthenticated, onShowAuth, onCartUpdate }) {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [addingToCart, setAddingToCart] = useState({})
  const [groupedProducts, setGroupedProducts] = useState({})
  const [pagination, setPagination] = useState({
    current_page: 1,
    last_page: 1,
    per_page: 50
  })
  const [isSearchMode, setIsSearchMode] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [visibleBrands, setVisibleBrands] = useState(new Set())

  const shopRef = useRef(null)
  const carouselRefs = useRef({})
  const brandSectionRefs = useRef({})

  // Scroll to top when component mounts or page changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [])

  useEffect(() => {
    fetchProducts()
  }, [searchQuery, filters, pagination.current_page])

  useEffect(() => {
    if (products.length > 0) {
      // Only enter search mode if there's actually a search query or active filters
      if (searchQuery && searchQuery.trim() !== '') {
        setIsSearchMode(true)
      } else if (Object.keys(filters).some(key => filters[key])) {
        setIsSearchMode(true)
      } else {
        setIsSearchMode(false)
        groupProductsByBrand()
      }
    }
  }, [products, searchQuery, filters])

  useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isModalOpen])

  // Intersection Observer for scroll animations
  useEffect(() => {
    if (isSearchMode) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const brand = entry.target.dataset.brand
            setVisibleBrands(prev => new Set([...prev, brand]))
          }
        })
      },
      { threshold: 0.15, rootMargin: '0px' }
    )

    Object.values(brandSectionRefs.current).forEach(section => {
      if (section) observer.observe(section)
    })

    return () => observer.disconnect()
  }, [groupedProducts, isSearchMode])

  const fetchProducts = async () => {
    try {
      setLoading(true)
      const params = {
        q: searchQuery,
        ...filters,
        page: pagination.current_page,
        per_page: pagination.per_page
      }
      
      Object.keys(params).forEach(key => {
        if (!params[key]) delete params[key]
      })

      const { data } = await axios.get(`${API_URL}/products`, { params })
      
      setProducts(data.data)
      setPagination({
        current_page: data.current_page,
        last_page: data.last_page,
        per_page: data.per_page
      })
    } catch (error) {
      console.error('Error fetching products:', error)
    } finally {
      setLoading(false)
    }
  }

  const groupProductsByBrand = () => {
    const grouped = {}
    
    products.forEach(product => {
      const brand = product.brand || 'Other'
      if (!grouped[brand]) {
        grouped[brand] = []
      }
      grouped[brand].push(product)
    })

    // Priority brand order
    const brandPriority = ['Relox', 'Omega', 'Patek Philippe', 'Audemars Piguet', 'Breguet', 
                          'Breitling', 'Maurice Lacroix', 'Rado', 'Vacheron Constantin', 'Tissot']
    
    const sortedBrands = Object.keys(grouped).sort((a, b) => {
      const aIndex = brandPriority.indexOf(a)
      const bIndex = brandPriority.indexOf(b)
      
      if (aIndex !== -1 && bIndex !== -1) return aIndex - bIndex
      if (aIndex !== -1) return -1
      if (bIndex !== -1) return 1
      return a.localeCompare(b)
    })

    const sortedGrouped = {}
    sortedBrands.forEach(brand => {
      sortedGrouped[brand] = grouped[brand]
    })

    setGroupedProducts(sortedGrouped)
  }

  const scrollCarousel = (brand, direction) => {
    const carousel = carouselRefs.current[brand]
    if (!carousel) return

    const scrollAmount = 340
    const newScrollLeft = carousel.scrollLeft + (direction === 'left' ? -scrollAmount : scrollAmount)
    
    carousel.scrollTo({
      left: newScrollLeft,
      behavior: 'smooth'
    })
  }

  const handleViewDetails = (product) => {
    setSelectedProduct(product)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setTimeout(() => setSelectedProduct(null), 300)
  }

  const handleAddToCart = async (productId) => {
    if (!isAuthenticated) {
      alert('Please login to add items to cart')
      onShowAuth()
      return
    }

    try {
      setAddingToCart(prev => ({ ...prev, [productId]: true }))
      
      await addToCart(productId, 1)
      alert('Added to cart successfully!')
      
      if (onCartUpdate) {
        onCartUpdate()
      }
    } catch (error) {
      console.error('Error adding to cart:', error)
      
      if (error.response?.status === 401) {
        alert('Please login to add items to cart')
        onShowAuth()
      } else if (error.response?.data?.message) {
        alert(error.response.data.message)
      } else {
        alert('Failed to add item to cart')
      }
    } finally {
      setAddingToCart(prev => ({ ...prev, [productId]: false }))
    }
  }

  // LOADING STATE
  if (loading) {
    return (
      <div className="shop-page-modern">
        <div className="shop-header-modern">
          <div className="hero-blur"></div>
          <div className="shop-hero-content">
            <span className="shop-eyebrow-modern">Curated Collections</span>
            <h1 className="shop-title-modern">Luxury Timepieces</h1>
            <p className="shop-subtitle-modern">
              Discover precision engineering and timeless design from the world's finest watchmakers
            </p>
          </div>
        </div>
        <div className="loading-state-full">
          <div className="loading-spinner-large"></div>
          <p>Curating your luxury collection...</p>
        </div>
      </div>
    )
  }

  // EMPTY STATE
  if (products.length === 0) {
    return (
      <div className="shop-page-modern">
        <div className="shop-header-modern">
          <div className="hero-blur"></div>
          <div className="shop-hero-content">
            <span className="shop-eyebrow-modern">Curated Collections</span>
            <h1 className="shop-title-modern">Luxury Timepieces</h1>
            <p className="shop-subtitle-modern">
              Discover precision engineering and timeless design from the world's finest watchmakers
            </p>
          </div>
        </div>
        <div className="empty-state-modern">
          <svg className="empty-icon-large" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <circle cx="11" cy="11" r="8" strokeWidth="2"/>
            <path d="m21 21-4.35-4.35" strokeWidth="2" strokeLinecap="round"/>
          </svg>
          <h3>No Timepieces Found</h3>
          <p>Adjust your search criteria to discover our curated collection</p>
          {(searchQuery || Object.keys(filters).some(key => filters[key])) && (
            <button 
              className="reset-btn-modern"
              onClick={() => window.location.reload()}
            >
              Clear Filters
            </button>
          )}
        </div>
      </div>
    )
  }

  // SEARCH RESULTS - GRID VIEW
  if (isSearchMode) {
    return (
      <div ref={shopRef} className="shop-page-modern">
        <div className="shop-header-modern search-header">
          <div className="hero-blur"></div>
          <div className="shop-hero-content">
            <span className="shop-eyebrow-modern">Search Results</span>
            <h1 className="shop-title-modern">
              {products.length} {products.length === 1 ? 'Timepiece' : 'Timepieces'}
            </h1>
            {searchQuery && searchQuery.trim() !== '' && (
              <p className="shop-subtitle-modern">
                Results for "{searchQuery}"
              </p>
            )}
          </div>
        </div>

        <div className="search-results-section">
          <div className="results-grid">
            {products.map((product, index) => (
              <div key={product.id} className="search-product-card" style={{ animationDelay: `${index * 30}ms` }}>
                <div className="card-image-wrapper">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="search-product-image"
                    loading="lazy"
                  />
                  <div className="image-gradient"></div>
                  
                  {product.stock <= 0 && (
                    <div className="status-badge sold-out-badge">SOLD OUT</div>
                  )}
                  {product.stock > 0 && product.stock < 5 && (
                    <div className="status-badge limited-badge">Only {product.stock}</div>
                  )}
                  
                  <div className="card-overlay-actions">
                    <button 
                      className="card-add-btn"
                      onClick={() => handleAddToCart(product.id)}
                      disabled={product.stock <= 0 || addingToCart[product.id]}
                    >
                      {addingToCart[product.id] ? (
                        <span className="loader-small"></span>
                      ) : (
                        <>
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <circle cx="9" cy="21" r="1" strokeWidth="2"/>
                            <circle cx="20" cy="21" r="1" strokeWidth="2"/>
                            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" strokeWidth="2" strokeLinecap="round"/>
                          </svg>
                          <span>Add to Cart</span>
                        </>
                      )}
                    </button>
                    <button 
                      className="card-view-btn"
                      onClick={() => handleViewDetails(product)}
                      title="View Details"
                    >
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                        <circle cx="12" cy="12" r="3"/>
                      </svg>
                    </button>
                  </div>
                </div>

                <div className="card-content">
                  <div className="card-brand">{product.brand}</div>
                  <h3 className="card-title">{product.name}</h3>
                  <p className="card-price">₱{product.price.toLocaleString()}</p>
                </div>
              </div>
            ))}
          </div>

          {pagination.last_page > 1 && (
            <div className="pagination-modern">
              <button
                className="pagination-btn-modern"
                disabled={pagination.current_page === 1}
                onClick={() => {
                  setPagination({ ...pagination, current_page: pagination.current_page - 1 })
                  window.scrollTo({ top: 0, behavior: 'smooth' })
                }}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M15 18l-6-6 6-6" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Previous
              </button>
              
              <span className="pagination-info-modern">
                Page {pagination.current_page} of {pagination.last_page}
              </span>

              <button
                className="pagination-btn-modern"
                disabled={pagination.current_page === pagination.last_page}
                onClick={() => {
                  setPagination({ ...pagination, current_page: pagination.current_page + 1 })
                  window.scrollTo({ top: 0, behavior: 'smooth' })
                }}
              >
                Next
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M9 18l6-6-6-6" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>
          )}
        </div>

        {isModalOpen && selectedProduct && (
          <ProductModal 
            product={selectedProduct} 
            onClose={handleCloseModal}
            onAddToCart={() => handleAddToCart(selectedProduct.id)}
            isAddingToCart={addingToCart[selectedProduct.id]}
          />
        )}
      </div>
    )
  }

  // NORMAL BRAND CAROUSEL VIEW
  return (
    <div ref={shopRef} className="shop-page-modern">
      <div className="shop-header-modern">
        <div className="hero-blur"></div>
        <div className="shop-hero-content">
          <span className="shop-eyebrow-modern">Curated Collections</span>
          <h1 className="shop-title-modern">Luxury Timepieces</h1>
          <p className="shop-subtitle-modern">
            Discover precision engineering and timeless design from the world's finest watchmakers
          </p>
        </div>
      </div>

      <div className="brand-collections-wrapper">
        {Object.entries(groupedProducts).map(([brand, brandProducts], brandIndex) => (
          <section 
            key={brand} 
            className={`brand-collection-section ${visibleBrands.has(brand) ? 'visible' : ''}`}
            ref={el => brandSectionRefs.current[brand] = el}
            data-brand={brand}
          >
            <div className="brand-collection-header">
              <div className="brand-header-left">
                <div className="brand-title-group">
                  <h2 className="brand-collection-title">{brand}</h2>
                  <span className="brand-product-count">{brandProducts.length} timepieces</span>
                </div>
              </div>
              <div className="carousel-controls">
                <button 
                  className="carousel-btn"
                  onClick={() => scrollCarousel(brand, 'left')}
                  aria-label="Scroll left"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M15 18l-6-6 6-6" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
                <button 
                  className="carousel-btn"
                  onClick={() => scrollCarousel(brand, 'right')}
                  aria-label="Scroll right"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M9 18l6-6-6-6" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
              </div>
            </div>

            <div 
              className="brand-carousel"
              ref={el => carouselRefs.current[brand] = el}
            >
              {brandProducts.map((product, productIndex) => (
                <article 
                  key={product.id} 
                  className="carousel-product-card"
                  style={{ animationDelay: `${productIndex * 40}ms` }}
                >
                  <div className="carousel-product-image-wrap">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="carousel-product-image"
                      loading="lazy"
                    />
                    {product.stock <= 0 && (
                      <div className="carousel-stock-badge out-of-stock">Sold Out</div>
                    )}
                    {product.stock > 0 && product.stock < 5 && (
                      <div className="carousel-stock-badge low-stock">
                        Only {product.stock} Left
                      </div>
                    )}
                    <div className="carousel-overlay"></div>
                  </div>
                  <div className="carousel-product-info">
                    <h3 
                      className="carousel-product-name"
                      onClick={() => handleViewDetails(product)}
                    >
                      {product.name}
                    </h3>
                    
                    <div className="carousel-product-meta">
                      <p className="carousel-product-price">
                        ₱{product.price.toLocaleString()}
                      </p>
                    </div>

                    <div className="carousel-actions-row">
                      <button 
                        className="carousel-cart-btn"
                        onClick={() => handleAddToCart(product.id)}
                        disabled={product.stock <= 0 || addingToCart[product.id]}
                      >
                        {addingToCart[product.id] ? (
                          <div className="btn-spinner"></div>
                        ) : (
                          <>
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <circle cx="9" cy="21" r="1" strokeWidth="2"/>
                              <circle cx="20" cy="21" r="1" strokeWidth="2"/>
                              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                            <span>{product.stock <= 0 ? 'Out of Stock' : 'Add to Cart'}</span>
                          </>
                        )}
                      </button>
                      <button 
                        className="carousel-details-btn"
                        onClick={() => handleViewDetails(product)}
                        title="View Details"
                      >
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                          <circle cx="12" cy="12" r="3"/>
                        </svg>
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>
        ))}
      </div>

      {pagination.last_page > 1 && (
        <div className="pagination-modern">
          <button
            className="pagination-btn-modern"
            disabled={pagination.current_page === 1}
            onClick={() => {
              setPagination({ ...pagination, current_page: pagination.current_page - 1 })
              window.scrollTo({ top: 0, behavior: 'smooth' })
            }}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M15 18l-6-6 6-6" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Previous
          </button>
          
          <span className="pagination-info-modern">
            Page {pagination.current_page} of {pagination.last_page}
          </span>

          <button
            className="pagination-btn-modern"
            disabled={pagination.current_page === pagination.last_page}
            onClick={() => {
              setPagination({ ...pagination, current_page: pagination.current_page + 1 })
              window.scrollTo({ top: 0, behavior: 'smooth' })
            }}
          >
            Next
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 18l6-6-6-6" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
      )}

      {isModalOpen && selectedProduct && (
        <ProductModal 
          product={selectedProduct} 
          onClose={handleCloseModal}
          onAddToCart={() => handleAddToCart(selectedProduct.id)}
          isAddingToCart={addingToCart[selectedProduct.id]}
        />
      )}
    </div>
  )
}

function ProductModal({ product, onClose, onAddToCart, isAddingToCart }) {
  const getStockStatus = (stock) => {
    if (stock <= 0) return { status: 'Out of Stock', color: '#dc3545', bgColor: 'rgba(220, 53, 69, 0.1)' }
    if (stock < 5) return { status: 'Limited Stock', color: '#ffc107', bgColor: 'rgba(255, 193, 7, 0.1)' }
    return { status: 'In Stock', color: '#28a745', bgColor: 'rgba(40, 167, 69, 0.1)' }
  }

  const stockStatus = getStockStatus(product.stock)

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={onClose}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>

        <div className="modal-body">
          <div className="modal-image-section">
            <img src={product.image} alt={product.name} className="modal-product-image" />
          </div>

          <div className="modal-info-section">
            <div className="modal-header">
              <span className="modal-brand">{product.brand}</span>
              <div className="modal-stock-badge" style={{ backgroundColor: stockStatus.bgColor, color: stockStatus.color, border: `1.5px solid ${stockStatus.color}` }}>
                {stockStatus.status}
              </div>
            </div>

            <h2 className="modal-title">{product.name}</h2>

            <div className="modal-price-section">
              <p className="modal-price">₱{product.price.toLocaleString()}</p>
            </div>

            {product.description && (
              <div className="modal-description">
                <h3 className="modal-section-title">Description</h3>
                <p className="modal-description-text">{product.description}</p>
              </div>
            )}

            <div className="modal-stock-info">
              <h3 className="modal-section-title">Availability</h3>
              <div className="stock-details">
                <div className="stock-item">
                  <span className="stock-label">Available Quantity</span>
                  <span className="stock-value">{product.stock > 0 ? product.stock : 'Out of Stock'}</span>
                </div>
                <div className="stock-divider"></div>
                <div className="stock-item">
                  <span className="stock-label">Status</span>
                  <span className="stock-value" style={{ color: stockStatus.color }}>
                    {stockStatus.status}
                  </span>
                </div>
              </div>
            </div>

            <div className="modal-actions">
              <button 
                className="modal-add-to-cart-btn"
                onClick={onAddToCart}
                disabled={product.stock <= 0 || isAddingToCart}
              >
                {isAddingToCart ? (
                  <>
                    <span className="modal-spinner"></span>
                    Adding...
                  </>
                ) : (
                  <>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="9" cy="21" r="1" strokeWidth="2"/>
                      <circle cx="20" cy="21" r="1" strokeWidth="2"/>
                      <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    {product.stock <= 0 ? 'Out of Stock' : 'Add to Cart'}
                  </>
                )}
              </button>
              <button className="modal-close-action-btn" onClick={onClose}>
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ShopPage