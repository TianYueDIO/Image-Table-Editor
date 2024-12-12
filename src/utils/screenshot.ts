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
    clone.style.width = 'auto';
    clone.style.height = 'auto';

    // 只保留表格元素
    const table = clone.querySelector('table');
    if (table) {
      // 清空容器并只添加表格
      clone.innerHTML = '';
      clone.appendChild(table);
      
      table.style.borderCollapse = 'collapse';
      table.style.backgroundColor = '#ffffff';
      table.style.width = 'auto';
      table.style.height = 'auto';
      
      // 处理所有单元格
      const cells = table.querySelectorAll('td');
      cells.forEach(td => {
        const cell = td as HTMLElement;
        cell.style.backgroundColor = '#ffffff';
        cell.style.border = '1px solid #d1d5db';
        
        // 移除调整大小的控件
        const resizeHandles = cell.querySelectorAll('.group\\/resize');
        resizeHandles.forEach(handle => handle.remove());
        
        // 移除空单元格提示
        const emptyLabels = cell.querySelectorAll('label');
        emptyLabels.forEach(label => {
          if (!label.querySelector('img')) {
            label.remove();
          }
        });

        // 确保内容可见
        const content = cell.querySelector('div');
        if (content) {
          (content as HTMLElement).style.opacity = '1';
        }
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
      style: {
        transform: 'none'
      },
      filter: (node) => {
        const element = node as HTMLElement;
        return !element.classList?.contains('group/resize') &&
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