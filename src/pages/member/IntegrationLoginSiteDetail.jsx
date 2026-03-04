import Breadcrumb from '@components/ui/Breadcrumb.jsx';
import Button from '@components/ui/Button.jsx';
import { useMatches } from 'react-router-dom';

export default function IntegrationLoginSiteDetail() {
  const matches = useMatches();
  const routeMenuName =
    [...matches]
      .reverse()
      .map((match) => match?.handle?.menuNm)
      .find((menuNm) => typeof menuNm === 'string' && menuNm.trim()) || '';
  const pageTitle = '통합로그인 사이트 상세조회' || routeMenuName;

  return (
    <div className="oncontentbox full">
      <div className="oncontentTitle">
        <h2>{pageTitle}</h2>
        <Breadcrumb pageTitle={pageTitle} />
      </div>
      <div className="oncontents">
        <div className="oncontent ontable-form">
          <div className="ontableBox">
            <table>
              <colgroup>
                <col style={{ width: '180px' }} />
                <col style={{ width: 'auto' }} />
                <col style={{ width: '180px' }} />
                <col style={{ width: 'auto' }} />
              </colgroup>
              <tbody>
                <tr>
                  <td>사이트코드</td>
                  <td>placeholder</td>
                  <td>사이트명</td>
                  <td>placeholder</td>
                </tr>
                <tr>
                  <td>사이트 설명</td>
                  <td colSpan={3}>placeholder</td>
                </tr>
                <tr>
                  <td>사이트 URL</td>
                  <td colSpan={3}>placeholder</td>
                </tr>
                <tr>
                  <td>관리기관 명</td>
                  <td>placeholder</td>
                  <td>담당자 명</td>
                  <td>placeholder</td>
                </tr>
                <tr>
                  <td>노출여부</td>
                  <td>placeholder</td>
                  <td>사용여부</td>
                  <td>placeholder</td>
                </tr>
                <tr>
                  <td>회원구분</td>
                  <td colSpan={3}>placeholder</td>
                </tr>
                <tr>
                  <td>등록일시</td>
                  <td>YYYY-MM-DD HH:DD</td>
                  <td>등록자</td>
                  <td>placeholder</td>
                </tr>
                <tr>
                  <td>최종수정일시</td>
                  <td colSpan={3}>YYYY-MM-DD HH:DD</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="ontable-legend">
            <Button btnType="list" btnNames="목록" />
            <Button btnType="edit" btnNames="수정" />
          </div>
        </div>
      </div>
    </div>
  );
}
