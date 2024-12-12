import React, { useState, useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import { CellContent, TextStyle, EditMode } from '../../types/table';
import { ResizeHandle } from './ResizeHandle';
import { DraggableCell } from './DraggableCell';
import { DroppableCell } from './DroppableCell';

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
  const [isEditing, setIsEditing] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

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
    if (textareaRef.current && textareaRef.current.value === '') {
      onContentChange(null);
    }
  };

  const getTextStyle = () => {
    if (content?.type === 'text' && content.style) {
      return content.style;
    }
    return defaultTextStyle;
  };

  const getTextStyleClasses = (style: TextStyle) => {
    const classes = ['whitespace-pre-wrap', 'break-words'];
    
    if (style.align === 'center') classes.push('text-center');
    if (style.align === 'right') classes.push('text-right');
    if (style.bold) classes.push('font-bold');
    if (style.italic) classes.push('italic');
    if (style.underline) classes.push('underline');
    
    return classes.join(' ');
  };

  const renderContent = () => {
    const innerContent = (() => {
      if (editMode === 'layout') {
        return (
          <div className="w-full h-full flex items-center justify-center text-gray-500 select-none">
            {width} × {height}
          </div>
        );
      }

      if (content?.type === 'image') {
        return (
          <div className="relative group h-full">
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

      const textStyle = getTextStyle();

      if (isEditing) {
        return (
          <textarea
            ref={textareaRef}
            className="w-full h-full p-2 border-none resize-none focus:ring-2 focus:ring-blue-500"
            style={{
              fontSize: `${textStyle.size || 16}px`,
              textAlign: textStyle.align || 'left',
              fontWeight: textStyle.bold ? 'bold' : 'normal',
              fontStyle: textStyle.italic ? 'italic' : 'normal',
              textDecoration: textStyle.underline ? 'underline' : 'none'
            }}
            value={content?.type === 'text' ? content.content : ''}
            onChange={(e) => onContentChange({
              type: 'text',
              content: e.target.value,
              style: textStyle
            })}
            onBlur={handleBlur}
          />
        );
      }

      return (
        <div
          className={`w-full h-full p-2 cursor-text ${getTextStyleClasses(textStyle)}`}
          style={{
            fontSize: `${textStyle.size || 16}px`
          }}
          onClick={handleClick}
        >
          {content?.type === 'text' ? content.content : ''}
        </div>
      );
    })();

    if (content && !isEditing) {
      return (
        <DraggableCell content={content} onDragStart={onDragStart}>
          {innerContent}
        </DraggableCell>
      );
    }

    return innerContent;
  };

  return (
    <td 
      className={`border border-gray-300 p-1 align-top relative group bg-white ${
        isSelected ? 'ring-2 ring-blue-500' : ''
      }`}
      style={{ 
        width: `${width}px`,
        height: `${height}px`,
        minWidth: '60px',
        minHeight: '30px'
      }}
      onClick={handleClick}
    >
      <DroppableCell
        onDragOver={onDragOver}
        onDrop={onDrop}
        editMode={editMode}
      >
        {renderContent()}
      </DroppableCell>

      <ResizeHandle
        type="column"
        onResize={onWidthChange}
        currentSize={width}
        minSize={60}
        className="opacity-0 group-hover:opacity-100"
      />
      <ResizeHandle
        type="row"
        onResize={onHeightChange}
        currentSize={height}
        minSize={30}
        className="opacity-0 group-hover:opacity-100"
      />
    </td>
  );
};