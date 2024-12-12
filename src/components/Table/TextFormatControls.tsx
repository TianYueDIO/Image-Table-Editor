import React from 'react';
import {
  AlignLeft,
  AlignCenter,
  AlignRight,
  Bold,
  Italic,
  Underline,
  Minus,
  Plus
} from 'lucide-react';
import { TextStyle } from '../../types/table';
import { LongPressButton } from '../Common/LongPressButton';

interface TextFormatControlsProps {
  style: TextStyle;
  onChange: (style: TextStyle) => void;
}

export const TextFormatControls: React.FC<TextFormatControlsProps> = ({
  style,
  onChange
}) => {
  const updateStyle = (updates: Partial<TextStyle>) => {
    onChange({ ...style, ...updates });
  };

  const handleFontSizeChange = (delta: number) => {
    const currentSize = style.size || 16;
    const newSize = Math.max(8, Math.min(72, currentSize + delta));
    updateStyle({ size: newSize });
  };

  return (
    <div className="flex gap-1 p-1 bg-white shadow-sm rounded border">
      <div className="flex gap-1 border-r pr-1">
        <button
          className={`p-1 rounded ${style.align === 'left' ? 'bg-blue-100' : 'hover:bg-gray-100'}`}
          onClick={() => updateStyle({ align: 'left' })}
          title="左对齐"
        >
          <AlignLeft size={16} />
        </button>
        <button
          className={`p-1 rounded ${style.align === 'center' ? 'bg-blue-100' : 'hover:bg-gray-100'}`}
          onClick={() => updateStyle({ align: 'center' })}
          title="居中"
        >
          <AlignCenter size={16} />
        </button>
        <button
          className={`p-1 rounded ${style.align === 'right' ? 'bg-blue-100' : 'hover:bg-gray-100'}`}
          onClick={() => updateStyle({ align: 'right' })}
          title="右对齐"
        >
          <AlignRight size={16} />
        </button>
      </div>
      
      <div className="flex items-center gap-1 border-r pr-1">
        <LongPressButton
          onClick={() => handleFontSizeChange(-1)}
          className="p-1 rounded hover:bg-gray-100"
        >
          <Minus size={16} />
        </LongPressButton>
        <input
          type="number"
          className="w-16 px-1 py-0.5 border rounded text-center"
          value={style.size || 16}
          onChange={(e) => {
            const size = Math.max(8, Math.min(72, Number(e.target.value)));
            updateStyle({ size });
          }}
          min="8"
          max="72"
          title="字号"
        />
        <LongPressButton
          onClick={() => handleFontSizeChange(1)}
          className="p-1 rounded hover:bg-gray-100"
        >
          <Plus size={16} />
        </LongPressButton>
      </div>

      <div className="flex gap-1">
        <button
          className={`p-1 rounded ${style.bold ? 'bg-blue-100' : 'hover:bg-gray-100'}`}
          onClick={() => updateStyle({ bold: !style.bold })}
          title="粗体"
        >
          <Bold size={16} />
        </button>
        <button
          className={`p-1 rounded ${style.italic ? 'bg-blue-100' : 'hover:bg-gray-100'}`}
          onClick={() => updateStyle({ italic: !style.italic })}
          title="斜体"
        >
          <Italic size={16} />
        </button>
        <button
          className={`p-1 rounded ${style.underline ? 'bg-blue-100' : 'hover:bg-gray-100'}`}
          onClick={() => updateStyle({ underline: !style.underline })}
          title="下划线"
        >
          <Underline size={16} />
        </button>
      </div>
    </div>
  );
};