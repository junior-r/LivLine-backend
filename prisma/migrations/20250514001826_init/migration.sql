/*
  Warnings:

  - Added the required column `idDocType` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `idNumber` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "IdType" AS ENUM ('IdenityCard', 'DNI');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "idDocType" "IdType" NOT NULL,
ADD COLUMN     "idNumber" TEXT NOT NULL;
