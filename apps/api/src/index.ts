import "dotenv/config";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import { loginLimiter, contactLimiter } from "./middleware/rateLimiters";

import projectsRouter from "./routes/projects";
import skillsRouter from "./routes/skills";
import postsRouter from "./routes/posts";
import messagesRouter from "./routes/messages";
import authRouter from "./routes/auth";
import experiencesRouter from "./routes/experiences";
import educationsRouter from "./routes/educations";

const app = express();
const PORT = process.env.PORT ?? 3001;

// Sécurité : headers HTTP
app.use(helmet());

// CORS : uniquement les origins explicitement autorisées, pas de fallback wildcard
const allowedOrigins = (process.env.CORS_ORIGIN ?? "")
  .split(",")
  .map(o => o.trim())
  .filter(Boolean);

if (allowedOrigins.length === 0) {
  throw new Error("CORS_ORIGIN non configuré — serveur refusé de démarrer");
}

app.use(cors({
  origin: (origin, callback) => {
    // Rejeter les requêtes sans header Origin (hors Postman/curl en dev)
    if (!origin) {
      if (process.env.NODE_ENV === "development") {
        callback(null, true); // autoriser les tools dev (Postman, curl)
      } else {
        callback(new Error("Not allowed by CORS"));
      }
      return;
    }
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
}));

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
