const proxy = require('express-http-proxy');

module.exports = proxy('https://api.beatsaver.com', {
	// request api.beatsaver.com in case you point beatsaver.com to localhost,
	// nslookup api.beatsaver.com says it's an alias of beatsaver.com,
	// so it's safe to request api.beatsaver.com for now
	proxyReqOptDecorator: (req) => {
		req.headers.host = 'beatsaver.com';
		return req;
	},
	filter: (req) => req.headers.referer || !req.path.startsWith('/api')
});