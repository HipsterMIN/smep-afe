import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
// import './index.css'
// import App from './App.jsx'
import Admin from './Admin.jsx' // 퍼블리싱 관리자 화면 메인으로

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {/* <App /> */}
    <Admin />
  </StrictMode>,
)
