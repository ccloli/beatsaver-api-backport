const search = require('./search');

const latest = async (req, res) => {
	req.query.sortOrder = 'Latest';

	return search(req, res);
};

module.exports = latest;