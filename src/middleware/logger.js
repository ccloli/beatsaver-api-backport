const logger = (req, res, next) => {
	console.log(`[${req.ip}] ${req.method} ${req.originalUrl} "${req.headers['user-agent']}"`);
	next();
};

module.exports = logger;