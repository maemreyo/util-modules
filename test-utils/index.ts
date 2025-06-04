// @ts-nocheck
// test-utils/index.ts
import { faker } from '@faker-js/faker';

export { faker };

export function createMockData<T>(factory: () => T, count = 1): T[] {
  return Array.from({ length: count }, factory);
}

export function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function mockConsole() {
  const originalConsole = { ...console };

  beforeEach(() => {
    console.log = vi.fn();
    console.error = vi.fn();
    console.warn = vi.fn();
  });

  afterEach(() => {
    console.log = originalConsole.log;
    console.error = originalConsole.error;
    console.warn = originalConsole.warn;
  });

  return {
    getLogs: () => (console.log as any).mock.calls,
    getErrors: () => (console.error as any).mock.calls,
    getWarnings: () => (console.warn as any).mock.calls,
  };
}
