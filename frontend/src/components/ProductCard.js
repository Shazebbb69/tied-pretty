import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag } from 'lucide-react';

const ProductCard = ({ product }) => {
  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div className="product-card group" data-testid={`product-card-${product.id}`}>
      <Link to={`/product/${product.id}`} className="block">
        {/* Image Container */}
        <div className="relative overflow-hidden">
          <img
            src={product.image_url}
            alt={product.name}
            className="w-full aspect-square object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
          {!product.in_stock && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <span className="bg-white text-[#2D283E] px-4 py-2 rounded-full font-semibold text-sm">
                Out of Stock
              </span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-4">
          {/* Category Badge */}
          <span className="inline-block px-3 py-1 bg-[#F3E8FF] text-[#FF6B9E] text-xs font-semibold rounded-full mb-2 capitalize">
            {product.category.replace('-', ' ')}
          </span>

          {/* Title */}
          <h3 className="font-semibold text-[#2D283E] text-lg mb-2 line-clamp-2" style={{ fontFamily: 'Fredoka, sans-serif' }}>
            {product.name}
          </h3>

          {/* Price */}
          <div className="flex items-center justify-between">
            <span className="text-xl font-bold text-[#FF6B9E]" data-testid={`product-price-${product.id}`}>
              {formatPrice(product.price)}
            </span>
            
            {product.in_stock && (
              <a
                href={`https://wa.me/916388533973?text=Hi! I'm interested in ${encodeURIComponent(product.name)} (${formatPrice(product.price)})`}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="p-2 bg-[#25D366] text-white rounded-full hover:scale-110 transition-transform"
                data-testid={`product-order-btn-${product.id}`}
              >
                <ShoppingBag className="w-5 h-5" />
              </a>
            )}
          </div>
        </div>
      </Link>
    </div>
  );
};

export default ProductCard;
