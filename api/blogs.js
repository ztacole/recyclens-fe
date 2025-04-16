// api/blogs.js
const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = async (req, res) => {
  // Penanganan langsung tanpa proxy middleware
  try {
    const url = 'https://capstone-be-production-3f8e.up.railway.app/blogs';
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    
    // Set CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    
    return res.json(data);
  } catch (error) {
    console.error('Proxy error:', error);
    return res.status(500).json({ 
      error: 'Proxy error', 
      message: error.message 
    });
  }
};