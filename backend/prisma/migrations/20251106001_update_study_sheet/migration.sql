-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_StudySheet" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "courseId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "summary" TEXT NOT NULL,
    "keyPoints" TEXT NOT NULL,
    "generatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "StudySheet_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_StudySheet" ("id", "courseId", "title", "keyPoints", "generatedAt")
SELECT "id", "courseId", "summaryTitle", "keyPoints", "generatedAt"
FROM "StudySheet";
DROP TABLE "StudySheet";
ALTER TABLE "new_StudySheet" RENAME TO "StudySheet";
PRAGMA foreign_key_check;