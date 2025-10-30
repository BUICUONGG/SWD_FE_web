/**
 * Validator utilities - Hàm validate dữ liệu
 */

/**
 * Kiểm tra email hợp lệ
 */
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Kiểm tra mật khẩu mạnh
 */
export const validatePassword = (password: string): {
  isValid: boolean;
  strength: 'weak' | 'medium' | 'strong';
} => {
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumbers = /\d/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

  const strength = [hasUpperCase, hasLowerCase, hasNumbers, hasSpecialChar].filter(
    Boolean
  ).length;

  return {
    isValid: password.length >= 8,
    strength: strength <= 1 ? 'weak' : strength <= 2 ? 'medium' : 'strong',
  };
};

/**
 * Kiểm tra phone hợp lệ
 */
export const validatePhone = (phone: string): boolean => {
  const phoneRegex = /^(\+?\d{1,3}[-.\s]?)?\d{9,11}$/;
  return phoneRegex.test(phone.replace(/\s/g, ''));
};

/**
 * Kiểm tra URL hợp lệ
 */
export const validateURL = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

/**
 * Kiểm tra số hợp lệ
 */
export const validateNumber = (value: any): boolean => {
  return !isNaN(value) && isFinite(value);
};

/**
 * Kiểm tra string trống
 */
export const isEmpty = (value: any): boolean => {
  return value === null || value === undefined || value.toString().trim() === '';
};

/**
 * Kiểm tra array trống
 */
export const isEmptyArray = (arr: any[]): boolean => {
  return !Array.isArray(arr) || arr.length === 0;
};

/**
 * Kiểm tra object trống
 */
export const isEmptyObject = (obj: Record<string, any>): boolean => {
  return Object.keys(obj).length === 0;
};

/**
 * Validate form object
 */
export const validateForm = (
  data: Record<string, any>,
  rules: Record<string, (value: any) => boolean | string>
): Record<string, string> => {
  const errors: Record<string, string> = {};

  Object.keys(rules).forEach((field) => {
    const result = rules[field](data[field]);
    if (result !== true) {
      errors[field] = result as string;
    }
  });

  return errors;
};
