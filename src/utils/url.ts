import { URL } from 'url';
import { join } from 'path';

export const joinUrls = (urls: string[]) => {
  const baseUrl = new URL(urls[0]);
  const pathsToJoin =
    baseUrl.pathname && baseUrl.pathname !== '/' ? [baseUrl.pathname, ...urls.slice(1)] : urls.slice(1);
  return new URL(join(...pathsToJoin), baseUrl.origin).toString();
};
