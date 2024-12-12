import React, { useRef } from 'react';
import { TableControls } from './TableControls';
import { TableRow } from './TableRow';
import { WheelZoomControl } from './WheelZoomControl';
import { useTableHistory } from '../../hooks/useTableHistory';
import { useTableOperations } from '../../hooks/useTableOperations';
import { useTableZoom } from '../../hooks/useTableZoom';
import { useTableDrag } from '../../hooks/useTableDrag';
import { useTableContent } from '../../hooks/useTableContent';
import { useTableCellSize } from '../../hooks/useTableCellSize';
import { TableData } from '../../types/table';
import { captureTableScreenshot, downloadScreenshot } from '../../utils/screenshot';
import { saveTableData, loadTableData } from '../../utils/tableStorage';

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
  const tableRef = useRef<HTMLDivElement>(null);

  const {
    tableData,
    updateTableData,
    handleUndo,
    handleRedo,
    canUndo,
    canRedo
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
    editMode,
    setEditMode,
    textStyle,
    selectedCell,
    handleContentChange,
    handleCellSelect,
    handleTextStyleChange
  } = useTableContent(tableData, updateTableData);

  const handleSave = () => {
    try {
      const url = saveTableData(tableData);
      const link = document.createElement('a');
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      link.download = `table-${timestamp}.json`;
      link.href = url;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('保存失败:', error);
      alert('保存失败，请重试');
    }
  };

  const handleLoad = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const data = await loadTableData(file);
      updateTableData(data);
    } catch (error) {
      console.error('加载失败:', error);
      alert('加载失败，请检查文件格式');
    }
  };

  const handleScreenshot = async () => {
    if (!tableRef.current) return;

    try {
      const dataUrl = await captureTableScreenshot('table-container');
      downloadScreenshot(dataUrl);
    } catch (error) {
      console.error('截图失败:', error);
      alert('截图失败，请重试');
    }
  };

  return (
    <div className="p-4">
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
        <div id="table-container" ref={tableRef} className="overflow-x-auto mt-4">
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
                  onDragStart={(colIndex) => handleDragStart(rowIndex, colIndex)}
                  onDragOver={handleDragOver}
                  onDrop={(colIndex) => handleDrop(rowIndex, colIndex)}
                  onCellSelect={(colIndex) => handleCellSelect(rowIndex, colIndex)}
                  rowHeight={tableData.rowHeights[rowIndex]}
                  colWidths={tableData.colWidths}
                  onRowResize={(rowIndex, newHeight) => {
                    const newData = { ...tableData };
                    newData.rowHeights[rowIndex] = newHeight;
                    updateTableData(newData);
                  }}
                  onColumnResize={(colIndex, newWidth) => {
                    const newData = { ...tableData };
                    newData.colWidths[colIndex] = newWidth;
                    updateTableData(newData);
                  }}
                  selectedCell={selectedCell}
                />
              ))}
            </tbody>
          </table>
        </div>
      </WheelZoomControl>
    </div>
  );
};