import { useState } from 'react';
import { TableData, CellContent, DragItem } from '../types/table';

export const useTableDrag = (tableData: TableData, updateTableData: (data: TableData) => void) => {
  const [draggedItem, setDraggedItem] = useState<DragItem | null>(null);

  const handleDragStart = (rowIndex: number, colIndex: number) => {
    const content = tableData.cells[rowIndex][colIndex];
    if (content) {
      setDraggedItem({ rowIndex, colIndex, content });
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (rowIndex: number, colIndex: number) => {
    if (!draggedItem) return;

    const newCells = tableData.cells.map(row => [...row]);
    const dragContent = draggedItem.content;
    const dropContent = newCells[rowIndex][colIndex];

    newCells[draggedItem.rowIndex][draggedItem.colIndex] = dropContent;
    newCells[rowIndex][colIndex] = dragContent;

    updateTableData({
      ...tableData,
      cells: newCells
    });

    setDraggedItem(null);
  };

  return {
    draggedItem,
    handleDragStart,
    handleDragOver,
    handleDrop
  };
};