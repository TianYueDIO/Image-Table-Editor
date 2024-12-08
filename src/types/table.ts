export interface TextStyle {
  align?: 'left' | 'center' | 'right';
  size?: number; // Changed from string to number for precise control
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
}

export interface CellContent {
  type: 'text' | 'image';
  content: string;
  style?: TextStyle;
}

export interface TableData {
  rows: number;
  cols: number;
  cells: (CellContent | null)[][];
  cellSizes: {
    [key: string]: {
      width: number;
      height: number;
    };
  };
  rowHeights: number[];
  colWidths: number[];
  defaultCellWidth: number; // Added for consistency
  defaultCellHeight: number; // Added for consistency
  defaultFontSize: number; // Added for consistency
}

export type EditMode = 'text' | 'image';

export interface DragItem {
  rowIndex: number;
  colIndex: number;
  content: CellContent | null;
}