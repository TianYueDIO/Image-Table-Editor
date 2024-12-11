import { useState } from 'react';
import { TableData, CellContent, TextStyle, EditMode, SelectedCell } from '../types/table';

const DEFAULT_FONT_SIZE = 16;

export const useTableContent = (tableData: TableData, updateTableData: (data: TableData) => void) => {
  const [editMode, setEditMode] = useState<EditMode>('text');
  const [selectedCell, setSelectedCell] = useState<SelectedCell | null>(null);
  const [textStyle, setTextStyle] = useState<TextStyle>({
    align: 'left',
    size: DEFAULT_FONT_SIZE,
    bold: false,
    italic: false,
    underline: false
  });

  const handleContentChange = (rowIndex: number, colIndex: number, content: CellContent | null) => {
    const newCells = tableData.cells.map((row, i) =>
      row.map((cell, j) => (i === rowIndex && j === colIndex ? content : cell))
    );
    updateTableData({
      ...tableData,
      cells: newCells
    });
  };

  const handleCellSelect = (rowIndex: number, colIndex: number) => {
    if (editMode === 'layout') {
      // 在布局模式下，点击同一个单元格会取消选择
      if (selectedCell?.row === rowIndex && selectedCell?.col === colIndex) {
        setSelectedCell(null);
      } else {
        setSelectedCell({ row: rowIndex, col: colIndex });
      }
    } else {
      setSelectedCell({ row: rowIndex, col: colIndex });
    }
  };

  const handleTextStyleChange = (newStyle: TextStyle) => {
    setTextStyle(newStyle);
    if (selectedCell) {
      const currentContent = tableData.cells[selectedCell.row][selectedCell.col];
      if (currentContent && currentContent.type === 'text') {
        handleContentChange(selectedCell.row, selectedCell.col, {
          ...currentContent,
          style: newStyle
        });
      }
    }
  };

  return {
    editMode,
    setEditMode,
    selectedCell,
    textStyle,
    handleContentChange,
    handleCellSelect,
    handleTextStyleChange
  };
};