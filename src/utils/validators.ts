/**
 * 信用卡卡號格式化 (每 4 碼加空格)
 */
export function formatCardNumber(value: string): string {
  const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
  const matches = v.match(/\d{4,16}/g);
  const match = (matches && matches[0]) || '';
  const parts = [];

  for (let i = 0, len = match.length; i < len; i += 4) {
    parts.push(match.substring(i, i + 4));
  }

  if (parts.length > 0) {
    return parts.join(' ');
  } else {
    return v;
  }
}

/**
 * 辨識信用卡類型 (Visa: 以 4 開頭, Mastercard: 以 5 開頭)
 */
export function getCardType(cardNumber: string): 'visa' | 'mastercard' | 'unknown' {
  const cleanNumber = cardNumber.replace(/\s+/g, '');
  if (cleanNumber.startsWith('4')) {
    return 'visa';
  }
  if (/^5[1-5]/.test(cleanNumber) || /^2[2-7]/.test(cleanNumber)) {
    return 'mastercard';
  }
  return 'unknown';
}

/**
 * 驗證信用卡號是否完整 (16碼數字)
 */
export function validateCardNumber(cardNumber: string): boolean {
  const cleanNumber = cardNumber.replace(/\s+/g, '');
  return /^\d{16}$/.test(cleanNumber);
}

/**
 * 驗證 CVC (3或4碼數字)
 */
export function validateCVC(cvc: string): boolean {
  return /^\d{3,4}$/.test(cvc);
}

/**
 * 驗證信用卡過期日 (MM/YY)
 */
export function validateExpiry(expiry: string): boolean {
  if (!/^\d{2}\/\d{2}$/.test(expiry)) return false;
  const [monthStr, yearStr] = expiry.split('/');
  const month = parseInt(monthStr, 10);
  const year = parseInt(yearStr, 10);
  if (month < 1 || month > 12) return false;
  
  const now = new Date();
  const currentMonth = now.getMonth() + 1;
  const currentYear = parseInt(now.getFullYear().toString().slice(-2), 10);
  
  if (year < currentYear) return false;
  if (year === currentYear && month < currentMonth) return false;
  return true;
}

/**
 * 驗證手機條碼載具 (必須以 / 開頭，後接 7 碼大寫英數字或特殊字元)
 */
export function validateCarrier(carrier: string): boolean {
  return /^\/[0-9A-Z+. -]{7}$/.test(carrier);
}

/**
 * 驗證中華民國公司統一編號 (8碼，符合財政部 Modulus 10 規則)
 */
export function validateTaxId(taxId: string): boolean {
  if (!/^\d{8}$/.test(taxId)) return false;

  const weights = [1, 2, 1, 2, 1, 2, 4, 1];
  let sum = 0;
  let hasSeven = false;

  for (let i = 0; i < 8; i++) {
    const digit = parseInt(taxId[i], 10);
    const weight = weights[i];
    const product = digit * weight;
    
    // 將乘積的十位數與個位數相加
    const sumDigits = Math.floor(product / 10) + (product % 10);
    sum += sumDigits;

    if (i === 6 && digit === 7) {
      hasSeven = true;
    }
  }

  // 若第七位數為 7，且總和除以 10 的餘數為 9 (即 sum + 1 可被 10 整除)，也算合格
  if (sum % 10 === 0) {
    return true;
  }
  
  if (hasSeven && (sum + 1) % 10 === 0) {
    return true;
  }

  return false;
}
