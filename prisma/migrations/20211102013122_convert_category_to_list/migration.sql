/*
  Warnings:

  - You are about to drop the column `categoryId` on the `Module` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `Module` DROP FOREIGN KEY `Module_ibfk_3`;

-- AlterTable
ALTER TABLE `Module` DROP COLUMN `categoryId`;

-- CreateTable
CREATE TABLE `ModuleCategory` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `moduleId` INTEGER NOT NULL,
    `categoryId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `ModuleCategory` ADD FOREIGN KEY (`moduleId`) REFERENCES `Module`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ModuleCategory` ADD FOREIGN KEY (`categoryId`) REFERENCES `Category`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
