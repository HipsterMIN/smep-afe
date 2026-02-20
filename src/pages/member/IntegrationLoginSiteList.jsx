import Button from '@components/ui/Button.jsx';
import GridTable from '@components/ui/GridTable';
import MenuInputBox from '@components/ui/MenuInputBox.jsx';
import { fetchCommonCodes } from '@utils/commonUtils.js';
import { useEffect, useRef, useState } from 'react';

export default function IntegrationLoginSiteList() {
  const [gridMemberList, setGridMemberList] = useState([]);
  const [linkUseTrgtSeCd, setLinkUseTrgtSeCd] = useState([]); // 사이트사용대상구분코드

  //검색 파라미터 ref
  const searchParamsRef = useRef({
    hasNext: false,
    nextCursor: null,
  });

  //검색 파라미터 state
  const [searchParams, setSearchParams] = useState({
    siteNm: '', // 사이트명
    siteMngInstNm: '', // 관리기관명
    linkUseTrgtSeCd: '', // 사이트사용대상구분코드
  });

  //공통코드 조회
  useEffect(() => {
    const fetchCommonCode = async () => {
      try {
        const response = await fetchCommonCodes(['LINK_USE_TRGT_SE_CD']);

        // LINK_USE_TRGT_SE_CD를 MenuInputBox options 형식으로 변환
        // comCd → value, comCdNm → label
        const linkUseTrgtSeOptions = (response.LINK_USE_TRGT_SE_CD || []).map(
          (item) => ({
            value: item.comCd,
            label: item.comCdNm,
          })
        );

        setLinkUseTrgtSeCd(linkUseTrgtSeOptions);
      } catch (error) {
        console.error('공통코드 조회 실패:', error);
      }
    };
    fetchCommonCode();
  }, []);
  return (
    <div className="oncontentbox full">
      <div className="oncontentTitle">
        <h2>통합로그인 사이트 목록</h2>
        <ul className="onbreadcrumb">
          <li>시스템 관리</li>
          <li>회원/권한 관리</li>
          <li>통합로그인 사이트 관리</li>
          <li className="on">통합로그인 사이트 목록</li>
        </ul>
      </div>

      <div className="oncontents">
        <div className="oncontent">
          <div className="onselect-form open" style={{ minHeight: 'auto' }}>
            {' '}
            {/** open 클래스로 동작, 펼치기/접기 */}
            <div className="onparagraph">
              <MenuInputBox
                menuType="input"
                menuName="사이트명"
                inputId="siteNm"
                menuSize="150px"
                value={searchParams.siteNm}
                onChange={(e) => {
                  setSearchParams({
                    ...searchParams,
                    siteNm: e.target.value,
                  });
                }}
              />
              <MenuInputBox
                menuType="input"
                menuName="관리기관"
                inputId="siteMngInstNm"
                menuSize="150px"
                value={searchParams.siteMngInstNm}
                onChange={(e) => {
                  setSearchParams({
                    ...searchParams,
                    siteMngInstNm: e.target.value,
                  });
                }}
              />
              <MenuInputBox
                menuType="select"
                menuName="회원유형"
                inputId="mbrTypeCd"
                options={linkUseTrgtSeCd} // [{ value: 'IND', label: '개인회원' }, ...]
                value={searchParams.linkUseTrgtSeCd}
                onChange={(e) => {
                  setSearchParams({
                    ...searchParams,
                    linkUseTrgtSeCd: e.target.value,
                  });
                }}
              />
              <MenuInputBox
                menuType="select"
                menuName="노출여부"
                menuSize="100px"
              />
              <MenuInputBox
                menuType="select"
                menuName="사용여부"
                menuSize="100px"
              />

              <div className="onbtn" style={{ marginLeft: 'auto' }}>
                <Button btnType="menuSearch" btnNames="검색" />
              </div>
            </div>
          </div>

          <div className="ontable-legend flexEnd" style={{ gap: '8px' }}>
            <Button btnType="add" btnNames="순서변경" />
            <Button btnType="add" btnNames="등록" />
          </div>

          <div className="ongrid-tableform mask">
            <GridTable />
          </div>
        </div>
      </div>
    </div>
  );
}
