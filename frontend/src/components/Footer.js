import React from 'react';
import { Link } from 'react-router-dom';
import { Instagram, MessageCircle, Heart } from 'lucide-react';

const LOGO_URL = "https://customer-assets.emergentagent.com/job_craft-corner-23/artifacts/zjr1h6m2_Screenshot_2026-03-30-21-43-48-964_com.instagram.android-edit.jpg";

const Footer = () => {
  const categories = [
    { name: 'Hamper', slug: 'hamper' },
    { name: 'Bouquet', slug: 'bouquet' },
    { name: 'Keychain', slug: 'keychain' },
    { name: 'Hair Accessories', slug: 'hair-accessories' },
    { name: 'Plushie', slug: 'plushie' },
  ];

  return (
    <footer className="bg-[#2D283E] text-white" data-testid="main-footer">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 md:py-16">
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 md:gap-12">
          {/* Brand */}
          <div className="col-span-2 sm:col-span-2 lg:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-3 sm:mb-4" data-testid="footer-logo">
              <img src={LOGO_URL} alt="tiedprettyy" className="w-8 h-8 sm:w-10 sm:h-10 rounded-full object-cover" />
              <span className="text-xl sm:text-2xl font-bold" style={{ fontFamily: 'Fredoka, sans-serif' }}>
                tiedprettyy
              </span>
            </Link>
            <p className="text-gray-300 text-xs sm:text-sm leading-relaxed mb-3 sm:mb-4">
              Handcrafted with love. Each piece is unique and made especially for you.
            </p>
            <div className="flex items-center gap-3">
              <a
                href="https://www.instagram.com/tp._loveco"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-[#FF6B9E] flex items-center justify-center hover:scale-110 transition-transform"
                data-testid="footer-instagram"
              >
                <Instagram className="w-4 h-4 sm:w-5 sm:h-5" />
              </a>
              <a
                href="https://wa.me/916388533973"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-[#25D366] flex items-center justify-center hover:scale-110 transition-transform"
                data-testid="footer-whatsapp"
              >
                <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm sm:text-lg font-semibold mb-2 sm:mb-4" style={{ fontFamily: 'Fredoka, sans-serif' }}>
              Quick Links
            </h3>
            <ul className="space-y-1 sm:space-y-2">
              <li>
                <Link to="/" className="text-gray-300 hover:text-[#FF6B9E] transition-colors text-xs sm:text-sm" data-testid="footer-link-home">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/products" className="text-gray-300 hover:text-[#FF6B9E] transition-colors text-xs sm:text-sm" data-testid="footer-link-products">
                  All Products
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-300 hover:text-[#FF6B9E] transition-colors text-xs sm:text-sm" data-testid="footer-link-about">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-300 hover:text-[#FF6B9E] transition-colors text-xs sm:text-sm" data-testid="footer-link-contact">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-sm sm:text-lg font-semibold mb-2 sm:mb-4" style={{ fontFamily: 'Fredoka, sans-serif' }}>
              Categories
            </h3>
            <ul className="space-y-1 sm:space-y-2">
              {categories.map((cat) => (
                <li key={cat.slug}>
                  <Link
                    to={`/products/${cat.slug}`}
                    className="text-gray-300 hover:text-[#FF6B9E] transition-colors text-xs sm:text-sm"
                    data-testid={`footer-category-${cat.slug}`}
                  >
                    {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="col-span-2 sm:col-span-1">
            <h3 className="text-sm sm:text-lg font-semibold mb-2 sm:mb-4" style={{ fontFamily: 'Fredoka, sans-serif' }}>
              Contact Us
            </h3>
            <ul className="space-y-2 sm:space-y-3">
              <li className="flex items-start gap-2 sm:gap-3">
                <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5 text-[#25D366] flex-shrink-0 mt-0.5" />
                <a
                  href="https://wa.me/916388533973"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-300 hover:text-[#FF6B9E] transition-colors text-xs sm:text-sm"
                  data-testid="footer-contact-whatsapp"
                >
                  +91 6388533973
                </a>
              </li>
              <li className="flex items-start gap-2 sm:gap-3">
                <Instagram className="w-4 h-4 sm:w-5 sm:h-5 text-[#FF6B9E] flex-shrink-0 mt-0.5" />
                <a
                  href="https://www.instagram.com/tp._loveco"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-300 hover:text-[#FF6B9E] transition-colors text-xs sm:text-sm"
                  data-testid="footer-contact-instagram"
                >
                  @tp._loveco
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-6 sm:mt-12 pt-4 sm:pt-8 border-t border-gray-700 flex flex-col sm:flex-row items-center justify-between gap-2 sm:gap-4">
          <p className="text-gray-400 text-xs sm:text-sm text-center sm:text-left">
            © {new Date().getFullYear()} tiedprettyy. All rights reserved.
          </p>
          <p className="text-gray-400 text-xs sm:text-sm flex items-center gap-1">
            Made with <Heart className="w-3 h-3 sm:w-4 sm:h-4 text-[#FF6B9E] fill-[#FF6B9E]" /> in India
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
