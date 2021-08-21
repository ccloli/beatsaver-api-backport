const { convertSong } = require('../utils/convert');

const search = async (req, res) => {
	const { axios } = req;
	const { page = 0 } = req.params;
	const perPage = 20;

	const listResponse = await axios.get(`https://api.beatsaver.com/search/text/${page}`, {
		params: {
			sortOrder: 'Relevance',
			...req.query
		}
	});
	const { docs } = listResponse.data;

	return res.json({
		...listResponse.data,
		docs: docs.map(convertSong),
		// we don't know how many maps are matched
		totalDocs: docs.length ? 1e9 : page * perPage,
		lastPage: docs.length ? 1e9 / perPage : page,
		prevPage: page > 0 ? +page - 1 : null,
		nextPage: docs.length ? +page + 1 : null,
	});
};

module.exports = search;