import { defineAction } from 'astro:actions';

export const logout = defineAction({
  accept: 'json',
  handler: async () => {
    return { ok: true };
  },
});
