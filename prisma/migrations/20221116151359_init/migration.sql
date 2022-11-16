-- CreateTable
CREATE TABLE "User" (
    "id" STRING NOT NULL,
    "provider" STRING NOT NULL,
    "provider_id" STRING NOT NULL,
    "access_token" STRING NOT NULL,
    "refresh_token" STRING NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Blueprint" (
    "id" STRING NOT NULL,
    "name" STRING NOT NULL,
    "slug" STRING NOT NULL,
    "description" STRING,
    "is_public" BOOL NOT NULL DEFAULT false,
    "download_count" INT4 NOT NULL DEFAULT 0,
    "userId" STRING NOT NULL,

    CONSTRAINT "Blueprint_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_provider_provider_id_key" ON "User"("provider", "provider_id");

-- AddForeignKey
ALTER TABLE "Blueprint" ADD CONSTRAINT "Blueprint_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
