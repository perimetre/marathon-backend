import { Locale, Prisma, PrismaClient } from '@prisma/client';
import { MaybePromise, ObjectDefinitionBlock } from 'nexus/dist/core';
import { URL } from 'url';
import { env } from '../env';
import { TlsContext } from 'aws-sdk/clients/iot';
import { Context } from '../typings/context';

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
): Promise<T> => {
  const path = await originalResolve(root, args, context, info);
  if (path) {
    try {
      return new URL(path, env.PUBLIC_MEDIA_URI).toString() as T;
    } catch {
      return path;
    }
  }

  return path;
};

export const registerTranslatedFields = <TypeName extends TypeNames>(
  t: ObjectDefinitionBlock<TypeName>,
  keys: string[],
  table: (ctx: Context) => any
) => {
  for (let i = 0; i < keys.length; i++) {
    const key = keys[i];

    t.string(key, {
      resolve: async (root, _args, ctx) => {
        const defaultLocale = env.DEFAULT_LOCALE;
        const translations = await table(ctx)
          .findUnique({ where: { id: root.id } })
          .translations({
            where: {
              locale: { in: (ctx.locale !== defaultLocale ? [ctx.locale, defaultLocale] : [defaultLocale]) as Locale[] }
            }
          });

        const localeTranslation = translations.find((x: any) => x.locale === ctx.locale);
        if (localeTranslation) {
          return localeTranslation[key];
        } else {
          const defaultTranslation = translations.find((x: any) => x.locale === defaultLocale);
          if (defaultTranslation) {
            return defaultTranslation[key];
          }
        }

        return null;
      }
    });
  }
};
