/*
  Warnings:

  - You are about to alter the column `ordenes` on the `ventas` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Json`.

*/
-- AlterTable
ALTER TABLE `ventas` MODIFY `ordenes` JSON NOT NULL;
