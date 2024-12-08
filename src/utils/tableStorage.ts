import { TableData } from '../types/table';

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

export const validateTableData = (data: any): ValidationResult => {
  const errors: string[] = [];

  if (!data) {
    errors.push('数据格式无效');
    return { isValid: false, errors };
  }

  // 检查必要的字段
  const requiredFields = ['rows', 'cols', 'cells', 'cellSizes', 'rowHeights', 'colWidths'];
  for (const field of requiredFields) {
    if (!(field in data)) {
      errors.push(`缺少必要字段: ${field}`);
    }
  }

  // 验证数组长度
  if (data.cells?.length !== data.rows) {
    errors.push('行数与数据不匹配');
  }

  if (data.cells?.some((row: any) => row.length !== data.cols)) {
    errors.push('列数与数据不匹配');
  }

  if (data.rowHeights?.length !== data.rows) {
    errors.push('行高数据不匹配');
  }

  if (data.colWidths?.length !== data.cols) {
    errors.push('列宽数据不匹配');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

export const saveTableData = (data: TableData): string => {
  try {
    const jsonString = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    return URL.createObjectURL(blob);
  } catch (error) {
    throw new Error('保存表格数据时出错');
  }
};

export const loadTableData = async (file: File): Promise<TableData> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string);
        const validation = validateTableData(data);
        
        if (!validation.isValid) {
          reject(new Error(`数据验证失败：${validation.errors.join(', ')}`));
          return;
        }

        resolve(data as TableData);
      } catch (error) {
        reject(new Error('无法解析表格数据文件'));
      }
    };

    reader.onerror = () => {
      reject(new Error('读取文件时出错'));
    };

    reader.readAsText(file);
  });
};