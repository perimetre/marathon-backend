-- AlterTable
ALTER TABLE `Collection` ADD COLUMN `hasPegs` BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE `Type` ADD COLUMN `hasPegs` BOOLEAN NOT NULL DEFAULT false;
