const detail = require('./detail');

const latest = async (req, res) => {
	req.query.sortOrder = 'Latest';

	return detail(req, res);
};

module.exports = latest;