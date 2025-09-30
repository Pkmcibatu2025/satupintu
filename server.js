import express from "express";
import fetch from "node-fetch";

const app = express();
app.use(express.json());

const GITHUB_TOKEN = process.env.GITHUB_TOKEN; // simpan di .env
const REPO_OWNER = "Pkmcibatu2025"; // ganti dengan akun GitHub kamu
const REPO_NAME = "satupintu"; // ganti dengan nama repo kamu
const FILE_PATH = "data/pengumuman.json"; // path file JSON

// API endpoint untuk tambah pengumuman
app.post("/add-pengumuman", async (req, res) => {
  try {
    const { title, body, date, category } = req.body;

    // 1. Ambil file JSON dari repo
    const url = `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${FILE_PATH}`;
    const headers = { 
      Authorization: `token ${GITHUB_TOKEN}`, 
      "Content-Type": "application/json" 
    };

    const fileRes = await fetch(url, { headers });
    const fileData = await fileRes.json();
    const content = Buffer.from(fileData.content, "base64").toString("utf8");
    let pengumuman = JSON.parse(content);

    // 2. Tambahkan pengumuman baru
    const newItem = {
      id: pengumuman.length ? Math.max(...pengumuman.map(p=>p.id))+1 : 1,
      title, body, date, category
    };
    pengumuman.push(newItem);

    // 3. Update file di GitHub
    const updatedContent = Buffer.from(JSON.stringify(pengumuman, null, 2)).toString("base64");

    const updateRes = await fetch(url, {
      method: "PUT",
      headers,
      body: JSON.stringify({
        message: `Tambah pengumuman: ${title}`,
        content: updatedContent,
        sha: fileData.sha
      })
    });

    if (!updateRes.ok) throw new Error(await updateRes.text());

    res.json({ success: true, pengumuman: newItem });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  }
});

app.listen(3000, () => console.log("Server jalan di http://localhost:3000"));
