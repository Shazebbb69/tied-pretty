import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ShoppingBag } from 'lucide-react';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Products', path: '/products' },
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' },
  ];

  const isActive = (path) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <header className="header-blur sticky top-0 z-50 border-b-2 border-[#F3E8FF]" data-testid="main-header">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2" data-testid="header-logo">
            <img src="https://customer-assets.emergentagent.com/job_craft-corner-23/artifacts/zjr1h6m2_Screenshot_2026-03-30-21-43-48-964_com.instagram.android-edit.jpg" alt="tiedprettyy" className="w-10 h-10 rounded-full object-cover" />
            <span className="text-xl md:text-2xl font-bold text-[#2D283E]" style={{ fontFamily: 'Fredoka, sans-serif' }}>
              tiedprettyy
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8" data-testid="desktop-nav">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                data-testid={`nav-link-${link.name.toLowerCase()}`}
                className={`font-medium transition-all duration-200 hover:text-[#FF6B9E] ${
                  isActive(link.path)
                    ? 'text-[#FF6B9E] font-semibold'
                    : 'text-[#2D283E]'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center gap-4">
            <a
              href="https://wa.me/916388533973"
              target="_blank"
              rel="noopener noreferrer"
              className="whatsapp-btn text-sm"
              data-testid="header-whatsapp-btn"
            >
              <ShoppingBag className="w-4 h-4" />
              Order Now
            </a>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-[#F3E8FF] transition-colors"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            data-testid="mobile-menu-btn"
          >
            {isMenuOpen ? (
              <X className="w-6 h-6 text-[#2D283E]" />
            ) : (
              <Menu className="w-6 h-6 text-[#2D283E]" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t-2 border-[#F3E8FF]" data-testid="mobile-menu">
            <nav className="flex flex-col gap-2">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  data-testid={`mobile-nav-link-${link.name.toLowerCase()}`}
                  onClick={() => setIsMenuOpen(false)}
                  className={`px-4 py-3 rounded-xl font-medium transition-all duration-200 ${
                    isActive(link.path)
                      ? 'bg-[#F3E8FF] text-[#FF6B9E]'
                      : 'text-[#2D283E] hover:bg-[#F3E8FF]'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
              <a
                href="https://wa.me/916388533973"
                target="_blank"
                rel="noopener noreferrer"
                className="whatsapp-btn mx-4 mt-2 justify-center"
                data-testid="mobile-whatsapp-btn"
              >
                <ShoppingBag className="w-4 h-4" />
                Order Now
              </a>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
