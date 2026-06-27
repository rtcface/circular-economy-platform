import { describe, it, expect, vi } from 'vitest';
import { createServerFn } from '@tanstack/start';

vi.mock('@tanstack/start', () => {
  return {
    createServerFn: () => {
      let handlerFn: any;
      const chain: any = {
        validator: () => chain,
        handler: (h: any) => {
          handlerFn = h;
          return async (opts: any) => handlerFn(opts);
        }
      };
      return chain;
    }
  };
});

// Since the mock is hoisted, this works!
import * as Start from '@tanstack/start';
const fn = Start.createServerFn({ method: "POST" }).validator((d: any) => d).handler(async ({ data }: any) => { return data.foo; });

describe('test', () => { it('works', async () => {
  const res = await fn({ data: { foo: 'bar' } });
  expect(res).toBe('bar');
}); });
