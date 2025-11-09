import * as React from 'react';
import EmojiPicker from 'emoji-picker-react';
import type { EmojiClickData } from 'emoji-picker-react';
import { Popover, PopoverContent, PopoverTrigger } from '../../components/ui/popover';
import { Button } from '../../components/ui/button';

export interface EmojiPickerProps {
  value?: string;
  onChange: (emoji: string) => void;
  trigger?: React.ReactNode;
}

/**
 * EmojiPicker component using emoji-picker-react
 * Displays a button that opens an emoji picker popover
 *
 * @example
 * <EmojiPicker
 *   value="😀"
 *   onChange={(emoji) => console.log(emoji)}
 * />
 */
export function EmojiPickerComponent({ value, onChange, trigger }: EmojiPickerProps) {
  const [open, setOpen] = React.useState(false);

  const handleEmojiClick = (emojiData: EmojiClickData) => {
    onChange(emojiData.emoji);
    setOpen(false);
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
      <PopoverContent className="w-auto p-0" align="start">
        <EmojiPicker
          onEmojiClick={handleEmojiClick}
          width={350}
          height={400}
          searchDisabled={false}
          previewConfig={{ showPreview: false }}
        />
      </PopoverContent>
    </Popover>
  );
}

export { EmojiPickerComponent as EmojiPicker };
