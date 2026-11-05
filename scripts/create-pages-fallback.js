const fs = require('node:fs');
const path = require('node:path');
const { parse, serialize } = require('parse5');

/** Preserve prerendered pages, but mount dynamic deep links into an empty shell. */
function createPagesFallback(html) {
  const document = parse(html);
  let rootCount = 0;
  let hydrationFlags = 0;

  function visit(node) {
    if (node.attrs?.some(({ name, value }) => name === 'id' && value === 'root')) {
      node.childNodes = [];
      rootCount += 1;
    }
    if (node.tagName === 'script') {
      for (const child of node.childNodes || []) {
        if (child.nodeName === '#text') {
          child.value = child.value.replace(
            /globalThis\.__EXPO_ROUTER_HYDRATE__\s*=\s*true\s*;/g,
            () => {
              hydrationFlags += 1;
              return 'globalThis.__EXPO_ROUTER_HYDRATE__=false;';
            }
          );
        }
      }
    }
    for (const child of node.childNodes || []) visit(child);
  }

  visit(document);
  // Fail the build if Expo changes this contract instead of shipping a broken fallback.
  if (rootCount !== 1 || hydrationFlags !== 1) {
    throw new Error('Unexpected Expo HTML: expected one app root and one hydration flag');
  }
  return serialize(document);
}

if (require.main === module) {
  const outputDir = path.resolve(__dirname, '../dist');
  const html = fs.readFileSync(path.join(outputDir, 'index.html'), 'utf8');
  fs.writeFileSync(path.join(outputDir, '404.html'), createPagesFallback(html));
}

module.exports = { createPagesFallback };
