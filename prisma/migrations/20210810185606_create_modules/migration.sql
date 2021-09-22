/*
  Warnings:

  - You are about to drop the column `partNumber` on the `ProjectModule` table. All the data in the column will be lost.
  - Added the required column `moduleId` to the `ProjectModule` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `ProjectModule` DROP COLUMN `partNumber`,
    ADD COLUMN `moduleId` INTEGER NOT NULL,
    MODIFY `projectId` INTEGER;

-- CreateTable
CREATE TABLE `Module` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `partNumber` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `Module.partNumber_unique`(`partNumber`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `ProjectModule` ADD FOREIGN KEY (`moduleId`) REFERENCES `Module`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
