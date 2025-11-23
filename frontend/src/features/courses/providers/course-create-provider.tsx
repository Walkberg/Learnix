import { createContext, useContext, useState, type ReactNode } from 'react';
import type { CourseCreateFormData, LanguageOption } from '../types';
import { courseCreateSchema } from '../schemas/course-create.schema';
import { useCourseApi } from './course-api-provider';

interface CourseCreateContextValue {
  isOpen: boolean;
  formData: CourseCreateFormData;
  languages: LanguageOption[];
  openDialog: () => void;
  closeDialog: () => void;
  updateFormData: (data: Partial<CourseCreateFormData>) => void;
  submitCourse: () => Promise<void>;
}

const languages: LanguageOption[] = [
  { id: 'fr', label: 'Français' },
  { id: 'en', label: 'English' },
  { id: 'es', label: 'Español' },
  { id: 'de', label: 'Deutsch' },
  { id: 'it', label: 'Italiano' },
];

const defaultFormData: CourseCreateFormData = {
  sourceType: 'text',
  language: languages[0],
  sourceText: '',
};

const CourseCreateContext = createContext<CourseCreateContextValue | undefined>(undefined);

export const CourseCreateProvider = ({ children }: { children: ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState<CourseCreateFormData>(defaultFormData);

  const openDialog = () => setIsOpen(true);
  const closeDialog = () => {
    setIsOpen(false);
    setFormData(defaultFormData);
  };
  const updateFormData = (data: Partial<CourseCreateFormData>) => {
    setFormData((prev) => ({ ...prev, ...data }));
  };
  const courseApi = useCourseApi();

  const submitCourse = async () => {
    const result = courseCreateSchema.safeParse(formData);

    console.log('Validation result:', result);

    if (!result.success) {
      throw new Error('Validation failed');
    }
    await courseApi.createCourse({
      title: formData.sourceText.slice(0, 40) || 'Nouveau cours',
      sourceText: formData.sourceText,
      emoji: undefined,
    });
    closeDialog();
  };

  return (
    <CourseCreateContext.Provider
      value={{ isOpen, formData, languages, openDialog, closeDialog, updateFormData, submitCourse }}
    >
      {children}
    </CourseCreateContext.Provider>
  );
};

export const useCourseCreate = () => {
  const ctx = useContext(CourseCreateContext);
  if (!ctx) throw new Error('useCourseCreate must be used within CourseCreateProvider');
  return ctx;
};
