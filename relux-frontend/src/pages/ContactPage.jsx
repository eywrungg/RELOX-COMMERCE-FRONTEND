import React, { useState, useEffect, useRef } from 'react';


export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    category: 'general'
  });

  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [visibleSections, setVisibleSections] = useState({});
  const sectionRefs = useRef({});

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // Intersection Observer for scroll triggers
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisibleSections(prev => ({
              ...prev,
              [entry.target.dataset.section]: true
            }));
          }
        });
      },
      { threshold: 0.15 }
    );

    Object.values(sectionRefs.current).forEach(ref => {
      if (ref) observer.observe(ref);
    });

    return () => observer.disconnect();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setSubmitted(true);
      setLoading(false);
      setFormData({ name: '', email: '', subject: '', message: '', category: 'general' });
      
      // Reset form after 5 seconds
      setTimeout(() => setSubmitted(false), 5000);
    }, 1500);
  };

  const contactMethods = [
    {
      icon: '💬',
      title: 'Live Chat',
      description: 'Get instant support from our team',
      link: 'Start Chat',
      featured: true,
      color: 'gold'
    },
    {
      icon: '✉️',
      title: 'Email Support',
      description: 'hello@relux.com - Usually replies within 2h',
      link: 'Send Email',
      color: 'slate'
    },
    {
      icon: '📞',
      title: 'Phone Support',
      description: '+1 (555) 123-4567 - Mon-Fri, 9AM-6PM EST',
      link: 'Call Now',
      color: 'slate'
    },
    {
      icon: '📍',
      title: 'Visit Our Store',
      description: '123 Luxury Ave, New York, NY 10001',
      link: 'Get Directions',
      color: 'slate'
    }
  ];

  return (
    <div className="contact-page-redesigned">
      {/* HERO SECTION */}
      <section 
        ref={el => sectionRefs.current.hero = el}
        data-section="hero"
        className={`contact-hero-redesigned ${visibleSections.hero ? 'in-view' : ''}`}
      >
        <div className="contact-hero-bg">
          <div className="hero-blob hero-blob-1"></div>
          <div className="hero-blob hero-blob-2"></div>
          <div className="hero-grid"></div>
        </div>

        <div className="contact-hero-content">
          <div className="hero-badge">
            <span>Let's Connect</span>
          </div>
          
          <h1 className="contact-hero-title">
            We're Here to <span className="highlight">Help</span>
          </h1>
          
          <p className="contact-hero-subtitle">
            Have questions about our luxury timepieces? Our expert team is ready to assist you 24/7. Choose your preferred way to reach us below.
          </p>

          <div className="hero-stats">
            <div className="stat-item">
              <span className="stat-number">24/7</span>
              <span className="stat-label">Support</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">2h</span>
              <span className="stat-label">Avg Response</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">98%</span>
              <span className="stat-label">Satisfaction</span>
            </div>
          </div>
        </div>

        <div className="hero-scroll-indicator">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      </section>

      {/* CONTACT METHODS GRID */}
      <section 
        ref={el => sectionRefs.current.methods = el}
        data-section="methods"
        className={`contact-methods-redesigned ${visibleSections.methods ? 'in-view' : ''}`}
      >
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Choose Your Channel</h2>
            <p className="section-subtitle">Connect with us through your preferred method</p>
          </div>

          <div className="methods-grid">
            {contactMethods.map((method, idx) => (
              <div
                key={idx}
                className={`method-card ${method.featured ? 'featured' : ''}`}
                style={{ '--card-delay': `${idx * 80}ms` }}
              >
                <div className={`method-icon ${method.color}`}>
                  {method.icon}
                </div>
                
                <h3 className="method-title">{method.title}</h3>
                <p className="method-description">{method.description}</p>
                
                <a href="#" className="method-link">
                  {method.link}
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </a>

                <div className="card-shine"></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CONTACT FORM SECTION */}
      <section 
        ref={el => sectionRefs.current.form = el}
        data-section="form"
        className={`contact-form-redesigned ${visibleSections.form ? 'in-view' : ''}`}
      >
        <div className="container">
          <div className="form-container">
            <div className="form-header">
              <h2 className="form-title">Get In Touch</h2>
              <p className="form-subtitle">Fill out the form below and we'll get back to you shortly</p>
            </div>

            {submitted ? (
              <div className="form-success">
                <div className="success-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="20 6 9 17 4 12" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <h3>Message Sent Successfully!</h3>
                <p>Thanks for reaching out. We'll get back to you within 2 hours.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="contact-form">
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="name">Your Name</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="John Doe"
                      required
                    />
                    <span className="form-highlight"></span>
                  </div>

                  <div className="form-group">
                    <label htmlFor="email">Email Address</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="john@example.com"
                      required
                    />
                    <span className="form-highlight"></span>
                  </div>
                </div>

                <div className="form-group full-width">
                  <label htmlFor="category">Inquiry Category</label>
                  <select
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    required
                  >
                    <option value="general">General Inquiry</option>
                    <option value="support">Customer Support</option>
                    <option value="sales">Sales Question</option>
                    <option value="warranty">Warranty Claim</option>
                    <option value="partnership">Partnership</option>
                  </select>
                  <span className="form-highlight"></span>
                </div>

                <div className="form-group full-width">
                  <label htmlFor="subject">Subject</label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    placeholder="How can we help?"
                    required
                  />
                  <span className="form-highlight"></span>
                </div>

                <div className="form-group full-width">
                  <label htmlFor="message">Message</label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Tell us more about your inquiry..."
                    rows="6"
                    required
                  ></textarea>
                  <span className="form-highlight"></span>
                </div>

                <button 
                  type="submit" 
                  className={`form-submit-btn ${loading ? 'loading' : ''}`}
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span className="btn-spinner"></span>
                      Sending...
                    </>
                  ) : (
                    <>
                      Send Message
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </>
                  )}
                </button>
              </form>
            )}
          </div>

          <div className="form-benefits">
            <div className="benefit-item">
              <span className="benefit-icon">⚡</span>
              <span>Lightning Fast Response</span>
            </div>
            <div className="benefit-item">
              <span className="benefit-icon">🔒</span>
              <span>Secure & Private</span>
            </div>
            <div className="benefit-item">
              <span className="benefit-icon">💯</span>
              <span>Expert Support</span>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ SECTION */}
      <section 
        ref={el => sectionRefs.current.faq = el}
        data-section="faq"
        className={`contact-faq-redesigned ${visibleSections.faq ? 'in-view' : ''}`}
      >
        <div className="container">
          <div className="section-header centered">
            <h2 className="section-title">Frequently Asked Questions</h2>
            <p className="section-subtitle">Find answers to common questions about our products and services</p>
          </div>

          <div className="faq-items">
            {[
              {
                q: "What's your shipping policy?",
                a: "We offer worldwide shipping with complimentary packaging. Orders ship within 24 hours."
              },
              {
                q: "Do you offer warranty on watches?",
                a: "All our watches come with a 5-year international warranty covering manufacturing defects."
              },
              {
                q: "Can I return or exchange my watch?",
                a: "Yes, we offer 30-day returns and exchanges on all unworn items in original packaging."
              },
              {
                q: "How can I verify authenticity?",
                a: "Each timepiece comes with a certificate of authenticity and serial number verification."
              }
            ].map((item, idx) => (
              <details key={idx} className="faq-item">
                <summary className="faq-question">
                  <span>{item.q}</span>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="6 9 12 15 18 9" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </summary>
                <div className="faq-answer">
                  <p>{item.a}</p>
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* CTA SECTION */}
      <section 
        ref={el => sectionRefs.current.cta = el}
        data-section="cta"
        className={`contact-cta-redesigned ${visibleSections.cta ? 'in-view' : ''}`}
      >
        <div className="cta-content">
          <h2>Still Have Questions?</h2>
          <p>Visit our knowledge base or schedule a consultation with our experts</p>
          <div className="cta-buttons">
            <a href="#" className="cta-btn primary">
              Schedule Call
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="1" fill="currentColor"/>
                <circle cx="12" cy="12" r="8"/>
                <path d="M12 7v5l3 3" strokeLinecap="round"/>
              </svg>
            </a>
            <a href="#" className="cta-btn secondary">
              Knowledge Base
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20M4 7a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V7z" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}