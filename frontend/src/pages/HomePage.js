import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ProductCard from '../components/ProductCard';
import CategoryCard from '../components/CategoryCard';
import { ArrowRight, Heart, Sparkles, Gift, Star } from 'lucide-react';

const API_URL = process.env.REACT_APP_BACKEND_URL;
const LOGO_URL = "https://customer-assets.emergentagent.com/job_craft-corner-23/artifacts/zjr1h6m2_Screenshot_2026-03-30-21-43-48-964_com.instagram.android-edit.jpg";

const HomePage = () => {
  const [categories, setCategories] = useState([]);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [catRes, prodRes] = await Promise.all([
          axios.get(`${API_URL}/api/categories`),
          axios.get(`${API_URL}/api/products`)
        ]);
        setCategories(catRes.data);
        setFeaturedProducts(prodRes.data.slice(0, 4));
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="min-h-screen flex flex-col" data-testid="home-page">
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden" data-testid="hero-section">
          <div className="hero-gradient absolute inset-0" />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 relative">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              {/* Left Content */}
              <div className="text-center md:text-left">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-sm mb-6 border-2 border-[#F3E8FF]">
                  <Sparkles className="w-4 h-4 text-[#FFD166]" />
                  <span className="text-sm font-medium text-[#2D283E]">Handcrafted with Love</span>
                </div>
                
                <h1 
                  className="text-4xl sm:text-5xl lg:text-6xl font-bold text-[#2D283E] mb-6 leading-tight"
                  style={{ fontFamily: 'Fredoka, sans-serif' }}
                >
                  Unique <span className="text-[#FF6B9E]">Handmade</span> Gifts for Your Loved Ones
                </h1>
                
                <p className="text-lg text-gray-600 mb-8 max-w-lg mx-auto md:mx-0">
                  Discover beautiful crochet creations, bouquets, keychains, and more. Each piece is crafted with care and made especially for you.
                </p>
                
                <div className="flex flex-col sm:flex-row items-center gap-4 justify-center md:justify-start">
                  <Link
                    to="/products"
                    className="btn-neo bg-[#FF6B9E] text-white w-full sm:w-auto text-center"
                    data-testid="hero-shop-btn"
                  >
                    Shop Now
                    <ArrowRight className="w-5 h-5 inline ml-2" />
                  </Link>
                  <a
                    href="https://wa.me/916388533973"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="whatsapp-btn w-full sm:w-auto justify-center"
                    data-testid="hero-whatsapp-btn"
                  >
                    <Gift className="w-5 h-5" />
                    Custom Order
                  </a>
                </div>
              </div>

              {/* Right Image */}
              <div className="relative">
                <div className="relative rounded-[2rem] overflow-hidden shadow-2xl border-4 border-white">
                  <img
                    src="https://images.pexels.com/photos/16228896/pexels-photo-16228896.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940"
                    alt="Handmade crafts"
                    className="w-full h-[400px] md:h-[500px] object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#FF6B9E]/20 to-transparent" />
                </div>
                
                {/* Floating Cards */}
                <div className="absolute -bottom-4 -left-4 bg-white rounded-2xl p-4 shadow-lg border-2 border-[#F3E8FF] hidden md:block">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-[#FFD166]/20 flex items-center justify-center">
                      <Star className="w-6 h-6 text-[#FFD166] fill-[#FFD166]" />
                    </div>
                    <div>
                      <p className="font-bold text-[#2D283E]">100+</p>
                      <p className="text-sm text-gray-500">Happy Customers</p>
                    </div>
                  </div>
                </div>
                
                <div className="absolute -top-4 -right-4 bg-white rounded-2xl p-4 shadow-lg border-2 border-[#F3E8FF] hidden md:block">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-[#82D1B2]/20 flex items-center justify-center">
                      <Heart className="w-6 h-6 text-[#82D1B2] fill-[#82D1B2]" />
                    </div>
                    <div>
                      <p className="font-bold text-[#2D283E]">Made with</p>
                      <p className="text-sm text-gray-500">Love & Care</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Categories Section */}
        <section className="py-16 md:py-24" data-testid="categories-section">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 
                className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#2D283E] mb-4"
                style={{ fontFamily: 'Fredoka, sans-serif' }}
              >
                Shop by Category
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Explore our collection of handmade treasures, each category filled with unique creations waiting to be discovered.
              </p>
            </div>

            {loading ? (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                {[...Array(7)].map((_, i) => (
                  <div key={i} className="aspect-square bg-gray-200 rounded-2xl animate-pulse" />
                ))}
              </div>
            ) : (
              <div className="bento-grid">
                {categories.slice(0, 7).map((category, index) => (
                  <CategoryCard
                    key={category.id}
                    category={category}
                    className={`bento-item-${index + 1} ${index === 0 ? 'min-h-[200px] md:min-h-0' : 'min-h-[150px] md:min-h-0'}`}
                  />
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Featured Products */}
        <section className="py-16 md:py-24 bg-[#F3E8FF]/30" data-testid="featured-section">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-12">
              <div>
                <h2 
                  className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#2D283E] mb-2"
                  style={{ fontFamily: 'Fredoka, sans-serif' }}
                >
                  Featured Products
                </h2>
                <p className="text-gray-600">Our most loved handmade creations</p>
              </div>
              <Link
                to="/products"
                className="hidden sm:flex items-center gap-2 text-[#FF6B9E] font-semibold hover:gap-4 transition-all"
                data-testid="view-all-products-btn"
              >
                View All
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>

            {loading ? (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="bg-white rounded-2xl overflow-hidden">
                    <div className="aspect-square bg-gray-200 animate-pulse" />
                    <div className="p-4 space-y-3">
                      <div className="h-4 bg-gray-200 rounded animate-pulse" />
                      <div className="h-6 bg-gray-200 rounded animate-pulse w-1/2" />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                {featuredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}

            <div className="mt-8 text-center sm:hidden">
              <Link
                to="/products"
                className="btn-neo bg-[#FF6B9E] text-white inline-flex items-center gap-2"
                data-testid="view-all-products-mobile-btn"
              >
                View All Products
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 md:py-24" data-testid="cta-section">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="bg-[#2D283E] rounded-[2rem] p-8 md:p-12 relative overflow-hidden">
              <div className="absolute inset-0 opacity-10">
                <div className="absolute top-0 left-0 w-32 h-32 bg-[#FF6B9E] rounded-full blur-3xl" />
                <div className="absolute bottom-0 right-0 w-32 h-32 bg-[#FFD166] rounded-full blur-3xl" />
              </div>
              
              <div className="relative">
                <h2 
                  className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-4"
                  style={{ fontFamily: 'Fredoka, sans-serif' }}
                >
                  Want Something Custom?
                </h2>
                <p className="text-gray-300 mb-8 max-w-lg mx-auto">
                  We love creating personalized gifts! Tell us your idea and we'll bring it to life with our handcrafted magic.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  <a
                    href="https://wa.me/916388533973?text=Hi! I'd like to discuss a custom order"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="whatsapp-btn w-full sm:w-auto justify-center"
                    data-testid="cta-whatsapp-btn"
                  >
                    <Gift className="w-5 h-5" />
                    Custom Order via WhatsApp
                  </a>
                  <a
                    href="https://www.instagram.com/tp._loveco"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="instagram-btn w-full sm:w-auto justify-center"
                    data-testid="cta-instagram-btn"
                  >
                    DM on Instagram
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default HomePage;
