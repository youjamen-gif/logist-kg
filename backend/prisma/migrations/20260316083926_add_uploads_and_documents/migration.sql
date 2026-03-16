/*
  Warnings:

  - You are about to drop the column `url` on the `company_documents` table. All the data in the column will be lost.
  - You are about to drop the column `url` on the `driver_documents` table. All the data in the column will be lost.
  - You are about to drop the column `vehicleId` on the `driver_documents` table. All the data in the column will be lost.
  - You are about to drop the column `insuranceUrl` on the `vehicles` table. All the data in the column will be lost.
  - You are about to drop the column `registrationCertificateUrl` on the `vehicles` table. All the data in the column will be lost.
  - Added the required column `fileUrl` to the `company_documents` table without a default value. This is not possible if the table is not empty.
  - Added the required column `fileUrl` to the `driver_documents` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "driver_documents" DROP CONSTRAINT "driver_documents_vehicleId_fkey";

-- AlterTable
ALTER TABLE "company_documents" DROP COLUMN "url",
ADD COLUMN     "fileUrl" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "driver_documents" DROP COLUMN "url",
DROP COLUMN "vehicleId",
ADD COLUMN     "fileUrl" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "vehicles" DROP COLUMN "insuranceUrl",
DROP COLUMN "registrationCertificateUrl",
ADD COLUMN     "techPassportUrl" TEXT;
