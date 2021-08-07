const { convertSong } = require('../utils/convert');

const download = async (req, res) => {
	const { axios } = req;
	const { id, hash } = req.params;

	const response = await axios.get(
		hash ? `https://api.beatsaver.com/maps/hash/${hash}`
			: `https://api.beatsaver.com/maps/id/${id}`
	);
	const result = convertSong(response.data);

	res.redirect(302, result.directDownload);
};

module.exports = download;