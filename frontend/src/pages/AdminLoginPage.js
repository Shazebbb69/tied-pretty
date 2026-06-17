import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Eye, EyeOff, Lock, Mail } from 'lucide-react';
import { toast } from 'sonner';

const AdminLoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { user, login } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate('/admin/dashboard');
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await login(email, password);

      toast.success('Welcome back!');
      navigate('/admin/dashboard');
    } catch (err) {
      const errorMessage =
        err?.message || 'Something went wrong. Please try again.';

      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen bg-[#FFFDF7] flex items-center justify-center px-4"
      data-testid="admin-login-page"
    >
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-4">
            <img
              src="https://customer-assets.emergentagent.com/job_craft-corner-23/artifacts/zjr1h6m2_Screenshot_2026-03-30-21-43-48-964_com.instagram.android-edit.jpg"
              alt="tiedprettyy"
              className="w-12 h-12 rounded-full object-cover"
            />
            <span
              className="text-3xl font-bold text-[#2D283E]"
              style={{ fontFamily: 'Fredoka, sans-serif' }}
            >
              tiedprettyy
            </span>
          </div>

          <h1
            className="text-2xl font-bold text-[#2D283E]"
            style={{ fontFamily: 'Fredoka, sans-serif' }}
          >
            Admin Login
          </h1>

          <p className="text-gray-500 mt-2">
            Sign in to manage your store
          </p>
        </div>

        <div className="bg-white rounded-[2rem] p-8 border-2 border-[#F3E8FF] shadow-lg">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-[#2D283E] mb-2">
                Email Address
              </label>

              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />

                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@example.com"
                  className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-[#F3E8FF] focus:border-[#FF6B9E] focus:outline-none transition-colors"
                  required
                  data-testid="admin-email-input"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-[#2D283E] mb-2">
                Password
              </label>

              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />

                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full pl-12 pr-12 py-3 rounded-xl border-2 border-[#F3E8FF] focus:border-[#FF6B9E] focus:outline-none transition-colors"
                  required
                  data-testid="admin-password-input"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  data-testid="toggle-password-btn"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {error && (
              <div
                className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm"
                data-testid="login-error"
              >
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-neo bg-[#FF6B9E] text-white disabled:opacity-50 disabled:cursor-not-allowed"
              data-testid="admin-login-btn"
            >
              {loading ? (
                <span className="inline-flex items-center gap-2">
                  <span className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></span>
                  Signing in...
                </span>
              ) : (
                'Sign In'
              )}
            </button>
          </form>
        </div>

        <div className="text-center mt-6">
          <a
            href="/"
            className="text-[#FF6B9E] hover:underline font-medium"
            data-testid="back-to-store-link"
          >
            ← Back to Store
          </a>
        </div>
      </div>
    </div>
  );
};

export default AdminLoginPage;