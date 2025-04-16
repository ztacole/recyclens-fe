const predict = async (req, res) => {
    try {
      const url = 'https://web-production-c8bf2.up.railway.app/predict';
      
      const response = await fetch(url, {
        method: req.method,
        headers: {
          'Content-Type': req.headers['content-type'],
        },
        body: req.method !== 'GET' ? req.body : undefined,
      });
  
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
      res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
      const contentType = response.headers.get('content-type');
  
      if (contentType && contentType.includes('application/json')) {
        const data = await response.json();
        return res.status(response.status).json(data);
      } else {
        const text = await response.text();
        return res.status(response.status).send(text);
      }
    } catch (error) {
      console.error('Proxy error:', error);
      return res.status(500).json({ error: 'Proxy error', message: error.message });
    }
  };
  
  export default predict;
  