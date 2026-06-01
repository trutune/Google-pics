import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ extended: true, limit: "50mb" }));

  app.post("/api/generate-image", async (req, res) => {
    try {
      const { prompt, aspectRatio, imageSize } = req.body;
      if (!prompt) {
        return res.status(400).json({ error: "Prompt is required" });
      }

      const width = aspectRatio === '16:9' ? 1024 : aspectRatio === '9:16' ? 576 : 1024;
      const height = aspectRatio === '16:9' ? 576 : aspectRatio === '9:16' ? 1024 : 1024;

      // Use Pollinations AI as a free fallback model as requested
      const seed = Math.floor(Math.random() * 1000000);
      const pollUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?width=${width}&height=${height}&nologo=true&seed=${seed}`;
      
      const pollRes = await fetch(pollUrl);
      if (!pollRes.ok) throw new Error("Failed to fetch image from Pollinations");
      const buffer = await pollRes.arrayBuffer();
      const base64Data = Buffer.from(buffer).toString('base64');
      const imageUrl = `data:image/jpeg;base64,${base64Data}`;

      res.json({ imageUrl });
    } catch (error: any) {
      console.error("Error generating image:", error);
      res.status(500).json({ error: error.message || "Failed to generate image" });
    }
  });

  app.post("/api/edit-image", async (req, res) => {
    try {
      const { prompt, imageBase64, mimeType } = req.body;
      if (!prompt || !imageBase64) {
        return res.status(400).json({ error: "Prompt and imageBase64 are required" });
      }

      // Use Pollinations AI as a free fallback model as requested
      // Note: Pollinations does not natively support editing an existing image easily,
      // so we use the prompt to generate a new visualization.
      const seed = Math.floor(Math.random() * 1000000);
      const pollUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?width=1024&height=1024&nologo=true&seed=${seed}`;
      
      const pollRes = await fetch(pollUrl);
      if (!pollRes.ok) throw new Error("Failed to fetch image from Pollinations");
      const buffer = await pollRes.arrayBuffer();
      const base64Data = Buffer.from(buffer).toString('base64');
      const imageUrl = `data:image/jpeg;base64,${base64Data}`;

      res.json({ imageUrl });
    } catch (error: any) {
      console.error("Error editing image:", error);
      res.status(500).json({ error: error.message || "Failed to edit image" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
