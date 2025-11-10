import {
  Dialog,
  DialogHeader,
  DialogContent,
  DialogFooter,
  DialogTitle,
} from '@/components/ui/dialog';
import { useCourseCreate } from '../providers/course-create-provider';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { courseCreateSchema } from '../schemas/course-create.schema';
import type { CourseCreateFormData } from '../types';
import { SourceTypeTabs } from './SourceTypeTabs';
import { LanguagePicker } from './LanguagePicker';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import type { SubmitHandler } from 'react-hook-form';

const hasMessage = (v: unknown): v is { message?: string } =>
  typeof v === 'object' && v !== null && 'message' in v;
import { Field } from '@/components/ui/field';

export const CourseCreationDialog = () => {
  const { isOpen, closeDialog, formData, updateFormData, submitCourse } = useCourseCreate();
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<CourseCreateFormData>({
    resolver: zodResolver(courseCreateSchema),
    defaultValues: formData,
  });

  const onSubmit: SubmitHandler<CourseCreateFormData> = async (data) => {
    updateFormData(data);
    await submitCourse();
  };

  console.log('Form errors:', errors);

  return (
    <Dialog open={isOpen} onOpenChange={closeDialog}>
      <DialogHeader>Ajouter un cours</DialogHeader>
      <DialogContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="flex flex-col gap-4">
            <DialogTitle>Ajouter un cours</DialogTitle>
            <SourceTypeTabs
              value={watch('sourceType')}
              onChange={(v) => setValue('sourceType', v)}
            />
            {watch('sourceType') === 'text' && (
              <Field>
                <Textarea
                  {...register('sourceText')}
                  placeholder="Collez le texte du cours ici..."
                  className=" h-60 mt-2"
                />
              </Field>
            )}
            <LanguagePicker
              value={watch('language')}
              onChange={(lang) => setValue('language', lang)}
            />
            {errors && (
              <div className="text-red-500">
                {Object.values(errors)
                  .map((e) => (hasMessage(e) ? e.message : undefined))
                  .filter(Boolean)
                  .join(', ')}
              </div>
            )}
            <DialogFooter>
              <Button disabled={errors.sourceText != null} type="submit">
                Générer la fiche
              </Button>
            </DialogFooter>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
