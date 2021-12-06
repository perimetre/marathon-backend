-- AlterTable
ALTER TABLE `Module` ADD COLUMN `attachmentToAppendId` INTEGER;

-- CreateTable
CREATE TABLE `ModuleAttachments` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `moduleId` INTEGER NOT NULL,
    `attachmentId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `ModuleAttachments` ADD FOREIGN KEY (`moduleId`) REFERENCES `Module`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ModuleAttachments` ADD FOREIGN KEY (`attachmentId`) REFERENCES `Module`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Module` ADD FOREIGN KEY (`attachmentToAppendId`) REFERENCES `Module`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
