import express from 'express';
import { getDb } from '../../database';
import { env } from '../../env';
import { marathonService } from '../../services/marathon';

const router = express.Router({ mergeParams: true });

router.get('/', async (req, res) => {
  const { SYNC_AUTH } = env;
  if (SYNC_AUTH && req.query.auth === SYNC_AUTH) {
    // Do not await, fire and forget
    marathonService({ db: getDb() }).syncData();
    res.json({ succeeded: 'true' });
  } else {
    res.status(401).json({ error: 'unauthorized' });
  }
});

export default router;
