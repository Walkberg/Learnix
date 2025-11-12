import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import type { Flashcard } from '../types';

interface DeleteFlashcardDialogProps {
  open: boolean;
  flashcard: Flashcard | null;
  onClose: () => void;
  onDelete: () => Promise<void>;
}

export function DeleteFlashcardDialog({
  open,
  flashcard,
  onClose,
  onDelete,
}: DeleteFlashcardDialogProps) {
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const handleDelete = async () => {
    setLoading(true);
    setError(null);
    try {
      await onDelete();
      onClose();
    } catch (e: any) {
      setError(e.message || 'Could not delete flashcard');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Flashcard</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <p>Are you sure you want to delete this flashcard?</p>
          <div className="bg-muted rounded p-3 text-sm">
            <strong>Question:</strong> {flashcard?.question}
            <br />
            <strong>Answer:</strong> {flashcard?.answer}
          </div>
          {error && <div className="text-destructive text-sm">{error}</div>}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={handleDelete} disabled={loading}>
            {loading ? <span className="animate-spin mr-2">⏳</span> : null}Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
