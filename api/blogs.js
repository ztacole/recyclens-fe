// api/blogs.js
export default blogs = async (req, res) => {
    try {
      console.log('Fetching blogs from:', 'https://capstone-be-production-3f8e.up.railway.app/blogs');
      
      const response = await fetch('https://capstone-be-production-3f8e.up.railway.app/blogs');
      
      // Log status response
      console.log('Response status:', response.status);
      
      // Set CORS headers
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
      res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
      
      // Cek content-type response
      const contentType = response.headers.get('content-type');
      console.log('Content-Type:', contentType);
      
      if (contentType && contentType.includes('application/json')) {
        const data = await response.json();
        return res.status(response.status).json(data);
      } else {
        // Jika bukan JSON, kembalikan sebagai text
        const text = await response.text();
        console.log('Response text:', text.substring(0, 100) + '...');
        return res.status(response.status).send(text);
      }
    } catch (error) {
      console.error('Proxy error:', error);
      return res.status(500).json({ 
        error: 'Proxy error', 
        message: error.message,
        stack: error.stack
      });
    }
  };