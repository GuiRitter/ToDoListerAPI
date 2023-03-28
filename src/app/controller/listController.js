import dbQuery from '../db/dev/dbQuery';

import {
	buildError,
	status
} from '../helper/status';

import { getLog } from '../util/log';

const log = getLog('listController');

export const get = async (req, res) => {
	const query = 'SELECT id, name FROM list ORDER BY name;';
	try {
		const { rows } = await dbQuery.query(query);
		return res.status(status.success).send(rows);
	} catch (error) {
		return buildError(log, 'get', error, res);
	}
};
