/*
  Warnings:

  - You are about to drop the column `ordenes` on the `ventas` table. All the data in the column will be lost.
  - You are about to drop the column `usuario_id` on the `ventas` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `ventas` DROP FOREIGN KEY `Ventas_usuario_id_fkey`;

-- AlterTable
ALTER TABLE `ventas` DROP COLUMN `ordenes`,
    DROP COLUMN `usuario_id`;
