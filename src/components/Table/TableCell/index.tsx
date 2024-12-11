import React from 'react';
import { CellContent, TextStyle, EditMode } from '../../../types/table';
import { useTableCell } from './useTableCell';
import { CellContent as CellContentComponent } from './CellContent';
import { ResizeHandles } from './ResizeHandles';

interface TableCellProps {
  content?: CellContent | null;
  onContentChange: (content: CellContent | null) => void;
  editMode: EditMode;
  defaultTextStyle: TextStyle;
  onDragStart: () => void;
  onDragOver: (e: React.DragEvent) => void;
  onDrop: () => void;
  onSelect: () => void;
  width: number;
  height: number;
  onWidthChange: (newWidth: number) => void;
  onHeightChange: (newHeight: number) => void;
  rowIndex: number;
  colIndex: number;
  isSelected: boolean;
}

export const TableCell: React.FC<TableCellProps> = ({
  content,
  onContentChange,
  editMode,
  defaultTextStyle,
  onDragStart,
  onDragOver,
  onDrop,
  onSelect,
  width,
  height,
  onWidthChange,
  onHeightChange,
  isSelected
}) => {
  const {
    isEditing,
    handleClick,
    handleDragOverEvent,
    handleDropEvent,
    handleImageUpload,
    handleBlur
  } = useTableCell({
    editMode,
    onContentChange,
    onDragOver,
    onDrop,
    onSelect
  });

  return (
    <td 
      className={`border border-gray-300 p-1 align-top relative group bg-white ${
        isSelected ? 'ring-2 ring-blue-500' : ''
      } ${editMode === 'layout' ? 'cursor-pointer' : ''}`}
      style={{ 
        width: `${width}px`,
        height: `${height}px`,
        minWidth: '60px',
        minHeight: '30px'
      }}
      onDragOver={handleDragOverEvent}
      onDrop={handleDropEvent}
      onClick={handleClick}
    >
      <CellContentComponent
        content={content}
        editMode={editMode}
        isEditing={isEditing}
        onContentChange={onContentChange}
        defaultTextStyle={defaultTextStyle}
        onDragStart={onDragStart}
        onBlur={handleBlur}
        handleImageUpload={handleImageUpload}
        width={width}
        height={height}
      />
      
      {editMode === 'layout' && (
        <ResizeHandles
          width={width}
          height={height}
          onWidthChange={onWidthChange}
          onHeightChange={onHeightChange}
        />
      )}
    </td>
  );
};