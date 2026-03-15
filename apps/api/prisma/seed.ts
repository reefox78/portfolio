import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  // Admin user
  const hashedPassword = await bcrypt.hash("admin123", 10);
  await prisma.user.upsert({
    where: { email: "admin@portfolio.com" },
    update: {},
    create: { email: "admin@portfolio.com", password: hashedPassword },
  });

  // Exemple de compétences
  await prisma.skill.createMany({
    skipDuplicates: true,
    data: [
      { name: "TypeScript", category: "Frontend", level: 5, order: 1 },
      { name: "React", category: "Frontend", level: 5, order: 2 },
      { name: "Node.js", category: "Backend", level: 4, order: 3 },
      { name: "PostgreSQL", category: "Backend", level: 4, order: 4 },
      { name: "Docker", category: "DevOps", level: 3, order: 5 },
    ],
  });

  // Exemple de projet
  await prisma.project.create({
    data: {
      title: "Portfolio API",
      description: "API REST pour mon portfolio personnel",
      stack: ["Node.js", "Express", "TypeScript", "PostgreSQL", "Prisma"],
      featured: true,
      order: 1,
    },
  });

  console.log("Seed terminé ✓");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
