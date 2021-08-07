const realIP = (req, res, next) => {
	// x-forwarded-for is handled by express if trust proxy enabled
	req.ip = req.headers['cf-connecting-ip'] || req.ip;
	next();
};

module.exports = realIP;