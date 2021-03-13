import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { SpeechProvider } from '@speechly/react-client';

ReactDOM.render(
  <SpeechProvider appId="01491183-a7f5-4316-a404-6aefbd641ae9"  language="en-US" >
    <App />
  </SpeechProvider>,
  document.getElementById('root')
);