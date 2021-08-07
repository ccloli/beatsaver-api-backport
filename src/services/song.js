const { convertInfo } = require('../utils/convert');

const song = async (req, res) => {
	const { axios } = req;
	const { id, hash } = req.params;

	const response = await axios.get(
		hash ? `https://api.beatsaver.com/maps/hash/${hash}`
			: `https://api.beatsaver.com/maps/id/${id}`
	);
	const result = convertInfo(response.data);

	return res.json(hash ? {
		songs: [result]
	} : {
		song: result
	});
};

module.exports = song;