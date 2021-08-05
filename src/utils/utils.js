const getLowerCamelCaseName = (str) => `${str[0].toLowerCase()}${str.substr(1)}`;

const getInitKeyMap = (keys, initialValue) => {
	return keys.reduce((pre, e) => {
		pre[e] = initialValue;
		return pre;
	}, {});
}

module.exports = {
	getLowerCamelCaseName,
	getInitKeyMap,
};