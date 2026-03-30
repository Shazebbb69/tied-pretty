import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Instagram, MessageCircle, Mail, MapPin } from 'lucide-react';

const Footer = () => {
  const categories = [
    { name: 'Hamper', slug: 'hamper' },
    { name: 'Bouquet', slug: 'bouquet' },
    { name: 'Keychain', slug: 'keychain' },
    { name: 'Hair Accessories', slug: 'hair-accessories' },
    { name: 'Plushie', slug: 'plushie' },
    { name: 'Custom Album', slug: 'custom-album' },
    { name: 'Custom Embroidery', slug: 'custom-embroidery' },
  ];

  return (
    <footer className="bg-[#2D283E] text-white" data-testid="main-footer">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4" data-testid="footer-logo">
              <Heart className="w-8 h-8 text-[#FF6B9E] fill-[#FF6B9E]" />
              <span className="text-2xl font-bold" style={{ fontFamily: 'Fredoka, sans-serif' }}>
                TP LoveCo
              </span>
            </Link>
            <p className="text-gray-300 text-sm leading-relaxed mb-4">
              Handcrafted with love. Each piece is unique and made especially for you.
            </p>
            <div className="flex items-center gap-4">
              <a
                href="https://www.instagram.com/tp._loveco"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-[#FF6B9E] flex items-center justify-center hover:scale-110 transition-transform"
                data-testid="footer-instagram"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="https://wa.me/916388533973"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-[#25D366] flex items-center justify-center hover:scale-110 transition-transform"
                data-testid="footer-whatsapp"
              >
                <MessageCircle className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4" style={{ fontFamily: 'Fredoka, sans-serif' }}>
              Quick Links
            </h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-300 hover:text-[#FF6B9E] transition-colors" data-testid="footer-link-home">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/products" className="text-gray-300 hover:text-[#FF6B9E] transition-colors" data-testid="footer-link-products">
                  All Products
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-300 hover:text-[#FF6B9E] transition-colors" data-testid="footer-link-about">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-300 hover:text-[#FF6B9E] transition-colors" data-testid="footer-link-contact">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-lg font-semibold mb-4" style={{ fontFamily: 'Fredoka, sans-serif' }}>
              Categories
            </h3>
            <ul className="space-y-2">
              {categories.slice(0, 5).map((cat) => (
                <li key={cat.slug}>
                  <Link
                    to={`/products/${cat.slug}`}
                    className="text-gray-300 hover:text-[#FF6B9E] transition-colors"
                    data-testid={`footer-category-${cat.slug}`}
                  >
                    {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-semibold mb-4" style={{ fontFamily: 'Fredoka, sans-serif' }}>
              Contact Us
            </h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <MessageCircle className="w-5 h-5 text-[#25D366] flex-shrink-0 mt-0.5" />
                <a
                  href="https://wa.me/916388533973"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-300 hover:text-[#FF6B9E] transition-colors"
                  data-testid="footer-contact-whatsapp"
                >
                  +91 6388533973
                </a>
              </li>
              <li className="flex items-start gap-3">
                <Instagram className="w-5 h-5 text-[#FF6B9E] flex-shrink-0 mt-0.5" />
                <a
                  href="https://www.instagram.com/tp._loveco"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-300 hover:text-[#FF6B9E] transition-colors"
                  data-testid="footer-contact-instagram"
                >
                  @tp._loveco
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 pt-8 border-t border-gray-700 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-gray-400 text-sm">
            © {new Date().getFullYear()} TP LoveCo. All rights reserved.
          </p>
          <p className="text-gray-400 text-sm flex items-center gap-1">
            Made with <Heart className="w-4 h-4 text-[#FF6B9E] fill-[#FF6B9E]" /> in India
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
