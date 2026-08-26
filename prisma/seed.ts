import { PrismaClient } from "@prisma/client";
import { runSeed } from "../src/lib/seedData";

const prisma = new PrismaClient();

runSeed(prisma)
  .then(() => {
    console.log("Seed completado.");
  })
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
