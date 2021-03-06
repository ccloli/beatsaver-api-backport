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
		...data.stats,
		downloads: data.stats.downloads,
		plays: data.stats.plays,
		downVotes: data.stats.downvotes,
		upVotes: data.stats.upvotes,
		heat: 0, // not defined in new api
		rating: data.stats.score,
	};
	const uploader = {
		...data.uploader,
		_id: data.uploader.id,
		username: data.uploader.name,
	};

	return {
		...data,
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

const convertInfo = (data) => {
	const lastVersion = Array.from(data.versions || [])
		.sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt))
		.find(e => e.state === 'Published');

	return {
		key: data.id,
		name: data.name,
		description: data.description,
		uploaderId: data.uploader.id,
		uploader: data.uploader.name,
		songName: data.metadata.songName,
		songSubName: data.metadata.songSubName,
		authorName: data.metadata.songAuthorName,
		bpm: data.metadata.bpm,
		downloadUrl: backwardURL(lastVersion.downloadURL),
		coverUrl: backwardURL(lastVersion.coverUrl),
		hashMd5: lastVersion.hash,
		downloadCount: data.stats.downloads,
		playedCount: data.stats.plays,
		downVotes: data.stats.downvotes,
		upVotes: data.stats.upvotes,
		createdAt: lastVersion.createdAt,
	}
};

module.exports = {
	convertSong,
	convertInfo,
};