const redirect = (req, res) => {
	const path = req.url.replace(/^\//, '');
	res.redirect(path);
};

module.exports = redirect;