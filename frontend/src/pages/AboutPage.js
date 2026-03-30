import React from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Sparkles, Gift, Star, Users, Package, Heart } from 'lucide-react';

const LOGO_URL = "https://customer-assets.emergentagent.com/job_craft-corner-23/artifacts/zjr1h6m2_Screenshot_2026-03-30-21-43-48-964_com.instagram.android-edit.jpg";

const AboutPage = () => {
  const features = [
    {
      icon: Heart,
      title: 'Made with Love',
      description: 'Every piece is handcrafted with care and attention to detail.',
    },
    {
      icon: Sparkles,
      title: 'Unique Designs',
      description: 'Each creation is one-of-a-kind, making your gift truly special.',
    },
    {
      icon: Gift,
      title: 'Perfect for Gifting',
      description: 'Our products make memorable gifts for your loved ones.',
    },
    {
      icon: Package,
      title: 'Beautiful Packaging',
      description: 'We package each item carefully to ensure it arrives perfectly.',
    },
  ];

  return (
    <div className="min-h-screen flex flex-col" data-testid="about-page">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative py-16 md:py-24 overflow-hidden">
          <div className="hero-gradient absolute inset-0" />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-sm mb-6 border-2 border-[#F3E8FF]">
                  <img src={LOGO_URL} alt="tiedprettyy" className="w-6 h-6 rounded-full object-cover" />
                  <span className="text-sm font-medium text-[#2D283E]">Our Story</span>
                </div>
                
                <h1
                  className="text-4xl sm:text-5xl lg:text-6xl font-bold text-[#2D283E] mb-6"
                  style={{ fontFamily: 'Fredoka, sans-serif' }}
                  data-testid="about-title"
                >
                  About <span className="text-[#FF6B9E]">tiedprettyy</span>
                </h1>
                
                <p className="text-lg text-gray-600 leading-relaxed mb-6">
                  Welcome to tiedprettyy! We're a small home-based business dedicated to creating beautiful handmade crafts that bring joy to people's lives.
                </p>
                
                <p className="text-lg text-gray-600 leading-relaxed">
                  From crochet bouquets to custom embroidery, each piece we create is made with love, care, and attention to detail. We believe that handmade gifts carry a special magic that mass-produced items simply can't match.
                </p>
              </div>
              
              <div className="relative">
                <div className="rounded-[2rem] overflow-hidden shadow-2xl border-4 border-white">
                  <img
                    src="https://images.pexels.com/photos/4601228/pexels-photo-4601228.png?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940"
                    alt="Handmade crafts"
                    className="w-full h-[400px] object-cover"
                  />
                </div>
                
                {/* Floating Badge */}
                <div className="absolute -bottom-4 -right-4 bg-white rounded-2xl p-4 shadow-lg border-2 border-[#F3E8FF]">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-[#FFD166]/20 flex items-center justify-center">
                      <Star className="w-6 h-6 text-[#FFD166] fill-[#FFD166]" />
                    </div>
                    <div>
                      <p className="font-bold text-[#2D283E]">Handmade</p>
                      <p className="text-sm text-gray-500">with love</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 md:py-24 bg-[#F3E8FF]/30" data-testid="features-section">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2
                className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#2D283E] mb-4"
                style={{ fontFamily: 'Fredoka, sans-serif' }}
              >
                Why Choose Us?
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                What makes TP LoveCo special is our commitment to quality and personal touch in everything we create.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="bg-white rounded-2xl p-6 border-2 border-[#F3E8FF] hover:shadow-lg hover:-translate-y-2 transition-all duration-300"
                  data-testid={`feature-card-${index}`}
                >
                  <div className="w-14 h-14 rounded-2xl bg-[#FF6B9E]/10 flex items-center justify-center mb-4">
                    <feature.icon className="w-7 h-7 text-[#FF6B9E]" />
                  </div>
                  <h3
                    className="text-lg font-semibold text-[#2D283E] mb-2"
                    style={{ fontFamily: 'Fredoka, sans-serif' }}
                  >
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 text-sm">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Mission Section */}
        <section className="py-16 md:py-24" data-testid="mission-section">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#82D1B2]/20 rounded-full mb-6">
              <Users className="w-4 h-4 text-[#82D1B2]" />
              <span className="text-sm font-medium text-[#2D283E]">Our Mission</span>
            </div>
            
            <h2
              className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#2D283E] mb-6"
              style={{ fontFamily: 'Fredoka, sans-serif' }}
            >
              Spreading Joy Through Handmade Creations
            </h2>
            
            <p className="text-lg text-gray-600 leading-relaxed mb-8">
              Our mission is simple: to create beautiful, meaningful handmade items that bring smiles to people's faces. Whether it's a crochet bouquet for a special occasion, a cute keychain for everyday use, or a custom embroidered handkerchief as a heartfelt gift, we pour our heart into every piece we make.
            </p>
            
            <p className="text-lg text-gray-600 leading-relaxed">
              We believe that in this age of mass production, there's something truly special about owning something made by hand. Each stitch, each fold, each detail tells a story of patience, creativity, and love.
            </p>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 md:py-24 bg-[#2D283E]" data-testid="about-cta-section">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2
              className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-6"
              style={{ fontFamily: 'Fredoka, sans-serif' }}
            >
              Ready to Find Your Perfect Gift?
            </h2>
            <p className="text-gray-300 mb-8 max-w-lg mx-auto">
              Browse our collection or reach out for a custom order. We'd love to create something special just for you!
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/products"
                className="btn-neo bg-[#FF6B9E] text-white w-full sm:w-auto text-center"
                data-testid="about-shop-btn"
              >
                Shop Now
              </Link>
              <Link
                to="/contact"
                className="btn-neo bg-white text-[#2D283E] w-full sm:w-auto text-center"
                data-testid="about-contact-btn"
              >
                Contact Us
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default AboutPage;
