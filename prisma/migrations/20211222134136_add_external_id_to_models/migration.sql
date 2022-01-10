/*
  Warnings:

  - A unique constraint covering the columns `[externalId]` on the table `Category` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[externalId]` on the table `Collection` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[externalId]` on the table `Finish` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[externalId]` on the table `Module` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[externalId]` on the table `Type` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `Category` ADD COLUMN `externalId` VARCHAR(191);

-- AlterTable
ALTER TABLE `Collection` ADD COLUMN `externalId` VARCHAR(191);

-- AlterTable
ALTER TABLE `Finish` ADD COLUMN `externalId` VARCHAR(191);

-- AlterTable
ALTER TABLE `Module` ADD COLUMN `externalId` VARCHAR(191);

-- AlterTable
ALTER TABLE `Type` ADD COLUMN `externalId` VARCHAR(191);

-- CreateIndex
CREATE UNIQUE INDEX `Category.externalId_unique` ON `Category`(`externalId`);

-- CreateIndex
CREATE UNIQUE INDEX `Collection.externalId_unique` ON `Collection`(`externalId`);

-- CreateIndex
CREATE UNIQUE INDEX `Finish.externalId_unique` ON `Finish`(`externalId`);

-- CreateIndex
CREATE UNIQUE INDEX `Module.externalId_unique` ON `Module`(`externalId`);

-- CreateIndex
CREATE UNIQUE INDEX `Type.externalId_unique` ON `Type`(`externalId`);
