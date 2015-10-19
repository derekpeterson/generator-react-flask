import { expect } from 'chai';

import React from 'react';
import ReactShallowRenderer from 'react-addons-test-utils';

import Example from '../../src/js/components/example.jsx';

describe('Example component', function () {
  before(() => {
    let shallowRenderer = ReactShallowRenderer.createRenderer();
    shallowRenderer.render(
      <Example />
    );
    this.result = shallowRenderer.getRenderOutput();
  });

  it('renders a <div>', () => {
    expect(this.result.type).to.equal('div');
  });
});
