import 'babel/polyfill';
import React from 'react';
import ReactDOM from 'react-dom';

function init () {
  let app = document.querySelectorAll('[data-section="app"]')[0];
  ReactDOM.render(
    <<%= componentName %> />,
    app
  );
}

// This would usually wait for the ready/DOMContentLoaded
// event, but we're loading this async, and it's up last
init();
