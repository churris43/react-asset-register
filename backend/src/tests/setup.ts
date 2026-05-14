import { beforeEach } from "vitest";
import { prisma } from "../lib/prisma";

// Wipes all rows before each test to prevent data leaking between tests.
//
// The cleaner alternative would be to wrap each test in a transaction and roll it back,
// but that requires every service function to accept an optional Prisma client (tx) so
// the test can pass in the transaction client. Currently services use the global prisma
// singleton directly, making it impossible to intercept calls from the outside.
beforeEach(async () => {
  await prisma.$transaction([
    prisma.asset.deleteMany(),
    prisma.role.deleteMany(),
    prisma.asset_type.deleteMany(),
    prisma.user.deleteMany(),
  ]);
});
