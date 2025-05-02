<h1 align="center">bsky-catbot</h1>

<p align="center">
  <img src="https://jesus.sh/assets/images/bg/neko-1.gif" width="100%">
</p>

<p align="center">
  a bot that likes posts on bluesky if they meow right.<br />
  built to serve the algorithm with feline devotion.
</p>

---

```
npm install
node index.js
```

or if you just wanna lurk:

```
node index.js --dry
```

you’ll need a `.env`:

```
BSKY_USERNAME=your.handle
BSKY_PASSWORD=your.app.password
```

not sure what that is? [go make one](https://bsky.app/settings/app-passwords)

---

## features

- logs `[LIKE] [score] url` for every match
- regex matches `meow`, `nya`, `mrrp`, `:3`, `owo`, and related war crimes
- tries to skip nsfw-tagged posts + replies to them
- doesn't like things like `:meow_praise:` or `nyaa.si`
- reconnects automatically if stream dies
- prints heartbeat every 5 min so you know it's alive

---

## license

divinely licensed.  
use it, break it, fork it, idgaf.  
no rules. just vibes.