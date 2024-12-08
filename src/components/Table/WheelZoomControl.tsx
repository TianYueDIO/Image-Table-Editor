import React, { useCallback, useEffect } from 'react';

interface WheelZoomControlProps {
  zoom: number;
  onZoomChange: (zoom: number) => void;
  isZoomMode: boolean;
  children: React.ReactNode;
}

export const WheelZoomControl: React.FC<WheelZoomControlProps> = ({
  zoom,
  onZoomChange,
  isZoomMode,
  children
}) => {
  const handleWheel = useCallback((e: WheelEvent) => {
    if (!isZoomMode) return;
    e.preventDefault();
    
    const delta = -Math.sign(e.deltaY) * 0.1;
    const newZoom = Math.max(0.5, Math.min(2, zoom + delta));
    onZoomChange(newZoom);
  }, [zoom, isZoomMode, onZoomChange]);

  useEffect(() => {
    const element = document.getElementById('zoom-container');
    if (element) {
      element.addEventListener('wheel', handleWheel, { passive: false });
      return () => element.removeEventListener('wheel', handleWheel);
    }
  }, [handleWheel]);

  return (
    <div className="relative overflow-auto">
      <div
        id="zoom-container"
        className={`inline-block transition-transform duration-200 ${isZoomMode ? 'cursor-zoom-in' : ''}`}
        style={{
          transform: `scale(${zoom})`,
          transformOrigin: 'top left'
        }}
      >
        {children}
      </div>
    </div>
  );
};