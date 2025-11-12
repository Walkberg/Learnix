import { useParams } from 'react-router-dom';
import { FlashcardsProvider } from '../providers/flashcards-provider';
import { useState } from 'react';
import { EditFlashcardDialog } from './EditFlashcardDialog';
import { DeleteFlashcardDialog } from './DeleteFlashcardDialog';
import { useFlashcards } from '../providers/flashcards-provider';
import { FlashcardStack } from './FlashcardStack';

export function FlashcardTabContent() {
  const { courseId } = useParams<{ courseId: string }>();
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedFlashcard, setSelectedFlashcard] = useState<Flashcard | null>(null);

  if (!courseId) {
    return (
      <div className="flex items-center justify-center h-full p-8">
        <p className="text-muted-foreground">Course ID not found</p>
      </div>
    );
  }

  return (
    <FlashcardsProvider courseId={courseId}>
      <TabContentInner
        editOpen={editOpen}
        setEditOpen={setEditOpen}
        deleteOpen={deleteOpen}
        setDeleteOpen={setDeleteOpen}
        selectedFlashcard={selectedFlashcard}
        setSelectedFlashcard={setSelectedFlashcard}
      />
    </FlashcardsProvider>
  );
}

import type { Flashcard, UpdateFlashcardInput } from '../types';
import type { Dispatch, SetStateAction } from 'react';

interface TabContentInnerProps {
  editOpen: boolean;
  setEditOpen: (open: boolean) => void;
  deleteOpen: boolean;
  setDeleteOpen: (open: boolean) => void;
  selectedFlashcard: Flashcard | null;
  setSelectedFlashcard: Dispatch<SetStateAction<Flashcard | null>>;
}

function TabContentInner({
  editOpen,
  setEditOpen,
  deleteOpen,
  setDeleteOpen,
  selectedFlashcard,
  setSelectedFlashcard,
}: TabContentInnerProps) {
  const { updateFlashcard, deleteFlashcard } = useFlashcards();
  const handleEdit = (flashcard: Flashcard) => {
    setSelectedFlashcard(flashcard);
    setEditOpen(true);
  };
  const handleDelete = (flashcard: Flashcard) => {
    setSelectedFlashcard(flashcard);
    setDeleteOpen(true);
  };
  const handleSave = async (input: UpdateFlashcardInput) => {
    if (!selectedFlashcard) return;
    await updateFlashcard(selectedFlashcard.id, input);
  };
  const handleDeleteConfirm = async () => {
    if (!selectedFlashcard) return;
    await deleteFlashcard(selectedFlashcard.id);
  };
  return (
    <div className="h-full flex flex-col">
      <FlashcardStack onEdit={handleEdit} onDelete={handleDelete} />
      <EditFlashcardDialog
        open={editOpen}
        flashcard={selectedFlashcard}
        onClose={() => setEditOpen(false)}
        onSave={handleSave}
      />
      <DeleteFlashcardDialog
        open={deleteOpen}
        flashcard={selectedFlashcard}
        onClose={() => setDeleteOpen(false)}
        onDelete={handleDeleteConfirm}
      />
    </div>
  );
}
