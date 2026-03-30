# TP LoveCo - Handicraft E-commerce Website PRD

## Original Problem Statement
Create a website for homemade crochet items and handicrafts including bouquets, embroidery, and keychains. Features required:
- About Us and Contact sections
- Category section for different products (easy search by category)
- Product display like Amazon (image on top, price below)
- Admin panel for product management

## User Personas
1. **Customer**: Looking for unique handmade gifts, wants to browse by category, easy contact via WhatsApp/Instagram
2. **Business Owner (Admin)**: Needs to add/edit/delete products, manage inventory

## Core Requirements
- Homepage with featured products and category navigation
- Products page with Amazon-style grid layout
- Category filtering
- Product detail pages
- About Us page
- Contact page with WhatsApp and Instagram links
- Admin panel for product management
- Responsive design for mobile/desktop

## Architecture
- **Frontend**: React with Tailwind CSS, Shadcn/UI components
- **Backend**: FastAPI (Python)
- **Database**: MongoDB
- **Authentication**: JWT-based admin authentication

## Categories
1. Hamper
2. Bouquet
3. Keychain
4. Hair Accessories
5. Plushie
6. Custom Album
7. Custom Embroidery on Handkerchief

## Contact Information
- WhatsApp: +91 6388533973
- Instagram: @tp._loveco (https://www.instagram.com/tp._loveco)

## What's Been Implemented (March 30, 2026)

### Frontend
- ✅ Homepage with hero section, category bento grid, featured products
- ✅ Products page with search and category filtering
- ✅ Product detail page with WhatsApp order button
- ✅ About Us page
- ✅ Contact page with WhatsApp and Instagram links
- ✅ Admin login page
- ✅ Admin dashboard with product management (CRUD)
- ✅ Responsive design
- ✅ Colorful and playful design theme (Fredoka + Nunito fonts)

### Backend
- ✅ Products API (CRUD)
- ✅ Categories API
- ✅ JWT Authentication for admin
- ✅ Admin seeding on startup
- ✅ Sample products seeded

### Admin Credentials
- Email: admin@tploveco.com
- Password: admin123

## Prioritized Backlog

### P0 (Critical) - Done
- Core product display
- Category navigation
- Contact information
- Admin product management

### P1 (High Priority) - Future
- Product image upload (currently uses URL)
- Multiple images per product
- Order management system
- Customer inquiries tracking

### P2 (Medium Priority) - Future
- SEO optimization
- Analytics dashboard
- Promotional banners
- Featured products management

### P3 (Nice to Have) - Future
- Customer reviews
- Wishlist functionality
- Email notifications
- Inventory alerts

## Next Tasks
1. Add actual product images from user's inventory
2. Set up custom domain (user mentioned wanting free domain/hosting)
3. Add more products to each category
4. Consider adding a simple order tracking system
