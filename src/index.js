import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { BrowserRouter as Router } from 'react-router-dom';
import { ThemeProvider } from '@material-ui/core/styles';
import { mainTheme } from './MuiTheme';

ReactDOM.render(
  <Router>
    <ThemeProvider theme={mainTheme}>
      <App />
    </ThemeProvider>
  </Router>,
  document.getElementById('root')
);
