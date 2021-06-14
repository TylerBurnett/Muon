import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import App from './Interface/App';
import { store } from './Interface/app/store';

render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
);
