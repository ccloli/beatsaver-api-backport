const getLowerCamelCaseName = (str) => `${str[0].toLowerCase()}${str.substr(1)}`;

const getInitKeyMap = (keys, initialValue) => {
	return keys.reduce((pre, e) => {
		pre[e] = initialValue;
		return pre;
	}, {});
}

const backwardURL = (url) => `/redirect/${url}`;

const errorHandler = (err) => {
	console.error(err);
}

module.exports = {
	getLowerCamelCaseName,
	getInitKeyMap,
	backwardURL,
	errorHandler,
};