import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import SignupIllustration from '../../assets/SignUpImage.png';
import LogoSVG from '../../assets/Logo.png';

const Signup = () => {
  const navigate = useNavigate();
  const { signup } = useAuth();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phoneNumber: '',
    agreeToTerms: false,
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
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
    
    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    }
    
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
    
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    if (!formData.agreeToTerms) {
      newErrors.agreeToTerms = 'You must agree to the terms and conditions';
    }
    // role validation removed
    
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validateForm();
    
    if (Object.keys(newErrors).length === 0) {
      setIsLoading(true);
      setApiError('');
      
      const result = await signup({
        fullName: formData.fullName,
        email: formData.email,
        password: formData.password,
        phoneNumber: formData.phoneNumber
      });
      
      if (result.success) {
        setSuccessMessage('Account created successfully! Redirecting to login...');
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      } else {
        setApiError(result.error || 'Signup failed. Please try again.');
      }
      
      setIsLoading(false);
    } else {
      setErrors(newErrors);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Illustration */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-purple-50 to-pink-50 items-center justify-center p-12">
        <div className="max-w-md w-full">
          <div className="relative">
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-16 h-16 bg-purple-200 rounded-full opacity-50 blur-xl"></div>
            <div className="absolute top-20 left-0 w-20 h-20 bg-pink-200 rounded-full opacity-50 blur-xl"></div>
            <div className="absolute bottom-10 right-10 w-24 h-24 bg-blue-200 rounded-full opacity-50 blur-xl"></div>

            {/* Render SVG illustration */}
            <div className="relative bg-white/10 backdrop-blur-sm rounded-3xl p-6 shadow-xl flex items-center justify-center">
              <img src={SignupIllustration} alt="Signup illustration" className="max-w-full h-auto" />
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Signup Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white overflow-y-auto">
        <div className="max-w-md w-full space-y-8 py-8">
          {/* Logo and Welcome Text */}
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 flex items-center justify-center">
                <img src={LogoSVG} alt="HandiGO logo" className="w-16 h-16" />
              </div>
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome to HandiGO</h2>
            <p className="text-sm text-gray-500">Create your account</p>
          </div>

          {/* Signup Form */}
          <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
            {/* Success Message */}
            {successMessage && (
              <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
                <p className="text-sm">{successMessage}</p>
              </div>
            )}
            
            {/* API Error Message */}
            {apiError && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                <p className="text-sm">{apiError}</p>
              </div>
            )}
            
            <div className="space-y-4">
              {/* Full Name Input */}
              <div>
                <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name
                </label>
                <input
                  id="fullName"
                  name="fullName"
                  type="text"
                  autoComplete="name"
                  value={formData.fullName}
                  onChange={handleChange}
                  className={`appearance-none relative block w-full px-4 py-3 border ${
                    errors.fullName ? 'border-red-500' : 'border-gray-300'
                  } placeholder-gray-400 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all`}
                  placeholder="Enter your full name"
                />
                {errors.fullName && (
                  <p className="mt-1 text-sm text-red-500">{errors.fullName}</p>
                )}
              </div>

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

              {/* Phone Number Input */}
              <div>
                <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number (Optional)
                </label>
                <input
                  id="phoneNumber"
                  name="phoneNumber"
                  type="tel"
                  autoComplete="tel"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  className="appearance-none relative block w-full px-4 py-3 border border-gray-300 placeholder-gray-400 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="Enter your phone number"
                />
              </div>

              {/* Role selection removed - server assigns Customer by default */}

              {/* Password Input */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  value={formData.password}
                  onChange={handleChange}
                  className={`appearance-none relative block w-full px-4 py-3 border ${
                    errors.password ? 'border-red-500' : 'border-gray-300'
                  } placeholder-gray-400 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all`}
                  placeholder="Create a password"
                />
                {errors.password && (
                  <p className="mt-1 text-sm text-red-500">{errors.password}</p>
                )}
              </div>

              {/* Confirm Password Input */}
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                  Confirm Password
                </label>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  autoComplete="new-password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className={`appearance-none relative block w-full px-4 py-3 border ${
                    errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
                  } placeholder-gray-400 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all`}
                  placeholder="Confirm your password"
                />
                {errors.confirmPassword && (
                  <p className="mt-1 text-sm text-red-500">{errors.confirmPassword}</p>
                )}
              </div>

              {/* Terms and Conditions Checkbox */}
              <div>
                <div className="flex items-start">
                  <input
                    id="agreeToTerms"
                    name="agreeToTerms"
                    type="checkbox"
                    checked={formData.agreeToTerms}
                    onChange={handleChange}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded mt-1"
                  />
                  <label htmlFor="agreeToTerms" className="ml-2 block text-sm text-gray-700">
                    I agree to the{' '}
                    <button type="button" className="text-blue-600 hover:text-blue-500 font-medium">
                      Terms and Conditions
                    </button>{' '}
                    and{' '}
                    <button type="button" className="text-blue-600 hover:text-blue-500 font-medium">
                      Privacy Policy
                    </button>
                  </label>
                </div>
                {errors.agreeToTerms && (
                  <p className="mt-1 text-sm text-red-500">{errors.agreeToTerms}</p>
                )}
              </div>
            </div>

            {/* Sign Up Button */}
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
                    Creating account...
                  </span>
                ) : (
                  'Sign Up'
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

            {/* Login Link */}
            <div className="text-center">
              <p className="text-sm text-gray-600">
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => navigate('/login')}
                  className="font-medium text-blue-600 hover:text-blue-500 transition-colors"
                >
                  Login
                </button>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Signup;
