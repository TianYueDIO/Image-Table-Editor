import React from 'react';
import { X } from 'lucide-react';
import { CellContent as CellContentType, EditMode, TextStyle } from '../../../types/table';
import { TextContent } from './TextContent';
import { ImageContent } from './ImageContent';
import { LayoutContent } from './LayoutContent';

interface CellContentProps {
  content: CellContentType | null | undefined;
  editMode: EditMode;
  isEditing: boolean;
  onContentChange: (content: CellContentType | null) => void;
  defaultTextStyle: TextStyle;
  onDragStart: () => void;
  onBlur: () => void;
  handleImageUpload: (file: File) => void;
  width: number;
  height: number;
}

export const CellContent: React.FC<CellContentProps> = ({
  content,
  editMode,
  isEditing,
  onContentChange,
  defaultTextStyle,
  onDragStart,
  onBlur,
  handleImageUpload,
  width,
  height
}) => {
  if (editMode === 'layout') {
    return <LayoutContent width={width} height={height} />;
  }

  if (content?.type === 'image') {
    return (
      <ImageContent
        content={content}
        onContentChange={onContentChange}
        onDragStart={onDragStart}
      />
    );
  }

  if (editMode === 'image' && !content) {
    return (
      <label className="flex items-center justify-center w-full h-full cursor-pointer hover:bg-gray-50">
        <input
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleImageUpload(file);
          }}
        />
      </label>
    );
  }

  return (
    <TextContent
      content={content}
      isEditing={isEditing}
      onContentChange={onContentChange}
      defaultTextStyle={defaultTextStyle}
      onDragStart={onDragStart}
      onBlur={onBlur}
    />
  );
};