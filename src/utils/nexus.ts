import { Locale, Prisma } from '@prisma/client';
import { MaybePromise, ObjectDefinitionBlock } from 'nexus/dist/core';
import { env } from '../env';
import { Context } from '../typings/context';
import { joinUrls } from './url';

type TypeNames = keyof typeof Prisma.ModelName;

export const registerModelsWithPrismaBinding = <TypeName extends TypeNames>(
  t: ObjectDefinitionBlock<TypeName>,
  keysToAddFiltering?: string[],
  keysToIgnore?: string[]
) => {
  // If we want to filter
  if (keysToAddFiltering) {
    const keys = Object.keys(t.model).filter((key) => (keysToIgnore ? !keysToIgnore.includes(key) : true));

    keys
      .filter((key) => !keysToAddFiltering.includes(key)) // Get only the keys that are NOT in the filter array
      .forEach((key) => t.model[key]()); // Register the model

    // Add filters only to the ones in the array
    keys
      .filter((key) => keysToAddFiltering.includes(key)) // Get only the keys that ARE in the filter array
      .forEach((key) => t.model[key]({ filtering: true, ordering: true, pagination: true })); // Register with filtering
  } else {
    // If we don't want to filter just run all
    Object.keys(t.model)
      .filter((key) => (keysToIgnore ? !keysToIgnore.includes(key) : true))
      .forEach((key) => t.model[key]());
  }
};

export const resolvePublicMediaUrlToField = async <T extends string | null, TRoot, TArgs, TContext, TInfo>(
  root: TRoot,
  args: TArgs,
  context: TContext,
  info: TInfo,
  originalResolve: (root: TRoot, args: TArgs, context: TContext, info: TInfo) => MaybePromise<T>
): Promise<T | null> => {
  const path = await originalResolve(root, args, context, info);
  return path ? (joinUrls([env.PUBLIC_MEDIA_URI, path].filter((x) => !!x) as string[]) as T) : null;
};

export const resolveAssetBundleUrlToField = async <
  T extends string | null,
  TRoot,
  TArgs,
  TContext extends Context,
  TInfo
>(
  root: TRoot,
  args: TArgs,
  context: TContext,
  info: TInfo,
  originalResolve: (root: TRoot, args: TArgs, context: TContext, info: TInfo) => MaybePromise<T>
): Promise<T | null> => {
  const path = await originalResolve(root, args, context, info);
  return path
    ? (joinUrls(
        [env.PUBLIC_MEDIA_URI, env.ASSET_BUNDLE_FOLDER, context.platform, path].filter((x) => !!x) as string[]
      ) as T)
    : null;
};

const resolveTranslatedField = async <T extends { id: number }>(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  table: (ctx: Context) => any,
  ctx: Context,
  root: T,
  key: string
) => {
  const defaultLocale = env.DEFAULT_LOCALE;
  const translations = await table(ctx)
    .findUnique({ where: { id: root.id } })
    .translations({
      where: {
        locale: { in: (ctx.locale !== defaultLocale ? [ctx.locale, defaultLocale] : [defaultLocale]) as Locale[] }
      }
    });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const localeTranslation = translations.find((x: any) => x.locale === ctx.locale);
  if (localeTranslation) {
    return localeTranslation[key];
  } else {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const defaultTranslation = translations.find((x: any) => x.locale === defaultLocale);
    if (defaultTranslation) {
      return defaultTranslation[key];
    }
  }
};

export const registerNonNullTranslatedFields = <TypeName extends TypeNames>(
  t: ObjectDefinitionBlock<TypeName>,
  keys: string[],
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  table: (ctx: Context) => any
) => {
  for (let i = 0; i < keys.length; i++) {
    const key = keys[i];

    t.nonNull.string(key, {
      resolve: async (root, _args, ctx) => {
        const translatedField = await resolveTranslatedField(table, ctx, root, key);
        if (!translatedField) {
          throw new Error(`Not null field ${key} expected value but is null`);
        } else {
          return translatedField;
        }
      }
    });
  }
};

export const registerTranslatedFields = <TypeName extends TypeNames>(
  t: ObjectDefinitionBlock<TypeName>,
  keys: string[],
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  table: (ctx: Context) => any
) => {
  for (let i = 0; i < keys.length; i++) {
    const key = keys[i];

    t.string(key, {
      resolve: async (root, _args, ctx) => {
        return (await resolveTranslatedField(table, ctx, root, key)) || null;
      }
    });
  }
};
