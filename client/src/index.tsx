import React from 'react';
import ReactDOM from 'react-dom';
import "./stylesSass/index.scss";
import App from './App';
import { Provider } from 'react-redux'
import store from './store/store'

// MUI Theme
import THEME from './utils/ThemeMui'
import { ThemeProvider } from '@mui/material/styles';
ReactDOM.render(
  <ThemeProvider theme={THEME}>
    <Provider store={store}>
      <App />
    </Provider>
  </ThemeProvider>,
  document.getElementById('root')
);


