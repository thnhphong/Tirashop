import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Signup = () => {
  useEffect(() => {
    document.title = "Tirashop - Signup";
  }, []);
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    agreeTerms: false,
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!form.name || !form.email || !form.phone || !form.password) {
      setError('Name, email, phone, and password are required');
      return;
    }
    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    if (!form.agreeTerms) {
      setError('You must agree to the Terms & Conditions');
      return;
    }
    try {
      const response = await axios.post('http://localhost:5001/api/customers/signup', {
        name: form.name,
        email: form.email,
        phone: form.phone,
        password: form.password,
      });
      setSuccess('Account created successfully!');
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setError(err.response?.data?.error || 'Signup failed');
    }
  };

  const togglePasswordVisibility = () => setShowPassword(!showPassword);
  const toggleConfirmPasswordVisibility = () => setShowConfirmPassword(!showConfirmPassword);

  const handleGoBack = () => navigate(-1);

  return (
    <div className="min-h-screen flex">
      <div className="hidden lg:flex lg:w-1/2 relative">
        <img
          alt="Bakery Display"
          className="w-full h-full object-cover object-top"
          src="https://readdy.ai/api/search-image?query=Beautiful%20bakery%20display%20case%20filled%20with%20colorful%20glazed%20donuts%2C%20chocolate%20covered%20pastries%2C%20cream%20filled%20donuts%20with%20sprinkles%2C%20warm%20golden%20bakery%20lighting%2C%20professional%20bakery%20interior%2C%20wooden%20shelves%20with%20fresh%20baked%20goods%2C%20cozy%20inviting%20atmosphere&width=800&height=1000&seq=login-bg-001&orientation=portrait"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/30 to-transparent"></div>
      </div>

      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-gradient-to-br from-amber-50 via-orange-50 to-red-50">
        <div className="w-full max-w-md">
          <button
            onClick={handleGoBack}
            className="flex items-center space-x-2 text-white hover:text-orange-200 mb-6 transition-colors cursor-pointer"
          >
            <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
              <i className="ri-arrow-left-line text-orange-600 text-xl"></i>
            </div>
            <span className="text-orange-600 font-medium">Back</span>
          </button>

          <div className="text-center mb-8">
            <h1
              style={{ fontFamily: 'Rosario, sans-serif' }}
              className="text-4xl font-bold text-orange-700 mb-2 font-pacifico"
            >
              Tirashop
            </h1>
            <h2 className="text-2xl font-bold text-orange-800 mb-2 font-rosario">
              Create Your Account
            </h2>
            <p className="text-orange-600/80 font-rosario">
              Freshly baked, everyday deliciousness awaits you
            </p>
          </div>

          <form className="space-y-4" onSubmit={handleSubmit}>
            {error && <p className="text-red-500 text-center font-rosario">{error}</p>}
            {success && <p className="text-green-500 text-center font-rosario">{success}</p>}
            <div>
              <input
                type="text"
                name="name"
                placeholder="Full Name"
                value={form.name}
                onChange={handleChange}
                required
                className="w-full px-6 py-4 bg-white/90 backdrop-blur-sm border border-orange-200 rounded-2xl 
                  focus:outline-none focus:ring-2 focus:ring-orange-300 focus:border-transparent transition-all 
                  text-gray-700 placeholder-orange-400/60 font-rosario"
              />
            </div>
            <div>
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={form.email}
                onChange={handleChange}
                required
                className="w-full px-6 py-4 bg-white/90 backdrop-blur-sm border border-orange-200 rounded-2xl 
                  focus:outline-none focus:ring-2 focus:ring-orange-300 focus:border-transparent transition-all 
                  text-gray-700 placeholder-orange-400/60 font-rosario"
              />
            </div>
            <div>
              <input
                type="tel"
                name="phone"
                placeholder="Phone Number"
                value={form.phone}
                onChange={handleChange}
                required
                className="w-full px-6 py-4 bg-white/90 backdrop-blur-sm border border-orange-200 rounded-2xl 
                  focus:outline-none focus:ring-2 focus:ring-orange-300 focus:border-transparent transition-all 
                  text-gray-700 placeholder-orange-400/60 font-rosario"
              />
            </div>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                placeholder="Password"
                value={form.password}
                onChange={handleChange}
                required
                className="w-full px-6 py-4 pr-12 bg-white/90 backdrop-blur-sm border border-orange-200 rounded-2xl 
                  focus:outline-none focus:ring-2 focus:ring-orange-300 focus:border-transparent transition-all 
                  text-gray-700 placeholder-orange-400/60 font-rosario"
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-orange-400 hover:text-orange-600 cursor-pointer"
              >
                <i className={showPassword ? 'ri-eye-off-line text-xl' : 'ri-eye-line text-xl'}></i>
              </button>
            </div>
            <div className="relative">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                name="confirmPassword"
                placeholder="Confirm Password"
                value={form.confirmPassword}
                onChange={handleChange}
                required
                className="w-full px-6 py-4 pr-12 bg-white/90 backdrop-blur-sm border border-orange-200 rounded-2xl 
                  focus:outline-none focus:ring-2 focus:ring-orange-300 focus:border-transparent transition-all 
                  text-gray-700 placeholder-orange-400/60 font-rosario"
              />
              <button
                type="button"
                onClick={toggleConfirmPasswordVisibility}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-orange-400 hover:text-orange-600 cursor-pointer"
              >
                <i className={showConfirmPassword ? 'ri-eye-off-line text-xl' : 'ri-eye-line text-xl'}></i>
              </button>
            </div>
            <div className="flex items-start space-x-3">
              <div className="relative mt-1">
                <input
                  type="checkbox"
                  id="agreeTerms"
                  name="agreeTerms"
                  checked={form.agreeTerms}
                  onChange={handleChange}
                  className="w-5 h-5 rounded-full border-2 border-orange-500 cursor-pointer bg-white checked:bg-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-300"
                />
                <label htmlFor="agreeTerms" className="absolute inset-0 cursor-pointer">
                  {form.agreeTerms && (
                    <i className="ri-check-line text-white text-xs absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"></i>
                  )}
                </label>
              </div>
              <p className="text-sm text-gray-600" style={{ fontFamily: 'Rosario, sans-serif' }}>
                I agree to the{' '}
                <a href="#terms" className="text-orange-600 hover:text-orange-700 underline cursor-pointer">
                  Terms & Conditions
                </a>
              </p>
            </div>
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 
                text-white font-semibold py-4 px-6 rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105 
                transition-all duration-200 cursor-pointer whitespace-nowrap font-rosario"
            >
              Create account
            </button>
            <button
              type="button"
              className="w-full flex items-center justify-center bg-red-500 hover:bg-red-600 text-white font-medium py-3 px-6 rounded-full"
              onClick={() => alert('Google Signup not implemented yet')}
            >
              <img
                src="https://www.svgrepo.com/show/475656/google-color.svg"
                alt="Google logo"
                className="w-5 h-5 mr-2"
              />
              Sign Up with Google
            </button>
          </form>
          <div className="text-center mt-6">
            <p className="text-gray-600 font-rosario">
              Already have an account?
              <button
                onClick={() => navigate('/login')}
                className="ml-2 text-orange-600 hover:text-orange-700 font-semibold transition-colors cursor-pointer"
              >
                Login
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;