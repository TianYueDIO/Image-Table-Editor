import React from 'react';
import { TableSizeConfig } from '../../types/table';

interface TableSizePreviewProps {
  sizeConfig: TableSizeConfig;
  isVisible: boolean;
  position: { x: number; y: number };
}

export const TableSizePreview: React.FC<TableSizePreviewProps> = ({
  sizeConfig,
  isVisible,
  position
}) => {
  if (!isVisible) return null;

  const maxPreviewSize = 200;
  const maxOriginalSize = Math.max(
    ...sizeConfig.colWidths,
    ...sizeConfig.rowHeights
  );
  const scale = maxPreviewSize / maxOriginalSize;

  return (
    <div
      className="fixed bg-white rounded-lg shadow-xl border border-gray-200 p-4 z-50"
      style={{
        left: position.x + 20,
        top: position.y,
        transform: `scale(${scale})`,
        transformOrigin: 'top left'
      }}
    >
      <div className="grid gap-1" style={{
        gridTemplateColumns: sizeConfig.colWidths.map(w => `${w}px`).join(' '),
        gridTemplateRows: sizeConfig.rowHeights.map(h => `${h}px`).join(' ')
      }}>
        {sizeConfig.rowHeights.map((_, rowIndex) => (
          sizeConfig.colWidths.map((_, colIndex) => (
            <div
              key={`${rowIndex}-${colIndex}`}
              className="bg-blue-100 border border-blue-200 rounded"
            />
          ))
        ))}
      </div>
      <div className="mt-2 text-sm text-gray-600 whitespace-nowrap">
        {sizeConfig.colWidths.length}列 × {sizeConfig.rowHeights.length}行
      </div>
    </div>
  );
};