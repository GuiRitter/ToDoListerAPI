import express from 'express';

import verifyAuth from '../middleware/verifyAuth';

import { get } from '../controller/listController';

const router = express.Router();

router.get('/get', verifyAuth, get);

export default router;
