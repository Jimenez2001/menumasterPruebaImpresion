-- CreateTable
CREATE TABLE `Metodo_Pagos` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `Pago` VARCHAR(191) NOT NULL,
    `ventasId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Metodo_Pagos` ADD CONSTRAINT `Metodo_Pagos_ventasId_fkey` FOREIGN KEY (`ventasId`) REFERENCES `Ventas`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
