import { StudySheet } from '../entities/study-sheet.entity';

export interface IStudySheetRepository {
  create(studySheet: StudySheet): Promise<StudySheet>;
  findByCourseId(courseId: string): Promise<StudySheet | null>;
}
