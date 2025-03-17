-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT,
    "phoneNumber" TEXT NOT NULL,
    "profilePicture" TEXT,
    "pictureUrl" TEXT,
    "refreshToken" TEXT
);
INSERT INTO "new_User" ("email", "id", "name", "password", "phoneNumber", "pictureUrl", "profilePicture", "refreshToken", "username") SELECT "email", "id", "name", "password", "phoneNumber", "pictureUrl", "profilePicture", "refreshToken", "username" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
