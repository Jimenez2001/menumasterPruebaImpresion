/*
  Warnings:

  - You are about to drop the column `Pago` on the `metodo_pagos` table. All the data in the column will be lost.
  - You are about to drop the column `ventasId` on the `metodo_pagos` table. All the data in the column will be lost.
  - Added the required column `Nombre` to the `Metodo_Pagos` table without a default value. This is not possible if the table is not empty.
  - Added the required column `venta_Id` to the `Metodo_Pagos` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `metodo_pagos` DROP FOREIGN KEY `Metodo_Pagos_ventasId_fkey`;

-- AlterTable
ALTER TABLE `metodo_pagos` DROP COLUMN `Pago`,
    DROP COLUMN `ventasId`,
    ADD COLUMN `Nombre` VARCHAR(191) NOT NULL,
    ADD COLUMN `venta_Id` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `Metodo_Pagos` ADD CONSTRAINT `Metodo_Pagos_venta_Id_fkey` FOREIGN KEY (`venta_Id`) REFERENCES `Ventas`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
