import { Router, Request, Response } from "express";
import { z } from "zod";
import { prisma } from "../lib/prisma";
import { requireAuth, AuthRequest } from "../middleware/auth";

const router = Router();

const postSchema = z.object({
  title: z.string().min(1),
  slug: z.string().min(1).regex(/^[a-z0-9-]+$/),
  excerpt: z.string().optional(),
  content: z.string().min(1),
  coverUrl: z.string().url().optional(),
  tags: z.array(z.string()).default([]),
  published: z.boolean().default(false),
  publishedAt: z.string().datetime().optional().transform(v => v ? new Date(v) : undefined),
});

// GET /api/posts — public (publiés uniquement)
router.get("/", async (_req: Request, res: Response) => {
  const posts = await prisma.post.findMany({
    where: { published: true },
    orderBy: { publishedAt: "desc" },
    select: { id: true, title: true, slug: true, excerpt: true, coverUrl: true, tags: true, publishedAt: true },
  });
  res.json(posts);
});

// GET /api/posts/:slug — public
router.get("/:slug", async (req: Request, res: Response) => {
  const post = await prisma.post.findUnique({
    where: { slug: String(req.params.slug) },
  });
  if (!post || !post.published) {
    res.status(404).json({ error: "Article introuvable" });
    return;
  }
  res.json(post);
});

// POST /api/posts — admin
router.post("/", requireAuth, async (req: AuthRequest, res: Response) => {
  const parsed = postSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.flatten() });
    return;
  }
  try {
    const post = await prisma.post.create({ data: parsed.data });
    res.status(201).json(post);
  } catch {
    res.status(409).json({ error: "Un article avec ce slug existe déjà" });
  }
});

// PATCH /api/posts/:id — admin
router.patch("/:id", requireAuth, async (req: AuthRequest, res: Response) => {
  const parsed = postSchema.partial().safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.flatten() });
    return;
  }
  try {
    const post = await prisma.post.update({
      where: { id: Number(req.params.id) },
      data: parsed.data,
    });
    res.json(post);
  } catch {
    res.status(404).json({ error: "Article introuvable" });
  }
});

// DELETE /api/posts/:id — admin
router.delete("/:id", requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    await prisma.post.delete({ where: { id: Number(req.params.id) } });
    res.status(204).send();
  } catch {
    res.status(404).json({ error: "Article introuvable" });
  }
});

export default router;
