import React, { useState } from 'react';
import '../css/footer.css';
import { ChevronUp } from 'lucide-react';

const ReloxFooter = () => {
  const [email, setEmail] = useState('');

  const handleSubmit = (e) => {
    e && e.preventDefault && e.preventDefault();
    console.log('Newsletter signup:', email);
    // TODO: wire up real API
    setEmail('');
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="relox-footer-wrapper" aria-label="Site footer">
      {/* Newsletter Section */}
      <section className="footer-newsletter-section">
        <div className="newsletter-container">
          <div className="newsletter-content">
            <h2>
              Subscribe <span>our newsletter</span>
            </h2>
            <p>
              Subscribe our newsletter and don't miss any of our promotions
              or sales of Relox watches. Thank you!
            </p>
          </div>

          <form className="newsletter-form" onSubmit={handleSubmit} aria-label="Newsletter signup">
            <input
              type="email"
              className="newsletter-input"
              placeholder="Your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <button type="submit" className="newsletter-button">
              Send
            </button>
          </form>
        </div>
      </section>

      {/* Main Footer */}
      <div className="footer-main">
        <div className="footer-grid">
          {/* About Column */}
          <div className="footer-column footer-about">
            <h3>About Us</h3>
            <p>
              Relox Group USA, Inc (formerly known as Relox Corporation) is
              an American manufacturer company founded in 1854. The company
              is now a wholly owned subsidiary of the Dutch conglomerate
              Relox Group B.V.
            </p>
            <a href="/about" className="footer-read-more">
              Read More →
            </a>
          </div>

          {/* Shop Column */}
          <div className="footer-column">
            <h3>Shop</h3>
            <ul className="footer-links">
              <li><a href="/shop?category=men">Men</a></li>
              <li><a href="/shop?category=women">Women</a></li>
              <li><a href="/shop?category=kids">Kids</a></li>
              <li><a href="/shop?sale=true">Sale</a></li>
              <li><a href="/collections">Collections</a></li>
            </ul>
          </div>

          {/* Relox Column */}
          <div className="footer-column">
            <h3>Relox</h3>
            <ul className="footer-links">
              <li><a href="/about">About Us</a></li>
              <li><a href="/about#story">Our Story</a></li>
              <li><a href="/careers">Careers</a></li>
              <li><a href="https://relox.com" target="_blank" rel="noopener noreferrer">Corporate Site</a></li>
              <li><a href="/global">Global Sites</a></li>
              <li><a href="/sell">Sell Relox</a></li>
              <li><a href="/contact">Contact Us</a></li>
            </ul>
          </div>

          {/* Customer Column */}
          <div className="footer-column">
            <h3>Customer</h3>
            <ul className="footer-links">
              <li><a href="/help">Help</a></li>
              <li><a href="/track-order">Check Order Status</a></li>
              <li><a href="/shipping">Shipping</a></li>
              <li><a href="/returns">Returns</a></li>
              <li><a href="/register">Product Registration</a></li>
              <li><a href="/manuals">Instructions & Manuals</a></li>
              <li><a href="/promotions">Promotional Details</a></li>
            </ul>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="footer-bottom">
          <div className="footer-brand">
            <span className="footer-logo">RELOX</span>
          </div>

          <div className="footer-legal">
            <a href="/privacy">Privacy/Security</a>
            <a href="/terms">Terms of Use</a>
            <a href="https://relox.com" target="_blank" rel="noopener noreferrer">Corporate Site</a>
          </div>

          <div className="footer-copyright">
            ©2025 Relox.com, Inc. All rights Reserved.

            <div className="footer-developer">
              Developed by <a href="https://github.com/eywrungg" target="_blank" rel="noopener noreferrer">ALCEBAR et al.,</a>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll to Top Button */}
      <button className="scroll-to-top" onClick={scrollToTop} aria-label="Scroll to top">
        <ChevronUp size={20} />
      </button>
    </footer>
  );
};

export default ReloxFooter;