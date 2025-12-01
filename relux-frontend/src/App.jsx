import React, { useState, useEffect } from 'react'

// Components
import Header from './components/Header'
import Sidebar from './components/Sidebar'
import IntroVideoSection from './components/IntroVideoSection'
import HeroSection from './components/HeroSection'
import ExploreSection from './components/ExploreSection'
import BrandsAndNew from './components/BrandsAndNew'
import VideoHeroFeature from './components/VideoHeroFeature'
import Auth from './components/Auth'
import ShopPage from './pages/ShopPage'
import AboutPage from './pages/AboutPage'
import ContactPage from './pages/ContactPage'
import OrdersPage from './pages/OrdersPage'  
import PopularRolexSection from './components/PopularRolexSection'
import ReloxFooter from './components/ReloxFooter'
import CheckoutModal from './components/CheckoutModal'
import OrderSuccessModal from './components/OrderSuccessModal'

import './css/responsive-overrides.css'
import './css/checkout-modal.css'
import './css/order-success.css'
import './css/popular-rolex.css'
import './css/orders.css' 
import './css/header.css'
import './css/sidebars.css'
import './css/intro-video.css'
import './css/hero.css'
import './css/explore.css'
import './css/brands.css'
import './css/auth.css'
import './css/shop.css'
import './css/about.css'
import './css/video-hero-feature.css'
import './css/contact-redesigned.css'

