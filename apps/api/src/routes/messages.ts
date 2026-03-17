import { Router, Request, Response } from "express";
import { z } from "zod";
import { prisma } from "../lib/prisma";
import { requireAuth, AuthRequest } from "../middleware/auth";
import { contactLimiter } from "../index";

const router = Router();

const messageSchema = z.object({
  name: z.string().min(1).max(100),
  email: z.string().email(),
  subject: z.string().max(200).optional(),
  message: z.string().min(1).max(5000),
  _gotcha: z.string().max(0).optional(), // honeypot anti-spam (doit rester vide)
});

// POST /api/messages — public (formulaire de contact)
router.post("/", contactLimiter, async (req: Request, res: Response) => {
  const parsed = messageSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.flatten() });
    return;
  }

  // Honeypot : si le champ caché est rempli, c'est un bot
  if (parsed.data._gotcha) {
    res.status(400).json({ error: "Requête invalide" });
    return;
  }

  const { _gotcha: _, ...data } = parsed.data;
  const msg = await prisma.contactMessage.create({ data });
  res.status(201).json({ success: true, id: msg.id });
});

// GET /api/messages — admin
router.get("/", requireAuth, async (_req: AuthRequest, res: Response) => {
  const messages = await prisma.contactMessage.findMany({
    orderBy: { createdAt: "desc" },
  });
  res.json(messages);
});

// PATCH /api/messages/:id/read — admin
router.patch("/:id/read", requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    const msg = await prisma.contactMessage.update({
      where: { id: Number(req.params.id) },
      data: { read: true },
    });
    res.json(msg);
  } catch {
    res.status(404).json({ error: "Message introuvable" });
  }
});

// DELETE /api/messages/:id — admin
router.delete("/:id", requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    await prisma.contactMessage.delete({ where: { id: Number(req.params.id) } });
    res.status(204).send();
  } catch {
    res.status(404).json({ error: "Message introuvable" });
  }
});

export default router;
