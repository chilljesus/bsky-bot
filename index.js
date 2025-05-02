process.on('uncaughtException', (err) => {
  console.error('[FATAL] Uncaught Exception:', err);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('[FATAL] Unhandled Rejection:', reason);
});

import 'dotenv/config';
import { login, likePost } from './client.js';
import { connectFirehose } from './firehose.js';
import { log } from './utils.js';

const dryRun = process.argv.includes('--dry');

const main = async () => {
  const client = await login();
  await connectFirehose(client, likePost, dryRun);
};

setInterval(() => log('[heartbeat] still alive'), 5 * 60 * 1000);
main();
