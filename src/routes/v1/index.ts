import express from 'express';

const router = express.Router();

router.get('/', (_req, res) => res.send({ version: '1' }));

export default router;
