import dbQuery from '../db/dev/dbQuery';

import {
	buildError,
	status
} from '../helper/status';

import { getLog } from '../util/log';

import { 
	PUT_ALL_VALUE_AMOUNT,
	PUT_ALL_VALUE_INDEX_LIST
} from '../constant/entry';

const log = getLog('entryController');

export const doMethod = async (req, res) => {
	const { id } = req.body;
	log('doMethod', { id });
	const query = `UPDATE entry SET status = 'done' WHERE id = $1 RETURNING *;`;
	try {
		const result = await dbQuery.query(query, [id]);
		const rows = result.rows;
		log('doMethod', { result });
		return res.status(status.success).send(rows);
	} catch (error) {
		return buildError(log, 'doMethod', error, res);
	}
};

export const get = async (req, res) => {
	const query = `(SELECT id, list, status, external_id, url, creation_date, external_date, content FROM entry WHERE status like 'done' ORDER BY external_id DESC, external_date DESC, creation_date DESC LIMIT 30) UNION (SELECT id, list, status, external_id, url, creation_date, external_date, content FROM entry WHERE status like 'to do' ORDER BY external_id DESC, external_date DESC, creation_date DESC) ORDER BY external_id DESC, external_date DESC, creation_date DESC;`;
	try {
		const { rows } = await dbQuery.query(query);
		return res.status(status.success).send(rows);
	} catch (error) {
		return buildError(log, 'get', error, res);
	}
};

export const putAll = async (req, res) => {
	log('putAll', { body: req.body });
	let values = req.body.flatMap(entry => [
		entry.list,
		entry.status,
		entry.external_id,
		entry.url,
		entry.creation_date,
		entry.external_date,
		entry.content
	]);
	let valuesString = req.body.map(
		(entry, index) => `(${PUT_ALL_VALUE_INDEX_LIST.map(
			putAllValueIndex => `$${putAllValueIndex + (index * PUT_ALL_VALUE_AMOUNT)}`
		).join(', ')})`
	).join(', ');
	const query = `INSERT INTO entry (list, status, external_id, url, creation_date, external_date, content) VALUES ${valuesString} RETURNING *;`;
	try {
		const result = await dbQuery.query(query, values);
		const rows = result.rows;
		log('putAll', { result });
		return res.status(status.success).send(rows);
	} catch (error) {
		return buildError(log, 'putAll', error, res);
	}
};
