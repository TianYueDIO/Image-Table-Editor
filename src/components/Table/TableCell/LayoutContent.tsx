import React from 'react';

interface LayoutContentProps {
  width: number;
  height: number;
}

export const LayoutContent: React.FC<LayoutContentProps> = ({ width, height }) => {
  return (
    <div className="w-full h-full flex items-center justify-center text-gray-500 select-none">
      {width} × {height}
    </div>
  );
};