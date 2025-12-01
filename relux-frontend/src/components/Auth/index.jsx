import React, { useState, useEffect } from 'react'

const API_URL = 'https://reloxapi.online/api'

const Auth = ({ onLoginSuccess }) => {
  const [activeTab, setActiveTab] = useState('login')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState({ type: '', text: '' })
  const [passwordStrength, setPasswordStrength] = useState(0)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  
  const [loginData, setLoginData] = useState({
    email: '',
    password: '',
    remember: false
  })
  
  const [signupData, setSignupData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreeToTerms: false
  })

  useEffect(() => {
    if (activeTab === 'signup') {
      const password = signupData.password
      let strength = 0
      
      if (password.length >= 6) strength++
      if (password.length >= 10) strength++
      if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++
      if (/\d/.test(password)) strength++
      if (/[^a-zA-Z0-9]/.test(password)) strength++
      
      setPasswordStrength(strength)
    }
  }, [signupData.password, activeTab])

  const handleBackToHome = (e) => {
    e.preventDefault()
    onLoginSuccess(null)
    setTimeout(() => {
      window.location.href = '/'
      window.location.reload()
    }, 100)
  }

  const handleSuccessRedirect = (user, isNewUser = false) => {
    onLoginSuccess(user)
    setTimeout(() => {
      window.location.href = '/'
      window.location.reload()
    }, isNewUser ? 2000 : 1500)
  }

  const handleLogin = async (e) => {
    e.preventDefault()
    setMessage({ type: '', text: '' })
    
    if (!loginData.email || !loginData.password) {
      setMessage({ type: 'error', text: 'Please fill in all fields' })
      return
    }
    
    setLoading(true)
    
    try {
      const response = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          email: loginData.email,
          password: loginData.password
        })
      })
      
      const data = await response.json()
      
      if (response.ok && data.user && data.token) {
        setMessage({ type: 'success', text: 'Login successful. Redirecting...' })
        localStorage.setItem('relux_user', JSON.stringify(data.user))
        localStorage.setItem('auth_token', data.token)
        
        handleSuccessRedirect(data.user, false)
      } else {
        if (data.errors) {
          const errorMessages = Object.values(data.errors).flat().join(', ')
          setMessage({ type: 'error', text: errorMessages })
        } else {
          setMessage({ type: 'error', text: data.message || 'Invalid credentials' })
        }
      }
    } catch (error) {
      setMessage({ 
        type: 'error', 
        text: 'Connection error. Make sure Laravel server is running' 
      })
    } finally {
      setLoading(false)
    }
  }

  const handleSignup = async (e) => {
    e.preventDefault()
    setMessage({ type: '', text: '' })
    
    if (!signupData.fullName || !signupData.email || !signupData.password || !signupData.confirmPassword) {
      setMessage({ type: 'error', text: 'Please fill in all fields' })
      return
    }
    
    if (signupData.password !== signupData.confirmPassword) {
      setMessage({ type: 'error', text: 'Passwords do not match' })
      return
    }
    
    if (signupData.password.length < 6) {
      setMessage({ type: 'error', text: 'Password must be at least 6 characters' })
      return
    }
    
    if (!signupData.agreeToTerms) {
      setMessage({ type: 'error', text: 'Please agree to terms and conditions' })
      return
    }
    
    setLoading(true)
    
    try {
      const response = await fetch(`${API_URL}/register`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          name: signupData.fullName,
          email: signupData.email,
          password: signupData.password,
          password_confirmation: signupData.confirmPassword
        })
      })
      
      const data = await response.json()
      
      if (response.ok && data.user && data.token) {
        setMessage({ type: 'success', text: 'Account created successfully. Welcome to RELUX...' })
        localStorage.setItem('relux_user', JSON.stringify(data.user))
        localStorage.setItem('auth_token', data.token)
        
        handleSuccessRedirect(data.user, true)
      } else {
        if (data.errors) {
          const errorMessages = Object.values(data.errors).flat().join(', ')
          setMessage({ type: 'error', text: errorMessages })
        } else {
          setMessage({ type: 'error', text: data.message || 'Registration failed' })
        }
      }
    } catch (error) {
      setMessage({ 
        type: 'error', 
        text: 'Connection error. Make sure Laravel server is running' 
      })
    } finally {
      setLoading(false)
    }
  }

  const getPasswordStrengthLabel = () => {
    if (passwordStrength === 0) return { text: '', color: '' }
    if (passwordStrength <= 2) return { text: 'Weak', color: '#ef4444' }
    if (passwordStrength <= 3) return { text: 'Fair', color: '#f59e0b' }
    if (passwordStrength <= 4) return { text: 'Good', color: '#10b981' }
    return { text: 'Strong', color: '#059669' }
  }

  return (
    <div className="relux-auth-stage">
      {/* Atmospheric Background */}
      <div className="auth-atmosphere">
        <div className="atmosphere-orb orb-1"></div>
        <div className="atmosphere-orb orb-2"></div>
        <div className="atmosphere-orb orb-3"></div>
        <div className="atmosphere-grid"></div>
        <div className="atmosphere-vignette"></div>
      </div>

      {/* Floating Particles */}
      <div className="auth-particles-field">
        {[...Array(25)].map((_, i) => (
          <div 
            key={i} 
            className="floating-particle" 
            style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 8}s`,
              animationDuration: `${8 + Math.random() * 12}s`
            }}
          ></div>
        ))}
      </div>

      {/* Elegant Back Button */}
      <button className="auth-back-home" onClick={handleBackToHome}>
        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M19 12H5M12 19l-7-7 7-7"/>
        </svg>
        <span>Return Home</span>
      </button>

      {/* Main Auth Container */}
      <div className="auth-container-glass">
        
        {/* Left Panel - Brand Experience */}
        <div className="auth-brand-panel">
          <div className="brand-panel-content">
            
            {/* Brand Identity */}
            <div className="brand-identity-centered">
              
              {/* Floating Clock Logo */}
              <div className="brand-logo-container">
                <div className="logo-circle">
                  <svg viewBox="0 0 100 100" className="logo-svg">
                    <circle cx="50" cy="50" r="45" fill="none" stroke="url(#logoGradient)" strokeWidth="2"/>
                    <path d="M50 20 L50 50 L70 60" fill="none" stroke="url(#logoGradient)" strokeWidth="3" strokeLinecap="round"/>
                    <defs>
                      <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#D4AF37"/>
                        <stop offset="100%" stopColor="#FFD700"/>
                      </linearGradient>
                    </defs>
                  </svg>
                  <div className="logo-pulse"></div>
                  <div className="logo-ring"></div>
                </div>
              </div>

              <h1 className="brand-wordmark">RELOX</h1>
              <p className="brand-essence">Timeless Elegance</p>
              
            </div>

          </div>
        </div>

        {/* Right Panel - Authentication Form */}
        <div className="auth-form-panel">
          
          {/* Tab Navigation */}
          <div className="auth-tab-navigation">
            <button 
              className={`auth-tab ${activeTab === 'login' ? 'active' : ''}`}
              onClick={() => {
                setActiveTab('login')
                setMessage({ type: '', text: '' })
              }}
            >
              Sign In
              {activeTab === 'login' && <div className="tab-active-indicator"></div>}
            </button>
            <button 
              className={`auth-tab ${activeTab === 'signup' ? 'active' : ''}`}
              onClick={() => {
                setActiveTab('signup')
                setMessage({ type: '', text: '' })
              }}
            >
              Create Account
              {activeTab === 'signup' && <div className="tab-active-indicator"></div>}
            </button>
          </div>

          {/* Alert Message */}
          {message.text && (
            <div className={`auth-alert ${message.type}`}>
              <div className="alert-icon">
                {message.type === 'success' ? (
                  <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                ) : (
                  <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                )}
              </div>
              <span>{message.text}</span>
            </div>
          )}

          {/* Login Form */}
          {activeTab === 'login' && (
            <form className="auth-form" onSubmit={handleLogin}>
              
              <div className="form-field">
                <label className="field-label">
                  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"/>
                  </svg>
                  Email Address
                </label>
                <div className="input-container">
                  <input
                    type="email"
                    className="field-input"
                    placeholder="your@email.com"
                    value={loginData.email}
                    onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                  />
                  <div className="input-focus-line"></div>
                </div>
              </div>

              <div className="form-field">
                <label className="field-label">
                  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
                  </svg>
                  Password
                </label>
                <div className="input-container input-with-toggle">
                  <input
                    type={showPassword ? "text" : "password"}
                    className="field-input"
                    placeholder="Enter your password"
                    value={loginData.password}
                    onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                  />
                  <button
                    type="button"
                    className="password-toggle-btn"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"/>
                      </svg>
                    ) : (
                      <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                        <path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                      </svg>
                    )}
                  </button>
                  <div className="input-focus-line"></div>
                </div>
              </div>

              <div className="form-options">
                <label className="checkbox-container">
                  <input
                    type="checkbox"
                    checked={loginData.remember}
                    onChange={(e) => setLoginData({ ...loginData, remember: e.target.checked })}
                  />
                  <span className="checkbox-custom"></span>
                  <span className="checkbox-label">Remember me</span>
                </label>
                <a href="#forgot" className="forgot-link">Forgot password?</a>
              </div>

              <button 
                type="submit" 
                className="auth-submit-btn"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <div className="btn-loader"></div>
                    <span>Authenticating...</span>
                  </>
                ) : (
                  <>
                    <span>Sign In</span>
                    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M5 12h14M12 5l7 7-7 7"/>
                    </svg>
                  </>
                )}
              </button>
            </form>
          )}

          {/* Signup Form */}
          {activeTab === 'signup' && (
            <form className="auth-form" onSubmit={handleSignup}>
              
              <div className="form-field">
                <label className="field-label">
                  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                  </svg>
                  Full Name
                </label>
                <div className="input-container">
                  <input
                    type="text"
                    className="field-input"
                    placeholder="John Doe"
                    value={signupData.fullName}
                    onChange={(e) => setSignupData({ ...signupData, fullName: e.target.value })}
                  />
                  <div className="input-focus-line"></div>
                </div>
              </div>

              <div className="form-field">
                <label className="field-label">
                  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"/>
                  </svg>
                  Email Address
                </label>
                <div className="input-container">
                  <input
                    type="email"
                    className="field-input"
                    placeholder="your@email.com"
                    value={signupData.email}
                    onChange={(e) => setSignupData({ ...signupData, email: e.target.value })}
                  />
                  <div className="input-focus-line"></div>
                </div>
              </div>

              <div className="form-field">
                <label className="field-label">
                  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
                  </svg>
                  Password
                </label>
                <div className="input-container input-with-toggle">
                  <input
                    type={showPassword ? "text" : "password"}
                    className="field-input"
                    placeholder="Create a password"
                    value={signupData.password}
                    onChange={(e) => setSignupData({ ...signupData, password: e.target.value })}
                  />
                  <button
                    type="button"
                    className="password-toggle-btn"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"/>
                      </svg>
                    ) : (
                      <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                        <path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                      </svg>
                    )}
                  </button>
                  <div className="input-focus-line"></div>
                </div>
                {signupData.password && (
                  <div className="password-strength-meter">
                    <div className="strength-bars">
                      {[...Array(5)].map((_, i) => (
                        <div 
                          key={i} 
                          className={`strength-bar ${i < passwordStrength ? 'active' : ''}`}
                          style={{ background: i < passwordStrength ? getPasswordStrengthLabel().color : '' }}
                        ></div>
                      ))}
                    </div>
                    <span className="strength-text" style={{ color: getPasswordStrengthLabel().color }}>
                      {getPasswordStrengthLabel().text}
                    </span>
                  </div>
                )}
              </div>

              <div className="form-field">
                <label className="field-label">
                  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                  Confirm Password
                </label>
                <div className="input-container input-with-toggle">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    className="field-input"
                    placeholder="Re-enter password"
                    value={signupData.confirmPassword}
                    onChange={(e) => setSignupData({ ...signupData, confirmPassword: e.target.value })}
                  />
                  <button
                    type="button"
                    className="password-toggle-btn"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"/>
                      </svg>
                    ) : (
                      <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                        <path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                      </svg>
                    )}
                  </button>
                  <div className="input-focus-line"></div>
                </div>
              </div>

              <label className="checkbox-container terms-checkbox">
                <input
                  type="checkbox"
                  checked={signupData.agreeToTerms}
                  onChange={(e) => setSignupData({ ...signupData, agreeToTerms: e.target.checked })}
                />
                <span className="checkbox-custom"></span>
                <span className="checkbox-label">
                  I agree to the <a href="#terms" className="terms-link">Terms & Conditions</a>
                </span>
              </label>

              <button 
                type="submit" 
                className="auth-submit-btn"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <div className="btn-loader"></div>
                    <span>Creating Account...</span>
                  </>
                ) : (
                  <>
                    <span>Create Account</span>
                    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M5 12h14M12 5l7 7-7 7"/>
                    </svg>
                  </>
                )}
              </button>
            </form>
          )}

        </div>
      </div>
    </div>
  )
}

export default Auth