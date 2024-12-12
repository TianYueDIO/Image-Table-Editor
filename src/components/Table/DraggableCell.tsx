import React from 'react';
import { CellContent } from '../../types/table';

interface DraggableCellProps {
  content: CellContent;
  onDragStart: () => void;
  children: React.ReactNode;
}

export const DraggableCell: React.FC<DraggableCellProps> = ({
  content,
  onDragStart,
  children
}) => {
  const handleDragStart = (e: React.DragEvent) => {
    e.stopPropagation();
    onDragStart();
  };

  return (
    <div 
      className="relative h-full"
      draggable={true}
      onDragStart={handleDragStart}
    >
      {children}
    </div>
  );
};