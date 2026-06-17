import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag } from 'lucide-react';

const API_URL = process.env.REACT_APP_BACKEND_URL;

const ProductCard = ({ product }) => {
  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price);
  };

  const getImageUrl = (url) => {
    if (!url) return 'https://via.placeholder.com/300';
    return url.startsWith('/') ? `${API_URL}${url}` : url;
  };

  const hasDiscount = product.discount_active && product.discount_percentage > 0;
  const discountedPrice = hasDiscount 
    ? Math.round(product.price * (1 - product.discount_percentage / 100))
    : product.price;

  return (
    <div className="product-card group" data-testid={`product-card-${product.id}`}>
      <Link to={`/product/${product.id}`} className="block">
        {/* Image Container */}
        <div className="relative overflow-hidden rounded-t-xl sm:rounded-t-2xl">
          <img
            src={getImageUrl(product.image_url)}
            alt={product.name}
            className="w-full aspect-square object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
          
          {/* Discount Badge */}
          {hasDiscount && (
            <div className="absolute top-2 left-2 sm:top-3 sm:left-3 bg-[#FFD166] text-[#2D283E] px-2 py-0.5 sm:px-3 sm:py-1 rounded-full font-bold text-xs sm:text-sm shadow-md">
              {product.discount_percentage}% OFF
            </div>
          )}
          
          {!product.in_stock && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <span className="bg-white text-[#2D283E] px-2 py-1 sm:px-4 sm:py-2 rounded-full font-semibold text-xs sm:text-sm">
                Out of Stock
              </span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-2 sm:p-4">
          {/* Category Badge */}
          <span className="inline-block px-2 py-0.5 sm:px-3 sm:py-1 bg-[#F3E8FF] text-[#FF6B9E] text-[10px] sm:text-xs font-semibold rounded-full mb-1 sm:mb-2 capitalize">
            {product.category}
          </span>

          {/* Title */}
          <h3 className="font-semibold text-[#2D283E] text-sm sm:text-lg mb-1 sm:mb-2 line-clamp-2" style={{ fontFamily: 'Fredoka, sans-serif' }}>
            {product.name}
          </h3>

          {/* Price */}
          <div className="flex items-center justify-between gap-1">
            <div className="min-w-0 flex-1">
              {hasDiscount ? (
                <div className="flex flex-col sm:flex-row sm:items-center sm:gap-2">
                  <span className="text-base sm:text-xl font-bold text-[#FF6B9E]" data-testid={`product-price-${product.id}`}>
                    {formatPrice(discountedPrice)}
                  </span>
                  <span className="text-xs sm:text-sm text-gray-400 line-through">
                    {formatPrice(product.price)}
                  </span>
                </div>
              ) : (
                <span className="text-base sm:text-xl font-bold text-[#FF6B9E]" data-testid={`product-price-${product.id}`}>
                  {formatPrice(product.price)}
                </span>
              )}
            </div>
            
            {product.in_stock && (
  <button
    type="button"
    onClick={(e) => {
      e.preventDefault();
      e.stopPropagation();

      window.open(
        `https://wa.me/916388533973?text=Hi! I'm interested in ${encodeURIComponent(product.name)} (${formatPrice(discountedPrice)})`,
        "_blank"
      );
    }}
    className="p-1.5 sm:p-2 bg-[#25D366] text-white rounded-full hover:scale-110 transition-transform flex-shrink-0"
    data-testid={`product-order-btn-${product.id}`}
  >
    <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5" />
  </button>
)}
          </div>
        </div>
      </Link>
    </div>
  );
};

export default ProductCard;
