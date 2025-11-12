import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import type { Flashcard, UpdateFlashcardInput } from '../types';

interface EditFlashcardDialogProps {
  open: boolean;
  flashcard: Flashcard | null;
  onClose: () => void;
  onSave: (input: UpdateFlashcardInput) => Promise<void>;
}

export function EditFlashcardDialog({
  open,
  flashcard,
  onClose,
  onSave,
}: EditFlashcardDialogProps) {
  const [question, setQuestion] = useState(flashcard?.question ?? '');
  const [answer, setAnswer] = useState(flashcard?.answer ?? '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Reset fields when flashcard changes
  React.useEffect(() => {
    setQuestion(flashcard?.question ?? '');
    setAnswer(flashcard?.answer ?? '');
    setError(null);
  }, [flashcard]);

  const handleSave = async () => {
    setLoading(true);
    setError(null);
    try {
      await onSave({ question, answer });
      onClose();
    } catch (e: any) {
      setError(e.message || 'Could not save changes');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Flashcard</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Input
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Enter question"
            disabled={loading}
          />
          <Input
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            placeholder="Enter answer"
            disabled={loading}
          />
          {error && <div className="text-destructive text-sm">{error}</div>}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button variant="default" onClick={handleSave} disabled={loading}>
            {loading ? <span className="animate-spin mr-2">⏳</span> : null}Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
