import React from 'react';
import { ResizeHandle } from '../ResizeHandle';

interface ResizeHandlesProps {
  width: number;
  height: number;
  onWidthChange: (newWidth: number) => void;
  onHeightChange: (newHeight: number) => void;
  showHandles?: boolean;
}

export const ResizeHandles: React.FC<ResizeHandlesProps> = ({
  width,
  height,
  onWidthChange,
  onHeightChange,
  showHandles = true
}) => {
  if (!showHandles) return null;

  return (
    <>
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
    </>
  );
};