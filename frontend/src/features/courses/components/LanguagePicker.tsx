import { Select, SelectTrigger, SelectContent, SelectItem } from '@/components/ui/select';
import { useCourseCreate } from '../providers/course-create-provider';
import type { LanguageOption } from '../types';

interface Props {
  value: LanguageOption;
  onChange: (lang: LanguageOption) => void;
}

export const LanguagePicker = ({ value, onChange }: Props) => {
  const { languages } = useCourseCreate();
  return (
    <Select
      value={value?.id}
      onValueChange={(id) => {
        const found = languages.find((l) => l.id === id);
        if (found) onChange(found);
      }}
    >
      <SelectTrigger>{value?.label}</SelectTrigger>
      <SelectContent>
        {languages.map((lang) => (
          <SelectItem key={lang.id} value={lang.id}>
            {lang.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
