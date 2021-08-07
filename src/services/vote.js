const axios = require('axios');
const { convertSong } = require('../utils/convert');

const vote = async (req, res) => {
	const { id } = req.params;
	const { steamID, ticket, direction } = req.body;

	// the new api can only be voted by hash
	const response = await axios.get(`https://api.beatsaver.com/maps/id/${id}`);
	const { hash } = convertSong(response.data);

	if (!hash) {
		res.statusCode = 404;
		res.json({
			error: 'Map hash not found'
		});
		return;
	}

	const submitResponse = await axios.post(`https://api.beatsaver.com/vote`, {
		auth: {
			steamId: steamID,
			proof: ticket,
			oculusId: null,
		},
		direction: direction > 0,
		hash,
	});

	if (!submitResponse.success) {
		res.statusCode = 403;
		res.json(submitResponse);
		return;
	}

	const mapResponse = await axios.get(`https://api.beatsaver.com/maps/id/${id}`);
	const result = convertSong(mapResponse.data);

	// the vote result is a subset of song detail
	return res.json(result);
};

module.exports = vote;