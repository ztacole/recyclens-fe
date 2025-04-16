import formidable from 'formidable';
import fs from 'fs';
import FormData from 'form-data';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  const form = new formidable.IncomingForm({ keepExtensions: true });

  form.parse(req, async (err, fields, files) => {
    if (err) {
      console.error('Form parse error:', err);
      return res.status(500).json({ error: 'Error parsing form' });
    }

    try {
      const file = Array.isArray(files.file) ? files.file[0] : files.file;
      if (!file) return res.status(400).json({ error: "No file received" });

      const formData = new FormData();
      formData.append('file', fs.createReadStream(file.filepath), file.originalFilename);

      const response = await fetch("https://web-production-c8bf2.up.railway.app/predict", {
        method: 'POST',
        body: formData,
        headers: formData.getHeaders(),
      });

      const text = await response.text(); // debug dulu
      console.log("ML backend response:", text);
      res.status(response.status).send(text); // sementara pakai send bukan json
    } catch (error) {
      console.error('Error forwarding to ML backend:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
}
