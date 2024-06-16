/*
  Warnings:

  - You are about to drop the column `descripcion` on the `producto` table. All the data in the column will be lost.
  - Added the required column `descripcion` to the `Orden` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `orden` ADD COLUMN `descripcion` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `producto` DROP COLUMN `descripcion`;
