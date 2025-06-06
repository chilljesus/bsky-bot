import WebSocket from 'ws';
import { log, isSafe, getCatness, getRandomMeow } from './utils.js';

const cockremoverDid = 'did:plc:hdfrgtchoulcxlfzl2qsqdec';
const trixDid = 'did:plc:honas5g3yaqo33mqvpfv5xdf';

const connectFirehose = async (client, likePost, dryRun) => {
  let ws;

  const connect = () => {
    ws = new WebSocket(
      'wss://jetstream1.us-east.bsky.network/subscribe?wantedCollections=app.bsky.feed.post',
      { perMessageDeflate: false }
    );

    ws.on('open', () => {
      log('Connected to Bluesky Jetstream (subscribed to posts)');
    });

    ws.on('message', (data) => {
      handleMessage(data).catch((err) => {
        log(`Message handler error: ${err.message}`);
      });
    });

    ws.on('error', (err) => {
      log(`WebSocket error: ${err.message}`);
    });

    ws.on('close', () => {
      log('WebSocket closed. Reconnecting in 5 seconds...');
      setTimeout(connect, 5000);
    });
  };

  const handleMessage = async (data) => {
    let evt;
    try {
      evt = JSON.parse(data);
    } catch (err) {
      log(`Invalid JSON received: ${err.message}`);
      return;
    }

    if (evt.kind !== 'commit') return;
    const commit = evt.commit;
    if (!commit || commit.collection !== 'app.bsky.feed.post') return;

    const post = commit.record;
    if (!post || !post.text) return;

    const uri = `at://${evt.did}/app.bsky.feed.post/${commit.rkey}`;
    const url = `https://bsky.app/profile/${evt.did}/post/${commit.rkey}`;
    const fakePost = { record: post, uri };

    //                              //
    // NEVER UNCOMMENT THESE LINES //
    //                            //
    /*log(`[LIKE] ${url}`);
    await likePost(client, uri, commit.cid, dryRun);
    return;*/

    const text = post.text;
    const score = getCatness(text);
    if (score >= 4) {
      const safe = await isSafe(fakePost, client);
      const status = safe ? 'LIKE' : 'FAIL';
      log(`[${status}] [${score}] ${url}`);

      if (safe) {
        await likePost(client, uri, commit.cid, dryRun);
      }
    }
  };

  connect();
};

export { connectFirehose };
