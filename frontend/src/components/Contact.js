import React, { useState, useEffect } from 'react';
import Navbar from './Navbar';

const Contact = () => {
  useEffect(() => {
    document.title = "Tirashop - Contact";
  }, []);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });

  const [messageLength, setMessageLength] = useState(0);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    if (name === 'message') {
      setMessageLength(value.length);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    alert('Message sent successfully!');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Navbar />

      {/* Breadcrumb */}
      <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-6 mt-16">
        <a className="hover:text-pink-600 transition-colors" href="/">Home</a>
        <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 
          7.293 6.707a1 1 0 011.414-1.414l4 
          4a1 1 0 010 1.414l-4 
          4a1 1 0 01-1.414 0z" clipRule="evenodd" />
        </svg>
        <span className="text-pink-600 font-semibold">Contact</span>
      </nav>

      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-extrabold text-rose-600 mb-4 tracking-tight">
          Get in Touch
        </h1>
        <p className="text-orange-600 text-lg max-w-2xl mx-auto leading-rugged">
          We'd love to hear from you. Send us a message and we'll respond as soon as possible.
        </p>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Contact Form */}
        <div className="bg-white rounded-2xl shadow-md border border-pink-100 p-8">
          <h2 className="text-2xl font-semibold text-rose-600 mb-6">Send us a Message</h2>
          
          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Name & Email */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-rose-600 mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  name="name"
                  required
                  placeholder="Your full name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg 
                  focus:outline-none focus:ring-2 focus:ring-rose-500 text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-rose-600 mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  name="email"
                  required
                  placeholder="your.email@example.com"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg 
                  focus:outline-none focus:ring-2 focus:ring-rose-500 text-sm"
                />
              </div>
            </div>

            {/* Phone & Subject */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-rose-600 mb-2">
                  Phone
                </label>
                <input
                  type="tel"
                  name="phone"
                  placeholder="Your phone number"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg 
                  focus:outline-none focus:ring-2 focus:ring-rose-500 text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-rose-600 mb-2">
                  Subject *
                </label>
                <select
                  name="subject"
                  required
                  value={formData.subject}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg 
                  focus:outline-none focus:ring-2 focus:ring-rose-500 text-sm"
                >
                  <option value="">Choose a subject</option>
                  <option value="general">General Inquiry</option>
                  <option value="order">Order Question</option>
                  <option value="catering">Catering Services</option>
                  <option value="custom">Custom Orders</option>
                  <option value="feedback">Feedback</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>

            {/* Message */}
            <div>
              <label className="block text-sm font-medium text-rose-600 mb-2">
                Message *
              </label>
              <textarea
                name="message"
                rows="6"
                maxLength="500"
                required
                placeholder="Tell us how we can help you..."
                value={formData.message}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg 
                focus:outline-none focus:ring-2 focus:ring-rose-500 text-sm resize-none"
              />
              <p className="text-xs text-gray-500 mt-1">
                {messageLength}/500 characters
              </p>
            </div>

            {/* Button */}
            <button
              type="submit"
              className="w-full bg-rose-500 hover:bg-rose-600 text-white py-3 px-6 
              rounded-lg font-medium shadow transition-colors"
            >
              Send Message
            </button>
          </form>
        </div>

        {/* Info + Map */}
        <div className="space-y-8">
          {/* Info Card */}
          <div className="bg-white rounded-2xl shadow-md border border-pink-100 p-8 space-y-6">
            <h2 className="text-2xl font-semibold text-rose-600">Visit Our Bakery</h2>
            
            {/* Address */}
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-rose-100 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-rose-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 
                    0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-rose-600">Address</h3>
                <p className="text-gray-700 leading-snug text-[18px]">
                  123 Sweet Street<br />
                  Bakery District, Paris 75001<br />
                  France
                </p>
              </div>
            </div>

            {/* Phone */}
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-rose-100 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-rose-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 
                    4.493a1 1 0 01-.502 1.21l-2.257 
                    1.13a11.042 11.042 0 005.516 
                    5.516l1.13-2.257a1 1 0 011.21-.502l4.493 
                    1.498a1 1 0 01.684.949V19a2 2 0 
                    01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-rose-600">Phone</h3>
                <p className="text-gray-700 leading-snug text-[18px]">+33 1 42 86 87 88</p>
              </div>
            </div>

            {/* Email */}
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-rose-100 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-rose-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                    d="M3 8l7.89 5.26a2 2 0 002.22 
                    0L21 8M5 19h14a2 2 0 
                    002-2V7a2 2 0 
                    00-2-2H5a2 2 0 
                    00-2 2v10a2 2 0 
                    002 2z" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-rose-600">Email</h3>
                <p className="text-gray-700 leading-snug text-[18px]">hello@tirashop.com</p>
              </div>
            </div>

            {/* Hours */}
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-rose-100 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-rose-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                    d="M12 8v4l3 3m6-3a9 9 0 
                    11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-rose-600">Opening Hours</h3>
                <p className="text-gray-700 leading-snug text-[18px]">Mon-Fri: 7:00 AM - 8:00 PM</p>
                <p className="text-gray-700 leading-snug text-[18px]">Saturday: 8:00 AM - 9:00 PM</p>
                <p className="text-gray-700 leading-snug text-[18px]">Sunday: 8:00 AM - 6:00 PM</p>
              </div>
            </div>
          </div>

          {/* Map */}
          <div className="bg-white rounded-2xl shadow-md border border-pink-100 overflow-hidden">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d62699.94123424123!2d106.60769742167969!3d10.830714799999996!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752537da9cb641%3A0x5e2263044ca32536!2sFriendship%20Coffee!5e0!3m2!1sen!2sfr!4v1574938668283!5m2!1sen!2sfr"
              width="100%"
              height="300"
              style={{ border: 0 }}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Tirashop Location"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
