/*
  Warnings:

  - A unique constraint covering the columns `[slug]` on the table `Collection` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[slug]` on the table `Finish` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[slug]` on the table `Project` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[slug]` on the table `ProjectGroup` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[slug]` on the table `Slide` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[slug]` on the table `SlideSupplier` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[slug]` on the table `Type` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `slug` to the `Collection` table without a default value. This is not possible if the table is not empty.
  - Added the required column `slug` to the `Finish` table without a default value. This is not possible if the table is not empty.
  - Added the required column `slug` to the `Project` table without a default value. This is not possible if the table is not empty.
  - Added the required column `slug` to the `ProjectGroup` table without a default value. This is not possible if the table is not empty.
  - Added the required column `slug` to the `Slide` table without a default value. This is not possible if the table is not empty.
  - Added the required column `slug` to the `SlideSupplier` table without a default value. This is not possible if the table is not empty.
  - Added the required column `slug` to the `Type` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Collection` ADD COLUMN `slug` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `Finish` ADD COLUMN `slug` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `Project` ADD COLUMN `slug` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `ProjectGroup` ADD COLUMN `slug` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `Slide` ADD COLUMN `slug` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `SlideSupplier` ADD COLUMN `slug` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `Type` ADD COLUMN `slug` VARCHAR(191) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Collection.slug_unique` ON `Collection`(`slug`);

-- CreateIndex
CREATE UNIQUE INDEX `Finish.slug_unique` ON `Finish`(`slug`);

-- CreateIndex
CREATE UNIQUE INDEX `Project.slug_unique` ON `Project`(`slug`);

-- CreateIndex
CREATE UNIQUE INDEX `ProjectGroup.slug_unique` ON `ProjectGroup`(`slug`);

-- CreateIndex
CREATE UNIQUE INDEX `Slide.slug_unique` ON `Slide`(`slug`);

-- CreateIndex
CREATE UNIQUE INDEX `SlideSupplier.slug_unique` ON `SlideSupplier`(`slug`);

-- CreateIndex
CREATE UNIQUE INDEX `Type.slug_unique` ON `Type`(`slug`);
