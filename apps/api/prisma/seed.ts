import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  // Admin user
  // En production : définir ADMIN_EMAIL et ADMIN_PASSWORD dans les variables d'env
  const adminEmail = process.env.ADMIN_EMAIL ?? "admin@portfolio.com";
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminPassword) {
    throw new Error(
      "ADMIN_PASSWORD non défini. Ajoutez-le dans votre .env avant de lancer le seed.\n" +
      "Exemple : ADMIN_PASSWORD=MonMotDePasseFort123!"
    );
  }

  const hashedPassword = await bcrypt.hash(adminPassword, 12);
  await prisma.user.upsert({
    where: { email: adminEmail },
    update: { password: hashedPassword },
    create: { email: adminEmail, password: hashedPassword },
  });

  console.log(`Admin créé : ${adminEmail}`);

  // Compétences de base
  await prisma.skill.createMany({
    skipDuplicates: true,
    data: [
      { name: "Java", category: "Backend", level: 5, order: 1 },
      { name: "Spring Boot", category: "Backend", level: 5, order: 2 },
      { name: "TypeScript", category: "Frontend", level: 4, order: 3 },
      { name: "PostgreSQL", category: "Backend", level: 4, order: 4 },
      { name: "Docker", category: "DevOps", level: 3, order: 5 },
    ],
  });

  console.log("Seed terminé ✓");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
