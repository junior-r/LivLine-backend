/*
  Warnings:

  - You are about to drop the column `bloodType` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `city` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `country` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `dateOfBirth` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `phone` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `sex` on the `User` table. All the data in the column will be lost.
  - Added the required column `bloodType` to the `PatientData` table without a default value. This is not possible if the table is not empty.
  - Added the required column `city` to the `PatientData` table without a default value. This is not possible if the table is not empty.
  - Added the required column `country` to the `PatientData` table without a default value. This is not possible if the table is not empty.
  - Added the required column `dateOfBirth` to the `PatientData` table without a default value. This is not possible if the table is not empty.
  - Added the required column `sex` to the `PatientData` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "PatientData" ADD COLUMN     "bloodType" "BloodType" NOT NULL,
ADD COLUMN     "city" TEXT NOT NULL,
ADD COLUMN     "country" TEXT NOT NULL,
ADD COLUMN     "dateOfBirth" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "emergencyContactName" TEXT,
ADD COLUMN     "emergencyContactPhone" TEXT,
ADD COLUMN     "phone" TEXT,
ADD COLUMN     "sex" "Sex" NOT NULL;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "bloodType",
DROP COLUMN "city",
DROP COLUMN "country",
DROP COLUMN "dateOfBirth",
DROP COLUMN "phone",
DROP COLUMN "sex";
