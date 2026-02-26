import { prisma } from "./lib/prisma";

async function main() {
  // Fetch all assets and their types with their posts
  const allRoles = await prisma.asset.findMany({
    include: {
      role: true,
      asset_type: true,
    },
  });
  console.log("All roles:", JSON.stringify(allRoles, null, 2));
}
main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
