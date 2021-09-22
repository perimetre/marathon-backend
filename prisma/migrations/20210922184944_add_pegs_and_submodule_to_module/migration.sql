/*
  Warnings:

  - Added the required column `hasPegs` to the `Module` table without a default value. This is not possible if the table is not empty.
  - Added the required column `isSubmodule` to the `Module` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Module` ADD COLUMN `hasPegs` BOOLEAN NOT NULL,
    ADD COLUMN `isSubmodule` BOOLEAN NOT NULL;
