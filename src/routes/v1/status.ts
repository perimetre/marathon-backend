/* eslint-disable @typescript-eslint/no-explicit-any */
import express from 'express';
import { getDb } from '../../database';
import { env } from '../../env';
import { marathonService } from '../../services/marathon';
import {
  GET_PRODUCT_STATUS,
  GET_SP_CATEGORY_STATUS,
  GET_SP_COLLECTION_STATUS,
  GET_SP_DRAWER_TYPES_STATUS,
  GET_SP_FINISH_STATUS
} from '../../services/marathon/queries';

const router = express.Router({ mergeParams: true });

router.get('/', async (req, res) => {
  const status: any = {};
  const db = getDb();
  const marathService = marathonService({ db });

  // Is backend able to connect to the DB
  try {
    // Tries to connect to the database
    const dbStatus = await db.$queryRaw`SHOW STATUS`;
    // If succeeded
    status.db = {
      status: 'success',
      result: {
        uptime: dbStatus.find((x: any) => x['Variable_name'] === 'Uptime')?.Value
      }
    };
  } catch (error) {
    // If failed
    status.db = {
      status: 'failed',
      error
    };
  }

  // Is Auth working
  try {
    // Tries to connect to the auth
    await marathService.login({ email: 'jo.redman@email.com', password: 'joredman' });

    // If succeeded
    status.marathonAuth = {
      status: 'success'
    };
  } catch (error: any) {
    // If failed
    status.marathonAuth = {
      status: 'failed',
      error: {
        message: error?.message,
        status: error.status
      }
    };
  }

  status.marathonApi = {
    status: 'success'
  };

  try {
    await marathService.marathonGraphql(GET_SP_CATEGORY_STATUS);
  } catch (error: any) {
    status.marathonApi.status = 'failed';
    status.marathonApi.error = {
      ...status.marathonApi.error,
      category: {
        message: error?.message,
        status: error.status
      }
    };
  }

  try {
    await marathService.marathonGraphql(GET_SP_COLLECTION_STATUS);
  } catch (error: any) {
    status.marathonApi.status = 'failed';
    status.marathonApi.error = {
      ...status.marathonApi.error,
      collection: {
        message: error?.message,
        status: error.status
      }
    };
  }

  try {
    await marathService.marathonGraphql(GET_SP_DRAWER_TYPES_STATUS);
  } catch (error: any) {
    status.marathonApi.status = 'failed';
    status.marathonApi.error = {
      ...status.marathonApi.error,
      drawerType: {
        message: error?.message,
        status: error.status
      }
    };
  }

  try {
    await marathService.marathonGraphql(GET_SP_FINISH_STATUS);
  } catch (error: any) {
    status.marathonApi.status = 'failed';
    status.marathonApi.error = {
      ...status.marathonApi.error,
      finish: {
        message: error?.message,
        status: error.status
      }
    };
  }

  try {
    await marathService.marathonGraphql(GET_PRODUCT_STATUS);
  } catch (error: any) {
    status.marathonApi.status = 'failed';
    status.marathonApi.error = {
      ...status.marathonApi.error,
      products: {
        message: error?.message,
        status: error.status
      }
    };
  }

  status.env = {
    NODE_ENV: env.NODE_ENV,
    LOG_QUERY: env.PRISMA_LOG_QUERY,
    PUBLIC_MEDIA_URI: env.PUBLIC_MEDIA_URI,
    ASSET_BUNDLE_FOLDER: env.ASSET_BUNDLE_FOLDER,
    DEFAULT_PLATFORM: env.DEFAULT_PLATFORM,
    MARATHON_API: env.MARATHON_API
  };

  res.json(status);
});

export default router;
