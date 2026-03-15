import { Router, Request, Response } from "express";
import { z } from "zod";
import { prisma } from "../lib/prisma";
import { requireAuth, AuthRequest } from "../middleware/auth";

const router = Router();

const educationProjectSchema = z.object({
  name: z.string().min(1),
  description: z.string().min(1),
  order: z.number().int().default(0),
});

const educationSchema = z.object({
  degree: z.string().min(1),
  graduationYear: z.number().int().min(1900),
  school: z.string().min(1),
  location: z.string().min(1),
  skills: z.array(z.string()).default([]),
  order: z.number().int().default(0),
  projects: z.array(educationProjectSchema).default([]),
});

const include = { projects: { orderBy: { order: "asc" as const } } };

// GET /api/educations — public
router.get("/", async (_req: Request, res: Response) => {
  const educations = await prisma.education.findMany({
    orderBy: [{ order: "asc" }, { graduationYear: "desc" }],
    include,
  });
  res.json(educations);
});

// GET /api/educations/:id — public
router.get("/:id", async (req: Request, res: Response) => {
  const education = await prisma.education.findUnique({
    where: { id: Number(req.params.id) },
    include,
  });
  if (!education) {
    res.status(404).json({ error: "Formation introuvable" });
    return;
  }
  res.json(education);
});

// POST /api/educations — admin
router.post("/", requireAuth, async (req: AuthRequest, res: Response) => {
  const parsed = educationSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.flatten() });
    return;
  }
  const { projects, ...educationData } = parsed.data;
  const education = await prisma.education.create({
    data: {
      ...educationData,
      projects: { create: projects },
    },
    include,
  });
  res.status(201).json(education);
});

// PATCH /api/educations/:id — admin
router.patch("/:id", requireAuth, async (req: AuthRequest, res: Response) => {
  const parsed = educationSchema.partial().safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.flatten() });
    return;
  }
  const { projects, ...educationData } = parsed.data;
  try {
    const education = await prisma.education.update({
      where: { id: Number(req.params.id) },
      data: {
        ...educationData,
        ...(projects !== undefined && {
          projects: {
            deleteMany: {},
            create: projects,
          },
        }),
      },
      include,
    });
    res.json(education);
  } catch {
    res.status(404).json({ error: "Formation introuvable" });
  }
});

// DELETE /api/educations/:id — admin
router.delete("/:id", requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    await prisma.education.delete({ where: { id: Number(req.params.id) } });
    res.status(204).send();
  } catch {
    res.status(404).json({ error: "Formation introuvable" });
  }
});

export default router;
