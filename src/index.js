import 'dotenv/config'; // always first import
import express from 'express';
import 'babel-polyfill';
import cors from 'cors';

import entryRoute from './app/route/entryRoute';
import listRoute from './app/route/listRoute';
import userRoute from './app/route/userRoute';

const app = express();

// Add middleware for parsing URL encoded bodies (which are usually sent by browser)
app.use(cors());
// Add middleware for parsing JSON and urlencoded data and populating `req.body`
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use('/to_do_lister/api/entry', entryRoute);
app.use('/to_do_lister/api/list', listRoute);
app.use('/to_do_lister/api/user', userRoute);

app.listen(process.env.PORT, '127.0.0.1').on('listening', () => {
	console.log(`${(new Date()).toISOString()} are live on ${process.env.PORT}`);
});

export default app;
