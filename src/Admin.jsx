import '../styles/onCommon.css'
import Header from './components/ui/Header'
import Layout from './components/ui/Layout'
import Leftbar from './components/ui/Leftbar'
import Contentbox from './components/ui/Contentbox'

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
    <>
      <Header />
      <Layout>
        <Leftbar />
        <Contentbox contentType="type1" />
        {/* <Contentbox contentType="type2" /> */}
        {/* <Contentbox contentType="type3" /> */}
        {/* <Contentbox contentType="type4" /> */}
        {/* <Contentbox contentType="type5" /> */}
        {/* <Contentbox contentType="type6" /> */}
      </Layout>
    </>
  );
}
