const axios = require('axios');
const { convertSong } = require('../utils/convert');

const detail = async (req, res) => {
	const { id } = req.params;

	const response = await axios.get(`https://api.beatsaver.com/maps/id/${id}`);
	console.log(response.data);
	const result = convertSong(response.data);
	console.log(result);

	return res.json(result);
};

module.exports = detail;