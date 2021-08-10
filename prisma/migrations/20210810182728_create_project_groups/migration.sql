/*
  Warnings:

  - You are about to drop the column `group` on the `Project` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `Project` table. All the data in the column will be lost.
  - Added the required column `groupId` to the `Project` table without a default value. This is not possible if the table is not empty.
  - Added the required column `brand` to the `Slide` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `Project` DROP FOREIGN KEY `Project_ibfk_3`;

-- AlterTable
ALTER TABLE `Project` DROP COLUMN `group`,
    DROP COLUMN `userId`,
    ADD COLUMN `groupId` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `Slide` ADD COLUMN `brand` VARCHAR(255) NOT NULL;

-- CreateTable
CREATE TABLE `ProjectGroup` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(255) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `UserProjectGroup` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `groupId` INTEGER NOT NULL,
    `userId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Project` ADD FOREIGN KEY (`groupId`) REFERENCES `ProjectGroup`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UserProjectGroup` ADD FOREIGN KEY (`groupId`) REFERENCES `ProjectGroup`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UserProjectGroup` ADD FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
