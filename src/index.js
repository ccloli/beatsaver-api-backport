const express = require('express');
const router = require('./router');
const proxy = require('express-http-proxy');
const port = process.env.PORT || 9980;

const app = express();
app.use(proxy('https://beatsaver.com', {
	filter: req => req.headers.referer || !req.path.startsWith('/api')
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