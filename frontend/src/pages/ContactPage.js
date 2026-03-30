import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { MessageCircle, Instagram, Clock } from 'lucide-react';

const LOGO_URL = "https://customer-assets.emergentagent.com/job_craft-corner-23/artifacts/zjr1h6m2_Screenshot_2026-03-30-21-43-48-964_com.instagram.android-edit.jpg";

const ContactPage = () => {
  const contactMethods = [
    {
      icon: MessageCircle,
      title: 'WhatsApp',
      description: 'Message us directly for quick responses',
      action: 'Chat Now',
      link: 'https://wa.me/916388533973',
      color: '#25D366',
      bgColor: '#25D366/10',
    },
    {
      icon: Instagram,
      title: 'Instagram DM',
      description: 'Follow us and send a direct message',
      action: 'DM on Instagram',
      link: 'https://www.instagram.com/tp._loveco',
      color: '#E1306C',
      bgColor: '#E1306C/10',
    },
  ];

  return (
    <div className="min-h-screen flex flex-col" data-testid="contact-page">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative py-16 md:py-24 overflow-hidden">
          <div className="hero-gradient absolute inset-0" />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
            <div className="text-center max-w-3xl mx-auto">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-sm mb-6 border-2 border-[#F3E8FF]">
                <img src={LOGO_URL} alt="tiedprettyy" className="w-6 h-6 rounded-full object-cover" />
                <span className="text-sm font-medium text-[#2D283E]">Get in Touch</span>
              </div>
              
              <h1
                className="text-4xl sm:text-5xl lg:text-6xl font-bold text-[#2D283E] mb-6"
                style={{ fontFamily: 'Fredoka, sans-serif' }}
                data-testid="contact-title"
              >
                Let's <span className="text-[#FF6B9E]">Connect!</span>
              </h1>
              
              <p className="text-lg text-gray-600 leading-relaxed">
                Have a question about our products? Want to place a custom order? Or just want to say hi? We'd love to hear from you!
              </p>
            </div>
          </div>
        </section>

        {/* Contact Cards */}
        <section className="py-16 md:py-24" data-testid="contact-methods-section">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid sm:grid-cols-2 gap-6 md:gap-8">
              {/* WhatsApp Card */}
              <div
                className="bg-white rounded-[2rem] p-8 border-2 border-[#F3E8FF] hover:shadow-xl hover:-translate-y-2 transition-all duration-300"
                data-testid="contact-whatsapp-card"
              >
                <div className="w-16 h-16 rounded-2xl bg-[#25D366]/10 flex items-center justify-center mb-6">
                  <MessageCircle className="w-8 h-8 text-[#25D366]" />
                </div>
                
                <h2
                  className="text-2xl font-bold text-[#2D283E] mb-2"
                  style={{ fontFamily: 'Fredoka, sans-serif' }}
                >
                  WhatsApp
                </h2>
                
                <p className="text-gray-600 mb-4">
                  The fastest way to reach us! Message us on WhatsApp for quick responses.
                </p>
                
                <p className="text-lg font-semibold text-[#2D283E] mb-6">
                  +91 6388533973
                </p>
                
                <a
                  href="https://wa.me/916388533973?text=Hi! I have a question about your products"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="whatsapp-btn w-full justify-center text-lg"
                  data-testid="contact-whatsapp-btn"
                >
                  <MessageCircle className="w-5 h-5" />
                  Chat on WhatsApp
                </a>
              </div>

              {/* Instagram Card */}
              <div
                className="bg-white rounded-[2rem] p-8 border-2 border-[#F3E8FF] hover:shadow-xl hover:-translate-y-2 transition-all duration-300"
                data-testid="contact-instagram-card"
              >
                <div className="w-16 h-16 rounded-2xl bg-[#E1306C]/10 flex items-center justify-center mb-6">
                  <Instagram className="w-8 h-8 text-[#E1306C]" />
                </div>
                
                <h2
                  className="text-2xl font-bold text-[#2D283E] mb-2"
                  style={{ fontFamily: 'Fredoka, sans-serif' }}
                >
                  Instagram
                </h2>
                
                <p className="text-gray-600 mb-4">
                  Follow us for updates, behind-the-scenes, and new product launches!
                </p>
                
                <p className="text-lg font-semibold text-[#2D283E] mb-6">
                  @tp._loveco
                </p>
                
                <a
                  href="https://www.instagram.com/tp._loveco"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="instagram-btn w-full justify-center text-lg"
                  data-testid="contact-instagram-btn"
                >
                  <Instagram className="w-5 h-5" />
                  Follow on Instagram
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-16 md:py-24 bg-[#F3E8FF]/30" data-testid="faq-section">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2
                className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#2D283E] mb-4"
                style={{ fontFamily: 'Fredoka, sans-serif' }}
              >
                Frequently Asked Questions
              </h2>
              <p className="text-gray-600">Quick answers to common questions</p>
            </div>

            <div className="space-y-4">
              {[
                {
                  question: 'How do I place an order?',
                  answer: 'Simply browse our products and click "Order on WhatsApp" or reach out to us via Instagram DM. We\'ll guide you through the process!',
                },
                {
                  question: 'Do you accept custom orders?',
                  answer: 'Absolutely! We love creating custom pieces. Just message us with your idea and we\'ll work together to bring it to life.',
                },
                {
                  question: 'How long does it take to make an item?',
                  answer: 'Depending on the complexity, most items take 3-7 days to create. Custom orders may take longer. We\'ll give you an estimated time when you place your order.',
                },
                {
                  question: 'Do you ship outside India?',
                  answer: 'Currently, we primarily ship within India. For international orders, please contact us directly and we\'ll try to accommodate your request.',
                },
                {
                  question: 'What payment methods do you accept?',
                  answer: 'We accept UPI, bank transfer, and other popular payment methods. Details will be shared when you place your order.',
                },
              ].map((faq, index) => (
                <div
                  key={index}
                  className="bg-white rounded-2xl p-6 border-2 border-[#F3E8FF]"
                  data-testid={`faq-item-${index}`}
                >
                  <h3
                    className="text-lg font-semibold text-[#2D283E] mb-2"
                    style={{ fontFamily: 'Fredoka, sans-serif' }}
                  >
                    {faq.question}
                  </h3>
                  <p className="text-gray-600">{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Response Time */}
        <section className="py-16 md:py-24" data-testid="response-time-section">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-[#2D283E] rounded-[2rem] p-8 md:p-12 text-center">
              <div className="w-16 h-16 rounded-full bg-[#FF6B9E]/20 flex items-center justify-center mx-auto mb-6">
                <Clock className="w-8 h-8 text-[#FF6B9E]" />
              </div>
              
              <h2
                className="text-2xl sm:text-3xl font-bold text-white mb-4"
                style={{ fontFamily: 'Fredoka, sans-serif' }}
              >
                Quick Response Guaranteed
              </h2>
              
              <p className="text-gray-300 max-w-lg mx-auto mb-6">
                We typically respond within a few hours during our business hours. For urgent inquiries, WhatsApp is the best way to reach us!
              </p>
              
              <div className="inline-flex items-center gap-2 px-6 py-3 bg-white/10 rounded-full text-white">
                <Clock className="w-5 h-5" />
                <span>Business Hours: 10 AM - 8 PM IST</span>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default ContactPage;
