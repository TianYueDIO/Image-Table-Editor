import React, { useState, useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import { CellContent, TextStyle, EditMode } from '../../types/table';
import { ResizeHandle } from './ResizeHandle';

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
  colIndex
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const cellRef = useRef<HTMLDivElement>(null);

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

  const handleDrop = (e: React.DragEvent) => {
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

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onContentChange({
      type: 'text',
      content: e.target.value,
      style: content?.type === 'text' ? content.style : defaultTextStyle
    });
  };

  const handleClick = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('.group\\/resize')) {
      return;
    }
    
    if (editMode === 'image') {
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

  const handleDragStartEvent = (e: React.DragEvent) => {
    e.stopPropagation();
    onDragStart();
  };

  const handleDragOverEvent = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onDragOver(e);
  };

  const getTextClassName = (style?: TextStyle) => {
    if (!style) return '';
    
    const classes = [
      style.align === 'center' ? 'text-center' : 
      style.align === 'right' ? 'text-right' : 'text-left',
      style.bold ? 'font-bold' : '',
      style.italic ? 'italic' : '',
      style.underline ? 'underline' : ''
    ];

    return classes.filter(Boolean).join(' ');
  };

  const getTextStyle = (style?: TextStyle) => {
    if (!style?.size) return {};
    return {
      fontSize: `${style.size}px`
    };
  };

  const renderContent = () => {
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
          className={`w-full h-full p-2 border-none resize-none focus:ring-2 focus:ring-blue-500 ${getTextClassName(
            content?.type === 'text' ? content.style : defaultTextStyle
          )}`}
          style={getTextStyle(content?.type === 'text' ? content.style : defaultTextStyle)}
          value={content?.type === 'text' ? content.content : ''}
          onChange={handleTextChange}
          onBlur={handleBlur}
        />
      );
    }

    return (
      <div
        className={`w-full h-full p-2 whitespace-pre-wrap break-words cursor-text ${getTextClassName(
          content?.type === 'text' ? content.style : defaultTextStyle
        )}`}
        style={getTextStyle(content?.type === 'text' ? content.style : defaultTextStyle)}
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
      className="border border-gray-300 p-1 align-top relative group bg-white"
      style={{ 
        width: `${width}px`,
        height: `${height}px`,
        minWidth: '60px',
        minHeight: '30px'
      }}
      onDragOver={handleDragOverEvent}
      onDrop={handleDrop}
      onClick={handleClick}
    >
      {renderContent()}
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