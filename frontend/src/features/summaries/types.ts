// Summary types
export interface Summary {
  id: string;
  courseId: string;
  content: string;
  status: 'PENDING' | 'GENERATED' | 'ERROR';
  createdAt: string;
  updatedAt: string;
}
