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

        console.log("Fields:", fields);
        console.log("Files:", files); // ← pastikan muncul data file!

        try {
            const file = files.file;

            const formData = new FormData();
            formData.append('file', fs.createReadStream(file.filepath), {
                filename: file.originalFilename,
                contentType: file.mimetype,
            });

            console.log("Forwarding to ML backend with file:", file.filepath);
            console.log("FormData headers:", formData.getHeaders());


            const response = await fetch("https://web-production-c8bf2.up.railway.app/predict", {
                method: 'POST',
                body: formData,
                headers: formData.getHeaders(), // ← penting! jangan ubah jadi JSON
            });

            const data = await response.json();
            res.status(response.status).json(data);
        } catch (error) {
            console.error('Error forwarding to ML backend:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    });
}
