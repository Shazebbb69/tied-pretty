import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ProductCard from '../components/ProductCard';
import { Search, Filter, X } from 'lucide-react';

const API_URL = process.env.REACT_APP_BACKEND_URL;

const ProductsPage = () => {
  const { category } = useParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(category || '');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    setSelectedCategory(category || '');
  }, [category]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [catRes, prodRes] = await Promise.all([
          axios.get(`${API_URL}/api/categories`),
          axios.get(`${API_URL}/api/products`, {
            params: {
              category: selectedCategory || undefined,
              search: searchQuery || undefined,
            },
          }),
        ]);
        setCategories(catRes.data);
        setProducts(prodRes.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [selectedCategory, searchQuery]);

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = !selectedCategory || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getCategoryName = (slug) => {
    const cat = categories.find((c) => c.slug === slug);
    return cat ? cat.name : 'All Products';
  };

  return (
    <div className="min-h-screen flex flex-col" data-testid="products-page">
      <Header />

      <main className="flex-1">
        {/* Page Header */}
        <div className="bg-[#F3E8FF]/30 py-12 md:py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1
              className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#2D283E] mb-4"
              style={{ fontFamily: 'Fredoka, sans-serif' }}
              data-testid="products-page-title"
            >
              {selectedCategory ? getCategoryName(selectedCategory) : 'All Products'}
            </h1>
            <p className="text-gray-600 max-w-2xl">
              {selectedCategory
                ? `Browse our ${getCategoryName(selectedCategory).toLowerCase()} collection`
                : 'Explore our complete collection of handmade treasures'}
            </p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
          {/* Filters Bar */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
            {/* Search */}
            <div className="relative w-full sm:w-auto">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full sm:w-80 pl-12 pr-4 py-3 rounded-xl border-2 border-[#F3E8FF] focus:border-[#FF6B9E] focus:outline-none transition-colors"
                data-testid="product-search-input"
              />
            </div>

            {/* Filter Toggle (Mobile) */}
            <button
              className="sm:hidden flex items-center gap-2 px-4 py-3 rounded-xl border-2 border-[#F3E8FF] hover:border-[#FF6B9E] transition-colors"
              onClick={() => setShowFilters(!showFilters)}
              data-testid="filter-toggle-btn"
            >
              <Filter className="w-5 h-5 text-[#2D283E]" />
              <span className="font-medium">Filters</span>
            </button>

            {/* Desktop Category Pills */}
            <div className="hidden sm:flex items-center gap-2 flex-wrap">
              <Link
                to="/products"
                onClick={() => setSelectedCategory('')}
                className={`px-4 py-2 rounded-full font-medium transition-all ${
                  !selectedCategory
                    ? 'bg-[#FF6B9E] text-white'
                    : 'bg-[#F3E8FF] text-[#2D283E] hover:bg-[#FF6B9E]/20'
                }`}
                data-testid="filter-all"
              >
                All
              </Link>
              {categories.map((cat) => (
                <Link
                  key={cat.id}
                  to={`/products/${cat.slug}`}
                  onClick={() => setSelectedCategory(cat.slug)}
                  className={`px-4 py-2 rounded-full font-medium transition-all ${
                    selectedCategory === cat.slug
                      ? 'bg-[#FF6B9E] text-white'
                      : 'bg-[#F3E8FF] text-[#2D283E] hover:bg-[#FF6B9E]/20'
                  }`}
                  data-testid={`filter-${cat.slug}`}
                >
                  {cat.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Mobile Filters Panel */}
          {showFilters && (
            <div className="sm:hidden mb-6 p-4 bg-white rounded-2xl border-2 border-[#F3E8FF]" data-testid="mobile-filters-panel">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-[#2D283E]" style={{ fontFamily: 'Fredoka, sans-serif' }}>
                  Categories
                </h3>
                <button onClick={() => setShowFilters(false)}>
                  <X className="w-5 h-5 text-gray-400" />
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                <Link
                  to="/products"
                  onClick={() => {
                    setSelectedCategory('');
                    setShowFilters(false);
                  }}
                  className={`px-4 py-2 rounded-full font-medium transition-all ${
                    !selectedCategory
                      ? 'bg-[#FF6B9E] text-white'
                      : 'bg-[#F3E8FF] text-[#2D283E]'
                  }`}
                >
                  All
                </Link>
                {categories.map((cat) => (
                  <Link
                    key={cat.id}
                    to={`/products/${cat.slug}`}
                    onClick={() => {
                      setSelectedCategory(cat.slug);
                      setShowFilters(false);
                    }}
                    className={`px-4 py-2 rounded-full font-medium transition-all ${
                      selectedCategory === cat.slug
                        ? 'bg-[#FF6B9E] text-white'
                        : 'bg-[#F3E8FF] text-[#2D283E]'
                    }`}
                  >
                    {cat.name}
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Products Grid */}
          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="bg-white rounded-2xl overflow-hidden border-2 border-[#F3E8FF]">
                  <div className="aspect-square bg-gray-200 animate-pulse" />
                  <div className="p-4 space-y-3">
                    <div className="h-4 bg-gray-200 rounded animate-pulse" />
                    <div className="h-6 bg-gray-200 rounded animate-pulse w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-16" data-testid="no-products-message">
              <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-[#F3E8FF] flex items-center justify-center">
                <Search className="w-10 h-10 text-[#FF6B9E]" />
              </div>
              <h3 className="text-xl font-semibold text-[#2D283E] mb-2" style={{ fontFamily: 'Fredoka, sans-serif' }}>
                No products found
              </h3>
              <p className="text-gray-500 mb-6">
                Try adjusting your search or filter to find what you're looking for.
              </p>
              <Link
                to="/products"
                onClick={() => {
                  setSelectedCategory('');
                  setSearchQuery('');
                }}
                className="btn-neo bg-[#FF6B9E] text-white inline-block"
              >
                View All Products
              </Link>
            </div>
          ) : (
            <>
              <p className="text-gray-500 mb-6" data-testid="products-count">
                Showing {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''}
              </p>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6" data-testid="products-grid">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ProductsPage;
