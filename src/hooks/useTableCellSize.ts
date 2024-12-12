import { useState, useCallback } from 'react';
import { TableSizeConfig } from '../types/table';

export const useTableCellSize = () => {
  const [copiedSize, setCopiedSize] = useState<TableSizeConfig | null>(null);

  const copySize = useCallback((width: number, height: number) => {
    const sizeConfig: TableSizeConfig = {
      width,
      height
    };
    setCopiedSize(sizeConfig);
  }, []);

  const pasteSize = useCallback((onWidthChange: (width: number) => void, onHeightChange: (height: number) => void) => {
    if (copiedSize) {
      onWidthChange(copiedSize.width);
      onHeightChange(copiedSize.height);
    }
  }, [copiedSize]);

  return {
    copiedSize,
    copySize,
    pasteSize
  };
};