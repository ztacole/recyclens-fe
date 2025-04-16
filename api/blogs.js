// api/blogs.js
module.exports = async (req, res) => {
    const url = 'https://capstone-be-production-3f8e.up.railway.app/blogs';
    
    try {
      const response = await fetch(url, {
        method: req.method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: req.method !== 'GET' ? JSON.stringify(req.body) : undefined,
      });
      
      const data = await response.json();
      
      // Set CORS headers
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
      res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
      
      res.status(response.status).json(data);
    } catch (error) {
      res.status(500).json({ error: 'Error fetching from API: ' + error.message });
    }
  };