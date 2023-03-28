import express from 'express';

import verifyAuth from '../middleware/verifyAuth';

import { doMethod, get, putAll } from '../controller/entryController';

const router = express.Router();

router.post('/do', verifyAuth, doMethod);
router.get('/get', verifyAuth, get);
router.post('/put_all', verifyAuth, putAll);

export default router;
