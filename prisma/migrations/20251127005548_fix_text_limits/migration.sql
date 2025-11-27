-- AlterTable
ALTER TABLE `BlogPost` MODIFY `content` TEXT NOT NULL;

-- AlterTable
ALTER TABLE `Product` MODIFY `description` TEXT NOT NULL,
    MODIFY `features` TEXT NULL;

-- AlterTable
ALTER TABLE `Settings` MODIFY `announcementText` TEXT NULL,
    MODIFY `homepageBenefits` TEXT NULL;
