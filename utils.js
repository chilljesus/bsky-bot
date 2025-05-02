const nsfwKeywords = ['porn', 'sexual', 'nudity', 'adult', 'nsfw'];

export const getCatness = (text) => {
  const t = text.toLowerCase();
  let score = 0;

  const match = (regex) => regex.test(t);
  const B = '[\\p{L}\\p{N}_:./@]';
  const boundary = (inner) => new RegExp(`(?<!${B})${inner}(?!${B})`, 'u');

  if (match(boundary('m+e+o+w+'))) score += 4;
  if (match(boundary('m+i+a+u+'))) score += 4;
  if (match(boundary('m+i+a+o+u+'))) score += 4;
  if (match(boundary('m+i+a+o+'))) score += 4;
  if (match(boundary('n+y+a+'))) score += 4;
  if (match(boundary('m+y+a+u+'))) score += 4;
  if (match(boundary('y+a+o+n+g+'))) score += 4;
  if (match(boundary('m+r+p+'))) score += 4;
  if (match(boundary('m+r+a+o+w+'))) score += 4;
  if (match(boundary('m+r+o+w+'))) score += 4;
  if (match(boundary('m+r+e+o+w+'))) score += 4;
  if (match(boundary('m+e+w+o+?'))) score += 4;
  if (match(/:3c?|>:?3c?|u\.u|o\.o|uwu|owo/)) score += 2;
  if (match(/~/)) score += 1;

  const multiPattern = new RegExp(`(?<!${B})(m+e+o+w+|n+y+a+|m+i+a+u+|m+i+a+o+u+|m+i+a+o+|m+r+p+|m+r+a+o+w+|m+y+a+u+|y+a+o+n+g+|m+e+w+o+?)(?!${B})`, 'gu');
  const matches = [...t.matchAll(multiPattern)];
  if (matches.length > 1) score += 2;

  const pureCat = /^(\s*(m+e+o+w+|n+y+a+|m+i+a+u+|m+i+a+o+u+|m+i+a+o+|m+r+p+|m+r+a+o+w+|m+y+a+u+|y+a+o+n+g+|m+e+w+o+?|:3c?|>:?3c?|u\.u|o\.o|uwu|owo)[~\s:;,.!?<3\^w\^]*)+$/i.test(t);
  if (pureCat) score += 2;

  const wordCount = t.split(/\s+/).filter(Boolean).length;
  if (wordCount >= 6) score -= 1;
  if (wordCount >= 10) score -= 2;

  return Math.max(score, 0);
};

export const isMatch = (text) => {
  return getCatness(text) >= 4;
};

export const isSafe = async (post, client) => {
  const hasNsfwLabel = (labels) => {
    if (!Array.isArray(labels)) return false;
    return labels.some(label => {
      if (typeof label === 'string') {
        return nsfwKeywords.includes(label.toLowerCase());
      }
      if (label?.val) {
        return nsfwKeywords.includes(label.val.toLowerCase());
      }
      return false;
    });
  };
  if (hasNsfwLabel(post.record.labels)) return false;
  const reply = post.record.reply;
  if (reply?.root?.uri?.startsWith('at://')) {
    try {
      const rootThread = await client.getPostThread({ uri: reply.root.uri });
      const rootNode = rootThread.data.thread;
      if (hasNsfwLabel(rootNode.labels) || hasNsfwLabel(rootNode.record?.labels)) {
        return false;
      }
    } catch (err) {
      console.log(`[Error fetching root post]: ${err.message}`);
    }
  }
  return true;
};

export const log = (...args) => {
  const timestamp = new Date().toISOString().replace('T', ' ').split('.')[0];
  console.log(`[${timestamp}]`, ...args);
};
