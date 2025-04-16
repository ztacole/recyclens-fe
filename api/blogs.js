const blogs = async (req, res) => {
    try {
      console.log('Fetching blogs from:', 'https://capstone-be-production-3f8e.up.railway.app/blogs');
      const response = await fetch('https://capstone-be-production-3f8e.up.railway.app/blogs');
  
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
      res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
      const contentType = response.headers.get('content-type');
      console.log('Content-Type:', contentType);
  
      if (contentType && contentType.includes('application/json')) {
        const data = await response.json();
        return res.status(response.status).json(data);
      } else {
        const text = await response.text();
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
  
  export default blogs;
  