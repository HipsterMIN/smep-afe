import Admin from '@layouts/AdminLayout.jsx'; // 퍼블리싱 관리자 화면 메인으로
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import App from './App.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
);
