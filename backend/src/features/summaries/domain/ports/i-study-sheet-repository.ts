import { StudySheet } from '../entities/study-sheet.entity';

export interface IStudySheetRepository {
  create(studySheet: StudySheet): Promise<StudySheet>;
  findByCourseId(courseId: string): Promise<StudySheet | null>;
  findManyByCourseId(courseId: string): Promise<StudySheet[]>;
  findById(id: string): Promise<StudySheet | null>;
  updateById(id: string, data: Partial<StudySheet>): Promise<number>;
}
