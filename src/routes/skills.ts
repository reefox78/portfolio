import { Router, Request, Response } from "express";
import { z } from "zod";
import { prisma } from "../lib/prisma";
import { requireAuth, AuthRequest } from "../middleware/auth";

const router = Router();

const skillSchema = z.object({
  name: z.string().min(1),
  category: z.string().min(1),
  level: z.number().int().min(1).max(5),
  iconUrl: z.string().url().optional(),
  order: z.number().int().default(0),
});

// GET /api/skills — public
router.get("/", async (_req: Request, res: Response) => {
  const skills = await prisma.skill.findMany({
    orderBy: [{ category: "asc" }, { order: "asc" }],
  });
  res.json(skills);
});

// POST /api/skills — admin
router.post("/", requireAuth, async (req: AuthRequest, res: Response) => {
  const parsed = skillSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.flatten() });
    return;
  }
  const skill = await prisma.skill.create({ data: parsed.data });
  res.status(201).json(skill);
});

// PATCH /api/skills/:id — admin
router.patch("/:id", requireAuth, async (req: AuthRequest, res: Response) => {
  const parsed = skillSchema.partial().safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.flatten() });
    return;
  }
  try {
    const skill = await prisma.skill.update({
      where: { id: Number(req.params.id) },
      data: parsed.data,
    });
    res.json(skill);
  } catch {
    res.status(404).json({ error: "Compétence introuvable" });
  }
});

// DELETE /api/skills/:id — admin
router.delete("/:id", requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    await prisma.skill.delete({ where: { id: Number(req.params.id) } });
    res.status(204).send();
  } catch {
    res.status(404).json({ error: "Compétence introuvable" });
  }
});

export default router;
