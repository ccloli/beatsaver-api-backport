const search = require('./search');

const latest = async (req, res) => {
	req.query.fullSpread = 'true';

	return search(req, res);
};

module.exports = latest;