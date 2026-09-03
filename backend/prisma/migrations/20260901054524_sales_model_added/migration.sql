-- CreateTable
CREATE TABLE "Sales" (
    "id" TEXT NOT NULL,
    "price" INTEGER NOT NULL,
    "description" TEXT,
    "authorId" TEXT NOT NULL,

    CONSTRAINT "Sales_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Sales" ADD CONSTRAINT "Sales_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
