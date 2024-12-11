import { useState, useEffect } from 'react';

interface ContextMenuState {
  isVisible: boolean;
  position: { x: number; y: number };
}

export const useContextMenu = () => {
  const [contextMenu, setContextMenu] = useState<ContextMenuState>({
    isVisible: false,
    position: { x: 0, y: 0 }
  });

  useEffect(() => {
    const handleClickOutside = () => {
      setContextMenu(prev => ({ ...prev, isVisible: false }));
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    setContextMenu({
      isVisible: true,
      position: { x: e.clientX, y: e.clientY }
    });
  };

  return {
    contextMenu,
    handleContextMenu,
    hideContextMenu: () => setContextMenu(prev => ({ ...prev, isVisible: false }))
  };
};