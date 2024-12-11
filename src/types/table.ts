export interface TextStyle {
  align?: 'left' | 'center' | 'right';
  size?: number;
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
}

export interface CellContent {
  type: 'text' | 'image';
  content: string;
  style?: TextStyle;
}

export interface TableSizeConfig {
  rowHeights: number[];
  colWidths: number[];
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
  defaultCellWidth: number;
  defaultCellHeight: number;
  defaultFontSize: number;
}

export type EditMode = 'text' | 'image' | 'layout';

export interface DragItem {
  rowIndex: number;
  colIndex: number;
  content: CellContent | null;
}

export interface SelectedCell {
  row: number;
  col: number;
}