import { useState } from 'react';

const DEFAULT_ZOOM = 1;

export const useTableZoom = () => {
  const [zoom, setZoom] = useState(DEFAULT_ZOOM);
  const [isZoomMode, setIsZoomMode] = useState(false);

  const handleResetZoom = () => {
    setZoom(DEFAULT_ZOOM);
  };

  const toggleZoomMode = () => {
    setIsZoomMode(!isZoomMode);
  };

  return {
    zoom,
    setZoom,
    isZoomMode,
    toggleZoomMode,
    handleResetZoom
  };
};