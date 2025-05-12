/*
  Warnings:

  - A unique constraint covering the columns `[userId]` on the table `PatientData` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "PatientData_userId_key" ON "PatientData"("userId");
