const axios = require('axios');

let userAgentString;
let appName;
try {
	if (process.env.npm_package_name) {
		appName = process.env.npm_package_name;
		userAgentString = [
			process.env.npm_package_name, process.env.npm_package_version
		].filter(e => e).join('/');
	} else {
		const packageJson = require('../../package.json');
		appName = packageJson.name;
		userAgentString = [
			packageJson.name, packageJson.version
		].filter(e => e).join('/');
	}
} catch (err) {
	console.error(err);
	userAgentString = 'beatsaver-api-backport';
	appName = 'beatsaver-api-backport';
}
userAgentString = `${userAgentString} (+https://github.com/ccloli/beatsaver-api-backport)`;

const axiosHook = (req, res, next) => {
	// eslint-disable-next-line no-unused-vars
	const { host, ...headers } = req.headers;
	const instance = axios.create({
		headers: {
			...headers,
			'X-Forwarded-For': req.headers['x-forwarded-for'] || req.ip,
			'X-Real-IP': req.headers['x-real-ip'] || req.ip,
			'X-Requested-With': appName,
			'X-Request-Original-URL': req.originalUrl,
			'X-Request-Original-Method': req.method,
			'User-Agent': [req.headers['user-agent'], userAgentString].filter(e => e).join(' '),
		},
		timeout: 30e3,
	});

	req.axios = instance;
	next();
};

module.exports = axiosHook;