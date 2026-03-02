// Shared routes stub. The full server API definitions are no longer
// needed in the front-end build and have been removed to avoid TypeScript
// errors during compilation.

export const api = {};

export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}
