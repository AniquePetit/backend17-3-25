/*
  Warnings:

  - You are about to alter the column `pricePerNight` on the `Property` table. The data in that column could be lost. The data in that column will be cast from `Decimal` to `Float`.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Property" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "hostId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "pricePerNight" REAL NOT NULL,
    "bedroomCount" INTEGER NOT NULL,
    "bathRoomCount" INTEGER NOT NULL,
    "maxGuestCount" INTEGER NOT NULL,
    "rating" INTEGER NOT NULL,
    CONSTRAINT "Property_hostId_fkey" FOREIGN KEY ("hostId") REFERENCES "Host" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Property" ("bathRoomCount", "bedroomCount", "description", "hostId", "id", "location", "maxGuestCount", "pricePerNight", "rating", "title") SELECT "bathRoomCount", "bedroomCount", "description", "hostId", "id", "location", "maxGuestCount", "pricePerNight", "rating", "title" FROM "Property";
DROP TABLE "Property";
ALTER TABLE "new_Property" RENAME TO "Property";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
