import formidable from 'formidable';
import fs from 'fs';
import FormData from 'form-data';

// For Vercel serverless functions
export default async function (req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const form = new formidable.IncomingForm({ keepExtensions: true });
  
  form.parse(req, async (err, fields, files) => {
    if (err) {
      console.error('Form parse error:', err);
      return res.status(500).json({ error: 'Error parsing form' });
    }
    
    try {
      const file = files.file;
      const formData = new FormData();
      
      formData.append('file', fs.createReadStream(file.filepath), {
        filename: file.originalFilename,
        contentType: file.mimetype,
      });
      
      const response = await fetch("https://web-production-c8bf2.up.railway.app/predict", {
        method: 'POST',
        body: formData,
        headers: formData.getHeaders(),
      });
      
      const data = await response.json();
      res.status(response.status).json(data);
    } catch (error) {
      console.error('Error forwarding to ML backend:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
}