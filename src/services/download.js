const axios = require('axios');
const { convertSong } = require('../utils/convert');

const download = async (req, res) => {
	const { id } = req.params;

	const response = await axios.get(`https://api.beatsaver.com/maps/id/${id}`);
	const result = convertSong(response.data);

	res.redirect(302, result.directDownload);
};

module.exports = download;