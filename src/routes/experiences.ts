import { Router, Request, Response } from "express";
import { z } from "zod";
import { prisma } from "../lib/prisma";
import { requireAuth, AuthRequest } from "../middleware/auth";

const router = Router();

const experienceProjectSchema = z.object({
  name: z.string().min(1),
  description: z.string().min(1),
  order: z.number().int().default(0),
});

const experienceSchema = z.object({
  jobTitle: z.string().min(1),
  company: z.string().min(1),
  location: z.string().min(1),
  startMonth: z.number().int().min(1).max(12),
  startYear: z.number().int().min(1900),
  endMonth: z.number().int().min(1).max(12).nullable().optional(),
  endYear: z.number().int().min(1900).nullable().optional(),
  skills: z.array(z.string()).default([]),
  order: z.number().int().default(0),
  projects: z.array(experienceProjectSchema).default([]),
});

const include = { projects: { orderBy: { order: "asc" as const } } };

// GET /api/experiences — public
router.get("/", async (_req: Request, res: Response) => {
  const experiences = await prisma.experience.findMany({
    orderBy: [{ order: "asc" }, { startYear: "desc" }, { startMonth: "desc" }],
    include,
  });
  res.json(experiences);
});

// GET /api/experiences/:id — public
router.get("/:id", async (req: Request, res: Response) => {
  const experience = await prisma.experience.findUnique({
    where: { id: Number(req.params.id) },
    include,
  });
  if (!experience) {
    res.status(404).json({ error: "Expérience introuvable" });
    return;
  }
  res.json(experience);
});

// POST /api/experiences — admin
router.post("/", requireAuth, async (req: AuthRequest, res: Response) => {
  const parsed = experienceSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.flatten() });
    return;
  }
  const { projects, ...experienceData } = parsed.data;
  const experience = await prisma.experience.create({
    data: {
      ...experienceData,
      projects: { create: projects },
    },
    include,
  });
  res.status(201).json(experience);
});

// PATCH /api/experiences/:id — admin
router.patch("/:id", requireAuth, async (req: AuthRequest, res: Response) => {
  const parsed = experienceSchema.partial().safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.flatten() });
    return;
  }
  const { projects, ...experienceData } = parsed.data;
  try {
    const experience = await prisma.experience.update({
      where: { id: Number(req.params.id) },
      data: {
        ...experienceData,
        ...(projects !== undefined && {
          projects: {
            deleteMany: {},
            create: projects,
          },
        }),
      },
      include,
    });
    res.json(experience);
  } catch {
    res.status(404).json({ error: "Expérience introuvable" });
  }
});

// DELETE /api/experiences/:id — admin
router.delete("/:id", requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    await prisma.experience.delete({ where: { id: Number(req.params.id) } });
    res.status(204).send();
  } catch {
    res.status(404).json({ error: "Expérience introuvable" });
  }
});

export default router;
