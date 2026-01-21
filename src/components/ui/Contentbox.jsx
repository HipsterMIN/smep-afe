// Contentbox.jsx
import { useNavigate } from 'react-router-dom';
import Button from './Button';
import Contents from './Contents';
import useTabStore from '../../store/useTabStore';

// 관리자 - 컨텐츠 영역
// eslint-disable-next-line react/prop-types
export default function Contentbox({ children }) {
  const navigate = useNavigate();
  const { openTabs, activeTabPath, removeTab, setActiveTab, clearTabs } = useTabStore();

  const handleClearAll = () => {
    if (window.confirm('모든 탭을 닫으시겠습니까?')) {
      clearTabs();
      navigate('/');
    }
  };

  const handleTabClick = (tabPath) => {
    setActiveTab(tabPath);
    navigate(`/${tabPath}`);
  };

  const handleTabClose = (e, tabPath) => {
    e.stopPropagation();

    // 닫으려는 탭이 현재 활성 탭인지 확인
    const isActiveTab = activeTabPath === tabPath;

    if (isActiveTab) {
      // 현재 탭의 인덱스 찾기
      const currentIndex = openTabs.findIndex(t => t.path === tabPath);
      const remainingTabs = openTabs.filter(t => t.path !== tabPath);

      if (remainingTabs.length > 0) {
        // 다음 탭으로 이동 (없으면 이전 탭)
        let nextTab;
        if (currentIndex < openTabs.length - 1) {
          // 다음 탭이 있으면 다음 탭으로
          nextTab = openTabs[currentIndex + 1];
        } else {
          // 마지막 탭이면 이전 탭으로
          nextTab = remainingTabs[remainingTabs.length - 1];
        }

        // 탭 제거 후 다음 탭으로 이동
        removeTab(tabPath);
        setActiveTab(nextTab.path);
        navigate(`/${nextTab.path}`);
      } else {
        // 마지막 남은 탭을 닫으면 홈으로
        removeTab(tabPath);
        navigate('/');
      }
    } else {
      // 선택되지 않은 탭을 닫으면 현재 상태 유지
      removeTab(tabPath);
    }
  };

  return (
      <div className="oncontentbox-wrap">
        <div className="oncontentTab">
          <ul>
            {openTabs.map(tab => (
                <li
                    className={activeTabPath === tab.path ? 'active' : ''}
                    key={tab.path}
                    onClick={() => handleTabClick(tab.path)}
                >
                  <a href="#">{tab.name}</a>
                  <i
                      className="close"
                      onClick={(e) => handleTabClose(e, tab.path)}
                  />
                </li>
            ))}
          </ul>
          {/* 전체 닫기 버튼 */}
          {openTabs.length > 0 && (
              <Button btnType="closeAll" btnNames="전체닫기" onClick={handleClearAll} />
          )}
        </div>

        <Contents>{children}</Contents>
      </div>
  );
}
