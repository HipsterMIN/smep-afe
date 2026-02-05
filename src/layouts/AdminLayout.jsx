import '@styles/onCommon.css';

import Header from '@components/ui/Header.jsx';
import Layout from '@components/ui/Layout.jsx';
import Leftbar from '@components/ui/Leftbar.jsx';
import { Outlet } from 'react-router-dom';

// Admin 레이아웃 컴포넌트
export default function Admin() {
  return (
    <>
      <Header />
      <Layout>
        <Leftbar />
        {/* Contentbox 내부의 .container 클래스가 중앙 정렬을 유도하므로
          여기서 감싸는 div 없이 바로 Outlet을 꽂습니다. */}
        <Outlet />
      </Layout>
    </>
  );
}
