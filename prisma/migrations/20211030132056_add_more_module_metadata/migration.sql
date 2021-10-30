-- AlterTable
ALTER TABLE `Module` ADD COLUMN `isImprintExtension` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `isMat` BOOLEAN NOT NULL DEFAULT false,
    MODIFY `hasPegs` BOOLEAN NOT NULL DEFAULT false,
    MODIFY `isSubmodule` BOOLEAN NOT NULL DEFAULT false;
