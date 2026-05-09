-- CreateTable
CREATE TABLE "asset" (
    "id" SERIAL NOT NULL,
    "asset_name" TEXT NOT NULL,
    "role_id" INTEGER,
    "asset_type_id" INTEGER,

    CONSTRAINT "asset_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "asset_type" (
    "id" SERIAL NOT NULL,
    "asset_type_name" TEXT NOT NULL,

    CONSTRAINT "asset_type_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "role" (
    "id" SERIAL NOT NULL,
    "role_name" TEXT NOT NULL,
    "staff_name" TEXT,

    CONSTRAINT "role_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "password_hash" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "idx_asset_type_id" ON "asset"("asset_type_id");

-- CreateIndex
CREATE INDEX "idx_role_id" ON "asset"("role_id");

-- CreateIndex
CREATE UNIQUE INDEX "user_email_key" ON "user"("email");

-- AddForeignKey
ALTER TABLE "asset" ADD CONSTRAINT "fk_asset_asset_type" FOREIGN KEY ("asset_type_id") REFERENCES "asset_type"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "asset" ADD CONSTRAINT "fk_asset_role" FOREIGN KEY ("role_id") REFERENCES "role"("id") ON DELETE SET NULL ON UPDATE CASCADE;
