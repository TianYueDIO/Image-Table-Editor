import React from 'react';
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
  if (!isVisible) return null;

  return (
    <div
      className="fixed bg-white rounded-lg shadow-xl border border-gray-200 py-1 z-50"
      style={{
        left: position.x,
        top: position.y
      }}
    >
      <button
        onClick={onCopy}
        className="w-full px-4 py-2 text-sm text-left hover:bg-gray-100 flex items-center gap-2"
      >
        <Copy size={16} />
        复制表格尺寸
      </button>
      <button
        onClick={onPaste}
        disabled={!hasCopiedSize}
        className={`w-full px-4 py-2 text-sm text-left flex items-center gap-2 ${
          hasCopiedSize ? 'hover:bg-gray-100' : 'text-gray-400 cursor-not-allowed'
        }`}
      >
        <Clipboard size={16} />
        粘贴表格尺寸
      </button>
    </div>
  );
};