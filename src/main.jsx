import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import Admin from './Admin.jsx'; // 퍼블리싱 관리자 화면 메인으로
// import './index.css'
import App from './App.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
);
