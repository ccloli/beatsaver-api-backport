const cdn = async (req, res) => {
	const { file } = req.params;

	res.redirect(302, `https://cdn.beatsaver.com/${file}`);
};

module.exports = cdn;