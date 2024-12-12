import { useState, useCallback } from 'react';
import { TableData, CellContent, DragItem } from '../types/table';

export const useTableDrag = (tableData: TableData, updateTableData: (data: TableData) => void) => {
  const [draggedItem, setDraggedItem] = useState<DragItem | null>(null);

  const handleDragStart = useCallback((rowIndex: number, colIndex: number) => {
    const content = tableData.cells[rowIndex][colIndex];
    if (content) {
      setDraggedItem({ rowIndex, colIndex, content });
    }
  }, [tableData.cells]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback((targetRowIndex: number, targetColIndex: number) => {
    if (!draggedItem) return;

    // 防止拖放到同一个位置
    if (draggedItem.rowIndex === targetRowIndex && draggedItem.colIndex === targetColIndex) {
      setDraggedItem(null);
      return;
    }

    const newCells = tableData.cells.map(row => [...row]);
    
    // 交换内容
    const sourceContent = draggedItem.content;
    const targetContent = newCells[targetRowIndex][targetColIndex];
    
    newCells[draggedItem.rowIndex][draggedItem.colIndex] = targetContent;
    newCells[targetRowIndex][targetColIndex] = sourceContent;

    updateTableData({
      ...tableData,
      cells: newCells
    });

    setDraggedItem(null);
  }, [draggedItem, tableData, updateTableData]);

  const isDragging = draggedItem !== null;

  return {
    draggedItem,
    isDragging,
    handleDragStart,
    handleDragOver,
    handleDrop
  };
};