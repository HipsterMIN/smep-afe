import React, { useEffect } from 'react';
import { Link, Outlet, useLocation,useNavigate } from 'react-router-dom';

import { autoPublishingRoutes } from '../routes/autoRoutes.jsx';
import useTabStore from '../store/useTabStore';

export default function PublishingMain() {
    const navigate = useNavigate();
    const location = useLocation();
    const { openTabs, activeTabPath, addTab, removeTab, setActiveTab, clearTabs } = useTabStore();

    const handleClearAll = () => {
        if (window.confirm('모든 탭을 닫으시겠습니까?')) {
            clearTabs();
            navigate('/publishing');
        }
    };

    // URL 변경 시 탭 추가 로직
    useEffect(() => {
        // 1. 현재 URL의 마지막 세그먼트를 가져와 디코딩
        const pathSegments = location.pathname.split('/');
        const currentPath = decodeURIComponent(pathSegments[pathSegments.length - 1]);

        if (!currentPath || currentPath === 'publishing') return;

        // 2. autoPublishingRoutes에서 path가 일치하는 항목 탐색
        const targetRoute = autoPublishingRoutes.find(r => r.path === currentPath);

        if (targetRoute) {
            addTab({
                path: targetRoute.path,
                name: targetRoute.name.replace(/[[\]]/g, '').trim() // 탭 이름에서 [ ] 제거 및 깔끔하게 정리
            });
        }
    }, [location.pathname, addTab]);

    return (
        <div className="onpage">
            <header className="pub-header" style={{ height: '50px', background: '#222', color: '#fff', display: 'flex', alignItems: 'center', padding: '0 20px' }}>
                <h3>Publishing Lab (Tabs Enabled)</h3>
            </header>

            <div className="onlayout" style={{ display: 'flex', height: 'calc(100vh - 50px)' }}>
                {/* 사이드바 */}
                <nav style={{ width: '220px', background: '#f4f4f4', borderRight: '1px solid #ddd', overflowY: 'auto' }}>
                    <ul style={{ listStyle: 'none', padding: '10px' }}>
                        {autoPublishingRoutes.map(route => (
                            <li key={route.path} style={{ marginBottom: '5px' }}>
                                <Link to={`/publishing/${route.path}`} style={{ textDecoration: 'none', color: '#333', fontSize: '14px' }}>
                                    📁 {route.path}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </nav>

                {/* 메인 영역 (탭 + 컨텐츠) */}
                <main style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                    {/* 탭 바 (Tab Bar) */}
                    <div className="tab-container" style={{ display: 'flex', alignItems: 'flex-end', background: '#eee', borderBottom: '1px solid #ccc', padding: '0 5px' }}>
                        <div className="tab-bar" style={{ display: 'flex', flex: 1, overflowX: 'auto' }}>
                            {openTabs.map(tab => (
                                <div
                                    key={tab.path}
                                    onClick={() => { setActiveTab(tab.path); navigate(`/publishing/${tab.path}`); }}
                                    style={{
                                        padding: '8px 15px',
                                        marginRight: '2px',
                                        background: activeTabPath === tab.path ? '#fff' : '#ddd',
                                        border: '1px solid #ccc',
                                        borderBottom: 'none',
                                        borderRadius: '5px 5px 0 0',
                                        cursor: 'pointer',
                                        fontSize: '12px',
                                        whiteSpace: 'nowrap',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '8px'
                                    }}
                                >
                                    {tab.name}
                                    <span
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            removeTab(tab.path);
                                            if(activeTabPath === tab.path) navigate('/publishing');
                                        }}
                                        style={{ color: '#999', fontSize: '16px', fontWeight: 'bold' }}
                                    >
                    ×
                  </span>
                                </div>
                            ))}
                        </div>

                        {/* 전체 닫기 버튼 */}
                        {openTabs.length > 0 && (
                            <button
                                onClick={handleClearAll}
                                style={{
                                    margin: '5px',
                                    padding: '4px 10px',
                                    fontSize: '11px',
                                    backgroundColor: '#666',
                                    color: '#fff',
                                    border: 'none',
                                    borderRadius: '3px',
                                    cursor: 'pointer',
                                    whiteSpace: 'nowrap'
                                }}
                            >
                                전체닫기
                            </button>
                        )}
                    </div>

                    {/* 실제 컨텐츠 영역 */}
                    <div style={{ flex: 1, overflowY: 'auto', background: '#fff', padding: '20px' }}>
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    );
}