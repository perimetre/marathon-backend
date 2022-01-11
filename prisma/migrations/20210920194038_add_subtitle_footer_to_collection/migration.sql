/*
  Warnings:

  - Added the required column `footer` to the `CollectionTranslations` table without a default value. This is not possible if the table is not empty.
  - Added the required column `subtitle` to the `CollectionTranslations` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `CollectionTranslations` ADD COLUMN `footer` VARCHAR(191) NOT NULL,
    ADD COLUMN `subtitle` VARCHAR(191) NOT NULL;
