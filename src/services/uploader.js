const { convertSong } = require('../utils/convert');

const uploader = async (req, res) => {
	const { axios } = req;
	const { id, page } = req.params;
	const perPage = 20;

	const listResponse = await axios.get(`https://api.beatsaver.com/maps/uploader/${id}/${page}`);
	const userResponse = await axios.get(`https://api.beatsaver.com/users/id/${id}`);
	const { docs } = listResponse.data;
	const { stats } = userResponse.data;
	const lastPage = Math.ceil(stats.totalMaps / perPage) - 1;

	return res.json({
		...listResponse.data,
		docs: docs.map(convertSong),
		totalDocs: stats.totalMaps,
		lastPage,
		prevPage: page > 0 ? +page - 1 : null,
		nextPage: page < lastPage ? +page + 1 : null,
	});
};

module.exports = uploader;