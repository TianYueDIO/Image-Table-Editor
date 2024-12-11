import { useState } from 'react';
import { TableData } from '../types/table';
import { TableHistory } from '../utils/history';

export const useTableHistory = (initialData: TableData) => {
  const [tableData, setTableData] = useState(initialData);
  const [history] = useState(() => new TableHistory());

  const updateTableData = (newData: TableData) => {
    setTableData(newData);
    history.push(newData);
  };

  const handleUndo = () => {
    const previousState = history.undo();
    if (previousState) {
      setTableData(previousState);
    }
  };

  const handleRedo = () => {
    const nextState = history.redo();
    if (nextState) {
      setTableData(nextState);
    }
  };

  return {
    tableData,
    updateTableData,
    handleUndo,
    handleRedo,
    canUndo: history.canUndo(),
    canRedo: history.canRedo(),
    clearHistory: history.clear.bind(history)
  };
};