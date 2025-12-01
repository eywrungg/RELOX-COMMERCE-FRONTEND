import React, { useState, useEffect } from 'react'

const OrdersPage = () => {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [showModal, setShowModal] = useState(false)
  
  const API_BASE_URL = 'https://reloxapi.online'

  useEffect(() => {
    fetchOrders()
  }, [])

  const fetchOrders = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const token = localStorage.getItem('auth_token')
      if (!token) {
        throw new Error('Please login to view orders')
      }

      const response = await fetch('https://reloxapi.online/api/orders', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      })

      if (!response.ok) {
        throw new Error('Failed to fetch orders')
      }

      const data = await response.json()
      setOrders(data.orders || [])
    } catch (err) {
      console.error('Error fetching orders:', err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const fetchOrderDetails = async (orderId) => {
    try {
      const token = localStorage.getItem('auth_token')
      const response = await fetch(`https://reloxapi.online/api/orders/${orderId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      })

      if (!response.ok) {
        throw new Error('Failed to fetch order details')
      }

      const data = await response.json()
      setSelectedOrder(data.order)
      setShowModal(true)
    } catch (err) {
      console.error('Error fetching order details:', err)
      alert('Failed to load order details')
    }
  }

  const getStatusInfo = (status) => {
    const statusMap = {
      pending: {
        label: 'Pending',
        icon: (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10"/>
            <path d="M12 6v6l4 2" strokeLinecap="round"/>
          </svg>
        ),
        progress: 25
      },
      processing: {
        label: 'Processing',
        icon: (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" strokeLinecap="round"/>
          </svg>
        ),
        progress: 50
      },
      shipped: {
        label: 'Shipped',
        icon: (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M16 16v2a2 2 0 01-2 2H4a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v2M7 12h14M17 8l4 4-4 4" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        ),
        progress: 75
      },
      delivered: {
        label: 'Delivered',
        icon: (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        ),
        progress: 100
      },
      cancelled: {
        label: 'Cancelled',
        icon: (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        ),
        progress: 0
      }
    }
    return statusMap[status] || statusMap.pending
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  if (loading) {
    return (
      <div className="orders-page-wrapper">
        <div className="orders-loading-state">
          <div className="orders-loading-spinner"></div>
          <p>Loading your orders...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="orders-page-wrapper">
        <div className="orders-error-state">
          <svg className="orders-error-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <circle cx="12" cy="12" r="10"/>
            <path d="M12 8v4M12 16h.01" strokeLinecap="round"/>
          </svg>
          <h2>Oops! Something went wrong</h2>
          <p>{error}</p>
          <button className="orders-error-btn" onClick={fetchOrders}>
            Try Again
          </button>
        </div>
      </div>
    )
  }

  if (orders.length === 0) {
    return (
      <div className="orders-page-wrapper">
        <div className="orders-page-header">
          <div className="orders-header-content">
            <span className="orders-eyebrow">Your Collection</span>
            <h1 className="orders-page-title">Order History</h1>
            <p className="orders-page-subtitle">
              Track and manage your luxury timepiece orders
            </p>
          </div>
        </div>
        <div className="orders-empty-state">
          <svg className="orders-empty-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <h2>No Orders Yet</h2>
          <p>Start building your luxury watch collection today</p>
          <a href="#shop" className="orders-shop-btn">
            Explore Collection
          </a>
        </div>
      </div>
    )
  }

  return (
    <div className="orders-page-wrapper">
      <div className="orders-page-header">
        <div className="orders-header-content">
          <span className="orders-eyebrow">Your Collection</span>
          <h1 className="orders-page-title">Order History</h1>
          <p className="orders-page-subtitle">
            Track and manage your luxury timepiece orders
          </p>
        </div>
      </div>

      <div className="orders-container-main">
        <div className="orders-grid-layout">
          {orders.map((order, index) => {
            const statusInfo = getStatusInfo(order.status)
            return (
              <div 
                key={order.id} 
                className="order-card-item"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="order-card-header-section">
                  <div className="order-number-display">
                    <span className="order-number-label">Order</span>
                    <span className="order-number-value">#{order.id}</span>
                  </div>
                  <div className={`order-status-badge status-${order.status}`}>
                    {statusInfo.icon}
                    {statusInfo.label}
                  </div>
                </div>

                <div className="order-card-body-section">
                  <div className="order-info-row-item">
                    <span className="order-info-label">Date</span>
                    <span className="order-info-value">{formatDate(order.created_at)}</span>
                  </div>
                  <div className="order-info-row-item">
                    <span className="order-info-label">Items</span>
                    <span className="order-info-value">{order.item_count} piece(s)</span>
                  </div>
                  <div className="order-info-row-item">
                    <span className="order-info-label">Total</span>
                    <span className="order-info-value order-total-value">
                      ₱{order.total?.toLocaleString()}
                    </span>
                  </div>
                </div>

                <div className="order-card-footer-section">
                  <button 
                    className="order-view-details-btn"
                    onClick={() => fetchOrderDetails(order.id)}
                  >
                    View Details
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>
                </div>

                <div className="order-progress-bar">
                  <div 
                    className="order-progress-fill" 
                    style={{ width: `${statusInfo.progress}%` }}
                  />
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Order Details Modal */}
      {showModal && selectedOrder && (
        <div className="order-modal-overlay-backdrop" onClick={() => setShowModal(false)}>
          <div className="order-modal-content-wrapper" onClick={(e) => e.stopPropagation()}>
            <button className="order-modal-close-btn" onClick={() => setShowModal(false)}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>

            <div className="order-modal-header-section">
              <h2 className="order-modal-title">Order #{selectedOrder.id}</h2>
              <div className={`order-status-badge status-${selectedOrder.status}`}>
                {getStatusInfo(selectedOrder.status).icon}
                {getStatusInfo(selectedOrder.status).label}
              </div>
            </div>

            <div className="order-modal-body-section">
              {/* Order Information */}
              <div className="order-detail-section">
                <h3 className="order-detail-section-title">Order Information</h3>
                <div className="order-info-grid">
                  <div className="order-info-item">
                    <span className="order-info-item-label">Order Date</span>
                    <span className="order-info-item-value">{formatDate(selectedOrder.created_at)}</span>
                  </div>
                  <div className="order-info-item">
                    <span className="order-info-item-label">Payment Method</span>
                    <span className="order-info-item-value">
                      {selectedOrder.payment_method === 'cod' && 'Cash on Delivery'}
                      {selectedOrder.payment_method === 'card' && 'Credit/Debit Card'}
                      {selectedOrder.payment_method === 'gcash' && 'GCash'}
                      {selectedOrder.payment_method === 'paymaya' && 'PayMaya'}
                    </span>
                  </div>
                  <div className="order-info-item">
                    <span className="order-info-item-label">Total Items</span>
                    <span className="order-info-item-value">{selectedOrder.items?.length || 0}</span>
                  </div>
                </div>
              </div>

              {/* Delivery Information */}
              <div className="order-detail-section">
                <h3 className="order-detail-section-title">Delivery Information</h3>
                <div className="order-delivery-info">
                  <p><strong>Name:</strong> {selectedOrder.delivery_name}</p>
                  <p><strong>Phone:</strong> {selectedOrder.delivery_phone}</p>
                  <p><strong>Address:</strong> {selectedOrder.delivery_address}</p>
                  <p><strong>City:</strong> {selectedOrder.delivery_city}</p>
                  <p><strong>Postal Code:</strong> {selectedOrder.delivery_postal_code}</p>
                  {selectedOrder.delivery_notes && (
                    <p className="order-delivery-notes">
                      <strong>Notes:</strong> {selectedOrder.delivery_notes}
                    </p>
                  )}
                </div>
              </div>

              {/* Order Items */}
              <div className="order-detail-section">
                <h3 className="order-detail-section-title">Order Items</h3>
                <div className="order-items-list-grid">
                  {selectedOrder.items?.map(item => {
                    // Get the image URL and prepend base URL if it's a relative path
                    let imageUrl = item.product?.image || item.image || item.product_image || '/placeholder.jpg'
                    
                    // If the image starts with /storage, prepend the API base URL
                    if (imageUrl.startsWith('/storage')) {
                      imageUrl = `${API_BASE_URL}${imageUrl}`
                    }
                    
                    const brandName = item.product?.brand || item.brand || 'Luxury Watch'
                    
                    return (
                      <div key={item.id} className="order-item-card-row">
                        <img 
                          src={imageUrl} 
                          alt={item.name}
                          className="order-item-image"
                          onError={(e) => {
                            console.error('Image failed to load:', imageUrl)
                            e.target.onerror = null
                            e.target.src = '/placeholder.jpg'
                          }}
                        />
                        <div className="order-item-info-section">
                          <div className="order-item-brand">{brandName}</div>
                          <h4 className="order-item-name">{item.name}</h4>
                          <p className="order-item-quantity">Quantity: {item.qty}</p>
                        </div>
                        <div className="order-item-price-display">
                          ₱{(item.unit_price * item.qty).toLocaleString()}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Total */}
              <div className="order-modal-total-section">
                <span className="order-modal-total-label">Total Amount</span>
                <span className="order-modal-total-amount">
                  ₱{selectedOrder.total?.toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default OrdersPage