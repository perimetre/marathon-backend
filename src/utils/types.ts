export type NoNullFields<Ob> = {
  // eslint-disable-next-line @typescript-eslint/ban-types
  [K in keyof Ob]: Ob[K] extends object ? NoNullFields<Ob[K]> : NonNullable<Ob[K]>;
};
