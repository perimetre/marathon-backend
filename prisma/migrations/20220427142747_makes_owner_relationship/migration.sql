-- AddForeignKey
ALTER TABLE `Module` ADD FOREIGN KEY (`ownerExternalId`) REFERENCES `Module`(`externalId`) ON DELETE SET NULL ON UPDATE CASCADE;
