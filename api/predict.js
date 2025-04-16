// api/predict.js
const formidable = require('formidable');
const fetch = require('node-fetch');
const FormData = require('form-data');
const fs = require('fs');

module.exports = async (req, res) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    return res.status(200).end();
  }
  
  if (req.method === 'POST') {
    try {
      const form = new formidable.IncomingForm();
      form.parse(req, async (err, fields, files) => {
        if (err) {
          console.error('Form parsing error:', err);
          return res.status(500).json({ error: 'Form parsing error' });
        }
        
        // Buat form-data baru untuk dikirim ke backend
        const formData = new FormData();
        
        // Tambahkan file jika ada
        if (files.image) {
          const fileStream = fs.createReadStream(files.image.path);
          formData.append('image', fileStream, files.image.name);
        }
        
        // Tambahkan fields jika ada
        for (const [key, value] of Object.entries(fields)) {
          formData.append(key, value);
        }
        
        // Kirim ke backend
        const response = await fetch('https://web-production-c8bf2.up.railway.app/predict', {
          method: 'POST',
          body: formData,
          headers: formData.getHeaders()
        });
        
        if (!response.ok) {
          throw new Error(`Backend returned ${response.status}: ${response.statusText}`);
        }
        
        const data = await response.json();
        
        // Set CORS headers
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
        
        return res.json(data);
      });
    } catch (error) {
      console.error('Proxy error:', error);
      return res.status(500).json({ 
        error: 'Proxy error', 
        message: error.message 
      });
    }
  } else {
    return res.status(405).json({ error: 'Method not allowed' });
  }
};