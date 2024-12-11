import React, { useRef } from 'react';
import { CellContent, TextStyle } from '../../../types/table';

interface TextContentProps {
  content: CellContent | null | undefined;
  isEditing: boolean;
  onContentChange: (content: CellContent | null) => void;
  defaultTextStyle: TextStyle;
  onDragStart: () => void;
  onBlur: () => void;
}

export const TextContent: React.FC<TextContentProps> = ({
  content,
  isEditing,
  onContentChange,
  defaultTextStyle,
  onDragStart,
  onBlur
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  if (isEditing) {
    return (
      <textarea
        ref={textareaRef}
        className="w-full h-full p-2 border-none resize-none focus:ring-2 focus:ring-blue-500"
        value={content?.type === 'text' ? content.content : ''}
        onChange={(e) => onContentChange({
          type: 'text',
          content: e.target.value,
          style: content?.type === 'text' ? content.style : defaultTextStyle
        })}
        onBlur={onBlur}
      />
    );
  }

  return (
    <div
      className="w-full h-full p-2 whitespace-pre-wrap break-words cursor-text"
      draggable={!!content}
      onDragStart={content ? onDragStart : undefined}
    >
      {content?.type === 'text' ? content.content : ''}
    </div>
  );
};