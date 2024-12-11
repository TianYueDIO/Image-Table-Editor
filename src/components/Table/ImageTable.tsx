import React, { useState } from 'react';
import { TableControls } from './TableControls';
import { TableRow } from './TableRow';
import { WheelZoomControl } from './WheelZoomControl';
import { TableData } from '../../types/table';
import { loadTableData, saveTableData } from '../../utils/tableStorage';
import { captureTableScreenshot, downloadScreenshot } from '../../utils/screenshot';
import { Undo, Redo } from 'lucide-react';

import { useTableHistory } from '../../hooks/useTableHistory';
import { useTableOperations } from '../../hooks/useTableOperations';
import { useTableZoom } from '../../hooks/useTableZoom';
import { useTableDrag } from '../../hooks/useTableDrag';
import { useTableResize } from '../../hooks/useTableResize';
import { useTableContent } from '../../hooks/useTableContent';
import { useTableSize } from '../../hooks/useTableSize';
import { useTableShortcuts } from '../../hooks/useTableShortcuts';

const DEFAULT_CELL_WIDTH = 200;
const DEFAULT_CELL_HEIGHT = 120;
const DEFAULT_FONT_SIZE = 16;

const initialTableData: TableData = {
  rows: 3,
  cols: 3,
  cells: Array(3).fill(null).map(() => Array(3).fill(null)),
  cellSizes: {},
  rowHeights: Array(3).fill(DEFAULT_CELL_HEIGHT),
  colWidths: Array(3).fill(DEFAULT_CELL_WIDTH),
  defaultCellWidth: DEFAULT_CELL_WIDTH,
  defaultCellHeight: DEFAULT_CELL_HEIGHT,
  defaultFontSize: DEFAULT_FONT_SIZE
};

export const ImageTable: React.FC = () => {
  const [error, setError] = useState<string | null>(null);
  
  const {
    tableData,
    updateTableData,
    handleUndo,
    handleRedo,
    canUndo,
    canRedo,
    clearHistory
  } = useTableHistory(initialTableData);

  const {
    addRow,
    addColumn,
    removeLastRow,
    removeLastColumn,
    resetTableSize,
    clearAllContent
  } = useTableOperations(tableData, updateTableData);

  const {
    zoom,
    setZoom,
    isZoomMode,
    toggleZoomMode,
    handleResetZoom
  } = useTableZoom();

  const {
    draggedItem,
    handleDragStart,
    handleDragOver,
    handleDrop
  } = useTableDrag(tableData, updateTableData);

  const {
    handleColumnResize,
    handleRowResize
  } = useTableResize(tableData, updateTableData);

  const {
    editMode,
    setEditMode,
    textStyle,
    handleContentChange,
    handleCellSelect,
    handleTextStyleChange
  } = useTableContent(tableData, updateTableData);

  const {
    copiedSize,
    copyTableSize,
    pasteTableSize,
    copyStatus,
    previewPosition,
    showPreview
  } = useTableSize(tableData, updateTableData);

  // 使用快捷键钩子
  useTableShortcuts(copyTableSize, pasteTableSize, !!copiedSize);

  const handleScreenshot = async () => {
    try {
      const dataUrl = await captureTableScreenshot('table-container');
      downloadScreenshot(dataUrl);
    } catch (error) {
      setError('截图失败，请稍后重试');
      setTimeout(() => setError(null), 3000);
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
      clearHistory();
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : '加载表格时出错');
      console.error('加载表格错误:', err);
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
          disabled={!canUndo}
          className={`p-2 rounded ${
            canUndo
              ? 'bg-gray-100 hover:bg-gray-200 text-gray-700'
              : 'bg-gray-100 text-gray-400 cursor-not-allowed'
          }`}
          title="撤销"
        >
          <Undo size={20} />
        </button>
        <button
          onClick={handleRedo}
          disabled={!canRedo}
          className={`p-2 rounded ${
            canRedo
              ? 'bg-gray-100 hover:bg-gray-200 text-gray-700'
              : 'bg-gray-100 text-gray-400 cursor-not-allowed'
          }`}
          title="重做"
        >
          <Redo size={20} />
        </button>
      </div>
      <TableControls
        onAddRow={addRow}
        onAddColumn={addColumn}
        onRemoveLastRow={removeLastRow}
        onRemoveLastColumn={removeLastColumn}
        onSave={handleSave}
        onLoad={handleLoad}
        onClearAll={clearAllContent}
        onResetTableSize={resetTableSize}
        onScreenshot={handleScreenshot}
        onCopySize={copyTableSize}
        onPasteSize={pasteTableSize}
        hasCopiedSize={!!copiedSize}
        copiedSize={copiedSize}
        copyStatus={copyStatus}
        showPreview={showPreview}
        previewPosition={previewPosition}
        canRemoveRow={tableData.rows > 1}
        canRemoveColumn={tableData.cols > 1}
        editMode={editMode}
        onEditModeChange={setEditMode}
        textStyle={textStyle}
        onTextStyleChange={handleTextStyleChange}
        isZoomMode={isZoomMode}
        onZoomModeChange={toggleZoomMode}
        zoomLevel={zoom}
        onResetZoom={handleResetZoom}
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