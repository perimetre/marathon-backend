-- AlterTable
ALTER TABLE `Project` RENAME COLUMN `width` TO `cabinetWidth`,
    ADD COLUMN `calculatedWidth` DOUBLE;

ALTER TABLE `Project` MODIFY `cabinetWidth` DOUBLE;
