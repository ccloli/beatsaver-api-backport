const { convertSong } = require('../utils/convert');

const detail = async (req, res) => {
	const { axios } = req;
	const { id, hash } = req.params;

	const response = await axios.get(
		hash ? `https://api.beatsaver.com/maps/hash/${hash}`
			: `https://api.beatsaver.com/maps/id/${id}`
	);
	const result = convertSong(response.data);

	return res.json(result);
};

module.exports = detail;