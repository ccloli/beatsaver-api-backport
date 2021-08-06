const express = require('express');
const router = require('./router');
const proxy = require('express-http-proxy');
const port = process.env.PORT || 9980;

const app = express();
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
app.listen(port, () => {
	console.log(`Server is now listening on port ${port}`);
});

app.on('error', (err) => {
	console.error(err);
});
process.on('uncaughtException', (err) => {
	console.error(err);
});