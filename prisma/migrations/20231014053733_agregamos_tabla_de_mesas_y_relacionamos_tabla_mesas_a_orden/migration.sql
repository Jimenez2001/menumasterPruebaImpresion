/*
  Warnings:

  - Added the required column `mesa_id` to the `Orden` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `orden` ADD COLUMN `mesa_id` INTEGER NOT NULL;

-- CreateTable
CREATE TABLE `Mesas` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nombre` VARCHAR(191) NOT NULL,
    `estado` BOOLEAN NOT NULL DEFAULT false,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Orden` ADD CONSTRAINT `Orden_mesa_id_fkey` FOREIGN KEY (`mesa_id`) REFERENCES `Mesas`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
