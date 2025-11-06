import { StudySheet } from '../entities/study-sheet.entity';

export class StudySheetGeneratedEvent {
  studySheetId: string;
  courseId: string;
  summary: string;
  constructor(studySheet: StudySheet) {
    this.studySheetId = studySheet.id;
    this.courseId = studySheet.courseId;
    this.summary = studySheet.summary;
  }
}
