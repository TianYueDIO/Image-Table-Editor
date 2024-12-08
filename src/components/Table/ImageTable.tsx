import React, { useState, useEffect } from 'react';
import { TableControls } from './TableControls';
import { TableRow } from './TableRow';
import { TableData, CellContent, EditMode, TextStyle, DragItem } from '../../types/table';
import { loadTableData, saveTableData } from '../../utils/tableStorage';
import { TableHistory } from '../../utils/history';
import { captureTableScreenshot, downloadScreenshot } from '../../utils/screenshot';
import { WheelZoomControl } from './WheelZoomControl';

const DEFAULT_CELL_WIDTH = 200;
const DEFAULT_CELL_HEIGHT = 120;
const DEFAULT_FONT_SIZE = 16;

export const ImageTable: React.FC = () => {
  const [tableData, setTableData] = useState<TableData>({
    rows: 3,
    cols: 3,
    cells: Array(3).fill(null).map(() => Array(3).fill(null)),
    cellSizes: {},
    rowHeights: Array(3).fill(DEFAULT_CELL_HEIGHT),
    colWidths: Array(3).fill(DEFAULT_CELL_WIDTH),
    defaultCellWidth: DEFAULT_CELL_WIDTH,
    defaultCellHeight: DEFAULT_CELL_HEIGHT,
    defaultFontSize: DEFAULT_FONT_SIZE
  });
  
  const [editMode, setEditMode] = useState<EditMode>('text');
  const [textStyle, setTextStyle] = useState<TextStyle>({
    align: 'left',
    size: DEFAULT_FONT_SIZE,
    bold: false,
    italic: false,
    underline: false
  });
  const [selectedCell, setSelectedCell] = useState<{row: number, col: number} | null>(null);
  const [draggedItem, setDraggedItem] = useState<DragItem | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [history] = useState(() => new TableHistory());
  const [zoom, setZoom] = useState(1);
  const [isZoomMode, setIsZoomMode] = useState(false);

  useEffect(() => {
    history.push(tableData);
  }, []);

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

  const handleContentChange = (rowIndex: number, colIndex: number, content: CellContent | null) => {
    const newCells = tableData.cells.map((row, i) =>
      row.map((cell, j) => (i === rowIndex && j === colIndex ? content : cell))
    );
    updateTableData({
      ...tableData,
      cells: newCells
    });
  };

  const handleColumnResize = (colIndex: number, newWidth: number) => {
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
  };

  const handleRowResize = (rowIndex: number, newHeight: number) => {
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
  };

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

  const handleCellSelect = (rowIndex: number, colIndex: number) => {
    setSelectedCell({ row: rowIndex, col: colIndex });
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

  const handleSave = () => {
    try {
      const url = saveTableData(tableData);
      const a = document.createElement('a');
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      a.href = url;
      a.download = `table-data-${timestamp}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      setError(null);
    } catch (err) {
      setError('保存表格时出错');
      console.error('保存表格错误:', err);
    }
  };

  const handleLoad = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const data = await loadTableData(file);
      updateTableData(data);
      history.clear();
      history.push(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : '加载表格时出错');
      console.error('加载表格错误:', err);
    }
  };

  const handleClearAll = () => {
    const newData = {
      ...tableData,
      cells: Array(tableData.rows).fill(null).map(() => Array(tableData.cols).fill(null))
    };
    updateTableData(newData);
  };

  const handleResetTableSize = () => {
    const newData = {
      ...tableData,
      rowHeights: Array(tableData.rows).fill(DEFAULT_CELL_HEIGHT),
      colWidths: Array(tableData.cols).fill(DEFAULT_CELL_WIDTH),
      defaultCellWidth: DEFAULT_CELL_WIDTH,
      defaultCellHeight: DEFAULT_CELL_HEIGHT
    };
    updateTableData(newData);
  };

  const handleScreenshot = async () => {
    try {
      const originalZoom = zoom;
      setZoom(1);
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const dataUrl = await captureTableScreenshot('table-container');
      downloadScreenshot(dataUrl);
      
      setZoom(originalZoom);
    } catch (error) {
      setError('截图失败，请稍后重试');
      console.error('Screenshot error:', error);
      setTimeout(() => setError(null), 3000);
    }
  };

  return (
    <div className="p-4">
      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
          {error}
        </div>
      )}
      <div className="flex gap-2 mb-4">
        <button
          onClick={handleUndo}
          disabled={!history.canUndo()}
          className={`p-2 rounded ${
            history.canUndo()
              ? 'bg-gray-100 hover:bg-gray-200 text-gray-700'
              : 'bg-gray-100 text-gray-400 cursor-not-allowed'
          }`}
          title="撤销"
        >
          撤销
        </button>
        <button
          onClick={handleRedo}
          disabled={!history.canRedo()}
          className={`p-2 rounded ${
            history.canRedo()
              ? 'bg-gray-100 hover:bg-gray-200 text-gray-700'
              : 'bg-gray-100 text-gray-400 cursor-not-allowed'
          }`}
          title="重做"
        >
          重做
        </button>
      </div>
      <TableControls
        onAddRow={addRow}
        onAddColumn={addColumn}
        onRemoveLastRow={removeLastRow}
        onRemoveLastColumn={removeLastColumn}
        onSave={handleSave}
        onLoad={handleLoad}
        onClearAll={handleClearAll}
        onResetTableSize={handleResetTableSize}
        onScreenshot={handleScreenshot}
        canRemoveRow={tableData.rows > 1}
        canRemoveColumn={tableData.cols > 1}
        editMode={editMode}
        onEditModeChange={setEditMode}
        textStyle={textStyle}
        onTextStyleChange={handleTextStyleChange}
        isZoomMode={isZoomMode}
        onZoomModeChange={() => setIsZoomMode(!isZoomMode)}
        zoomLevel={zoom}
        onResetZoom={() => setZoom(1)}
      />
      <WheelZoomControl
        zoom={zoom}
        onZoomChange={setZoom}
        isZoomMode={isZoomMode}
      >
        <div id="table-container" className="overflow-x-auto mt-4">
          <table className="border-collapse">
            <tbody>
              {tableData.cells.map((row, rowIndex) => (
                <TableRow
                  key={rowIndex}
                  row={row}
                  rowIndex={rowIndex}
                  showDeleteButton={false}
                  onContentChange={(colIndex, content) => 
                    handleContentChange(rowIndex, colIndex, content)
                  }
                  onRemoveRow={() => {}}
                  editMode={editMode}
                  defaultTextStyle={textStyle}
                  onDragStart={handleDragStart}
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                  onCellSelect={(colIndex) => handleCellSelect(rowIndex, colIndex)}
                  rowHeight={tableData.rowHeights[rowIndex]}
                  colWidths={tableData.colWidths}
                  onRowResize={(rowIndex, newHeight) => handleRowResize(rowIndex, newHeight)}
                  onColumnResize={(colIndex, newWidth) => handleColumnResize(colIndex, newWidth)}
                />
              ))}
            </tbody>
          </table>
        </div>
      </WheelZoomControl>
    </div>
  );
};