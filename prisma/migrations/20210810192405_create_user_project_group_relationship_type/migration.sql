/*
  Warnings:

  - Added the required column `relationshipType` to the `UserProjectGroup` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `UserProjectGroup` ADD COLUMN `relationshipType` ENUM('owner', 'default') NOT NULL;
