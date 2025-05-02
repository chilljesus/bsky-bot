import { BskyAgent } from '@atproto/api';
import { log } from './utils.js';

const login = async () => {
  const agent = new BskyAgent({ service: 'https://bsky.social' });
  await agent.login({
    identifier: process.env.BSKY_IDENTIFIER,
    password: process.env.BSKY_PASSWORD,
  });
  log('Logged into Bluesky');
  return agent;
};

const likePost = async (client, uri, cid, dryRun = false) => {
  const postUrl = `https://bsky.app/profile/${uri.split('/')[2]}/post/${uri.split('/')[4]}`;
  try {
    if (dryRun) {
      log(`[DRY] Would like ${postUrl}`);
      return;
    }
    await client.like(uri, cid);
  } catch (err) {
    log(`[FAIL] ${postUrl} - Error: ${err.message}`);
  }
};

export { login, likePost };