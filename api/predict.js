// api/predict.js
module.exports = async (req, res) => {
    const url = 'https://web-production-c8bf2.up.railway.app/predict';
    
    if (req.method === 'OPTIONS') {
      // Handle preflight request
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
      res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
      res.status(200).end();
      return;
    }
    
    try {
      // For multipart/form-data or any other content types
      const contentType = req.headers['content-type'];
      
      const response = await fetch(url, {
        method: req.method,
        headers: {
          'Content-Type': contentType,
        },
        body: req.method !== 'GET' ? req.body : undefined,
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