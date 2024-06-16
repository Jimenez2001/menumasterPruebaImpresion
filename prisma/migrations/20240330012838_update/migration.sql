/*
  Warnings:

  - You are about to drop the column `fechaVenta` on the `ventas` table. All the data in the column will be lost.
  - You are about to drop the column `noPedido` on the `ventas` table. All the data in the column will be lost.
  - You are about to drop the column `nombre` on the `ventas` table. All the data in the column will be lost.
  - You are about to drop the column `pedido` on the `ventas` table. All the data in the column will be lost.
  - You are about to alter the column `fecha` on the `ventas` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `DateTime(3)`.
  - You are about to drop the `metodo_pagos` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `descripcion` to the `Ventas` table without a default value. This is not possible if the table is not empty.
  - Added the required column `ordenes` to the `Ventas` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `metodo_pagos` DROP FOREIGN KEY `Metodo_Pagos_venta_Id_fkey`;

-- AlterTable
ALTER TABLE `ventas` DROP COLUMN `fechaVenta`,
    DROP COLUMN `noPedido`,
    DROP COLUMN `nombre`,
    DROP COLUMN `pedido`,
    ADD COLUMN `descripcion` JSON NOT NULL,
    ADD COLUMN `ordenes` VARCHAR(191) NOT NULL,
    MODIFY `fecha` DATETIME(3) NOT NULL;

-- DropTable
DROP TABLE `metodo_pagos`;
