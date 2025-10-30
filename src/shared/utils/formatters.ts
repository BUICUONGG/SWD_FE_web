/**
 * Formatter utilities - Hàm format dữ liệu
 */

/**
 * Format date thành chuỗi
 */
export const formatDate = (date: Date | string, format: string = 'DD/MM/YYYY'): string => {
  const d = typeof date === 'string' ? new Date(date) : date;
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  const hours = String(d.getHours()).padStart(2, '0');
  const minutes = String(d.getMinutes()).padStart(2, '0');

  return format
    .replace('DD', day)
    .replace('MM', month)
    .replace('YYYY', String(year))
    .replace('HH', hours)
    .replace('mm', minutes);
};

/**
 * Format tiền tệ
 */
export const formatCurrency = (amount: number, currency: string = 'VND'): string => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: currency,
  }).format(amount);
};

/**
 * Format số lượng
 */
export const formatNumber = (num: number, decimals: number = 0): string => {
  return Number(num).toLocaleString('vi-VN', {
    maximumFractionDigits: decimals,
    minimumFractionDigits: decimals,
  });
};

/**
 * Format percentage
 */
export const formatPercentage = (value: number, decimals: number = 1): string => {
  return `${Number((value * 100).toFixed(decimals))}%`;
};

/**
 * Format file size
 */
export const formatFileSize = (bytes: number): string => {
  const units = ['B', 'KB', 'MB', 'GB', 'TB'];
  let size = bytes;
  let unitIndex = 0;

  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex++;
  }

  return `${size.toFixed(2)} ${units[unitIndex]}`;
};

/**
 * Format thời gian (VD: 2 hours ago)
 */
export const formatTimeAgo = (date: Date | string): string => {
  const d = typeof date === 'string' ? new Date(date) : date;
  const seconds = Math.floor((new Date().getTime() - d.getTime()) / 1000);

  let interval = seconds / 31536000;
  if (interval > 1) return Math.floor(interval) + ' năm trước';

  interval = seconds / 2592000;
  if (interval > 1) return Math.floor(interval) + ' tháng trước';

  interval = seconds / 86400;
  if (interval > 1) return Math.floor(interval) + ' ngày trước';

  interval = seconds / 3600;
  if (interval > 1) return Math.floor(interval) + ' giờ trước';

  interval = seconds / 60;
  if (interval > 1) return Math.floor(interval) + ' phút trước';

  return Math.floor(seconds) + ' giây trước';
};
