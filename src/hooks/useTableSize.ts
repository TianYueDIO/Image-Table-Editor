import { useCallback } from 'react';
import { TableData } from '../types/table';

export const useTableSize = (tableData: TableData, updateTableData: (data: TableData) => void) => {
  const handleColumnResize = useCallback((colIndex: number, newWidth: number) => {
    if (newWidth >= 60) {
      const newData = {
        ...tableData,
        colWidths: tableData.colWidths.map((width, i) => 
          i === colIndex ? newWidth : width
        ),
        defaultCellWidth: newWidth
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
        ),
        defaultCellHeight: newHeight
      };
      updateTableData(newData);
    }
  }, [tableData, updateTableData]);

  return {
    handleColumnResize,
    handleRowResize
  };
};