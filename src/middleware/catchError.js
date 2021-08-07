const catchError = (err, req, res, next) => {
	if (err.isAxiosError) {
		const { response } = err;
		if (response) {
			console.log(response.data);
			res.statusCode = response.status;
			res.json(response.data);
			return;
		}
	}

	console.error(err);
	res.statusCode = 500;
	res.json({
		error: 'Server Internal Error',
		message: err.message,
	});

	next(err);
};

module.exports = catchError;