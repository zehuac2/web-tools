import '@testing-library/jest-dom';

// jsdom does not expose `localStorage` under this Node version: Node's own
// experimental implementation is disabled without `--localstorage-file`, and
// it shadows the jsdom one. Supply an in-memory stand-in so tests see the
// same API a browser gives them.
//
// `matchMedia` is deliberately left absent. It is also missing in jsdom, and
// the theme module guards for it. A global stub would hide a missing guard.
if (typeof globalThis.localStorage === 'undefined') {
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
}
