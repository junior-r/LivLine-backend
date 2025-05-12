/*
  Warnings:

  - Added the required column `address` to the `PatientData` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "PatientData" ADD COLUMN     "address" TEXT NOT NULL;
