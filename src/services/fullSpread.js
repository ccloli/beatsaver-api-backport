const search = require('./search');

const fullSpread = async (req, res) => {
	req.query.fullSpread = 'true';

	return search(req, res);
};

module.exports = fullSpread;