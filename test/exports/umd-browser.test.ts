import assert from 'assert';
import React from 'react';

describe('browser UMD global', () => {
  it('loads the classic script and exposes the public exports on window', async () => {
    const browser = window as Window & { React?: typeof React; reactRefBoundary?: typeof import('react-ref-boundary') };
    const previousReact = browser.React;
    const previousGlobal = browser.reactRefBoundary;
    const readGlobal = () => browser.reactRefBoundary;
    browser.React = React;
    delete browser.reactRefBoundary;
    const script = document.createElement('script');
    script.src = new URL('../../dist/umd/react-ref-boundary.cjs', import.meta.url).href;
    script.async = false;
    try {
      await new Promise<void>((resolve, reject) => {
        script.addEventListener('load', () => resolve(), { once: true });
        script.addEventListener('error', () => reject(new Error(`Failed to load ${script.src}`)), { once: true });
        document.head.append(script);
      });
      const exported = readGlobal();
      assert.equal(typeof exported?.BoundaryProvider, 'function');
      assert.equal(typeof exported?.useRef, 'function');
      assert.equal(typeof exported?.useBoundary, 'function');
    } finally {
      script.remove();
      if (previousGlobal) browser.reactRefBoundary = previousGlobal;
      else delete browser.reactRefBoundary;
      if (previousReact) browser.React = previousReact;
      else delete browser.React;
    }
  });
});
