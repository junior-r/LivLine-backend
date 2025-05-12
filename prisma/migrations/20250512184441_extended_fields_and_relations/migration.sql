/*
  Warnings:

  - You are about to drop the column `content` on the `Allergy` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `Allergy` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `Appointment` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `ChronicCondition` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `Medication` table. All the data in the column will be lost.
  - You are about to drop the column `description` on the `Surgery` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `Surgery` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `Vaccine` table. All the data in the column will be lost.
  - Added the required column `name` to the `Allergy` table without a default value. This is not possible if the table is not empty.
  - Added the required column `reaction` to the `Allergy` table without a default value. This is not possible if the table is not empty.
  - Added the required column `severity` to the `Allergy` table without a default value. This is not possible if the table is not empty.
  - Made the column `name` on table `ChronicCondition` required. This step will fail if there are existing NULL values in that column.
  - Made the column `name` on table `Medication` required. This step will fail if there are existing NULL values in that column.
  - Made the column `dosage` on table `Medication` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `name` to the `Surgery` table without a default value. This is not possible if the table is not empty.
  - Made the column `name` on table `Vaccine` required. This step will fail if there are existing NULL values in that column.

*/
-- CreateEnum
CREATE TYPE "AllergySeverity" AS ENUM ('Mild', 'Moderate', 'Severe');

-- DropForeignKey
ALTER TABLE "Allergy" DROP CONSTRAINT "Allergy_userId_fkey";

-- DropForeignKey
ALTER TABLE "Appointment" DROP CONSTRAINT "Appointment_userId_fkey";

-- DropForeignKey
ALTER TABLE "ChronicCondition" DROP CONSTRAINT "ChronicCondition_userId_fkey";

-- DropForeignKey
ALTER TABLE "Medication" DROP CONSTRAINT "Medication_userId_fkey";

-- DropForeignKey
ALTER TABLE "Surgery" DROP CONSTRAINT "Surgery_userId_fkey";

-- DropForeignKey
ALTER TABLE "Vaccine" DROP CONSTRAINT "Vaccine_userId_fkey";

-- AlterTable
ALTER TABLE "Allergy" DROP COLUMN "content",
DROP COLUMN "userId",
ADD COLUMN     "name" TEXT NOT NULL,
ADD COLUMN     "patientDataPk" TEXT,
ADD COLUMN     "reaction" TEXT NOT NULL,
ADD COLUMN     "severity" "AllergySeverity" NOT NULL;

-- AlterTable
ALTER TABLE "Appointment" DROP COLUMN "userId",
ADD COLUMN     "patientDataPk" TEXT;

-- AlterTable
ALTER TABLE "ChronicCondition" DROP COLUMN "userId",
ADD COLUMN     "patientDataPk" TEXT,
ALTER COLUMN "name" SET NOT NULL;

-- AlterTable
ALTER TABLE "Medication" DROP COLUMN "userId",
ADD COLUMN     "patientDataPk" TEXT,
ALTER COLUMN "name" SET NOT NULL,
ALTER COLUMN "dosage" SET NOT NULL;

-- AlterTable
ALTER TABLE "Surgery" DROP COLUMN "description",
DROP COLUMN "userId",
ADD COLUMN     "name" TEXT NOT NULL,
ADD COLUMN     "patientDataPk" TEXT;

-- AlterTable
ALTER TABLE "Vaccine" DROP COLUMN "userId",
ADD COLUMN     "patientDataPk" TEXT,
ALTER COLUMN "name" SET NOT NULL;

-- CreateTable
CREATE TABLE "PatientData" (
    "pk" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "PatientData_pkey" PRIMARY KEY ("pk")
);

-- AddForeignKey
ALTER TABLE "PatientData" ADD CONSTRAINT "PatientData_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("pk") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Allergy" ADD CONSTRAINT "Allergy_patientDataPk_fkey" FOREIGN KEY ("patientDataPk") REFERENCES "PatientData"("pk") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Surgery" ADD CONSTRAINT "Surgery_patientDataPk_fkey" FOREIGN KEY ("patientDataPk") REFERENCES "PatientData"("pk") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChronicCondition" ADD CONSTRAINT "ChronicCondition_patientDataPk_fkey" FOREIGN KEY ("patientDataPk") REFERENCES "PatientData"("pk") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Appointment" ADD CONSTRAINT "Appointment_patientDataPk_fkey" FOREIGN KEY ("patientDataPk") REFERENCES "PatientData"("pk") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Medication" ADD CONSTRAINT "Medication_patientDataPk_fkey" FOREIGN KEY ("patientDataPk") REFERENCES "PatientData"("pk") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Vaccine" ADD CONSTRAINT "Vaccine_patientDataPk_fkey" FOREIGN KEY ("patientDataPk") REFERENCES "PatientData"("pk") ON DELETE CASCADE ON UPDATE CASCADE;
