import express from 'express';
import statusRoutes from './status';
import syncRoutes from './sync';

const router = express.Router();

router.get('/', (_req, res) => res.send({ version: '1' }));
router.use('/status', statusRoutes);
router.use('/sync', syncRoutes);

export default router;
