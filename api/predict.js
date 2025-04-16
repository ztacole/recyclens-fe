import fs from "fs";
import FormData from "form-data";
import fetch from "node-fetch"; // pastikan kamu pakai ini untuk fetch di node

export default async function handler(req, res) {
  const files = req.files;
  const file = files.file;

  const form = new FormData();
  form.append("file", fs.createReadStream(file.filepath), file.originalFilename);

  try {
    const response = await fetch("https://web-production-c8bf2.up.railway.app/predict", {
      method: "POST",
      body: form,
      headers: form.getHeaders(),
    });

    const data = await response.json();
    res.status(response.status).json(data); // pakai res di sini, bukan return
  } catch (error) {
    console.error("Error forwarding to ML backend:", error);
    res.status(500).json({ message: "Gagal mengirim ke API ML" });
  }
}
