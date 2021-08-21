const proxy = require('express-http-proxy');

module.exports = filterBrowser => proxy('https://api.beatsaver.com', {
	// request api.beatsaver.com in case you point beatsaver.com to localhost,
	// nslookup api.beatsaver.com says it's an alias of beatsaver.com,
	// so it's safe to request api.beatsaver.com for now
	proxyReqOptDecorator: (req) => {
		req.headers.host = 'beatsaver.com';
		return req;
	},
	// the api services have already merged newer api data struct and older struct,
	// so in theory it will fit both the old mods and new mods,
	// and it should be fine to put proxy middleware after api convert services.
	// however, beatsaver website itself has a strict JSON validator,
	// and the merged data will make the site throw a validation error,
	// saying the data has additional keys (like `_id`).
	// so it's still need to put a proxy middleware before api services,
	...(filterBrowser && {
		filter: (req) => req.headers.referer || !req.path.startsWith('/api')
	}),
});