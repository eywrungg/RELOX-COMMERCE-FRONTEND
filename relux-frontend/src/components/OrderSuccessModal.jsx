// src/components/OrderSuccessModal.jsx
import React from 'react'


function OrderSuccessModal({ order, onClose }) {
  const handleViewOrders = () => {
    onClose()
    window.location.hash = '#orders'
  }

  const handleContinueShopping = () => {
    onClose()
    window.location.hash = '#shop'
  }

  return (
    <div className="success-modal-overlay" onClick={onClose}>
      <div className="success-modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="success-close-btn" onClick={onClose}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>

        <div className="success-animation">
          <div className="success-checkmark">
            <svg viewBox="0 0 52 52">
              <circle className="checkmark-circle" cx="26" cy="26" r="25" fill="none"/>
              <path className="checkmark-check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8"/>
            </svg>
          </div>
        </div>

        <div className="success-content">
          <h2>Order Placed Successfully!</h2>
          <p className="success-message">
            Thank you for your order. We've received your order and will process it shortly.
          </p>

          <div className="order-details-box">
            <div className="detail-row">
              <span className="detail-label">Order Number:</span>
              <span className="detail-value">#{order.id}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Total Amount:</span>
              <span className="detail-value total">₱{order.total?.toLocaleString()}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Payment Method:</span>
              <span className="detail-value payment-method">
                {order.payment_method === 'cod' && 'Cash on Delivery'}
                {order.payment_method === 'card' && 'Credit/Debit Card'}
                {order.payment_method === 'gcash' && 'GCash'}
                {order.payment_method === 'paymaya' && 'PayMaya'}
              </span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Delivery To:</span>
              <span className="detail-value">{order.delivery_name}</span>
            </div>
          </div>

          <div className="success-info">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10"/>
              <path d="M12 16v-4M12 8h.01" strokeLinecap="round"/>
            </svg>
            <p>
              We've sent a confirmation email with your order details. 
              You can track your order status in the Orders page.
            </p>
          </div>

          <div className="success-actions">
            <button className="btn-view-orders" onClick={handleViewOrders}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              View My Orders
            </button>
            <button className="btn-continue-shopping" onClick={handleContinueShopping}>
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default OrderSuccessModal