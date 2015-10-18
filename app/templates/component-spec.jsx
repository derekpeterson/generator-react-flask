import { expect } from 'chai';

import React from 'react';
import ReactShallowRenderer from 'react-addons-test-utils';

import <%= componentName %> from '../../src/js/components/<%= kebabName %>.jsx';

describe('<%= componentName %> component', function () {
  before(() => {
    let shallowRenderer = ReactShallowRenderer.createRenderer();
    shallowRenderer.render(
      <<%= componentName %> />
    );
    this.result = shallowRenderer.getRenderOutput();
  });

  it('renders a <div>', () => {
    expect(this.result.type).to.equal('div');
  });
});
