const express = require('express');
const proxy = require('express-http-proxy');
const http = require('http');
const https = require('https');
const fs = require('fs');
const router = require('./router');

const app = express();

if (process.env.LOG_REQUEST === 'true') {
	app.use((req, res, next) => {
		console.log(`[${req.ip}] ${req.method} ${req.originalUrl}`);
		next();
	});
}

app.use(proxy('https://api.beatsaver.com', {
	// request api.beatsaver.com in case you point beatsaver.com to localhost,
	// nslookup api.beatsaver.com says it's an alias of beatsaver.com,
	// so it's safe to request api.beatsaver.com for now
	proxyReqOptDecorator: (req) => {
		req.headers.host = 'beatsaver.com';
		return req;
	},
	filter: (req) => req.headers.referer || !req.path.startsWith('/api')
}));

app.use('/', router);

app.on('error', (err) => {
	console.error(err);
});
process.on('uncaughtException', (err) => {
	console.error(err);
});

if (process.env.HTTP_ENABLE === 'true') {
	const port = process.env.HTTP_PORT || 9980;
	http.createServer(app).listen(port, () => {
		console.log(`HTTP server is now listening on port ${port}`);
	}).on('error', (err) => {
		console.error(err);
	});
}
if (process.env.HTTPS_ENABLE === 'true') {
	const port = process.env.HTTPS_PORT || 9443;
	https.createServer({
		key: fs.readFileSync(process.env.HTTPS_KEY, 'utf-8'),
		cert: fs.readFileSync(process.env.HTTPS_CERT, 'utf-8'),
	}, app).listen(port, () => {
		console.log(`HTTPS server is now listening on port ${port}`);
	}).on('error', (err) => {
		console.error(err);
	});
}