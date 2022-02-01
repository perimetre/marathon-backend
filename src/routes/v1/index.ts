import express from 'express';
import statusRoutes from './status';

const router = express.Router();

router.get('/', (_req, res) => res.send({ version: '1' }));
router.use('/status', statusRoutes);

export default router;
