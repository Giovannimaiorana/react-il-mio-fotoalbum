/*
  Warnings:

  - You are about to drop the column `desciption` on the `photos` table. All the data in the column will be lost.
  - Added the required column `description` to the `photos` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `photos` DROP COLUMN `desciption`,
    ADD COLUMN `description` TEXT NOT NULL;
