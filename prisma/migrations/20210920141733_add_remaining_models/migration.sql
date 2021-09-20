/*
  Warnings:

  - You are about to drop the column `name` on the `Collection` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `Finish` table. All the data in the column will be lost.
  - You are about to drop the column `gableInCM` on the `Project` table. All the data in the column will be lost.
  - You are about to drop the column `gableInIN` on the `Project` table. All the data in the column will be lost.
  - You are about to drop the column `mainMeasureSystem` on the `Project` table. All the data in the column will be lost.
  - You are about to drop the column `type` on the `Project` table. All the data in the column will be lost.
  - You are about to drop the column `widthInCM` on the `Project` table. All the data in the column will be lost.
  - You are about to drop the column `widthInIN` on the `Project` table. All the data in the column will be lost.
  - You are about to drop the column `posY` on the `ProjectModule` table. All the data in the column will be lost.
  - You are about to drop the column `rotX` on the `ProjectModule` table. All the data in the column will be lost.
  - You are about to drop the column `rotY` on the `ProjectModule` table. All the data in the column will be lost.
  - You are about to drop the column `brand` on the `Slide` table. All the data in the column will be lost.
  - You are about to drop the column `depthInCM` on the `Slide` table. All the data in the column will be lost.
  - You are about to drop the column `depthInIN` on the `Slide` table. All the data in the column will be lost.
  - The values [default] on the enum `UserProjectGroup_relationshipType` will be removed. If these variants are still used in the database, this will fail.
  - Added the required column `thumbnailUrl` to the `Collection` table without a default value. This is not possible if the table is not empty.
  - Added the required column `thumbnailUrl` to the `Finish` table without a default value. This is not possible if the table is not empty.
  - Added the required column `collectionId` to the `Module` table without a default value. This is not possible if the table is not empty.
  - Added the required column `finishId` to the `Module` table without a default value. This is not possible if the table is not empty.
  - Added the required column `rules` to the `Module` table without a default value. This is not possible if the table is not empty.
  - Added the required column `thumbnailUrl` to the `Module` table without a default value. This is not possible if the table is not empty.
  - Added the required column `gable` to the `Project` table without a default value. This is not possible if the table is not empty.
  - Added the required column `slideDepthId` to the `Project` table without a default value. This is not possible if the table is not empty.
  - Added the required column `typeId` to the `Project` table without a default value. This is not possible if the table is not empty.
  - Added the required column `width` to the `Project` table without a default value. This is not possible if the table is not empty.
  - Added the required column `formula` to the `Slide` table without a default value. This is not possible if the table is not empty.
  - Added the required column `supplierId` to the `Slide` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Collection` DROP COLUMN `name`,
    ADD COLUMN `thumbnailUrl` VARCHAR(255) NOT NULL;

-- AlterTable
ALTER TABLE `Finish` DROP COLUMN `name`,
    ADD COLUMN `thumbnailUrl` VARCHAR(255) NOT NULL;

-- AlterTable
ALTER TABLE `Module` ADD COLUMN `collectionId` INTEGER NOT NULL,
    ADD COLUMN `finishId` INTEGER NOT NULL,
    ADD COLUMN `rules` JSON NOT NULL,
    ADD COLUMN `thumbnailUrl` VARCHAR(255) NOT NULL;

-- AlterTable
ALTER TABLE `Project` DROP COLUMN `gableInCM`,
    DROP COLUMN `gableInIN`,
    DROP COLUMN `mainMeasureSystem`,
    DROP COLUMN `type`,
    DROP COLUMN `widthInCM`,
    DROP COLUMN `widthInIN`,
    ADD COLUMN `gable` DOUBLE NOT NULL,
    ADD COLUMN `slideDepthId` INTEGER NOT NULL,
    ADD COLUMN `typeId` INTEGER NOT NULL,
    ADD COLUMN `width` DOUBLE NOT NULL;

-- AlterTable
ALTER TABLE `ProjectModule` DROP COLUMN `posY`,
    DROP COLUMN `rotX`,
    DROP COLUMN `rotY`;

-- AlterTable
ALTER TABLE `Slide` DROP COLUMN `brand`,
    DROP COLUMN `depthInCM`,
    DROP COLUMN `depthInIN`,
    ADD COLUMN `formula` VARCHAR(255) NOT NULL,
    ADD COLUMN `supplierId` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `UserProjectGroup` MODIFY `relationshipType` ENUM('owner', 'member') NOT NULL;

-- CreateTable
CREATE TABLE `CollectionTranslations` (
    `id` INTEGER NOT NULL,
    `locale` ENUM('en', 'fr') NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NOT NULL,
    `collectionId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `FinishTranslations` (
    `id` INTEGER NOT NULL,
    `locale` ENUM('en', 'fr') NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NOT NULL,
    `finishId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `TypeTranslations` (
    `id` INTEGER NOT NULL,
    `locale` ENUM('en', 'fr') NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NOT NULL,
    `typeId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Type` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `thumbnailUrl` VARCHAR(255) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `SlideDepth` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `display` VARCHAR(255) NOT NULL,
    `depth` DOUBLE NOT NULL,
    `slideId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `SlideSupplier` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `thumbnailUrl` VARCHAR(255) NOT NULL,
    `name` VARCHAR(255) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `CollectionTranslations` ADD FOREIGN KEY (`collectionId`) REFERENCES `Collection`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `FinishTranslations` ADD FOREIGN KEY (`finishId`) REFERENCES `Finish`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `TypeTranslations` ADD FOREIGN KEY (`typeId`) REFERENCES `Type`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Module` ADD FOREIGN KEY (`finishId`) REFERENCES `Finish`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Module` ADD FOREIGN KEY (`collectionId`) REFERENCES `Collection`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Project` ADD FOREIGN KEY (`typeId`) REFERENCES `Type`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Project` ADD FOREIGN KEY (`slideDepthId`) REFERENCES `SlideDepth`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SlideDepth` ADD FOREIGN KEY (`slideId`) REFERENCES `Slide`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Slide` ADD FOREIGN KEY (`supplierId`) REFERENCES `SlideSupplier`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
