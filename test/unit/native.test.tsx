import assert from 'assert';
import React from 'react';
import { render } from '@testing-library/react-native';

import { View } from 'react-native';
import { BoundaryProvider, useRef, useBoundary } from 'react-ref-boundary';

describe('react-native', function () {
  function NonBoundaryComponent() {
    const ref = React.useRef<View>(null);
    return <View ref={ref} />;
  }

  function BoundaryComponent() {
    const ref = useRef<View>(null);
    return <View ref={ref} />;
  }

  function BoundaryChecker({ getRefs }) {
    const boundary = useBoundary();
    getRefs(boundary.refs);
    return <View />;
  }

  it('refs', function () {
    let refs = [];
    function getRefs(x) {
      refs = x;
    }
    assert.equal(refs.length, 0);
    render(
      <BoundaryProvider>
        <BoundaryComponent />
        <NonBoundaryComponent />
        <BoundaryComponent />
        <BoundaryChecker getRefs={getRefs} />
      </BoundaryProvider>,
    );
    assert.equal(refs.length, 2);
  });
});
