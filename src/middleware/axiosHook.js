const axios = require('axios');

const axiosHook = (req, res, next) => {
	// eslint-disable-next-line no-unused-vars
	const { host, ...headers } = req.headers;
	const instance = axios.create({
		headers: {
			...headers,
			'X-Forwarded-For': req.headers['x-forwarded-for'] || req.ip,
			'X-Real-IP': req.headers['x-real-ip'] || req.ip,
			'X-Requested-With': 'beatsaver-api-backport',
			'X-Request-Original-URL': req.originalUrl,
			'X-Request-Original-Method': req.method,
		},
		timeout: 30e3,
	});

	req.axios = instance;
	next();
};

module.exports = axiosHook;