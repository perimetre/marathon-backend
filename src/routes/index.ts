import express from 'express';
import v1Router from './v1';

const router = express.Router();
router.get('/', (_req, res) => res.send({ currentVersion: 'v1' }));
router.use('/v1', v1Router);

export default router;
