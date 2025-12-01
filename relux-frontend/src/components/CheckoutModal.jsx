// src/components/CheckoutModal.jsx
import React, { useState, useEffect } from 'react'
import { getCart, checkout } from '../services/cartService'
import '../css/checkout-modal.css'

function CheckoutModal({ onClose, onSuccess }) {
  const [cart, setCart] = useState(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    delivery_name: '',
    delivery_phone: '',
    delivery_address: '',
    delivery_city: '',
    delivery_postal_code: '',
    delivery_notes: '',
    payment_method: 'cod'
  })
  const [errors, setErrors] = useState({})

  useEffect(() => {
    fetchCart()
  }, [])

  const fetchCart = async () => {
    try {
      setLoading(true)
      const data = await getCart()
      
      console.log('🛒 Cart loaded:', data)
      console.log('🛒 Items:', data.items)
      
      setCart(data)
    } catch (error) {
      console.error('❌ Error loading cart:', error)
      alert('Failed to load cart: ' + (error.message || 'Unknown error'))
      onClose()
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const validateForm = () => {
    const newErrors = {}
    if (!formData.delivery_name.trim()) newErrors.delivery_name = 'Name is required'
    if (!formData.delivery_phone.trim()) newErrors.delivery_phone = 'Phone is required'
    if (!formData.delivery_address.trim()) newErrors.delivery_address = 'Address is required'
    if (!formData.delivery_city.trim()) newErrors.delivery_city = 'City is required'
    if (!formData.delivery_postal_code.trim()) newErrors.delivery_postal_code = 'Postal code is required'
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) return

    if (!cart || !cart.items || cart.items.length === 0) {
      alert('Your cart is empty')
      return
    }

    try {
      setSubmitting(true)
      const response = await checkout(formData)
      const order = response.order || response
      onSuccess(order)
    } catch (error) {
      console.error('❌ Checkout error:', error)
      const errorMsg = error.response?.data?.message || error.response?.data?.error || error.message || 'Checkout failed'
      alert(errorMsg)
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="checkout-modal-overlay">
        <div className="checkout-modal-content" style={{ minHeight: '400px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <div className="loading-spinner-large"></div>
          <p style={{ marginTop: '1rem', color: '#666' }}>Loading cart...</p>
        </div>
      </div>
    )
  }

  if (!cart || !cart.items || cart.items.length === 0) {
    return (
      <div className="checkout-modal-overlay" onClick={onClose}>
        <div className="checkout-modal-content" onClick={(e) => e.stopPropagation()}>
          <button className="checkout-close-btn" onClick={onClose}>×</button>
          <div style={{ padding: '4rem', textAlign: 'center' }}>
            <h2>Your cart is empty</h2>
            <button onClick={onClose} style={{ marginTop: '2rem', padding: '0.75rem 2rem', background: '#1a1a1a', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="checkout-modal-overlay" onClick={onClose}>
      <div className="checkout-modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="checkout-close-btn" onClick={onClose}>×</button>

        <div className="checkout-header">
          <h2>Secure Checkout</h2>
          <p>Complete your luxury timepiece purchase</p>
        </div>

        <div className="checkout-body">
          <div className="checkout-form">
            <h3>Delivery Information</h3>

            <div className="form-group">
              <label htmlFor="delivery_name">Full Name *</label>
              <input type="text" id="delivery_name" name="delivery_name" value={formData.delivery_name} onChange={handleChange} placeholder="Juan Dela Cruz" />
              {errors.delivery_name && <span className="error-text">{errors.delivery_name}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="delivery_phone">Phone Number *</label>
              <input type="tel" id="delivery_phone" name="delivery_phone" value={formData.delivery_phone} onChange={handleChange} placeholder="+63 912 345 6789" />
              {errors.delivery_phone && <span className="error-text">{errors.delivery_phone}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="delivery_address">Street Address *</label>
              <textarea id="delivery_address" name="delivery_address" value={formData.delivery_address} onChange={handleChange} placeholder="123 Luxury Avenue" rows="3" />
              {errors.delivery_address && <span className="error-text">{errors.delivery_address}</span>}
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="delivery_city">City *</label>
                <input type="text" id="delivery_city" name="delivery_city" value={formData.delivery_city} onChange={handleChange} placeholder="Cagayan de Oro" />
                {errors.delivery_city && <span className="error-text">{errors.delivery_city}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="delivery_postal_code">Postal Code *</label>
                <input type="text" id="delivery_postal_code" name="delivery_postal_code" value={formData.delivery_postal_code} onChange={handleChange} placeholder="9000" />
                {errors.delivery_postal_code && <span className="error-text">{errors.delivery_postal_code}</span>}
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="delivery_notes">Delivery Notes (Optional)</label>
              <textarea id="delivery_notes" name="delivery_notes" value={formData.delivery_notes} onChange={handleChange} placeholder="Special instructions..." rows="2" />
            </div>

            <div className="form-group">
              <label htmlFor="payment_method">Payment Method *</label>
              <select id="payment_method" name="payment_method" value={formData.payment_method} onChange={handleChange}>
                <option value="cod">Cash on Delivery</option>
                <option value="card">Credit/Debit Card</option>
                <option value="gcash">GCash</option>
                <option value="paymaya">PayMaya</option>
              </select>
            </div>

            <div className="checkout-actions">
              <button type="button" className="btn-cancel" onClick={onClose}>Cancel</button>
              <button type="button" className="btn-place-order" disabled={submitting} onClick={handleSubmit}>
                {submitting ? 'Processing...' : `Place Order - ₱${(cart.total || 0).toLocaleString()}`}
              </button>
            </div>
          </div>

          <div className="checkout-summary">
            <h3>Order Summary</h3>
            <div className="summary-items">
              {cart.items.map((item) => (
                <div key={item.id} className="summary-item">
                  <img src={item.product?.image || '/placeholder.jpg'} alt={item.product?.name || item.name} />
                  <div className="summary-item-info">
                    <p className="summary-item-name">{item.product?.name || item.name}</p>
                    <p className="summary-item-qty">Qty: {item.qty}</p>
                  </div>
                  <p className="summary-item-price">₱{((item.unit_price || 0) * (item.qty || 0)).toLocaleString()}</p>
                </div>
              ))}
            </div>
            <div className="summary-total">
              <span>Total</span>
              <span className="total-amount">₱{(cart.total || 0).toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CheckoutModal