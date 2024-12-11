import { useState } from 'react';
import { CellContent, EditMode } from '../../../types/table';

interface UseTableCellProps {
  editMode: EditMode;
  onContentChange: (content: CellContent | null) => void;
  onDragOver: (e: React.DragEvent) => void;
  onDrop: () => void;
  onSelect: () => void;
}

export const useTableCell = ({
  editMode,
  onContentChange,
  onDragOver,
  onDrop,
  onSelect
}: UseTableCellProps) => {
  const [isEditing, setIsEditing] = useState(false);

  const handleImageUpload = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      onContentChange({
        type: 'image',
        content: e.target?.result as string
      });
    };
    reader.readAsDataURL(file);
  };

  const handleDragOverEvent = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onDragOver(e);
  };

  const handleDropEvent = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (editMode === 'image') {
      const file = e.dataTransfer.files[0];
      if (file && file.type.startsWith('image/')) {
        handleImageUpload(file);
        return;
      }
    }
    onDrop();
  };

  const handleClick = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('.group\\/resize')) {
      return;
    }
    
    if (editMode === 'layout' || editMode === 'image') {
      onSelect();
      return;
    }

    setIsEditing(true);
    onSelect();
  };

  const handleBlur = () => {
    setIsEditing(false);
  };

  return {
    isEditing,
    handleClick,
    handleDragOverEvent,
    handleDropEvent,
    handleImageUpload,
    handleBlur
  };
};