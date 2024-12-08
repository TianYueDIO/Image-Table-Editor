import React, { useState, useCallback } from 'react';
import { ArrowLeftRight } from 'lucide-react';

interface TableResizeHeaderProps {
  colWidths: number[];
  onColumnResize: (colIndex: number, newWidth: number) => void;
}

export const TableResizeHeader: React.FC<TableResizeHeaderProps> = ({
  colWidths,
  onColumnResize
}) => {
  const [resizingCol, setResizingCol] = useState<number | null>(null);
  const [startX, setStartX] = useState(0);
  const [startWidth, setStartWidth] = useState(0);
  const [showMinSizeHint, setShowMinSizeHint] = useState(false);
  
  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (resizingCol === null) return;
    const diff = e.clientX - startX;
    const newWidth = startWidth + diff;
    
    if (newWidth < 60) {
      setShowMinSizeHint(true);
      setTimeout(() => setShowMinSizeHint(false), 2000);
      return;
    }
    
    onColumnResize(resizingCol, newWidth);
  }, [resizingCol, startX, startWidth, onColumnResize]);

  const handleMouseUp = useCallback(() => {
    setResizingCol(null);
    setShowMinSizeHint(false);
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
  }, [handleMouseMove]);

  const handleResizeStart = useCallback((e: React.MouseEvent, colIndex: number) => {
    e.preventDefault();
    setResizingCol(colIndex);
    setStartX(e.clientX);
    setStartWidth(colWidths[colIndex]);

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  }, [colWidths, handleMouseMove, handleMouseUp]);

  return (
    <div className="flex select-none relative">
      <div className="w-8" />
      {colWidths.map((width, index) => (
        <div
          key={index}
          className={`relative border-r border-gray-300 last:border-r-0 ${
            resizingCol === index ? 'bg-blue-50' : ''
          }`}
          style={{ width: `${width}px` }}
        >
          <div
            className="absolute right-0 top-0 bottom-0 w-6 -mr-3 cursor-col-resize z-10 group"
            onMouseDown={(e) => handleResizeStart(e, index)}
          >
            <div className="absolute inset-y-0 left-1/2 w-px bg-gray-300 group-hover:bg-blue-500 group-hover:w-0.5" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 bg-blue-500 rounded-lg p-2 shadow-lg transition-all duration-200 transform scale-90 group-hover:scale-100">
              <ArrowLeftRight size={20} className="text-white" />
            </div>
          </div>
        </div>
      ))}
      {showMinSizeHint && (
        <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 px-3 py-1.5 bg-gray-800 text-white text-sm rounded-md shadow-lg z-50">
          最小宽度为 60px
        </div>
      )}
    </div>
  );
};