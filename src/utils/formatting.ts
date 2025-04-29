export const formatErrorMessage = (error: any): string => {
  if (!error) {
    return 'An unexpected error occurred';
  }
  
  if (typeof error === 'string') {
    return error;
  }
  
  if (error instanceof Error) {
    return error.message;
  }
  
  if (error.response && error.response.data) {
    const { data } = error.response;
    
    if (typeof data === 'string') {
      return data;
    }
    
    if (data.message) {
      return data.message;
    }
    
    if (data.error) {
      return data.error;
    }
  }
  
  return 'An unexpected error occurred';
};

export const formatCurrency = (
  amount: number, 
  currency: string = 'KES', 
  locale: string = 'en-KE'
): string => {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: 2
  }).format(amount);
};

export const formatPhoneNumber = (phone: string): string => {
  // Format for Kenyan phone numbers (adjust as needed)
  if (!phone) return '';
  
  // Remove non-numeric characters
  const cleaned = phone.replace(/\D/g, '');
  
  // Check if it's a Kenyan number
  if (cleaned.startsWith('254') && cleaned.length === 12) {
    return `+${cleaned.slice(0, 3)} ${cleaned.slice(3, 6)} ${cleaned.slice(6, 9)} ${cleaned.slice(9)}`;
  }
  
  // If it starts with 0 and is 10 digits, assume Kenyan
  if (cleaned.startsWith('0') && cleaned.length === 10) {
    return `+254 ${cleaned.slice(1, 4)} ${cleaned.slice(4, 7)} ${cleaned.slice(7)}`;
  }
  
  // Otherwise return as is with basic formatting
  if (cleaned.length > 8) {
    return `+${cleaned.slice(0, 3)} ${cleaned.slice(3)}`;
  }
  
  return phone;
};