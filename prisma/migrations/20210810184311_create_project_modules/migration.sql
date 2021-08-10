-- CreateTable
CREATE TABLE `ProjectModule` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `projectId` INTEGER NOT NULL,
    `partNumber` VARCHAR(255) NOT NULL,
    `posX` DOUBLE NOT NULL,
    `posY` DOUBLE NOT NULL,
    `posZ` DOUBLE NOT NULL,
    `rotX` DOUBLE NOT NULL,
    `rotY` DOUBLE NOT NULL,
    `rotZ` DOUBLE NOT NULL,
    `parentId` INTEGER,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `ProjectModule` ADD FOREIGN KEY (`projectId`) REFERENCES `Project`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ProjectModule` ADD FOREIGN KEY (`parentId`) REFERENCES `ProjectModule`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
