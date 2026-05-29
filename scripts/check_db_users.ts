import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const users = await prisma.user.findMany();
  console.log("DB Users Count:", users.length);
  console.log("DB Users:", users.map((u: any) => ({ id: u.id, email: u.email, name: u.name })));
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error(e);
    prisma.$disconnect();
  });
