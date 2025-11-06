/*
  Warnings:

  - You are about to alter the column `keyPoints` on the `StudySheet` table. The data in that column could be lost. The data in that column will be cast from `String` to `Json`.
  - You are about to alter the column `summary` on the `StudySheet` table. The data in that column could be lost. The data in that column will be cast from `String` to `Json`.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_StudySheet" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "courseId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "summary" JSONB NOT NULL,
    "keyPoints" JSONB NOT NULL,
    "generatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "StudySheet_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_StudySheet" ("courseId", "generatedAt", "id", "keyPoints", "summary", "title") SELECT "courseId", "generatedAt", "id", "keyPoints", "summary", "title" FROM "StudySheet";
DROP TABLE "StudySheet";
ALTER TABLE "new_StudySheet" RENAME TO "StudySheet";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
