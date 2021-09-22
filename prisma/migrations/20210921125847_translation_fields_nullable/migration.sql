-- AlterTable
ALTER TABLE `CollectionTranslations` MODIFY `description` VARCHAR(191),
    MODIFY `footer` VARCHAR(191),
    MODIFY `subtitle` VARCHAR(191);

-- AlterTable
ALTER TABLE `FinishTranslations` MODIFY `description` VARCHAR(191);

-- AlterTable
ALTER TABLE `TypeTranslations` MODIFY `description` VARCHAR(191);
