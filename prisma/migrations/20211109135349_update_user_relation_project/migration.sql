-- AlterTable
ALTER TABLE `Project` ADD COLUMN `userId` INTEGER;

-- AddForeignKey
ALTER TABLE `Project` ADD FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
