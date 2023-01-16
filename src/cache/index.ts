const storage = window.localStorage;
const prefix = 'app.';
const prefixLength = prefix.length;

export const all = (): Record<string, string> => {
  const allKeys = keys();
  const all: Record<string, string> = {};
  allKeys.forEach((key: string) => {
    const value = get(key);
    if (value === null) return;
    all[key] = value;
  }, {});
  return all;
};

export const keys = (): string[] => {
  const keys = new Array(storage.length);
  let length = 0;
  for (let i = 0; i < storage.length; ++i) {
    const key = storage.key(i);
    if (key === null) continue;
    if (key.substring(0, prefixLength) !== prefix) continue;
    keys[length] = key.substring(prefixLength, 0);
    ++length;
  }
  return keys.slice(0, length);
};

export const get = (key: string): string | null => {
  return localStorage.getItem(`${prefix}${key}`);
};

export const set = (key: string, value: unknown = null): void => {
  if (value == null) {
    return localStorage.removeItem(`${prefix}${key}`);
  }
  localStorage.setItem(`${prefix}${key}`, `${value}`);
};

export const unset = (key: string): void => {
  return localStorage.removeItem(`${prefix}${key}`);
};

export const clear = (): void => {
  return localStorage.clear();
};
