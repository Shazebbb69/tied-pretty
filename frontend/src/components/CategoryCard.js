import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const CategoryCard = ({ category, className = '' }) => {
  return (
    <Link
      to={`/products/${category.slug}`}
      className={`category-card block ${className}`}
      data-testid={`category-card-${category.slug}`}
    >
      <img
        src={category.image_url}
        alt={category.name}
        className="w-full h-full object-cover"
        loading="lazy"
      />
      <div className="category-overlay">
        <div className="flex items-center justify-between w-full">
          <span className="text-white font-semibold text-lg md:text-xl" style={{ fontFamily: 'Fredoka, sans-serif' }}>
            {category.name}
          </span>
          <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm">
            <ArrowRight className="w-4 h-4 text-white" />
          </div>
        </div>
      </div>
    </Link>
  );
};

export default CategoryCard;
