/*
  Warnings:

  - A unique constraint covering the columns `[email]` on the table `Host` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Host_email_key" ON "Host"("email");
