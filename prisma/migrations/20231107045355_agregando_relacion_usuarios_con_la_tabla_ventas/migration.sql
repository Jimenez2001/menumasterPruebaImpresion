/*
  Warnings:

  - Added the required column `usuario_id` to the `Ventas` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `ventas` ADD COLUMN `usuario_id` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `Ventas` ADD CONSTRAINT `Ventas_usuario_id_fkey` FOREIGN KEY (`usuario_id`) REFERENCES `Usuarios`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
