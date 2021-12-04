-- AlterTable
ALTER TABLE `Module` RENAME COLUMN `isImprintExtension` TO `isExtension`,
    ADD COLUMN `defaultLeftExtensionId` INTEGER,
    ADD COLUMN `defaultRightExtensionId` INTEGER;

-- AddForeignKey
ALTER TABLE `Module` ADD FOREIGN KEY (`defaultLeftExtensionId`) REFERENCES `Module`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Module` ADD FOREIGN KEY (`defaultRightExtensionId`) REFERENCES `Module`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
