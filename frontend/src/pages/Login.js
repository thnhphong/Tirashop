import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import axios from 'axios';

const Login = () => {
  useEffect(() => {
    document.title = "Tirashop - Login"
  })
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({
    email: '',
    password: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    if (!form.email || !form.password) {
      setError('Email and password are required');
      return;
    }
    try {
      const response = await axios.post('http://localhost:5001/api/customers/login', {
        email: form.email,
        password: form.password,
      });
      console.log('API Response:', response.data);
      const token = response.data.token;
      const user = response.data.user;
      if (token) {
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        console.log('Token stored:', localStorage.getItem('token'));
        console.log('Token stored:', token);
        console.log('User stored:', user);
        setSuccess('Login successful!');
        setTimeout(() => {
          navigate('/');
          window.location.reload();
        }, 2000);
      } else {
        setError('No token received from server. Please try again.');
      }
    } catch (err) {
      console.error('Login error:', err.response?.data);
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
    }
  };

  const navigate = useNavigate();
  const handleGoBack = () => {
    navigate(-1);
  };

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
            <h1 className="text-4xl font-bold text-orange-700 mb-2 font-pacifico">
              Tirashop
            </h1>
            <h2 className="text-2xl font-bold text-orange-800 mb-2 font-rosario">
              Welcome Back
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
                onChange={handleChange}
                type="email"
                name="email"
                placeholder="Email"
                required
                className="w-full px-6 py-4 bg-white/90 backdrop-blur-sm border border-orange-200 rounded-2xl 
                  focus:outline-none focus:ring-2 focus:ring-orange-300 focus:border-transparent transition-all 
                  text-gray-700 placeholder-orange-400/60 font-rosario"
              />
            </div>
            <div className="relative">
              <input
                onChange={handleChange}
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Password"
                required
                className="w-full px-6 py-4 pr-12 bg-white/90 backdrop-blur-sm border border-orange-200 rounded-2xl 
                  focus:outline-none focus:ring-2 focus:ring-orange-300 focus:border-transparent transition-all 
                  text-gray-700 placeholder-orange-400/60 font-rosario"
              />
              <button
                onClick={togglePasswordVisibility}
                type="button"
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-orange-400 hover:text-orange-600 cursor-pointer"
              >
                <i className="ri-eye-line text-xl"></i>
              </button>
            </div>
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 
                text-white font-semibold py-4 px-6 rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105 
                transition-all duration-200 cursor-pointer whitespace-nowrap font-rosario"
            >
              Login
            </button>
          </form>
          <div className="text-center mt-6">
            <p className="text-gray-600 font-rosario">
              Don't have an account?
              <button
                onClick={() => window.location.href = "/signup"}
                className="ml-2 text-orange-600 hover:text-orange-700 font-semibold transition-colors cursor-pointer"
              >
                Sign Up
              </button>
            </p>
          </div>
          <div className="text-center mt-4">
            <a
              href="#forgot-password"
              className="text-sm text-gray-500 hover:text-orange-500 transition-colors font-rosario"
            >
              Forgot your password?
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
