import React, { useEffect, useState } from 'react';
import { Link, Outlet, useLocation,useNavigate } from 'react-router-dom';

import { autoPublishingRoutes } from '../routes/autoRoutes.jsx';
import useTabStore from '../store/useTabStore';
import Header from '../publishing/components/Header.jsx';
import Leftbar from '../publishing/components/Leftbar.jsx';
import Button from "../components/ui/Button.jsx";

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

    const [isOnNavToggle, setOnNavToggle] = useState(!true);
        const handleOnNavToggle = () => {
            setOnNavToggle(!isOnNavToggle);
    }

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
            {/* 우측 상단 퍼블 밴드: 전체 레이아웃 최상단 고정 */}
            <div style={{
                position: 'fixed',
                top: '20px',
                right: '-40px',
                width: '160px',
                height: '32px',
                // rgba를 사용하여 배경만 투명하게 처리 (글자는 선명 유지)
                background: 'rgba(255, 71, 87, 0.8)',
                color: '#fff',
                textAlign: 'center',
                lineHeight: '32px',
                fontSize: '15px',
                fontWeight: '800',
                transform: 'rotate(45deg)',
                zIndex: 10000,
                boxShadow: '0 2px 10px rgba(0,0,0,0.2)',
                // 아래 요소를 클릭할 수 있게 해주는 핵심 속성
                pointerEvents: 'none',
                letterSpacing: '2px',
                // 전체적인 부드러운 투명도 추가 (선택 사항)
                opacity: 0.9
            }}>
                퍼블
            </div>
            <Header isOnNavToggle={isOnNavToggle} handleOnNavToggle={handleOnNavToggle} />
            <div className="onlayout">
                {/* 사이드바 */}
                <Leftbar isOnNavToggle={isOnNavToggle} setOnNavToggle={setOnNavToggle} />
                {/* 메인 영역 (탭 + 컨텐츠) */}
                <main>
                    {/* 탭 바 (Tab Bar) */}
                    <div className="oncontentbox-wrap">
                        <div className="oncontentTab">
                            <ul>
                                {openTabs.map(tab => (
                                    <li className={activeTabPath === tab.path ? 'active' : ''}
                                        key={tab.path}
                                        onClick={() => {
                                            setActiveTab(tab.path);
                                            navigate(`/publishing/${tab.path}`);
                                        }}>
                                        <a href="#">{tab.name}</a>
                                        <i className="close" onClick={(e) => {
                                            e.stopPropagation();
                                            removeTab(tab.path);
                                            if(activeTabPath === tab.path) navigate('/publishing');
                                        }}/>
                                    </li>
                                ))}
                            </ul>
                            {/* 전체 닫기 버튼 */}
                            {openTabs.length > 0 && (
                                <Button btnType="closeAll" btnNames="전체닫기" onClick={handleClearAll}/>
                            )}
                        </div>
                        {/* 실제 컨텐츠 영역 */}
                        <Outlet/>
                    </div>
                </main>
            </div>
        </div>
    );
}