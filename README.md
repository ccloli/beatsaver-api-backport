# BeatSaver API Backport Server

## What's this?

An adapter to convert newer BeatSaver API (maintained by Top_Cat) to older version (maintained by The Jellyfish)


## Why I need this?

If you want to use old version's mods, the in-game song download feature may not working properly, since BeatSaver has been refreshed on around Aug 5, 2021, most of the APIs are having breaking change, and old mods may broken because they don't recognise the new API.

The server helps you to migrate the newer APIs, and adapt them to the older APIs on-the-fly, so that the old mods can run most features like browsing song list and downloading them.


## How to use?

You may need to have a look at `.env` file to do some configuration before start up.

```sh
npm i --production
npm start
```

The server is configured to proxy to original `beatsaver.com`, so accessing the server should give you the full features for current version of BeatSaver, and convert APIs to older version automatically for mods (or technically, when not accessing with a web browser).

To make the server (and your mods) fully works, it's **required** to create a https server, and it **must** run on port `443`.

You can either edit the `.env` file to enable the built-in HTTPS server:

```bash
HTTP_ENABLE=true
HTTP_PORT=80
HTTPS_ENABLE=true
HTTPS_PORT=443
HTTPS_KEY=./beatsaver.com.key
HTTPS_CERT=./beatsaver.com.cert
LOG_REQUEST=true
```

Or if you have multiple hosts are running on your server, you can use a simple nginx config file:

```conf
server {
	listen 80;
	listen 443 ssl;
	server_name beatsaver.com;

	ssl_certificate /usr/share/nginx/ssl/beatsaver.com.crt;
	ssl_certificate_key /usr/share/nginx/ssl/beatsaver.com.key;
	ssl_protocols TLSv1 TLSv1.1 TLSv1.2;
	ssl_prefer_server_ciphers on;

	location / {
		# the default http server port in .env is 9980
		proxy_pass http://127.0.0.1:9980;
	}
}
```

However, in either way, you still need to create a SSL certificate of `beatsaver.com` to make it works.

Since you don't own `beatsaver.com`, so you cannot sign a public validated certificate. Instead, you have to [self-sign a SSL certificate](https://www.google.com/search?q=how+to+generate+a+self-signed+ssl), and [trust it on the PC](https://www.google.com/search?q=how+to+trust+a+self-signed+ssl) you want to use old mods.

Finally, update your hosts file, add a line to point `beatsaver.com` to your server:

```conf
<server-ip> beatsaver.com

# for example, if you run the server on localhost, put it like this
# 127.0.0.1 beatsaver.com
```

If you have setup some DNS resolver programs like Adguard Home, it's recommend to do the same things on them.

If everything works fine, open `https://beatsaver.com` on the PC that has trusted the self-signed certificate and set hosts file, the site should works fine and you should see the request logs on terminal. Opening game and click _More Songs_ button, you should see the latest song list and can download any songs.


## Why I need this?

Again, if you're intended to use a newer version of game and mods, and don't want to stay on old version's game or mods (which is also not recommended by BSMG), then you don't need this. Instead, all you need to do is to wait the mods being updated.

If you're trying to run an older version of game or mods (again it's not recommended by BSMG), and wants to download songs in game, then this is a way to make it works again.


## I'm not a geek, can I use a public hosted server?

You can, but not recommended for security reasons. They may modify the source code which makes you download malware. No one can sure the server is running the same code in this repo.


## Why you write this?

I'm not interested in updating (and have reason to run old version game), and don't like the feeling that having BREAKING CHANGE things and doesn't compatible with the old version.

Though to be honest, it's still a good step to make BeatSaver works better like having new features, a short pain is for better future. But I'm still prefer to compatible with older APIs, and newer APIs should distinct with older APIs like having a newer prefix like `/api/v2/`. But as the server's maintainer is changed, so it may not possible as it's not easy to do an adapter.


## Special Thanks

- [Internet Archive Wayback Machine](https://web.archive.org/web/*/https://beatsaver.com/api/*) for most API URLs and response data
- [BeatSaberDataProvider](https://github.com/Zingabopp/BeatSaberDataProvider/blob/586cb111a381be95bc77a165bb85cd51839772c4/SongFeedReadersTests/WebUtilsTests/GetRateLimitedBase_Tests.cs) and [BeatSaverDownloader](https://github.com/andruzzzhka/BeatSaverDownloader/blob/88430ed017828f8cf7102680310900e789a0387d/BeatSaverDownloader/Misc/BeatSaverAPIResult.cs) for some missing API URLs and data structs.


## License

MIT
