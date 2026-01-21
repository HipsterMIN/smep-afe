// ============================================
// 메인 화면 컴포넌트
// - 모든 탭이 닫혔을 때 표시되는 안내 화면
// - Contentbox를 사용하여 일관된 레이아웃 유지
// ============================================
import Contentbox from "../components/ui/Contentbox.jsx";

export default function MainPage() {
  return (
      <Contentbox>
        <div style={{ textAlign: 'center', paddingTop: '100px', color: '#999' }}>
          <h3>왼쪽 메뉴에서 확인할 페이지를 선택해주세요.</h3>
        </div>
      </Contentbox>
  );
}
