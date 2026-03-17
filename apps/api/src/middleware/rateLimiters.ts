import rateLimit from "express-rate-limit";

export const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: { error: "Trop de tentatives de connexion, réessayez dans 15 minutes" },
  standardHeaders: true,
  legacyHeaders: false,
});

export const contactLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 5,
  message: { error: "Trop de messages envoyés, réessayez dans 1 heure" },
  standardHeaders: true,
  legacyHeaders: false,
});
