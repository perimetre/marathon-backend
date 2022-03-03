import path from 'path';

export const isSameExtesion = (...paths: string[]) => {
  if (!paths || paths.length <= 0) return false;

  const exts = paths.map(path.extname);
  const first = exts[1];

  return exts.every((ext) => ext === first);
};

export const replaceExtension = (original: string, replaceWith: string) => {
  //   if (isSameExtesion(original, replaceWith)) return original;

  const newExt = path.extname(replaceWith);
  const originalExt = path.extname(original);

  return originalExt ? original.replace(originalExt, newExt) : original + newExt;
};
