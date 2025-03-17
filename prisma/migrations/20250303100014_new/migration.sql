/*
  Warnings:

  - You are about to drop the column `checkInDate` on the `Booking` table. All the data in the column will be lost.
  - You are about to drop the column `checkOutDate` on the `Booking` table. All the data in the column will be lost.
  - Added the required column `checkinDate` to the `Booking` table without a default value. This is not possible if the table is not empty.
  - Added the required column `checkoutDate` to the `Booking` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Booking" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "propertyId" TEXT NOT NULL,
    "checkinDate" DATETIME NOT NULL,
    "checkoutDate" DATETIME NOT NULL,
    "numberOfGuests" INTEGER NOT NULL,
    "totalPrice" INTEGER NOT NULL,
    CONSTRAINT "Booking_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "Property" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Booking" ("id", "numberOfGuests", "propertyId", "totalPrice", "userId") SELECT "id", "numberOfGuests", "propertyId", "totalPrice", "userId" FROM "Booking";
DROP TABLE "Booking";
ALTER TABLE "new_Booking" RENAME TO "Booking";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
