/*
  Warnings:

  - A unique constraint covering the columns `[nanoId]` on the table `ProjectModule` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `nanoId` to the `ProjectModule` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `ProjectModule` ADD COLUMN `nanoId` VARCHAR(191) NOT NULL,
    ADD COLUMN `parentNanoId` VARCHAR(191);

-- CreateIndex
CREATE UNIQUE INDEX `ProjectModule.nanoId_unique` ON `ProjectModule`(`nanoId`);
