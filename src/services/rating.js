const search = require('./search');

const rating = async (req, res) => {
	req.query.sortOrder = 'Rating';

	return search(req, res);
};

module.exports = rating;