import { TableData } from '../types/table';

const MAX_HISTORY_LENGTH = 50;

export class TableHistory {
  private history: TableData[] = [];
  private currentIndex: number = -1;

  push(state: TableData) {
    // 如果当前不在历史记录末尾，删除后面的记录
    if (this.currentIndex < this.history.length - 1) {
      this.history = this.history.slice(0, this.currentIndex + 1);
    }

    // 添加新状态
    this.history.push(JSON.parse(JSON.stringify(state)));
    this.currentIndex++;

    // 限制历史记录长度
    if (this.history.length > MAX_HISTORY_LENGTH) {
      this.history.shift();
      this.currentIndex--;
    }
  }

  undo(): TableData | null {
    if (this.currentIndex > 0) {
      this.currentIndex--;
      return JSON.parse(JSON.stringify(this.history[this.currentIndex]));
    }
    return null;
  }

  redo(): TableData | null {
    if (this.currentIndex < this.history.length - 1) {
      this.currentIndex++;
      return JSON.parse(JSON.stringify(this.history[this.currentIndex]));
    }
    return null;
  }

  canUndo(): boolean {
    return this.currentIndex > 0;
  }

  canRedo(): boolean {
    return this.currentIndex < this.history.length - 1;
  }

  clear() {
    this.history = [];
    this.currentIndex = -1;
  }
}