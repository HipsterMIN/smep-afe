import '../styles/onCommon.css'
import Header from './components/ui/Header'
import Layout from './components/ui/Layout'
import Leftbar from './components/ui/Leftbar'
import Contentbox from './components/ui/Contentbox'
import {Outlet} from "react-router-dom";

// 퍼블리싱 관리자 화면

/**
 * type1 : 공통코드 관리
 * type2 : 권한 관리
 * type3 : 관리자 메뉴관리
 * type4 : 게시판 관리
 * type5 : 사업정보 관리
 * type6 : 사업정보 등록/수정
 */
export default function Admin() {
    return (
        <div className="onpage">
            <Header />
            <div className="onlayout">
                <Leftbar />
                <main className="oncontentbox-wrap">
                    {/* Contentbox 내부의 .container 클래스가 중앙 정렬을 유도하므로
              여기서 감싸는 div 없이 바로 Outlet을 꽂습니다. */}
                    <Outlet />
                </main>
            </div>
        </div>
    );
}
