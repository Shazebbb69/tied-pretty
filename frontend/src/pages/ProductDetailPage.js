import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ProductCard from '../components/ProductCard';
import { ArrowLeft, ShoppingBag, MessageCircle, Instagram, Check, Package, Percent } from 'lucide-react';

const API_URL = process.env.REACT_APP_BACKEND_URL;

const ProductDetailPage = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${API_URL}/api/products/${id}`);
        setProduct(response.data);

        // Fetch related products from same category
        const relatedRes = await axios.get(`${API_URL}/api/products`, {
          params: { category: response.data.category },
        });
        setRelatedProducts(relatedRes.data.filter((p) => p.id !== id).slice(0, 4));
      } catch (error) {
        console.error('Error fetching product:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price);
  };

  const getImageUrl = (url) => {
    if (!url) return 'https://via.placeholder.com/500';
    return url.startsWith('/') ? `${API_URL}${url}` : url;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#FF6B9E] border-t-transparent"></div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-[#2D283E] mb-4" style={{ fontFamily: 'Fredoka, sans-serif' }}>
              Product Not Found
            </h2>
            <Link to="/products" className="btn-neo bg-[#FF6B9E] text-white inline-block">
              Browse Products
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const hasDiscount = product.discount_active && product.discount_percentage > 0;
  const discountedPrice = hasDiscount 
    ? Math.round(product.price * (1 - product.discount_percentage / 100))
    : product.price;

  return (
    <div className="min-h-screen flex flex-col" data-testid="product-detail-page">
      <Header />

      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
          {/* Back Button */}
          <Link
            to="/products"
            className="inline-flex items-center gap-2 text-[#2D283E] hover:text-[#FF6B9E] transition-colors mb-8"
            data-testid="back-to-products-btn"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">Back to Products</span>
          </Link>

          {/* Product Details */}
          <div className="grid md:grid-cols-2 gap-8 md:gap-12 mb-16">
            {/* Image */}
            <div className="relative">
              <div className="rounded-[2rem] overflow-hidden border-2 border-[#F3E8FF] shadow-lg">
                <img
                  src={getImageUrl(product.image_url)}
                  alt={product.name}
                  className="w-full aspect-square object-cover"
                  data-testid="product-detail-image"
                />
              </div>
              
              {/* Discount Badge */}
              {hasDiscount && (
                <div className="absolute top-4 left-4 bg-[#FFD166] text-[#2D283E] px-4 py-2 rounded-full font-bold text-lg shadow-lg flex items-center gap-2">
                  <Percent className="w-5 h-5" />
                  {product.discount_percentage}% OFF
                </div>
              )}
              
              {!product.in_stock && (
                <div className="absolute top-4 right-4 bg-[#FF4D4F] text-white px-4 py-2 rounded-full font-semibold">
                  Out of Stock
                </div>
              )}
            </div>

            {/* Details */}
            <div className="flex flex-col">
              {/* Category Badge */}
              <Link
                to={`/products/${product.category}`}
                className="inline-block self-start px-4 py-2 bg-[#F3E8FF] text-[#FF6B9E] text-sm font-semibold rounded-full mb-4 capitalize hover:bg-[#FF6B9E] hover:text-white transition-colors"
                data-testid="product-detail-category"
              >
                {product.category.replace('-', ' ')}
              </Link>

              {/* Title */}
              <h1
                className="text-3xl sm:text-4xl font-bold text-[#2D283E] mb-4"
                style={{ fontFamily: 'Fredoka, sans-serif' }}
                data-testid="product-detail-name"
              >
                {product.name}
              </h1>

              {/* Price */}
              <div className="mb-6" data-testid="product-detail-price">
                {hasDiscount ? (
                  <div className="flex items-center gap-3">
                    <span className="text-3xl font-bold text-[#FF6B9E]">
                      {formatPrice(discountedPrice)}
                    </span>
                    <span className="text-xl text-gray-400 line-through">
                      {formatPrice(product.price)}
                    </span>
                    <span className="px-3 py-1 bg-[#FFD166]/20 text-[#cc9900] rounded-full font-semibold text-sm">
                      Save {formatPrice(product.price - discountedPrice)}
                    </span>
                  </div>
                ) : (
                  <span className="text-3xl font-bold text-[#FF6B9E]">
                    {formatPrice(product.price)}
                  </span>
                )}
              </div>

              {/* Description */}
              <p className="text-gray-600 text-lg leading-relaxed mb-8" data-testid="product-detail-description">
                {product.description}
              </p>

              {/* Features */}
              <div className="space-y-3 mb-8">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#82D1B2]/20 flex items-center justify-center">
                    <Check className="w-4 h-4 text-[#82D1B2]" />
                  </div>
                  <span className="text-[#2D283E]">100% Handmade with Love</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#82D1B2]/20 flex items-center justify-center">
                    <Check className="w-4 h-4 text-[#82D1B2]" />
                  </div>
                  <span className="text-[#2D283E]">Premium Quality Materials</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#82D1B2]/20 flex items-center justify-center">
                    <Package className="w-4 h-4 text-[#82D1B2]" />
                  </div>
                  <span className="text-[#2D283E]">Carefully Packaged</span>
                </div>
              </div>

              {/* CTA Buttons */}
              {product.in_stock ? (
                <div className="flex flex-col sm:flex-row gap-4">
                  <a
                    href={`https://wa.me/916388533973?text=Hi! I'm interested in ${encodeURIComponent(product.name)} (${formatPrice(discountedPrice)})`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="whatsapp-btn flex-1 justify-center text-lg"
                    data-testid="product-detail-whatsapp-btn"
                  >
                    <ShoppingBag className="w-5 h-5" />
                    Order on WhatsApp
                  </a>
                  <a
                    href={`https://www.instagram.com/tp._loveco`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="instagram-btn flex-1 justify-center text-lg"
                    data-testid="product-detail-instagram-btn"
                  >
                    <Instagram className="w-5 h-5" />
                    DM on Instagram
                  </a>
                </div>
              ) : (
                <div className="bg-gray-100 rounded-xl p-6 text-center">
                  <p className="text-gray-600 mb-4">This item is currently out of stock</p>
                  <a
                    href={`https://wa.me/916388533973?text=Hi! I'm interested in ${encodeURIComponent(product.name)} but it's out of stock. Can you let me know when it's available?`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="whatsapp-btn inline-flex"
                    data-testid="product-detail-notify-btn"
                  >
                    <MessageCircle className="w-5 h-5" />
                    Get Notified
                  </a>
                </div>
              )}
            </div>
          </div>

          {/* Related Products */}
          {relatedProducts.length > 0 && (
            <section data-testid="related-products-section">
              <h2
                className="text-2xl sm:text-3xl font-bold text-[#2D283E] mb-8"
                style={{ fontFamily: 'Fredoka, sans-serif' }}
              >
                You Might Also Like
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                {relatedProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </section>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ProductDetailPage;
