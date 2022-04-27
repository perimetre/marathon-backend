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

router.get('/parse/:id', async (req, res) => {
  const { SYNC_AUTH } = env;
  if (SYNC_AUTH && req.query.auth === SYNC_AUTH && req.params.id) {
    // Do not await, fire and forget
    const data = await marathonService({ db: getDb() }).fetchSingleProduct(req.params.id);
    res.json(data);
  } else {
    res.status(401).json({ error: 'unauthorized' });
  }
});

export default router;
