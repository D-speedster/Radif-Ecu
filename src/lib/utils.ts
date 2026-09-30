import * as jalaali from 'jalaali-js';

/**
 * تبدیل تاریخ میلادی به شمسی
 */
export function toJalali(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  const j = jalaali.toJalaali(d.getFullYear(), d.getMonth() + 1, d.getDate());
  return `${j.jy}/${j.jm.toString().padStart(2, '0')}/${j.jd.toString().padStart(2, '0')}`;
}

/**
 * فرمت تاریخ و زمان فارسی
 */
export function formatJalaliDateTime(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  const jalaliDate = toJalali(d);
  const time = `${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`;
  return `${jalaliDate} - ${time}`;
}

/**
 * تولید slug از متن فارسی
 */
export function generateSlug(text: string): string {
  const persianToEnglish: { [key: string]: string } = {
    'ا': 'a', 'آ': 'a', 'ب': 'b', 'پ': 'p', 'ت': 't', 'ث': 's', 'ج': 'j', 'چ': 'ch',
    'ح': 'h', 'خ': 'kh', 'د': 'd', 'ذ': 'z', 'ر': 'r', 'ز': 'z', 'ژ': 'zh', 'س': 's',
    'ش': 'sh', 'ص': 's', 'ض': 'z', 'ط': 't', 'ظ': 'z', 'ع': 'a', 'غ': 'gh', 'ف': 'f',
    'ق': 'gh', 'ک': 'k', 'گ': 'g', 'ل': 'l', 'م': 'm', 'ن': 'n', 'و': 'v', 'ه': 'h',
    'ی': 'y', 'ئ': 'y', ' ': '-'
  };

  return text
    .toLowerCase()
    .split('')
    .map(char => persianToEnglish[char] || char)
    .join('')
    .replace(/[^a-z0-9-]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

/**
 * کوتاه کردن متن
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
}

/**
 * فرمت شماره تلفن
 */
export function formatPhoneNumber(phone: string): string {
  // حذف تمام کاراکترهای غیر عددی
  const cleaned = phone.replace(/\D/g, '');
  
  // فرمت: 0912-345-6789
  if (cleaned.length === 11 && cleaned.startsWith('0')) {
    return `${cleaned.slice(0, 4)}-${cleaned.slice(4, 7)}-${cleaned.slice(7)}`;
  }
  
  return phone;
}
