import React, { useCallback, useRef, useState } from 'react';
import { ArrowLeftRight, ArrowUpDown } from 'lucide-react';

interface ResizeHandleProps {
  type: 'column' | 'row';
  onResize: (newSize: number) => void;
  currentSize: number;
  minSize: number;
  className?: string;
}

export const ResizeHandle: React.FC<ResizeHandleProps> = ({ 
  type, 
  onResize, 
  currentSize,
  minSize,
  className = ''
}) => {
  const startPosRef = useRef(0);
  const startSizeRef = useRef(0);
  const [isResizing, setIsResizing] = useState(false);
  const [previewSize, setPreviewSize] = useState(currentSize);
  const [showTooltip, setShowTooltip] = useState(false);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    startPosRef.current = type === 'column' ? e.clientX : e.clientY;
    startSizeRef.current = currentSize;
    setIsResizing(true);
    setShowTooltip(true);

    const handleMouseMove = (e: MouseEvent) => {
      const currentPos = type === 'column' ? e.clientX : e.clientY;
      const diff = currentPos - startPosRef.current;
      const newSize = Math.max(startSizeRef.current + diff, minSize);
      setPreviewSize(newSize);
      onResize(newSize);
    };

    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      setIsResizing(false);
      setTimeout(() => setShowTooltip(false), 1000);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  }, [type, onResize, currentSize, minSize]);

  const handleMouseEnter = () => {
    if (!isResizing) {
      setShowTooltip(true);
    }
  };

  const handleMouseLeave = () => {
    if (!isResizing) {
      setShowTooltip(false);
    }
  };

  const Icon = type === 'column' ? ArrowLeftRight : ArrowUpDown;

  return (
    <div
      className={`absolute ${
        type === 'column'
          ? 'cursor-col-resize right-0 top-0 w-4 h-full -mr-2'
          : 'cursor-row-resize bottom-0 left-0 h-4 w-full -mb-2'
      } z-50 group/resize transition-opacity ${className}`}
      onMouseDown={handleMouseDown}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div
        className={`absolute ${
          type === 'column'
            ? 'w-0.5 h-full left-1/2 -translate-x-1/2'
            : 'h-0.5 w-full top-1/2 -translate-y-1/2'
        } bg-gray-300 group-hover/resize:bg-blue-500 transition-colors`}
      />
      {showTooltip && (
        <div 
          className={`absolute ${
            type === 'column' 
              ? 'left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2' 
              : 'left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2'
          } bg-gray-800 text-white text-xs rounded-lg px-2 py-1 shadow-lg whitespace-nowrap`}
          style={{
            transform: `translate(${type === 'column' ? 'calc(-50% + 8px)' : '-50%'}, -50%)`,
          }}
        >
          <div className="flex items-center gap-2">
            <Icon size={12} />
            <span>{Math.round(previewSize)}px</span>
          </div>
        </div>
      )}
    </div>
  );
};