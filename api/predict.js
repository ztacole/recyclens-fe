import fs from "fs";
import FormData from "form-data";

const file = files.file;

const form = new FormData();
form.append("file", fs.createReadStream(file.filepath), file.originalFilename);

try {
  const response = await fetch("https://web-production-c8bf2.up.railway.app/predict", {
    method: "POST",
    body: form,
    headers: form.getHeaders(), // penting!
  });

  const data = await response.json();
  return res.status(response.status).json(data);
} catch (error) {
  console.error("Error forwarding to ML backend:", error);
  return res.status(500).json({ message: "Gagal mengirim ke API ML" });
}
