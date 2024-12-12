import React, { useEffect, useRef } from 'react';
import { Copy, Clipboard } from 'lucide-react';

interface TableContextMenuProps {
  isVisible: boolean;
  position: { x: number; y: number };
  onCopy: () => void;
  onPaste: () => void;
  hasCopiedSize: boolean;
}

export const TableContextMenu: React.FC<TableContextMenuProps> = ({
  isVisible,
  position,
  onCopy,
  onPaste,
  hasCopiedSize
}) => {
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isVisible && menuRef.current) {
      const menu = menuRef.current;
      const rect = menu.getBoundingClientRect();
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;

      let { x, y } = position;

      // 确保菜单不会超出视口右侧
      if (x + rect.width > viewportWidth) {
        x = x - rect.width;
      }

      // 确保菜单不会超出视口底部
      if (y + rect.height > viewportHeight) {
        y = y - rect.height;
      }

      menu.style.left = `${x}px`;
      menu.style.top = `${y}px`;
    }
  }, [isVisible, position]);

  if (!isVisible) return null;

  return (
    <div
      ref={menuRef}
      className="fixed bg-white rounded-lg shadow-xl border border-gray-200 py-1 z-50 min-w-[140px]"
      style={{
        left: position.x,
        top: position.y
      }}
    >
      <button
        onClick={onCopy}
        className="w-full px-3 py-1.5 text-sm text-left hover:bg-gray-100 flex items-center gap-2"
      >
        <Copy size={14} />
        <span>复制尺寸</span>
      </button>
      <button
        onClick={onPaste}
        disabled={!hasCopiedSize}
        className={`w-full px-3 py-1.5 text-sm text-left flex items-center gap-2 ${
          hasCopiedSize ? 'hover:bg-gray-100' : 'text-gray-400 cursor-not-allowed'
        }`}
      >
        <Clipboard size={14} />
        <span>粘贴尺寸</span>
      </button>
    </div>
  );
};