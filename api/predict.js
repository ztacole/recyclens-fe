import formidable from "formidable";
import fs from "fs";

// Disabling default body parser
export const config = {
    api: {
        bodyParser: false,
    },
};

export default async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({ message: "Method not allowed" });
    }

    const form = formidable({ multiples: false });

    form.parse(req, async (err, fields, files) => {
        if (err) {
            console.error("Formidable error:", err);
            return res.status(500).json({ message: "Failed to parse form data" });
        }

        const file = files.file;
        if (!file) {
            return res.status(400).json({ message: "No file uploaded" });
        }

        try {
            console.log("FILES:", files);
            const fileData = fs.readFileSync(file.filepath);

            // Forward ke backend Python
            const response = await fetch("https://web-production-c8bf2.up.railway.app/predict", {
                method: "POST",
                headers: {
                    // Kalau backend Flask kamu pakai form upload
                    "Content-Type": "application/octet-stream",
                    "Content-Disposition": `form-data; name="file"; filename="${file[0].originalFilename}"`,
                },
                body: fileData,
            });

            const data = await response.json();
            return res.status(response.status).json(data);
        } catch (error) {
            console.error("Error forwarding to ML backend:", error);
            return res.status(500).json({ message: "Failed to send image to ML API" });
        }
    });
}
