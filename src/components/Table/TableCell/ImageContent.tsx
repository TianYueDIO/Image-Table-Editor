import React from 'react';
import { X } from 'lucide-react';
import { CellContent } from '../../../types/table';

interface ImageContentProps {
  content: CellContent;
  onContentChange: (content: CellContent | null) => void;
  onDragStart: () => void;
}

export const ImageContent: React.FC<ImageContentProps> = ({
  content,
  onContentChange,
  onDragStart
}) => {
  return (
    <div 
      className="relative group h-full"
      draggable
      onDragStart={onDragStart}
    >
      <img
        src={content.content}
        alt="Cell content"
        className="w-full h-full object-contain"
        draggable={false}
      />
      <button
        onClick={() => onContentChange(null)}
        className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
      >
        <X size={16} />
      </button>
    </div>
  );
};