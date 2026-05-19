import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";
import { getAiInsights, chatAssistant } from "./src/lib/gemini";
import { generateSyntheticData } from "./src/lib/data-engine";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Endpoints
  app.get("/api/data", (req, res) => {
    const data = generateSyntheticData();
    res.json(data);
  });

  app.post("/api/insights", async (req, res) => {
    const { dashboardData } = req.body;
    const insights = await getAiInsights(dashboardData);
    res.json(insights);
  });

  app.post("/api/chat", async (req, res) => {
    const { message, context } = req.body;
    const answer = await chatAssistant(message, context);
    res.json({ answer });
  });

  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  // Vite integration
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
    console.log("Vite development middleware loaded.");
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`NHS Diagnostics Server running on http://localhost:${PORT}`);
  });
}

startServer();
