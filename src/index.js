const express = require('express');
const router = require('./router');
const port = process.env.PORT || 9980;

const app = express();
app.use('/', router);
app.listen(port, () => {
	console.log(`Server is now listening on port ${port}`);
});

app.on('error', (err) => {
	console.error(err);
});
process.on('uncaughtException', (err) => {
	console.error(err);
});