function App() {
  const [showAuth, setShowAuth] = useState(false)
  const [currentUser, setCurrentUser] = useState(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [currentPage, setCurrentPage] = useState('home')
  const [cartTrigger, setCartTrigger] = useState(0)
  const [showCheckout, setShowCheckout] = useState(false)
  const [orderSuccess, setOrderSuccess] = useState(null)

  // Search and Filter State
  const [searchQuery, setSearchQuery] = useState('')
  const [filters, setFilters] = useState({
    brand: '',
    sort: ''
  })

  // chromeVisible = show header/left-rail when NOT on the intro section
  const [chromeVisible, setChromeVisible] = useState(false)

  // Restore user (if any)
  useEffect(() => {
    const savedUser = localStorage.getItem('relux_user')
    const savedToken = localStorage.getItem('auth_token')
    if (savedUser && savedToken) {
      try {
        const user = JSON.parse(savedUser)
        setCurrentUser(user)
        setIsAuthenticated(true)
        console.log('✅ User restored from localStorage:', user)
      } catch (error) {
        console.error('❌ Failed to parse saved user:', error)
        localStorage.removeItem('relux_user')
        localStorage.removeItem('auth_token')
      }
    }
  }, [])

  // Setup checkout handler
  useEffect(() => {
    window.onCheckoutClick = () => {
      console.log('🛒 Checkout button clicked')
      if (!isAuthenticated) {
        alert('Please login to checkout')
        setShowAuth(true)
        return
      }
      setShowCheckout(true)
    }

    return () => {
      window.onCheckoutClick = null
    }
  }, [isAuthenticated])

  // Checkout handlers
  const handleCheckoutSuccess = (order) => {
    console.log('✅ Order placed successfully:', order)
    setShowCheckout(false)
    setOrderSuccess(order)
    setCartTrigger(prev => prev + 1) // Refresh cart
  }

  const handleCloseSuccess = () => {
    setOrderSuccess(null)
  }

useEffect(() => {
  const handleHashChange = () => {
    const hash = window.location.hash
    if (hash === '#shop') {
      setCurrentPage('shop')
      setChromeVisible(true)
    } else if (hash === '#about') {
      setCurrentPage('about')
      setChromeVisible(true)
    } else if (hash === '#contact') {
      setCurrentPage('contact')
      setChromeVisible(true)
    } else if (hash === '#orders') {  // ADD THIS
      setCurrentPage('orders')
      setChromeVisible(true)
    } else {
      setCurrentPage('home')
      setSearchQuery('')
      setFilters({ brand: '', sort: '' })
    }
  }

  handleHashChange()
  window.addEventListener('hashchange', handleHashChange)
  
  return () => window.removeEventListener('hashchange', handleHashChange)
}, [])

  // Watch the INTRO for chrome visibility (only on home page)
  useEffect(() => {
    if (currentPage !== 'home') return

    const intro = document.querySelector('#intro')
    if (!intro) return

    const io = new IntersectionObserver(
      ([entry]) => setChromeVisible(!entry.isIntersecting),
      { threshold: 0.1 }
    )
    io.observe(intro)

    const rect = intro.getBoundingClientRect()
    const isIntroOnScreen = rect.top < window.innerHeight && rect.bottom > 0
    setChromeVisible(!isIntroOnScreen)

    return () => io.disconnect()
  }, [currentPage])

  const handleShowAuth = () => {
    console.log('🔐 Opening auth modal')
    setShowAuth(true)
  }

  const handleLoginSuccess = (user) => {
    console.log('🎉 Login success callback received:', user)
    
    if (user === null) {
      console.log('🏠 Returning to home page')
      setShowAuth(false)
      return
    }
    
    setCurrentUser(user)
    setIsAuthenticated(true)
    setCartTrigger(prev => prev + 1)
    
    setTimeout(() => {
      setShowAuth(false)
      console.log('✅ User logged in:', user)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }, 100)
  }

  const handleLogout = () => {
    console.log('👋 Logging out user')
    setCurrentUser(null)
    setIsAuthenticated(false)
    localStorage.removeItem('relux_user')
    localStorage.removeItem('auth_token')
    setCartTrigger(prev => prev + 1)
    console.log('✅ User logged out successfully')
  }

  const handleSearch = (query) => {
    console.log('🔍 Search query:', query)
    setSearchQuery(query)
    
    if (currentPage !== 'shop' && query.trim() !== '') {
      window.location.hash = 'shop'
    }
  }

  const handleFilterChange = (filterType, value) => {
    console.log('🎛️ Filter changed:', filterType, value)
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }))
    
    if (currentPage !== 'shop') {
      window.location.hash = 'shop'
    }
  }

  const clearSearchAndFilters = () => {
    setSearchQuery('')
    setFilters({ brand: '', sort: '' })
  }

  const handleCartUpdate = () => {
    console.log('🛒 Cart updated - triggering refresh')
    setCartTrigger(prev => prev + 1)
  }

  const handleDiscoverMore = () => {
    console.log('🎯 Discover more clicked - navigating to shop')
    window.location.hash = 'shop'
  }

  if (showAuth) {
    return <Auth onLoginSuccess={handleLoginSuccess} />
  }

  const showSidebar = currentPage === 'home' && chromeVisible

  return (
    <>
      <Header
        visible={chromeVisible || currentPage === 'shop' || currentPage === 'about' || currentPage === 'contact'}
        isAuthenticated={isAuthenticated}
        currentUser={currentUser}
        onLogout={handleLogout}
        onShowAuth={handleShowAuth}
        onSearch={handleSearch}
        onFilterChange={handleFilterChange}
        searchQuery={searchQuery}
        filters={filters}
        cartTrigger={cartTrigger}
      />
      
      <Sidebar visible={showSidebar} />

      {/* Page Content */}
      {currentPage === 'shop' ? (
        <ShopPage 
          searchQuery={searchQuery}
          filters={filters}
          onClearSearch={clearSearchAndFilters}
          isAuthenticated={isAuthenticated}
          onShowAuth={handleShowAuth}
          onCartUpdate={handleCartUpdate}
        />
      ) : currentPage === 'about' ? (
        <AboutPage />
) : currentPage === 'contact' ? (
  <ContactPage />
) : currentPage === 'orders' ? (  // ADD THIS
  <OrdersPage />
) : (
        <>
          <section className="intro-video-wrap" id="intro">
            <IntroVideoSection
              srcPublic="/media/relux-intro.mp4"
              isAuthenticated={isAuthenticated}
              currentUser={currentUser}
              onLogout={handleLogout}
              onShowAuth={handleShowAuth}
              onSearch={handleSearch}
              onFilterChange={handleFilterChange}
              searchQuery={searchQuery}
              filters={filters}
            />
          </section>

          <main className="main-content no-right-rail">
            <section id="home" className="hero-section">
              <HeroSection />
            </section>

            <section id="explore" className="explore-section">
              <ExploreSection />
            </section>

            <section id="brands" className="brands-and-new-section">
              <BrandsAndNew onFilterChange={handleFilterChange} />
            </section>

            <section id="featured" className="video-hero-section">
              <VideoHeroFeature
                videoSrc="/media/video1.mp4"
                posterImage="/media/sand-gold-poster.jpg"
              />
            </section>

            <section id="popular-rolex" className="popular-rolex-section-wrapper">
              <PopularRolexSection 
                isAuthenticated={isAuthenticated}
                onShowAuth={handleShowAuth}
                onCartUpdate={handleCartUpdate}
              />
            </section>

            <section>
              <ReloxFooter />
            </section>
          </main>
        </>
      )}

      {/* Checkout Modal */}
      {showCheckout && (
        <CheckoutModal 
          onClose={() => setShowCheckout(false)}
          onSuccess={handleCheckoutSuccess}
        />
      )}

      {/* Order Success Modal */}
      {orderSuccess && (
        <OrderSuccessModal
          order={orderSuccess}
          onClose={handleCloseSuccess}
        />
      )}
    </>
  )
}

export default App