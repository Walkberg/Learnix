import { Select, SelectContent, SelectItem, SelectTrigger } from '@/components/ui/select';
import { useChat } from '../providers/ChatProvider';
import { useCourses } from '@/features/courses';

export default function CoursePicker() {
  const { selectedCourse, setSelectedCourse } = useChat();
  const { courses } = useCourses();

  return (
    <div className="mb-4">
      <label className="text-sm text-muted-foreground block mb-1">Cours</label>
      <Select
        value={selectedCourse?.id ?? ''}
        onValueChange={(id) => {
          const c = courses.find((s) => s.id === id) ?? null;
          setSelectedCourse({
            id: c?.id ?? '',
            title: c?.title ?? '',
            emoji: c?.emoji ?? '',
          });
        }}
      >
        <SelectTrigger>
          {selectedCourse
            ? `${selectedCourse.emoji} ${selectedCourse.title}`
            : 'Sélectionner un cours'}
        </SelectTrigger>
        <SelectContent>
          {courses.map((c) => (
            <SelectItem key={c.id} value={c.id}>
              {c.emoji} {c.title}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
