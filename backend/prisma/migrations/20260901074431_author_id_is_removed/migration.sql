/*
  Warnings:

  - You are about to drop the column `authorId` on the `Sales` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Sales" DROP CONSTRAINT "Sales_authorId_fkey";

-- AlterTable
ALTER TABLE "Sales" DROP COLUMN "authorId";
