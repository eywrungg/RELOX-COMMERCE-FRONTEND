// src/pages/CartPage.jsx
import React, { useState, useEffect } from 'react'
import axios from 'axios'
// ⭐ ADD THESE 2 IMPORTS
import CheckoutModal from '../components/CheckoutModal'
import OrderSuccessModal from '../components/OrderSuccessModal'

const API_URL = 'https://reloxapi.online/api'

function CartPage() {
  const [cart, setCart] = useState({ items: [], total: 0 })
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)
  
  // ⭐ ADD THESE 3 NEW STATES
  const [showCheckout, setShowCheckout] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [completedOrder, setCompletedOrder] = useState(null)

  useEffect(() => {
    fetchCart()
  }, [])

  const fetchCart = async () => {
    const token = localStorage.getItem('relux_token')
    if (!token) {
      window.location.hash = '#shop'
      return
    }

    try {
      setLoading(true)
      const { data } = await axios.get(`${API_URL}/cart`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setCart(data)
    } catch (error) {
      console.error('Error fetching cart:', error)
      alert('Failed to load cart')
    } finally {
      setLoading(false)
    }
  }

  const updateQuantity = async (itemId, newQuantity) => {
    if (newQuantity < 1) return

    const token = localStorage.getItem('relux_token')
    try {
      setUpdating(true)
      await axios.patch(
        `${API_URL}/cart/items/${itemId}`,
        { quantity: newQuantity },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      await fetchCart()
      window.dispatchEvent(new Event('cartUpdated'))
    } catch (error) {
      console.error('Error updating quantity:', error)
      alert('Failed to update quantity')
    } finally {
      setUpdating(false)
    }
  }

  const removeItem = async (itemId) => {
    if (!confirm('Remove this item from cart?')) return

    const token = localStorage.getItem('relux_token')
    try {
      setUpdating(true)
      await axios.delete(`${API_URL}/cart/items/${itemId}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      await fetchCart()
      window.dispatchEvent(new Event('cartUpdated'))
    } catch (error) {
      console.error('Error removing item:', error)
      alert('Failed to remove item')
    } finally {
      setUpdating(false)
    }
  }

  // ⭐ REPLACE handleCheckout WITH THIS
  const handleCheckout = () => {
    if (cart.items.length === 0) {
      alert('Your cart is empty')
      return
    }
    setShowCheckout(true)
  }

  // ⭐ ADD THESE 2 NEW HANDLERS
  const handleCheckoutSuccess = (order) => {
    setCompletedOrder(order)
    setShowCheckout(false)
    setShowSuccess(true)
    fetchCart() // Refresh cart after successful order
    window.dispatchEvent(new Event('cartUpdated'))
  }

  const handleSuccessClose = () => {
    setShowSuccess(false)
    setCompletedOrder(null)
  }

  if (loading) {
    return (
      <div className="cart-page">
        <div className="loading-state">
          <div className="loading-spinner"></div>
          <p>Loading your cart...</p>
        </div>
      </div>
    )
  }

  return (
    <>
      <div className="cart-page">
        <div className="cart-header">
          <h1 className="cart-title">Shopping Cart</h1>
          <p className="cart-subtitle">
            {cart.items.length} {cart.items.length === 1 ? 'item' : 'items'} in your cart
          </p>
        </div>

        {cart.items.length === 0 ? (
          <div className="empty-cart">
            <svg className="empty-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path
                d="M3 3h2l.6 3M7 13h10l3-7H6M7 13L5.8 6M7 13l-2 2h12M9 21a1 1 0 1 1 0-2 1 1 0 0 1 0 2Zm8 0a1 1 0 1 1 0-2 1 1 0 0 1 0 2Z"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <h3>Your cart is empty</h3>
            <p>Add some luxury timepieces to get started</p>
            <a href="#shop" className="shop-btn">Continue Shopping</a>
          </div>
        ) : (
          <div className="cart-container">
            <div className="cart-items">
              {cart.items.map((item) => (
                <div key={item.id} className="cart-item">
                  <img
                    src={item.product?.image || '/images/placeholder.jpg'}
                    alt={item.product?.name}
                    className="cart-item-image"
                  />
                  <div className="cart-item-details">
                    <h3 className="cart-item-name">{item.product?.name}</h3>
                    <p className="cart-item-brand">{item.product?.brand}</p>
                    <p className="cart-item-price">₱{item.product?.price.toLocaleString()}</p>
                  </div>
                  <div className="cart-item-actions">
                    <div className="quantity-controls">
                      <button
                        className="qty-btn"
                        disabled={updating || item.quantity <= 1}
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      >
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M5 12h14" strokeLinecap="round" />
                        </svg>
                      </button>
                      <span className="qty-display">{item.quantity}</span>
                      <button
                        className="qty-btn"
                        disabled={updating}
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      >
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M12 5v14M5 12h14" strokeLinecap="round" />
                        </svg>
                      </button>
                    </div>
                    <button
                      className="remove-btn"
                      disabled={updating}
                      onClick={() => removeItem(item.id)}
                    >
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path
                          d="M3 6h18M8 6V4a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v2M19 6v14a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V6M10 11v6M14 11v6"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      Remove
                    </button>
                  </div>
                  <div className="cart-item-subtotal">
                    ₱{(item.product?.price * item.quantity).toLocaleString()}
                  </div>
                </div>
              ))}
            </div>

            <div className="cart-summary">
              <h2 className="summary-title">Order Summary</h2>
              <div className="summary-row">
                <span>Subtotal</span>
                <span>₱{cart.subtotal?.toLocaleString() || cart.total?.toLocaleString()}</span>
              </div>
              <div className="summary-row">
                <span>Shipping</span>
                <span>Calculated at checkout</span>
              </div>
              <div className="summary-row summary-total">
                <span>Total</span>
                <span>₱{cart.total?.toLocaleString()}</span>
              </div>
              <button className="checkout-btn" onClick={handleCheckout}>
                Proceed to Checkout
              </button>
              <a href="#shop" className="continue-shopping">Continue Shopping</a>
            </div>
          </div>
        )}
      </div>

      {/* ⭐ ADD THESE 2 MODALS AT THE END */}
      {showCheckout && (
        <CheckoutModal 
          cart={cart}
          onClose={() => setShowCheckout(false)}
          onSuccess={handleCheckoutSuccess}
        />
      )}

      {showSuccess && completedOrder && (
        <OrderSuccessModal 
          order={completedOrder}
          onClose={handleSuccessClose}
        />
      )}
    </>
  )
}

export default CartPage