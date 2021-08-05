const axios = require('axios');
const { convertSong } = require('../utils/convert');

const detail = async (req, res) => {
	const { id } = req.params;

	const response = await axios.get(`https://api.beatsaver.com/maps/id/${id}`);
	const result = convertSong(response.data);

	return res.json(result);
};

module.exports = detail;