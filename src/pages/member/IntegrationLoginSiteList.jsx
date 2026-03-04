import Breadcrumb from '@components/ui/Breadcrumb.jsx';
import Button from '@components/ui/Button.jsx';
import GridTable from '@components/ui/GridTable';
import MenuInputBox from '@components/ui/MenuInputBox.jsx';
import http from '@lib/http.js';
import { fetchCommonCodes } from '@utils/commonUtils.js';
import { formatDate } from '@utils/stringUtils.js';
import { useEffect, useRef, useState } from 'react';
import { useMatches, useNavigate } from 'react-router-dom';

export default function IntegrationLoginSiteList() {
  const matches = useMatches();
  const routeMenuName =
    [...matches]
      .reverse()
      .map((match) => match?.handle?.menuNm)
      .find((menuNm) => typeof menuNm === 'string' && menuNm.trim()) || '';
  const pageTitle = routeMenuName || '통합로그인 사이트 목록';
  const navigate = useNavigate();
  const [gridMemberList, setGridMemberList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [cursor, setCursor] = useState(null);
  const [hasNext, setHasNext] = useState(true);
  const [linkUseTrgtSeCd, setLinkUseTrgtSeCd] = useState([]); // 사이트사용대상구분코드
  const ynOptions = [
    { value: 'Y', label: '사용' },
    { value: 'N', label: '미사용' },
  ];
  const observerRef = useRef(null);
  const appliedSearchParamsRef = useRef({
    siteNm: '',
    siteMngInstNm: '',
    linkUseTrgtSeCd: '',
    prtlSysExpsrYn: '',
    useYn: '',
  });

  //검색 파라미터 state
  const [searchParams, setSearchParams] = useState({
    siteNm: '', // 사이트명
    siteMngInstNm: '', // 관리기관명
    linkUseTrgtSeCd: '', // 사이트사용대상구분코드
    prtlSysExpsrYn: '',
    useYn: '',
  });

  const handleInputChange = (name, value) => {
    setSearchParams((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSearchKeyDown = (e) => {
    if (e.key !== 'Enter') return;
    e.preventDefault();
    fetchLinkSiteList(null, true);
  };

  const getLinkUseTrgtSeLabel = (code) => {
    const fallbackMap = {
      IND: '개인',
      ENT: '기업',
      ALL: '모든 회원',
    };

    return (
      linkUseTrgtSeCd.find((item) => item.value === code)?.label ||
      fallbackMap[code] ||
      code ||
      '-'
    );
  };

  const fetchLinkSiteList = async (nextCursor = null, reset = false) => {
    if (loading) return;
    if (!hasNext && !reset) return;

    setLoading(true);
    if (reset) {
      appliedSearchParamsRef.current = { ...searchParams };
    }

    try {
      const params = reset ? searchParams : appliedSearchParamsRef.current;
      const response = await http.post('/api/v1/linksite/search', {
        cursorPageRequest: {
          size: 20,
          cursor: nextCursor,
        },
        siteNm: params.siteNm,
        siteMngInstNm: params.siteMngInstNm,
        linkUseTrgtSeCd: params.linkUseTrgtSeCd,
        prtlSysExpsrYn: params.prtlSysExpsrYn,
        useYn: params.useYn,
      });

      const data = response?.data || {};
      const linkSiteList = data?.data || [];
      const formattedData = linkSiteList.map((item, index) => ({
        id: item?.linkSiteCd
          ? `site-${item.linkSiteCd}`
          : `site-${nextCursor || 'first'}-${index}`,
        no: 0,
        linkSiteCd: item?.linkSiteCd || '-',
        siteNm: item?.siteNm || '-',
        siteMngInstNm: item?.siteMngInstNm || '-',
        linkUseTrgtSeCdNm: getLinkUseTrgtSeLabel(item?.linkUseTrgtSeCd),
        prtlSysExpsrYnNm: item?.prtlSysExpsrYn === 'Y' ? '노출' : '미노출',
        useYnNm: item?.useYn === 'Y' ? '사용' : '미사용',
        regDt: item?.regDt || '',
        management: '관리',
      }));

      setGridMemberList((prev) => {
        const merged = reset ? formattedData : [...prev, ...formattedData];
        const uniqueRows = [];
        const seen = new Set();

        merged.forEach((row) => {
          const key =
            row.linkSiteCd && row.linkSiteCd !== '-' ? row.linkSiteCd : row.id;
          if (seen.has(key)) return;
          seen.add(key);
          uniqueRows.push(row);
        });

        return uniqueRows.map((row, rowIndex) => ({
          ...row,
          no: rowIndex + 1,
        }));
      });

      setCursor(data.nextCursor ?? null);
      setHasNext(Boolean(data.hasNext));
    } catch (error) {
      console.error('통합로그인 사이트 목록 조회 실패:', error);
      alert('통합로그인 사이트 목록을 불러오는데 실패했습니다.');
      if (reset) {
        setGridMemberList([]);
      }
      setHasNext(false);
      setCursor(null);
    } finally {
      setLoading(false);
    }
  };

  const handleMoveToEdit = (linkSiteCd) => {
    if (!linkSiteCd || linkSiteCd === '-') {
      alert('사이트코드가 없습니다.');
      return;
    }
    navigate(`${linkSiteCd}/update`);
  };

  const columns = [
    { id: 'no', header: '순번', width: 44 },
    { id: 'linkSiteCd', header: '사이트코드', width: 208 },
    { id: 'siteNm', header: '사이트명', width: 350 },
    { id: 'siteMngInstNm', header: '관리기관', width: 300 },
    { id: 'linkUseTrgtSeCdNm', header: '회원유형', width: 100 },
    { id: 'prtlSysExpsrYnNm', header: '노출여부', width: 90 },
    { id: 'useYnNm', header: '사용여부', width: 90 },
    {
      id: 'regDt',
      header: '등록일시',
      width: 292,
      template: (value) => formatDate(value, 'yyyy-MM-dd HH:mm:ss'),
    },
    {
      id: 'management',
      header: '관리',
      width: 89,
      cell: ({ row }) => (
        <button
          type="button"
          className="defaultbutton edit"
          data-action="ignore-click"
          onMouseDown={(e) => e.stopPropagation()}
          onPointerDown={(e) => e.stopPropagation()}
          onClick={(e) => {
            e.stopPropagation();
            handleMoveToEdit(row?.linkSiteCd);
          }}
        >
          수정
        </button>
      ),
    },
  ];

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

  useEffect(() => {
    fetchLinkSiteList(null, true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!observerRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNext && !loading) {
          fetchLinkSiteList(cursor, false);
        }
      },
      { threshold: 1 }
    );

    observer.observe(observerRef.current);
    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cursor, hasNext, loading]);

  return (
    <div className="oncontentbox full">
      <div className="oncontentTitle">
        <h2>{pageTitle}</h2>
        <Breadcrumb pageTitle={pageTitle} />
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
                onChange={(e) => handleInputChange('siteNm', e.target.value)}
                onKeyDown={handleSearchKeyDown}
              />
              <MenuInputBox
                menuType="input"
                menuName="관리기관"
                inputId="siteMngInstNm"
                menuSize="150px"
                value={searchParams.siteMngInstNm}
                onChange={(e) =>
                  handleInputChange('siteMngInstNm', e.target.value)
                }
                onKeyDown={handleSearchKeyDown}
              />
              <MenuInputBox
                menuType="select"
                menuName="회원유형"
                inputId="linkUseTrgtSeCd"
                options={linkUseTrgtSeCd} // [{ value: 'IND', label: '개인회원' }, ...]
                value={searchParams.linkUseTrgtSeCd}
                onChange={(e) =>
                  handleInputChange('linkUseTrgtSeCd', e.target.value)
                }
              />
              <MenuInputBox
                menuType="select"
                menuName="노출여부"
                menuSize="100px"
                options={ynOptions}
                value={searchParams.prtlSysExpsrYn}
                onChange={(e) =>
                  handleInputChange('prtlSysExpsrYn', e.target.value)
                }
              />
              <MenuInputBox
                menuType="select"
                menuName="사용여부"
                menuSize="100px"
                options={ynOptions}
                value={searchParams.useYn}
                onChange={(e) => handleInputChange('useYn', e.target.value)}
              />

              <div className="onbtn" style={{ marginLeft: 'auto' }}>
                <Button
                  btnType="menuSearch"
                  btnNames="검색"
                  onClick={() => fetchLinkSiteList(null, true)}
                />
              </div>
            </div>
          </div>

          <div className="ontable-legend flexEnd" style={{ gap: '8px' }}>
            <Button
              btnType="add"
              btnNames="순서변경"
              onClick={() => navigate('sort')}
            />
            <Button
              btnType="add"
              btnNames="등록"
              onClick={() => navigate('create')}
            />
          </div>

          <div className="ongrid-tableform">
            <GridTable data={gridMemberList} columns={columns} />
            <div ref={observerRef} style={{ height: 40 }} />
          </div>
        </div>
      </div>
    </div>
  );
}
