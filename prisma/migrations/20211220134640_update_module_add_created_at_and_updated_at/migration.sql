-- AlterTable
ALTER TABLE `Module` ADD COLUMN `createdAt` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    ADD COLUMN `updatedAt` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0);
