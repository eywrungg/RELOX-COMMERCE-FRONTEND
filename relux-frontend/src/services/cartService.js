// src/services/cartService.js
import axios from 'axios'

const API_URL = 'https://reloxapi.online/api'

const getAuthToken = () => {
  return localStorage.getItem('auth_token')
}

export const getCart = async () => {
  const token = getAuthToken()
  if (!token) {
    throw new Error('Not authenticated')
  }

  console.log('📥 Fetching cart...')
  const response = await axios.get(`${API_URL}/cart`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/json'
    }
  })
  console.log('✅ Cart received:', response.data)
  return response.data
}

export const addToCart = async (productId, quantity = 1) => {
  const token = getAuthToken()
  if (!token) {
    throw new Error('Not authenticated')
  }

  const response = await axios.post(
    `${API_URL}/cart/items`,
    { product_id: productId, qty: quantity },
    {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    }
  )
  return response.data
}

export const updateCartItem = async (cartItemId, quantity) => {
  const token = getAuthToken()
  if (!token) {
    throw new Error('Not authenticated')
  }

  const response = await axios.patch(
    `${API_URL}/cart/items/${cartItemId}`,
    { qty: quantity },
    {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    }
  )
  return response.data
}

export const removeFromCart = async (cartItemId) => {
  const token = getAuthToken()
  if (!token) {
    throw new Error('Not authenticated')
  }

  const response = await axios.delete(`${API_URL}/cart/items/${cartItemId}`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/json'
    }
  })
  return response.data
}

export const checkout = async (deliveryInfo) => {
  const token = getAuthToken()
  if (!token) {
    throw new Error('Not authenticated')
  }

  console.log('🚀 Starting checkout...')
  console.log('📦 Delivery info:', deliveryInfo)
  
  try {
    const response = await axios.post(
      `${API_URL}/checkout`,
      deliveryInfo,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      }
    )
    
    console.log('✅ Checkout success:', response.data)
    return response.data
  } catch (error) {
    console.error('❌ Checkout failed:', error)
    console.error('❌ Response:', error.response?.data)
    console.error('❌ Status:', error.response?.status)
    throw error
  }
}