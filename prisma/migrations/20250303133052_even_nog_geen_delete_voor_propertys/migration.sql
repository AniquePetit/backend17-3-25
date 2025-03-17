/*
  Warnings:

  - You are about to drop the `PropertyAmenity` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the column `bookingStatus` on the `Booking` table. All the data in the column will be lost.
  - You are about to drop the column `checkinDate` on the `Booking` table. All the data in the column will be lost.
  - You are about to drop the column `checkoutDate` on the `Booking` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Host` table. All the data in the column will be lost.
  - You are about to alter the column `pricePerNight` on the `Property` table. The data in that column could be lost. The data in that column will be cast from `Float` to `Decimal`.
  - Added the required column `checkInDate` to the `Booking` table without a default value. This is not possible if the table is not empty.
  - Added the required column `checkOutDate` to the `Booking` table without a default value. This is not possible if the table is not empty.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "PropertyAmenity";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phoneNumber" TEXT NOT NULL,
    "profilePicture" TEXT,
    "pictureUrl" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_PropertyAmenities" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,
    CONSTRAINT "_PropertyAmenities_A_fkey" FOREIGN KEY ("A") REFERENCES "Amenity" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_PropertyAmenities_B_fkey" FOREIGN KEY ("B") REFERENCES "Property" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Booking" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "propertyId" TEXT NOT NULL,
    "checkInDate" DATETIME NOT NULL,
    "checkOutDate" DATETIME NOT NULL,
    "numberOfGuests" INTEGER NOT NULL,
    "totalPrice" INTEGER NOT NULL,
    CONSTRAINT "Booking_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "Property" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Booking" ("id", "numberOfGuests", "propertyId", "totalPrice", "userId") SELECT "id", "numberOfGuests", "propertyId", "totalPrice", "userId" FROM "Booking";
DROP TABLE "Booking";
ALTER TABLE "new_Booking" RENAME TO "Booking";
CREATE TABLE "new_Host" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phoneNumber" TEXT NOT NULL,
    "profilePicture" TEXT,
    "aboutMe" TEXT
);
INSERT INTO "new_Host" ("aboutMe", "email", "id", "name", "password", "phoneNumber", "profilePicture", "username") SELECT "aboutMe", "email", "id", "name", "password", "phoneNumber", "profilePicture", "username" FROM "Host";
DROP TABLE "Host";
ALTER TABLE "new_Host" RENAME TO "Host";
CREATE UNIQUE INDEX "Host_username_key" ON "Host"("username");
CREATE TABLE "new_Property" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "hostId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "pricePerNight" DECIMAL NOT NULL,
    "bedroomCount" INTEGER NOT NULL,
    "bathRoomCount" INTEGER NOT NULL,
    "maxGuestCount" INTEGER NOT NULL,
    "rating" INTEGER NOT NULL,
    CONSTRAINT "Property_hostId_fkey" FOREIGN KEY ("hostId") REFERENCES "Host" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Property" ("bathRoomCount", "bedroomCount", "description", "hostId", "id", "location", "maxGuestCount", "pricePerNight", "rating", "title") SELECT "bathRoomCount", "bedroomCount", "description", "hostId", "id", "location", "maxGuestCount", "pricePerNight", "rating", "title" FROM "Property";
DROP TABLE "Property";
ALTER TABLE "new_Property" RENAME TO "Property";
CREATE TABLE "new_Review" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "propertyId" TEXT NOT NULL,
    "rating" INTEGER NOT NULL,
    "comment" TEXT NOT NULL,
    CONSTRAINT "Review_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "Property" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Review" ("comment", "id", "propertyId", "rating", "userId") SELECT "comment", "id", "propertyId", "rating", "userId" FROM "Review";
DROP TABLE "Review";
ALTER TABLE "new_Review" RENAME TO "Review";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "_PropertyAmenities_AB_unique" ON "_PropertyAmenities"("A", "B");

-- CreateIndex
CREATE INDEX "_PropertyAmenities_B_index" ON "_PropertyAmenities"("B");
