import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { afterEach, beforeEach, vi } from 'vitest';

// Node 22+ introduces an experimental globalThis.localStorage getter that warns and returns undefined in test environments
class LocalStorageMock implements Storage {
  private store: Record<string, string> = {};

  clear() {
    this.store = {};
  }

  getItem(key: string): string | null {
    return Object.prototype.hasOwnProperty.call(this.store, key) ? this.store[key] : null;
  }

  setItem(key: string, value: string): void {
    this.store[key] = String(value);
  }

  removeItem(key: string): void {
    delete this.store[key];
  }

  get length(): number {
    return Object.keys(this.store).length;
  }

  key(index: number): string | null {
    return Object.keys(this.store)[index] || null;
  }
}

const mockStorage = new LocalStorageMock();
delete (globalThis as Record<string, unknown>).localStorage;
(globalThis as Record<string, unknown>).localStorage = mockStorage;
Object.defineProperty(window, 'localStorage', { value: mockStorage, configurable: true, writable: true });

// Automatically clean up React DOM and local storage after each test
afterEach(() => {
  cleanup();
  mockStorage.clear();
  vi.clearAllMocks();
});

beforeEach(() => {
  mockStorage.clear();
});

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Mock scrollTo
window.scrollTo = vi.fn();
