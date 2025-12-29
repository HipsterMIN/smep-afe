import '../../styles/onCommon.css'; // 기존 관리자 스타일 재사용 (필요시)

import React from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';

import { autoPublishingRoutes } from '../routes/autoRoutes.jsx';

export default function PublishingMain() {
    const location = useLocation();

    return (
        <div className="onpage">
            <header className="publishing-header" style={{ height: '60px', background: '#333', color: '#fff', display: 'flex', alignItems: 'center', padding: '0 20px' }}>
                <h2>Publishing Workboard</h2>
                <Link to="/admin" style={{ marginLeft: 'auto', color: '#fff', fontSize: '14px' }}>Admin 화면으로 이동</Link>
            </header>

            <div className="onlayout" style={{ display: 'flex', minHeight: 'calc(100vh - 60px)' }}>
                {/* 사이드바 역할을 하는 Publishing List */}
                <nav className="publishing-leftbar" style={{ width: '250px', background: '#f8f9fa', borderRight: '1px solid #ddd', padding: '20px' }}>
                    <h3 style={{ fontSize: '16px', marginBottom: '20px', color: '#666' }}>Page List</h3>
                    <ul style={{ listStyle: 'none', padding: 0 }}>
                        {autoPublishingRoutes.map((route) => {
                            const isActive = location.pathname.includes(route.path);
                            return (
                                <li key={route.path} style={{ marginBottom: '10px' }}>
                                    <Link
                                        to={`/publishing/${route.path}`}
                                        style={{
                                            textDecoration: 'none',
                                            color: isActive ? '#007bff' : '#333',
                                            fontWeight: isActive ? 'bold' : 'normal',
                                            display: 'block',
                                            padding: '8px 12px',
                                            borderRadius: '4px',
                                            background: isActive ? '#e7f1ff' : 'transparent'
                                        }}
                                    >
                                        📄 {route.path.toUpperCase()}
                                    </Link>
                                </li>
                            );
                        })}
                    </ul>
                </nav>

                {/* 페이지가 렌더링되는 메인 영역 */}
                <main style={{ flex: 1, padding: '20px', background: '#fff' }}>
                    <Outlet />
                </main>
            </div>
        </div>
    );
}