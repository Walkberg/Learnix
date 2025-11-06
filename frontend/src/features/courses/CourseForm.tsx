import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { courseSchema } from './schema';
import type { z } from 'zod';

type CourseFormData = z.infer<typeof courseSchema>;

export function CourseForm() {
  const [isLoading, setIsLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CourseFormData>({
    resolver: zodResolver(courseSchema),
  });

  const onSubmit = async (data: CourseFormData) => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/courses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Failed to create course');
      }

      // Redirect to course list or show success message
      window.location.href = '/courses';
    } catch (error) {
      console.error('Failed to create course:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700">
          Course Title
        </label>
        <input
          {...register('title')}
          type="text"
          id="title"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        />
        {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>}
      </div>

      <div>
        <label htmlFor="emoji" className="block text-sm font-medium text-gray-700">
          Emoji (optional)
        </label>
        <input
          {...register('emoji')}
          type="text"
          id="emoji"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        />
        {errors.emoji && <p className="mt-1 text-sm text-red-600">{errors.emoji.message}</p>}
      </div>

      <div>
        <label htmlFor="sourceText" className="block text-sm font-medium text-gray-700">
          Course Content
        </label>
        <textarea
          {...register('sourceText')}
          id="sourceText"
          rows={10}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        />
        {errors.sourceText && (
          <p className="mt-1 text-sm text-red-600">{errors.sourceText.message}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
      >
        {isLoading ? 'Creating...' : 'Create Course'}
      </button>
    </form>
  );
}
