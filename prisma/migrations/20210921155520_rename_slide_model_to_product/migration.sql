/*
  Warnings:

  - You are about to drop the column `model` on the `Slide` table. All the data in the column will be lost.
  - Added the required column `product` to the `Slide` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Slide` DROP COLUMN `model`,
    ADD COLUMN `product` VARCHAR(255) NOT NULL;
