-- AlterTable
ALTER TABLE "user" ADD COLUMN     "isAdmin" BOOLEAN DEFAULT false,
ADD COLUMN     "name" TEXT NOT NULL DEFAULT 'Unknown';
