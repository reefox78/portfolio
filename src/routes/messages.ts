import { Router, Request, Response } from "express";
import { z } from "zod";
import { prisma } from "../lib/prisma";
import { requireAuth, AuthRequest } from "../middleware/auth";

const router = Router();

const messageSchema = z.object({
  name: z.string().min(1).max(100),
  email: z.string().email(),
  subject: z.string().max(200).optional(),
  message: z.string().min(1).max(5000),
});

// POST /api/messages — public (formulaire de contact)
router.post("/", async (req: Request, res: Response) => {
  const parsed = messageSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.flatten() });
    return;
  }
  const msg = await prisma.contactMessage.create({ data: parsed.data });
  res.status(201).json({ success: true, id: msg.id });
});

// GET /api/messages — admin (liste tous les messages)
router.get("/", requireAuth, async (_req: AuthRequest, res: Response) => {
  const messages = await prisma.contactMessage.findMany({
    orderBy: { createdAt: "desc" },
  });
  res.json(messages);
});

// PATCH /api/messages/:id/read — admin (marquer comme lu)
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
