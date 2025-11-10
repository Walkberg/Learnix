import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

export const SourceTypeTabs = ({
  value,
  onChange,
}: {
  value: 'text' | 'document' | 'photo';
  onChange: (v: 'text' | 'document' | 'photo') => void;
}) => (
  <Tabs value={value} onValueChange={(v) => onChange(v as 'text' | 'document' | 'photo')}>
    <TabsList>
      <TabsTrigger value="document">Document</TabsTrigger>
      <TabsTrigger value="text">Texte</TabsTrigger>
      <TabsTrigger value="photo">Photo</TabsTrigger>
    </TabsList>
  </Tabs>
);
