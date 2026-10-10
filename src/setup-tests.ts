import '@testing-library/jest-dom';

// Supply an in-memory `localStorage` for tests. Do not read the global first:
// Node's getter can warn or throw without `--localstorage-file`.
//
// `matchMedia` is deliberately left absent. It is also missing in jsdom, and
// the theme module guards for it. A global stub would hide a missing guard.
const store = new Map<string, string>();

const memoryStorage: Storage = {
  get length() {
    return store.size;
  },
  key: (index) => [...store.keys()][index] ?? null,
  getItem: (key) => store.get(key) ?? null,
  setItem: (key, value) => {
    store.set(key, String(value));
  },
  removeItem: (key) => {
    store.delete(key);
  },
  clear: () => {
    store.clear();
  },
};

Object.defineProperty(globalThis, 'localStorage', {
  value: memoryStorage,
  configurable: true,
});
