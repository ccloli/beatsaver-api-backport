const search = require('./search');

const advanced = async (req, res) => {
	const { q = '' } = req.query;

	const result = {};
	// the query syntax of Elastic Search, or Query DSL, is too strong,
	// we can only adapt a small set of original queries and ignore some features like AND/OR and regex
	// see https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-query-string-query.html
	const tokens = q.split(/(?<=.+?:(?:[[{].+?[\]}]|\(.+?\)|".+?"|.+?))(?:\s+(?:AND|OR|\|)\s*|$)/).filter(e => e);

	const parseRange = value => value.replace(/^[[{(]|[\]})]$/g, '').split(/\s+(?:AND|OR|TO)\s+/);
	const ignoreUnsupported = value => (
		// wildcards: *, ?
		// groups: ()
		// fuzzy: ~\d*
		// boost: ^\d*
		// boolean: +, -
		// regex: /.*/
		// the syntax can be combined, but if we case all the cases it'll be too heavy, like reimplementing DSL
		// so... hope nobody will use that complex syntax
		(value || '').replace(/\*|\?|^\(|\)$|\)?~\d*$|\)?\^\d*$|^\+|^-.*$|^\/.+\/$/g, ' ').replace(/\\\\/g, '').trim()
	);
	const isWildCard = value => value === '*';
	const isRegex = value => /^\/.*\/$/.test(value);
	const parseStartEnd = value => {
		// hope no one uses something like >, < and combined them with AND / OR...
		let [start, end] = parseRange(value);
		if (start && !end) {
			// falsy boolean operator (-) is not supported
			if (/^-[>=<]/.test(start)) {
				return [];
			}
			// remove truly boolean operator (+)
			start = start.replace(/^\+/, '');
			if (/^[>=<]/.test(start)) {
				if (start[0] === '>') {
					[end, start] = start.split(/>=?\s*/);
				}
				else if (start[0] === '<') {
					[start, end] = start.split(/<=?\s*/);
				}
				else { // start[0] === '='
					start = start.replace(/^=\s*/, '');
					end = start;
				}
			}
			else {
				end = start;
			}
		}
		[start, end] = [start, end].map(e => (isWildCard(e) || e === '') ? null : e);
		return [start, end];
	};

	tokens.forEach((e) => {
		const [key, value] = e.split(':', 2);

		if (isRegex(value)) {
			return;
		}

		switch (key) {
			case 'uploaded': {
				const [start, end] = parseStartEnd(value);
				result.from = start;
				result.to = end;
				break;
			}

			case 'metadata.songName':
			case 'metadata.songSubName':
			case 'metadata.songAuthorName':
			case 'name':
			case 'description': {
				result.q = [result.q, ...parseRange(value).map(ignoreUnsupported)].filter(e => e).join(' ');
				break;
			}

			case 'metadata.levelAuthorName':
			case 'uploader.username': {
				result.q = [result.q, `mapper:${value}`].filter(e => e).join(' ');
				break;
			}

			case 'metadata.duration': {
				const [start, end] = parseStartEnd(value);
				result.minDuration = start;
				result.maxDuration = end;
				break;
			}

			case 'metadata.bpm': {
				const [start, end] = parseStartEnd(value);
				result.minBpm = start;
				result.maxBpm = end;
				break;
			}

			case 'metadata.automapper': {
				result.automapper = value;
				break;
			}

			case 'metadata.stats.rating': {
				const [start, end] = parseStartEnd(value);
				result.minRating = start;
				result.maxRating = end;
				break;
			}

			case 'key': {
				result.q = [result.q, `key:${value}`].filter(e => e).join(' ');
				break;
			}

			// the other keys are not supported by server
		}
	});

	req.query = result;

	return search(req, res);
};

module.exports = advanced;