/*
  Warnings:

  - Added the required column `icon_url` to the `categories` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "categories" ADD COLUMN     "icon_url" TEXT NOT NULL;
