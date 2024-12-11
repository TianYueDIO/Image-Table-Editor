import React from 'react';
import { TableCell } from './TableCell';
import { CellContent, EditMode, TextStyle } from '../../types/table';

interface TableRowProps {
  row: (CellContent | null)[];
  rowIndex: number;
  showDeleteButton: boolean;
  onContentChange: (colIndex: number, content: CellContent | null) => void;
  onRemoveRow: () => void;
  editMode: EditMode;
  defaultTextStyle: TextStyle;
  onDragStart: (rowIndex: number, colIndex: number) => void;
  onDragOver: (e: React.DragEvent) => void;
  onDrop: (rowIndex: number, colIndex: number) => void;
  onCellSelect: (colIndex: number) => void;
  rowHeight: number;
  colWidths: number[];
  onRowResize: (rowIndex: number, newHeight: number) => void;
  onColumnResize: (colIndex: number, newWidth: number) => void;
  selectedCell?: { row: number; col: number } | null;
  onCopySize?: () => void;
  onPasteSize?: () => void;
  hasCopiedSize?: boolean;
}

export const TableRow: React.FC<TableRowProps> = ({
  row,
  rowIndex,
  showDeleteButton,
  onContentChange,
  onRemoveRow,
  editMode,
  defaultTextStyle,
  onDragStart,
  onDragOver,
  onDrop,
  onCellSelect,
  rowHeight,
  colWidths,
  onRowResize,
  onColumnResize,
  selectedCell,
  onCopySize,
  onPasteSize,
  hasCopiedSize
}) => {
  return (
    <tr style={{ height: `${rowHeight}px` }}>
      {row.map((cell, colIndex) => (
        <TableCell
          key={`${rowIndex}-${colIndex}`}
          content={cell}
          onContentChange={(content) => onContentChange(colIndex, content)}
          editMode={editMode}
          defaultTextStyle={defaultTextStyle}
          onDragStart={() => onDragStart(rowIndex, colIndex)}
          onDragOver={onDragOver}
          onDrop={() => onDrop(rowIndex, colIndex)}
          onSelect={() => onCellSelect(colIndex)}
          width={colWidths[colIndex]}
          height={rowHeight}
          onWidthChange={(newWidth) => onColumnResize(colIndex, newWidth)}
          onHeightChange={(newHeight) => onRowResize(rowIndex, newHeight)}
          rowIndex={rowIndex}
          colIndex={colIndex}
          isSelected={selectedCell?.row === rowIndex && selectedCell?.col === colIndex}
          onCopySize={onCopySize}
          onPasteSize={onPasteSize}
          hasCopiedSize={hasCopiedSize}
        />
      ))}
    </tr>
  );
};