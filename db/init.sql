CREATE TABLE IF NOT EXISTS role(  
    id int NOT NULL PRIMARY KEY AUTO_INCREMENT COMMENT 'Primary Key',
    role_name VARCHAR(255) NOT NULL,
    staff_name TEXT NULL
) COMMENT '';

CREATE TABLE IF NOT EXISTS `asset` (
    `id` INT NOT NULL AUTO_INCREMENT,
    `asset_name` VARCHAR(255) NOT NULL,
    `role_id` INT NULL,
    `asset_type_id` INT NULL,
    PRIMARY KEY (`id`),
    INDEX `idx_role_id` (`role_id`),
    CONSTRAINT `fk_asset_role` 
        FOREIGN KEY (`role_id`) 
        REFERENCES `role` (`id`) 
        ON DELETE SET NULL 
        ON UPDATE CASCADE,
    CONSTRAINT `fk_asset_asset_type` 
        FOREIGN KEY (`asset_type_id`) 
        REFERENCES `asset_type` (`id`) 
        ON DELETE SET NULL
        ON UPDATE CASCADE
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `asset_type` (
    `id` INT NOT NULL AUTO_INCREMENT,
    `asset_type_name` VARCHAR(255) NOT NULL,
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;