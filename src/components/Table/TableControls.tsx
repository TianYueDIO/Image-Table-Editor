import React from 'react';
import { 
  Save, Upload, Image as ImageIcon, Type, ChevronDown, ChevronUp, 
  ChevronLeft, ChevronRight, Trash2, Search, Maximize2, 
  Camera, LayoutGrid 
} from 'lucide-react';
import { TextFormatControls } from './TextFormatControls';
import { EditMode, TextStyle } from '../../types/table';

interface TableControlsProps {
  onAddRow: () => void;
  onAddColumn: () => void;
  onRemoveLastRow: () => void;
  onRemoveLastColumn: () => void;
  onSave: () => void;
  onLoad: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onClearAll: () => void;
  onResetTableSize: () => void;
  onScreenshot: () => void;
  canRemoveRow: boolean;
  canRemoveColumn: boolean;
  editMode: EditMode;
  onEditModeChange: (mode: EditMode) => void;
  textStyle: TextStyle;
  onTextStyleChange: (style: TextStyle) => void;
  isZoomMode: boolean;
  onZoomModeChange: () => void;
  zoomLevel: number;
  onResetZoom: () => void;
}

export const TableControls: React.FC<TableControlsProps> = ({
  onAddRow,
  onAddColumn,
  onRemoveLastRow,
  onRemoveLastColumn,
  onSave,
  onLoad,
  onClearAll,
  onResetTableSize,
  onScreenshot,
  canRemoveRow,
  canRemoveColumn,
  editMode,
  onEditModeChange,
  textStyle,
  onTextStyleChange,
  isZoomMode,
  onZoomModeChange,
  zoomLevel,
  onResetZoom,
}) => {
  return (
    <div className="mb-4 space-y-2">
      <div className="flex gap-2 flex-wrap">
        {/* 行列操作区 */}
        <div className="flex items-center gap-1 bg-gray-100 p-2 rounded">
          <div className="flex flex-col items-center gap-1">
            <button
              onClick={onAddRow}
              className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
              title="添加行"
            >
              <ChevronDown size={20} />
            </button>
            <button
              onClick={onRemoveLastRow}
              className={`p-2 rounded transition-colors ${
                canRemoveRow 
                  ? 'bg-red-500 text-white hover:bg-red-600' 
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
              disabled={!canRemoveRow}
              title="删除行"
            >
              <ChevronUp size={20} />
            </button>
          </div>
          <div className="flex flex-col items-center gap-1">
            <button
              onClick={onAddColumn}
              className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
              title="添加列"
            >
              <ChevronRight size={20} />
            </button>
            <button
              onClick={onRemoveLastColumn}
              className={`p-2 rounded transition-colors ${
                canRemoveColumn 
                  ? 'bg-red-500 text-white hover:bg-red-600' 
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
              disabled={!canRemoveColumn}
              title="删除列"
            >
              <ChevronLeft size={20} />
            </button>
          </div>
          <button
            onClick={onResetTableSize}
            className="p-2 bg-white text-gray-700 rounded hover:bg-gray-50 transition-colors"
            title="重置表格大小"
          >
            <Maximize2 size={20} />
          </button>
        </div>

        {/* 编辑模式切换区 */}
        <div className="flex items-center gap-2 bg-gray-100 p-2 rounded">
          <button
            onClick={() => onEditModeChange('text')}
            className={`p-2 rounded transition-colors ${
              editMode === 'text' ? 'bg-blue-500 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
            title="文字模式"
          >
            <Type size={20} />
          </button>
          <button
            onClick={() => onEditModeChange('image')}
            className={`p-2 rounded transition-colors ${
              editMode === 'image' ? 'bg-blue-500 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
            title="图片模式"
          >
            <ImageIcon size={20} />
          </button>
          <button
            onClick={() => onEditModeChange('layout')}
            className={`p-2 rounded transition-colors ${
              editMode === 'layout' ? 'bg-blue-500 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
            title="布局模式"
          >
            <LayoutGrid size={20} />
          </button>
        </div>

        {/* 缩放控制区 */}
        <div className="flex items-center gap-2 bg-gray-100 p-2 rounded">
          <button
            onClick={onZoomModeChange}
            className={`p-2 rounded transition-colors relative ${
              isZoomMode ? 'bg-blue-500 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
            title={`${isZoomMode ? "退出缩放模式" : "进入缩放模式"} (${Math.round(zoomLevel * 100)}%)`}
          >
            <Search size={20} />
          </button>
          <button
            onClick={onResetZoom}
            className="p-2 rounded bg-white text-gray-700 hover:bg-gray-50 transition-colors"
            title="重置缩放"
          >
            <Maximize2 size={20} />
          </button>
        </div>

        {/* 文件操作区 */}
        <div className="flex items-center gap-2 bg-gray-100 p-2 rounded">
          <button
            onClick={onSave}
            className="p-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
            title="保存表格数据到本地文件"
          >
            <Save size={20} />
          </button>
          <label className="p-2 bg-purple-500 text-white rounded cursor-pointer hover:bg-purple-600 transition-colors">
            <Upload size={20} />
            <input
              type="file"
              accept=".json"
              className="hidden"
              onChange={onLoad}
              title="从本地文件加载表格数据"
            />
          </label>
          <button
            onClick={onClearAll}
            className="p-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
            title="清除所有内容"
          >
            <Trash2 size={20} />
          </button>
          <button
            onClick={onScreenshot}
            className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
            title="截图"
          >
            <Camera size={20} />
          </button>
        </div>
      </div>
      
      {/* 文字格式控制区 - 只在文字模式下显示 */}
      {editMode === 'text' && (
        <div className="bg-gray-100 p-2 rounded">
          <TextFormatControls style={textStyle} onChange={onTextStyleChange} />
        </div>
      )}
    </div>
  );
};