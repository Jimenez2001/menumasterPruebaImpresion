/*
  Warnings:

  - Added the required column `mesa_id` to the `Ventas` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `ventas` ADD COLUMN `mesa_id` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `Ventas` ADD CONSTRAINT `Ventas_mesa_id_fkey` FOREIGN KEY (`mesa_id`) REFERENCES `Mesas`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
