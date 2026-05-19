-- AlterTable
ALTER TABLE "user" ADD COLUMN     "role_id" INTEGER;

-- CreateIndex
CREATE INDEX "idx_user_role_id" ON "user"("role_id");

-- AddForeignKey
ALTER TABLE "user" ADD CONSTRAINT "fk_asset_role" FOREIGN KEY ("role_id") REFERENCES "role"("id") ON DELETE SET NULL ON UPDATE CASCADE;
