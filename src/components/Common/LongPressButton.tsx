import React, { useState, useEffect, useCallback } from 'react';

interface LongPressButtonProps {
  onClick: () => void;
  children: React.ReactNode;
  interval?: number;
  className?: string;
}

export const LongPressButton: React.FC<LongPressButtonProps> = ({
  onClick,
  children,
  interval = 50,
  className = ''
}) => {
  const [isPressed, setIsPressed] = useState(false);
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null);
  const [intervalId, setIntervalId] = useState<NodeJS.Timeout | null>(null);

  const clearTimers = useCallback(() => {
    if (timeoutId) clearTimeout(timeoutId);
    if (intervalId) clearInterval(intervalId);
    setTimeoutId(null);
    setIntervalId(null);
  }, [timeoutId, intervalId]);

  useEffect(() => {
    return () => {
      clearTimers();
    };
  }, [clearTimers]);

  const handleMouseDown = () => {
    setIsPressed(true);
    onClick(); // 立即触发一次点击

    // 设置初始延迟
    const timeout = setTimeout(() => {
      // 开始连续触发
      const interval = setInterval(() => {
        onClick();
      }, interval);
      setIntervalId(interval);
    }, 500); // 500ms 后开始连续触发

    setTimeoutId(timeout);
  };

  const handleMouseUp = () => {
    setIsPressed(false);
    clearTimers();
  };

  const handleMouseLeave = () => {
    if (isPressed) {
      setIsPressed(false);
      clearTimers();
    }
  };

  return (
    <button
      className={`${className} ${isPressed ? 'scale-95' : ''} transition-transform`}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseLeave}
      type="button"
    >
      {children}
    </button>
  );
};