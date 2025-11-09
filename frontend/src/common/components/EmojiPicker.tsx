import * as React from 'react';
import { EmojiPicker } from 'frimousse';
import { Popover, PopoverContent, PopoverTrigger } from '../../components/ui/popover';
import { Button } from '../../components/ui/button';

export interface EmojiPickerProps {
  value?: string;
  onChange: (emoji: string) => void;
  trigger?: React.ReactNode;
}

/**
 * EmojiPicker component using Frimousse by Liveblocks inside Shadcn UI Popover
 *
 * @example
 * <EmojiPicker
 *   value="😀"
 *   onChange={(emoji) => console.log(emoji)}
 * />
 */
export function EmojiPickerComponent({ value, onChange, trigger }: EmojiPickerProps) {
  const [open, setOpen] = React.useState(false);

  // Frimousse uses onEmojiSelect prop
  const handleEmojiSelect = (emoji: any) => {
    if (emoji && emoji.emoji) {
      onChange(emoji.emoji);
      setOpen(false);
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        {trigger || (
          <Button variant="outline" size="icon" type="button">
            {value || '😀'}
          </Button>
        )}
      </PopoverTrigger>
      <PopoverContent className="w-[350px] p-4" align="start">
        <EmojiPicker.Root onEmojiSelect={handleEmojiSelect}>
          <EmojiPicker.Search className="mb-2" />
          <EmojiPicker.Viewport>
            <EmojiPicker.Loading>Loading…</EmojiPicker.Loading>
            <EmojiPicker.Empty>No emoji found.</EmojiPicker.Empty>
            <EmojiPicker.List />
          </EmojiPicker.Viewport>
        </EmojiPicker.Root>
      </PopoverContent>
    </Popover>
  );
}

export { EmojiPickerComponent as EmojiPicker };
