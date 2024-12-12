import { useCallback } from 'react';
import { TableData } from '../types/table';

export const useTableResize = (tableData: TableData, updateTableData: (data: TableData) => void) => {
  const handleColumnResize = useCallback((colIndex: number, newWidth: number) => {
    if (newWidth >= 60) {
      const newData = {
        ...tableData,
        colWidths: tableData.colWidths.map((width, i) => 
          i === colIndex ? newWidth : width
        )
      };
      updateTableData(newData);
    }
  }, [tableData, updateTableData]);

  const handleRowResize = useCallback((rowIndex: number, newHeight: number) => {
    if (newHeight >= 30) {
      const newData = {
        ...tableData,
        rowHeights: tableData.rowHeights.map((height, i) => 
          i === rowIndex ? newHeight : height
        )
      };
      updateTableData(newData);
    }
  }, [tableData, updateTableData]);

  const resetTableSize = useCallback(() => {
    const newData = {
      ...tableData,
      rowHeights: Array(tableData.rows).fill(tableData.defaultCellHeight),
      colWidths: Array(tableData.cols).fill(tableData.defaultCellWidth)
    };
    updateTableData(newData);
  }, [tableData, updateTableData]);

  return {
    handleColumnResize,
    handleRowResize,
    resetTableSize
  };
};