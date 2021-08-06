const { getLowerCamelCaseName, getInitKeyMap, backwardURL } = require('./utils');

const convertSong = (data) => {
	const lastVersion = Array.from(data.versions || [])
		.sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt))
		.find(e => e.state === 'Published');

	const difficultyNames = ['easy', 'expert', 'expertPlus', 'hard', 'normal'];

	const metadata = {
		// bpm, duration, songName, songSubName, songAuthorName, levelAuthorName
		...data.metadata,
		difficulties: (lastVersion.diffs || []).reduce((pre, e) => {
			pre[getLowerCamelCaseName(e.difficulty)] = true;
			return pre;
		}, getInitKeyMap(difficultyNames, false)),
		automapper: data.automapper || null,
		characteristics: Object.entries(
			(lastVersion.diffs || []).reduce((pre, e) => {
				if (!pre[e.characteristic]) {
					pre[e.characteristic] = getInitKeyMap(difficultyNames, null);
				}
				pre[e.characteristic][getLowerCamelCaseName(e.difficulty)] = {
					duration: Math.round(e.length), // wait
					length: Math.round(e.seconds),  // what
					njs: e.njs,
					njsOffset: e.offset,
					bombs: e.bombs,
					notes: e.notes,
					obstacles: e.obstacles,
				}
				return pre;
			}, {})
		).map(([name, difficulties]) => ({ name, difficulties })),
	};
	const stats = {
		downloads: data.stats.downloads,
		plays: data.stats.plays,
		downVotes: data.stats.downvotes,
		upVotes: data.stats.upvotes,
		heat: 0, // not defined in new api
		rating: data.stats.score,
	};
	const uploader = {
		_id: data.uploader.id,
		username: data.uploader.name,
	};

	return {
		metadata,
		stats,
		description: data.description,
		deletedAt: lastVersion.deletedAt || null,
		_id: data.id,
		key: data.id,
		name: data.name,
		uploader,
		hash: lastVersion.hash,
		uploaded: data.uploaded,
		directDownload: backwardURL(lastVersion.downloadURL),
		downloadURL: backwardURL(lastVersion.downloadURL),
		coverURL: backwardURL(lastVersion.coverURL),
	};
};

module.exports = {
	convertSong,
};