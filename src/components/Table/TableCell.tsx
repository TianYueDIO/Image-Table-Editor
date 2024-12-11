import React, { useState, useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import { CellContent, TextStyle, EditMode } from '../../types/table';
import { ResizeHandle } from './ResizeHandle';
import { TableContextMenu } from './TableContextMenu';
import { useContextMenu } from '../../hooks/useContextMenu';

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
  onCopySize?: () => void;
  onPasteSize?: () => void;
  hasCopiedSize?: boolean;
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
  rowIndex,
  colIndex,
  isSelected,
  onCopySize,
  onPasteSize,
  hasCopiedSize
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const cellRef = useRef<HTMLDivElement>(null);
  const { contextMenu, handleContextMenu, hideContextMenu } = useContextMenu();

  useEffect(() => {
    if (isEditing && textareaRef.current) {
      textareaRef.current.focus();
      const length = textareaRef.current.value.length;
      textareaRef.current.setSelectionRange(length, length);
    }
  }, [isEditing]);

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
    
    if (editMode === 'image' && !content) {
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
    
    if (editMode === 'layout') {
      onSelect();
      return;
    }

    if (editMode === 'image') {
      onSelect();
      return;
    }

    setIsEditing(true);
    onSelect();
  };

  const handleCellContextMenu = (e: React.MouseEvent) => {
    if (editMode === 'layout') {
      handleContextMenu(e);
      onSelect();
    }
  };

  const handleCopy = () => {
    if (onCopySize) {
      onCopySize();
      hideContextMenu();
    }
  };

  const handlePaste = () => {
    if (onPasteSize && hasCopiedSize) {
      onPasteSize();
      hideContextMenu();
    }
  };

  const handleBlur = () => {
    setIsEditing(false);
    if (textareaRef.current && textareaRef.current.value === '') {
      onContentChange(null);
    }
  };

  const handleDragStartEvent = (e: React.DragEvent) => {
    e.stopPropagation();
    onDragStart();
  };

  const renderContent = () => {
    if (editMode === 'layout') {
      return (
        <div className="w-full h-full flex items-center justify-center text-gray-500 select-none">
          {width} × {height}
        </div>
      );
    }

    if (content?.type === 'image') {
      return (
        <div 
          className="relative group h-full"
          draggable
          onDragStart={handleDragStartEvent}
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
          onBlur={handleBlur}
        />
      );
    }

    return (
      <div
        className="w-full h-full p-2 whitespace-pre-wrap break-words cursor-text"
        onClick={handleClick}
        draggable={!!content}
        onDragStart={content ? handleDragStartEvent : undefined}
      >
        {content?.type === 'text' ? content.content : ''}
      </div>
    );
  };

  return (
    <td 
      ref={cellRef}
      className={`border border-gray-300 p-1 align-top relative group bg-white ${
        isSelected ? 'ring-2 ring-blue-500' : ''
      } ${editMode === 'layout' ? 'cursor-pointer' : ''}`}
      style={{ 
        width: `${width}px`,
        height: `${height}px`,
        minWidth: '60px',
        minHeight: '30px'
      }}
      onContextMenu={handleCellContextMenu}
      onDragOver={handleDragOverEvent}
      onDrop={handleDropEvent}
      onClick={handleClick}
    >
      {renderContent()}
      <ResizeHandle
        type="column"
        onResize={onWidthChange}
        currentSize={width}
        minSize={60}
        className={`opacity-0 ${editMode === 'layout' ? 'group-hover:opacity-100' : ''}`}
      />
      <ResizeHandle
        type="row"
        onResize={onHeightChange}
        currentSize={height}
        minSize={30}
        className={`opacity-0 ${editMode === 'layout' ? 'group-hover:opacity-100' : ''}`}
      />
      {editMode === 'layout' && (
        <TableContextMenu
          isVisible={contextMenu.isVisible}
          position={contextMenu.position}
          onCopy={handleCopy}
          onPaste={handlePaste}
          hasCopiedSize={!!hasCopiedSize}
        />
      )}
    </td>
  );
};