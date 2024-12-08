import { toPng } from 'html-to-image';

export const captureTableScreenshot = async (tableId: string): Promise<string> => {
  const element = document.getElementById(tableId);
  if (!element) {
    throw new Error('Table element not found');
  }

  try {
    // 创建一个临时容器用于截图
    const container = document.createElement('div');
    container.style.position = 'fixed';
    container.style.top = '-9999px';
    container.style.left = '-9999px';
    container.style.backgroundColor = '#ffffff';
    document.body.appendChild(container);

    // 克隆表格并处理样式
    const clone = element.cloneNode(true) as HTMLElement;
    clone.style.transform = 'none';
    clone.style.backgroundColor = '#ffffff';
    clone.style.padding = '0';
    clone.style.margin = '0';

    // 处理表格样式
    const table = clone.querySelector('table');
    if (table) {
      table.style.borderCollapse = 'collapse';
      table.style.backgroundColor = '#ffffff';
      
      // 处理所有单元格
      const cells = table.querySelectorAll('td');
      cells.forEach(td => {
        td.style.backgroundColor = '#ffffff';
        td.style.border = '1px solid #d1d5db';
        
        // 移除不需要的元素
        const resizeHandles = td.querySelectorAll('.resize-handle, .group\\/resize');
        resizeHandles.forEach(handle => handle.remove());
        
        // 移除空单元格提示文字
        const emptyLabels = td.querySelectorAll('label');
        emptyLabels.forEach(label => {
          if (!label.querySelector('img')) {
            label.remove();
          }
        });
      });
    }

    container.appendChild(clone);

    // 等待DOM更新
    await new Promise(resolve => setTimeout(resolve, 100));

    // 捕获图片
    const dataUrl = await toPng(clone, {
      quality: 1.0,
      pixelRatio: 2,
      backgroundColor: '#ffffff',
      filter: (node) => {
        const element = node as HTMLElement;
        // 过滤掉调整大小的控件和空单元格提示
        return !element.classList?.contains('resize-handle') &&
               !element.classList?.contains('group/resize') &&
               !(element.tagName === 'LABEL' && !element.querySelector('img'));
      }
    });

    // 清理临时元素
    document.body.removeChild(container);
    return dataUrl;
  } catch (error) {
    console.error('Screenshot error:', error);
    throw new Error('Failed to capture screenshot');
  }
};

export const downloadScreenshot = (dataUrl: string) => {
  const link = document.createElement('a');
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  link.download = `table-${timestamp}.png`;
  link.href = dataUrl;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};