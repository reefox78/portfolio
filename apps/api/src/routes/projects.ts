import { Router, Request, Response } from "express";
import { z } from "zod";
import { prisma } from "../lib/prisma";
import { requireAuth, AuthRequest } from "../middleware/auth";

const router = Router();

const projectSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  content: z.string().optional(),
  imageUrl: z.union([z.string().url(), z.literal(""), z.null()]).optional(),
  repoUrl: z.union([z.string().url(), z.literal(""), z.null()]).optional(),
  liveUrl: z.union([z.string().url(), z.literal(""), z.null()]).optional(),
  stack: z.array(z.string()).default([]),
  featured: z.boolean().default(false),
  order: z.number().int().default(0),
});

// GET /api/projects — public
router.get("/", async (_req: Request, res: Response) => {
  const projects = await prisma.project.findMany({
    orderBy: [{ featured: "desc" }, { order: "asc" }, { createdAt: "desc" }],
  });
  res.json(projects);
});

// GET /api/projects/:id — public
router.get("/:id", async (req: Request, res: Response) => {
  const project = await prisma.project.findUnique({
    where: { id: Number(req.params.id) },
  });
  if (!project) {
    res.status(404).json({ error: "Projet introuvable" });
    return;
  }
  res.json(project);
});

// POST /api/projects — admin
router.post("/", requireAuth, async (req: AuthRequest, res: Response) => {
  const parsed = projectSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.flatten() });
    return;
  }
  const project = await prisma.project.create({ data: parsed.data });
  res.status(201).json(project);
});

// PATCH /api/projects/:id — admin
router.patch("/:id", requireAuth, async (req: AuthRequest, res: Response) => {
  const parsed = projectSchema.partial().safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.flatten() });
    return;
  }
  try {
    const project = await prisma.project.update({
      where: { id: Number(req.params.id) },
      data: parsed.data,
    });
    res.json(project);
  } catch {
    res.status(404).json({ error: "Projet introuvable" });
  }
});

// DELETE /api/projects/:id — admin
router.delete("/:id", requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    await prisma.project.delete({ where: { id: Number(req.params.id) } });
    res.status(204).send();
  } catch {
    res.status(404).json({ error: "Projet introuvable" });
  }
});

export default router;
