import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { installLiveApiCache } from './core/api/liveApiCache';

installLiveApiCache();

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
