import React from 'react';
import { Minus } from 'lucide-react';

interface TableHeaderProps {
  columns: number;
  onRemoveColumn: (index: number) => void;
}

export const TableHeader: React.FC<TableHeaderProps> = ({ columns, onRemoveColumn }) => {
  if (columns <= 1) return null;

  return (
    <tr>{Array.from({ length: columns }).map((_, colIndex) => (
      <td key={colIndex} className="text-center border-none p-1">
        <button
          onClick={() => onRemoveColumn(colIndex)}
          className="p-1 text-red-500 hover:text-red-700"
        >
          <Minus size={16} />
        </button>
      </td>
    ))}<td className="border-none p-1" /></tr>
  );
};