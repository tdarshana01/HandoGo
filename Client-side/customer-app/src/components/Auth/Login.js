import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import LoginIllustration from '../../assets/LoginImage.png';
import LogoSVG from '../../assets/Logo.png';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  // role is derived from server response after login
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState('');
  // Use deployed admin app URL (Netlify)
  const ADMIN_APP_URL = 'https://serviceadmin-app.netlify.app';

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
    if (apiError) {
      setApiError('');
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.email) {
      newErrors.email = 'Email address is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email address is invalid';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validateForm();
    
    if (Object.keys(newErrors).length === 0) {
      setIsLoading(true);
      setApiError('');
      
  const result = await login(formData.email, formData.password);

      if (result.success) {
        const userRole = (result.user && result.user.role) ? result.user.role.toLowerCase() : null;

        try {
          const payload = { token: result.token, user: result.user };
          const encoded = btoa(JSON.stringify(payload));

          if (userRole === 'coordinator') {
            // Coordinator -> request-service (port 3002)
            window.location.href = `https://servicecoordinator-app.netlify.app/service-requests?auth=${encodeURIComponent(encoded)}`;
            return;
          }

          if (userRole === 'customer') {
            // Customer -> customer dashboard (port 3001)
            window.location.href = `https://servicecustomer-app.netlify.app/dashboard?auth=${encodeURIComponent(encoded)}`;
            return;
          }

          if (userRole === 'admin') {
            // Admin -> admin app (Netlify) - dashboard
            window.location.href = `${ADMIN_APP_URL}/dashboard?auth=${encodeURIComponent(encoded)}`;
            return;
          }

          // fallback: navigate locally
          navigate('/dashboard');
        } catch (e) {
          // fallback behavior if encoding fails
          if (userRole === 'coordinator') {
            window.location.href = 'https://servicecoordinator-app.netlify.app/service-requests';
          } else if (userRole === 'customer') {
            window.location.href = 'https://servicecustomer-app.netlify.app/dashboard';
          } else if (userRole === 'admin') {
            window.location.href = `${ADMIN_APP_URL}/dashboard`;
          } else {
            navigate('/dashboard');
          }
        }
      } else {
        setApiError(result.error || 'Login failed. Please try again.');
      }
      
      setIsLoading(false);
    } else {
      setErrors(newErrors);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Illustration */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-50 to-blue-100 items-center justify-center p-12">
        <div className="max-w-md w-full">
          <div className="relative">
            {/* Decorative elements */}
            <div className="absolute top-0 left-0 w-16 h-16 bg-yellow-200 rounded-full opacity-50 blur-xl"></div>
            <div className="absolute top-20 right-0 w-20 h-20 bg-pink-200 rounded-full opacity-50 blur-xl"></div>
            <div className="absolute bottom-10 left-10 w-24 h-24 bg-blue-200 rounded-full opacity-50 blur-xl"></div>

            {/* Render SVG illustration */}
            <div className="relative bg-white/10 backdrop-blur-sm rounded-3xl p-6 shadow-xl flex items-center justify-center">
              <img src={LoginIllustration} alt="Login illustration" className="max-w-full h-auto" />
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white">
        <div className="max-w-md w-full space-y-8">
          {/* Logo and Welcome Text */}
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 flex items-center justify-center">
                <img src={LogoSVG} alt="HandiGO logo" className="w-16 h-16" />
              </div>
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome to HandiGO</h2>
            <p className="text-sm text-gray-500">Login to your account</p>
          </div>

          {/* Login Form */}
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            {/* API Error Message */}
            {apiError && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                <p className="text-sm">{apiError}</p>
              </div>
            )}
            
            <div className="space-y-4">
              {/* Email Input */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`appearance-none relative block w-full px-4 py-3 border ${
                    errors.email ? 'border-red-500' : 'border-gray-300'
                  } placeholder-gray-400 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all`}
                  placeholder="Enter your email"
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-500">{errors.email}</p>
                )}
              </div>

              {/* Password Input */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  value={formData.password}
                  onChange={handleChange}
                  className={`appearance-none relative block w-full px-4 py-3 border ${
                    errors.password ? 'border-red-500' : 'border-gray-300'
                  } placeholder-gray-400 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all`}
                  placeholder="Enter your password"
                />
                {errors.password && (
                  <p className="mt-1 text-sm text-red-500">{errors.password}</p>
                )}
              </div>
            </div>

            {/* Forgot Password Link */}
            <div className="flex items-center justify-end">
              <button
                type="button"
                className="text-sm font-medium text-blue-600 hover:text-blue-500 transition-colors"
              >
                Forgot password?
              </button>
            </div>

            {/* Login Button */}
            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {isLoading ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Logging in...
                  </span>
                ) : (
                  'Login'
                )}
              </button>
            </div>

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Or</span>
              </div>
            </div>

            {/* Sign Up Link */}
            <div className="text-center">
              <p className="text-sm text-gray-600">
                Don't have an account?{' '}
                <button
                  type="button"
                  onClick={() => navigate('/signup')}
                  className="font-medium text-blue-600 hover:text-blue-500 transition-colors"
                >
                  Sign Up
                </button>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
