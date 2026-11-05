const { createPagesFallback } = require('../create-pages-fallback');
const { parse } = require('parse5');

describe('GitHub Pages deep-link shell', () => {
  const homeHtml = '<!doctype html><html><head><title>Chiron</title>' +
    '<script type="module">globalThis.__EXPO_ROUTER_HYDRATE__=true;</script></head>' +
    '<body><div id="root"><div>Find Your Race<div>Nested home content</div></div></div>' +
    '<script src="/entry.js" defer></script></body></html>';

  it('empties only the app root, disables hydration, and retains the bundle and metadata', () => {
    const shell = createPagesFallback(homeHtml);
    expect(shell).toContain('<div id="root"></div>');
    expect(shell).not.toContain('Find Your Race');
    expect(shell).not.toContain('Nested home content');
    expect(shell).toContain('globalThis.__EXPO_ROUTER_HYDRATE__=false;');
    expect(shell).toContain('<title>Chiron</title>');
    expect(shell).toContain('<script src="/entry.js" defer=""></script>');
    expect(() => parse(shell)).not.toThrow();
    expect(homeHtml).toContain('Find Your Race');
  });

  it.each([
    homeHtml.replace('id="root"', 'id="other"'),
    homeHtml.replace('globalThis.__EXPO_ROUTER_HYDRATE__=true;', ''),
    homeHtml.replace('</body>', '<div id="root"></div></body>'),
  ])('fails the build if the Expo HTML contract changes', (html) => {
    expect(() => createPagesFallback(html)).toThrow('Unexpected Expo HTML');
  });
});
