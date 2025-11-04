// middleware/staticFile.js
const path = require('path');
const express = require('express'); // ✅ Add this missing import
const fs = require('fs'); // ✅ Add for directory checking

const staticFilesMiddleware = (app) => {
  // Fix: Point to the correct uploads directory
  const uploadsPath = path.join(__dirname, '..', 'uploads');
  
  // Check if uploads directory exists
  if (!fs.existsSync(uploadsPath)) {
    console.warn('⚠️  Uploads directory does not exist:', uploadsPath);
    console.log('Creating uploads directory...');
    try {
      fs.mkdirSync(uploadsPath, { recursive: true });
      console.log('✅ Uploads directory created successfully');
    } catch (error) {
      console.error('❌ Failed to create uploads directory:', error.message);
    }
  }
  
  // For debugging
  console.log('📁 Uploads path:', uploadsPath);
  console.log('📁 Directory exists:', fs.existsSync(uploadsPath));
  
  // List files in uploads directory for debugging
  try {
    const files = fs.readdirSync(uploadsPath);
    console.log('📋 Files in uploads directory:', files.length > 0 ? files : 'No files found');
  } catch (error) {
    console.log('📋 Could not read uploads directory:', error.message);
  }

  // Set up static file serving with CORS headers
  app.use('/uploads', (req, res, next) => {
    // Add CORS headers for static files
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Cross-Origin-Resource-Policy', 'cross-origin');
    res.header('Cache-Control', 'public, max-age=86400'); // Cache for 1 day
    
    // Log file requests for debugging
    console.log('📄 Static file request:', req.path);
    
    next();
  }, express.static(uploadsPath));

  // Add a test route to check if static serving is working
  app.get('/api/uploads-test', (req, res) => {
    try {
      const files = fs.readdirSync(uploadsPath);
      res.json({
        success: true,
        uploadsPath,
        filesCount: files.length,
        files: files.map(file => ({
          name: file,
          url: `/uploads/${file}`,
          fullUrl: `http://localhost:5001/uploads/products/${file}`
        }))
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message,
        uploadsPath
      });
    }
  });
};

module.exports = staticFilesMiddleware;