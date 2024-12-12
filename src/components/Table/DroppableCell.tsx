import React from 'react';
import { EditMode } from '../../types/table';

interface DroppableCellProps {
  onDragOver: (e: React.DragEvent) => void;
  onDrop: () => void;
  editMode: EditMode;
  children: React.ReactNode;
}

export const DroppableCell: React.FC<DroppableCellProps> = ({
  onDragOver,
  onDrop,
  editMode,
  children
}) => {
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onDragOver(e);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onDrop();
  };

  return (
    <div 
      className={`w-full h-full ${editMode === 'layout' ? 'cursor-move' : ''}`}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      {children}
    </div>
  );
};