export const setStorageItem = (key: string, value: any): void => {
  try {
    const serializedValue = typeof value === 'object'
      ? JSON.stringify(value)
      : String(value);

    localStorage.setItem(key, serializedValue);
  } catch (error) {
    console.error('Error setting localStorage item:', error);
  }
};

export const getStorageItem = (key: string): any => {
  try {
    const item = localStorage.getItem(key);

    if (item === null) {
      return null;
    }

    try {
      return JSON.parse(item);
    } catch (e) {
      return item;
    }
  } catch (error) {
    console.error('Error getting localStorage item:', error);
    return null;
  }
};

export const removeStorageItem = (key: string): void => {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error('Error removing localStorage item:', error);
  }
};
