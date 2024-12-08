import React from 'react';
import { ZoomIn, ZoomOut, Maximize2 } from 'lucide-react';

interface ZoomControlsProps {
  zoom: number;
  onZoomChange: (zoom: number) => void;
  onResetZoom: () => void;
}

export const ZoomControls: React.FC<ZoomControlsProps> = ({
  zoom,
  onZoomChange,
  onResetZoom
}) => {
  const handleZoomIn = () => {
    onZoomChange(Math.min(zoom + 0.1, 2));
  };

  const handleZoomOut = () => {
    onZoomChange(Math.max(zoom - 0.1, 0.5));
  };

  return (
    <div className="flex items-center gap-2 bg-gray-100 p-2 rounded">
      <button
        onClick={handleZoomOut}
        className="p-2 rounded hover:bg-gray-200 text-gray-700"
        title="缩小"
        disabled={zoom <= 0.5}
      >
        <ZoomOut size={20} />
      </button>
      <div className="px-2 min-w-[80px] text-center">
        {Math.round(zoom * 100)}%
      </div>
      <button
        onClick={handleZoomIn}
        className="p-2 rounded hover:bg-gray-200 text-gray-700"
        title="放大"
        disabled={zoom >= 2}
      >
        <ZoomIn size={20} />
      </button>
      <button
        onClick={onResetZoom}
        className="p-2 rounded hover:bg-gray-200 text-gray-700"
        title="重置缩放"
      >
        <Maximize2 size={20} />
      </button>
    </div>
  );
};