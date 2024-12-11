import { TableData } from '../types/table';

const DEFAULT_CELL_WIDTH = 200;
const DEFAULT_CELL_HEIGHT = 120;

export const useTableOperations = (tableData: TableData, updateTableData: (data: TableData) => void) => {
  const addRow = () => {
    const newData = {
      ...tableData,
      rows: tableData.rows + 1,
      cells: [...tableData.cells, Array(tableData.cols).fill(null)],
      rowHeights: [...tableData.rowHeights, tableData.defaultCellHeight]
    };
    updateTableData(newData);
  };

  const addColumn = () => {
    const newData = {
      ...tableData,
      cols: tableData.cols + 1,
      cells: tableData.cells.map(row => [...row, null]),
      colWidths: [...tableData.colWidths, tableData.defaultCellWidth]
    };
    updateTableData(newData);
  };

  const removeLastRow = () => {
    if (tableData.rows <= 1) return;
    const newData = {
      ...tableData,
      rows: tableData.rows - 1,
      cells: tableData.cells.slice(0, -1),
      rowHeights: tableData.rowHeights.slice(0, -1)
    };
    updateTableData(newData);
  };

  const removeLastColumn = () => {
    if (tableData.cols <= 1) return;
    const newData = {
      ...tableData,
      cols: tableData.cols - 1,
      cells: tableData.cells.map(row => row.slice(0, -1)),
      colWidths: tableData.colWidths.slice(0, -1)
    };
    updateTableData(newData);
  };

  const resetTableSize = () => {
    const newData = {
      ...tableData,
      rowHeights: Array(tableData.rows).fill(DEFAULT_CELL_HEIGHT),
      colWidths: Array(tableData.cols).fill(DEFAULT_CELL_WIDTH),
      defaultCellWidth: DEFAULT_CELL_WIDTH,
      defaultCellHeight: DEFAULT_CELL_HEIGHT
    };
    updateTableData(newData);
  };

  const clearAllContent = () => {
    const newData = {
      ...tableData,
      cells: Array(tableData.rows).fill(null).map(() => Array(tableData.cols).fill(null))
    };
    updateTableData(newData);
  };

  return {
    addRow,
    addColumn,
    removeLastRow,
    removeLastColumn,
    resetTableSize,
    clearAllContent
  };
};