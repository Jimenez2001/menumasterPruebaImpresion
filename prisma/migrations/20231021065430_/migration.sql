/*
  Warnings:

  - Added the required column `fechaVenta` to the `Ventas` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `ventas` ADD COLUMN `fechaVenta` DATETIME(3) NOT NULL;
