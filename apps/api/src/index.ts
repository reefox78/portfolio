import "dotenv/config";
import express from "express";
import cors from "cors";

import projectsRouter from "./routes/projects";
import skillsRouter from "./routes/skills";
import postsRouter from "./routes/posts";
import messagesRouter from "./routes/messages";
import authRouter from "./routes/auth";
import experiencesRouter from "./routes/experiences";
import educationsRouter from "./routes/educations";

const app = express();
const PORT = process.env.PORT ?? 3001;

// Middlewares globaux
app.use(cors({ origin: process.env.CORS_ORIGIN ?? "*" }));
app.use(express.json());

// Routes
app.use("/api/projects", projectsRouter);
app.use("/api/skills", skillsRouter);
app.use("/api/posts", postsRouter);
app.use("/api/messages", messagesRouter);
app.use("/api/auth", authRouter);
app.use("/api/experiences", experiencesRouter);
app.use("/api/educations", educationsRouter);

// Health check
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// 404
app.use((_req, res) => {
  res.status(404).json({ error: "Route introuvable" });
});

app.listen(PORT, () => {
  console.log(`Serveur démarré sur http://localhost:${PORT}`);
});

export default app;
