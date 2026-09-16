(function ensureDom() {
  if (typeof window !== 'undefined') return; // running in the browser
  const { satisfies } = require('semver');
  if (!satisfies(process.versions.node, require('jsdom/package.json').engines.node)) return;
  const jsdom = require('jsdom');
  const doc = new jsdom.JSDOM('<!doctype html><html><body></body></html>');
  global.window = doc.window;
  global.document = doc.window.document;
  Object.defineProperty(global, 'navigator', { configurable: true, value: doc.window.navigator });
})();
