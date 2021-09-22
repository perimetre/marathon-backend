/*
  Warnings:

  - Added the required column `collectionId` to the `Slide` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Slide` ADD COLUMN `collectionId` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `Slide` ADD FOREIGN KEY (`collectionId`) REFERENCES `Collection`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
