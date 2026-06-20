import React from "react";
import "@/App.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { Toaster } from "./components/ui/sonner";

// Pages
import HomePage from "./pages/HomePage";
import ProductsPage from "./pages/ProductsPage";
import ProductDetailPage from "./pages/ProductDetailPage";
import AboutPage from "./pages/AboutPage";
import ContactPage from "./pages/ContactPage";
import AdminLoginPage from "./pages/AdminLoginPage";
import AdminDashboard from "./pages/AdminDashboard";

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FFFDF7]">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#FF6B9E] border-t-transparent"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/admin/login" replace />;
  }

  return children;
};

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/products" element={<ProductsPage />} />
      <Route path="/products/:category" element={<ProductsPage />} />
      <Route path="/product/:id" element={<ProductDetailPage />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="/contact" element={<ContactPage />} />
      <Route path="/admin/login" element={<AdminLoginPage />} />
      <Route
        path="/admin/*"
        element={
          <ProtectedRoute>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

function MaintenancePage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FFFDF7] px-4">
      <div className="text-center max-w-lg">
        <h1 className="text-4xl font-bold text-[#FF6B9E] mb-4">
          Website Under Maintenance
        </h1>

        <p className="text-gray-600 text-lg mb-6">
          We are currently updating the website to improve your experience.
          Please check back soon.
        </p>

        <p className="text-gray-500">
          For urgent inquiries, please contact us on WhatsApp or Instagram.
        </p>
      </div>
    </div>
  );
}

function App() {
  const MAINTENANCE_MODE = true;

  if (MAINTENANCE_MODE) {
    return <MaintenancePage />;
  }

  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="App min-h-screen bg-[#FFFDF7]">
          <AppRoutes />
          <Toaster position="top-right" />
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
