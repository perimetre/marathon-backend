/*
  Warnings:

  - You are about to drop the column `groupId` on the `Project` table. All the data in the column will be lost.
  - You are about to drop the `ProjectGroup` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `UserProjectGroup` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `Project` DROP FOREIGN KEY `Project_ibfk_5`;

-- DropForeignKey
ALTER TABLE `UserProjectGroup` DROP FOREIGN KEY `UserProjectGroup_ibfk_1`;

-- DropForeignKey
ALTER TABLE `UserProjectGroup` DROP FOREIGN KEY `UserProjectGroup_ibfk_2`;

-- AlterTable
ALTER TABLE `Project` DROP COLUMN `groupId`;

-- DropTable
DROP TABLE `ProjectGroup`;

-- DropTable
DROP TABLE `UserProjectGroup`;
