-- AlterTable
ALTER TABLE `blogpost` MODIFY `content` TEXT NOT NULL;

-- AlterTable
ALTER TABLE `product` MODIFY `description` TEXT NOT NULL,
    MODIFY `features` TEXT NULL;

-- AlterTable
ALTER TABLE `settings` MODIFY `announcementText` TEXT NULL,
    MODIFY `homepageBenefits` TEXT NULL;
