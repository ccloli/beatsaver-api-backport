const express = require('express');
require('express-async-errors');
const http = require('http');
const https = require('https');
const fs = require('fs');
const router = require('./router');
const realIP = require('./middleware/realIP');
const logger = require('./middleware/logger');
const redirect = require('./middleware/redirect');
const proxy = require('./middleware/proxy');
const catchError = require('./middleware/catchError');
const axiosHook = require('./middleware/axiosHook');
const { errorHandler } = require('./utils/utils');

const app = express();
if (process.env.LOG_TRUST_PROXY === 'true') {
	app.enable('trust proxy');
}

app.use(realIP);
if (process.env.LOG_REQUEST === 'true') {
	app.use(logger);
}
app.use('/redirect/', redirect);
app.use(proxy);
app.use(axiosHook);
app.use('/', router);
app.use(catchError);

app.on('error', errorHandler);
process.on('uncaughtException', errorHandler);
process.on('unhandledRejection', errorHandler);

if (process.env.HTTP_ENABLE === 'true') {
	const port = process.env.HTTP_PORT || 9980;
	http.createServer(app).listen(port, () => {
		console.log(`HTTP server is now listening on port ${port}`);
	}).on('error', errorHandler);
}
if (process.env.HTTPS_ENABLE === 'true') {
	const port = process.env.HTTPS_PORT || 9443;
	https.createServer({
		key: fs.readFileSync(process.env.HTTPS_KEY, 'utf-8'),
		cert: fs.readFileSync(process.env.HTTPS_CERT, 'utf-8'),
	}, app).listen(port, () => {
		console.log(`HTTPS server is now listening on port ${port}`);
	}).on('error', errorHandler);
}