import Button from '@components/ui/Button.jsx';
import { createGridValueActionCell } from '@components/ui/createGridValueActionCell.js';
import GridTable from '@components/ui/GridTable.jsx';
import MenuInputBox from '@components/ui/MenuInputBox.jsx';
import { useUserMenu } from '@context/UserMenuContext';
import http from '@lib/http.js';
import { fetchAndConvertCommonCodes } from '@utils/commonUtils.js';
import { formatDate } from '@utils/stringUtils.js';
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function BbsList() {
  const navigate = useNavigate();
  const { getFullPath } = useUserMenu();
  const [bbsData, setBbsData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  const [cursor, setCursor] = useState(null);
  const [hasNext, setHasNext] = useState(true);
  const [bbsTypeCdList, setBbsTypeCdList] = useState([]);
  const observerRef = useRef(null);
  const appliedSearchParamsRef = useRef({
    bbsNo: '',
    bbsNm: '',
    bbsTypeCd: '',
    bbsExplnCn: '',
    useYn: '',
  });

  const [searchParams, setSearchParams] = useState({
    bbsNo: '',
    bbsNm: '',
    bbsTypeCd: '',
    bbsExplnCn: '',
    useYn: '',
  });

  const getBbsTypeLabel = (code) => {
    if (!code) return '';
    const matchedCode = bbsTypeCdList.find((item) => item?.value === code);
    return matchedCode?.label || code;
  };

  const stripHtmlTags = (value = '') =>
    String(value)
      .replace(/<[^>]*>/g, ' ')
      .replace(/&nbsp;/gi, ' ')
      .replace(/\s+/g, ' ')
      .trim();

  const handleInputChange = (name, value) => {
    setSearchParams((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSearchKeyDown = (e) => {
    if (e.key !== 'Enter') return;
    e.preventDefault();
    fetchBbsList(null, true);
  };

  const fetchBbsList = async (nextCursor = null, reset = false) => {
    if (loading) return;
    if (!hasNext && !reset) return;

    setLoading(true);
    if (reset) {
      appliedSearchParamsRef.current = { ...searchParams };
    }

    try {
      const params = reset ? searchParams : appliedSearchParamsRef.current;
      const response = await http.post('/api/v1/board/bbs/search', {
        cursorPageRequest: {
          size: 20,
          cursor: nextCursor,
        },
        ...params,
      });

      const data = response?.data || {};
      const list = data?.data || [];
      const formattedData = list.map((item, index) => ({
        id: item?.bbsNo || `${nextCursor || 'first'}-${index}`,
        no: 0,
        bbsNo: item?.bbsNo || '',
        bbsNm: item?.bbsNm || '',
        menuId: item?.menuId || '',
        bbsTypeCd: item?.bbsTypeCd || '',
        bbsExplnCn: stripHtmlTags(item?.bbsExplnCn || ''),
        rgtrId: item?.rgtrId,
        useYn: item?.useYn === 'Y' ? '사용' : '미사용',
        ctgryUseYn: item?.ctgryUseYn === 'Y' ? '사용' : '미사용',
        regDt: item?.regDt || '',
        bbsManagement: '수정',
        pstManagement: '선택',
      }));

      setBbsData((prev) => {
        const merged = reset ? formattedData : [...prev, ...formattedData];
        const uniqueRows = [];
        const seen = new Set();

        merged.forEach((row) => {
          const key = row.bbsNo || row.id;
          if (seen.has(key)) return;
          seen.add(key);
          uniqueRows.push(row);
        });

        return uniqueRows.map((row, rowIndex) => ({
          ...row,
          no: rowIndex + 1,
        }));
      });

      setCursor(data?.nextCursor ?? null);
      setHasNext(Boolean(data?.hasNext));
      setTotalCount(Number(data?.totalCount ?? 0));
    } catch (error) {
      console.error('게시판 목록 조회 실패:', error);
      alert('게시판 목록을 불러오는데 실패했습니다.');
      if (reset) {
        setBbsData([]);
        setTotalCount(0);
      }
      setHasNext(false);
      setCursor(null);
    } finally {
      setLoading(false);
    }
  };

  const handleMoveToEdit = (bbsNo) => {
    if (!bbsNo) {
      alert('게시판 번호가 없습니다.');
      return;
    }
    navigate(`${bbsNo}`);
  };

  const handleSelect = (row) => {
    const menuId = row?.menuId;
    const routePath = menuId ? getFullPath(menuId) : null;

    if (routePath) {
      navigate(routePath);
      return;
    }

    handleMoveToEdit(row?.bbsNo);
  };

  // 게시판명 컬럼 전용 셀 렌더러.
  // 기존에 column 내부에서 직접 작성하던 버튼 JSX를 팩토리로 대체하여
  // "표시 값 + 클릭 시 row 전달" 패턴을 선언형으로 단순화한다.
  const bbsNameActionCell = createGridValueActionCell({
    valueKey: 'bbsNm',
    fallback: '-',
    onClick: (row) => handleSelect(row),
    variant: 'link',
  });

  const bbsColumns = [
    { id: 'no', width: 40, header: 'No', headerAlign: 'center', dataAlign: 'center' },
    { id: 'bbsNo', width: 90, header: '게시판 ID' },
    {
      id: 'bbsNm',
      width: 300,
      header: '게시판 명',
      dataAlign: 'left',
      // 작업자 관점: cell 구현부를 길게 적지 않고, 미리 만든 렌더러를 바로 연결한다.
      cell: bbsNameActionCell,
    },
    {
      id: 'bbsTypeCd',
      width: 110,
      header: '게시판 유형',
      template: (value) => getBbsTypeLabel(value),
    },
    { id: 'bbsExplnCn', flexgrow: 1, header: '게시판 소개글', dataAlign: 'left' },
    { id: 'ctgryUseYn', width: 120, header: '카테고리 사용여부' },
    { id: 'useYn', width: 80, header: '사용여부' },
    { id: 'rgtrId', width: 120, header: '등록자 ID' },
    {
      id: 'regDt',
      width: 180,
      header: '등록일',
      template: (value) => formatDate(value, 'yyyy-MM-dd HH:mm:ss'),
    },
    /*{
      id: 'pstManagement',
      header: '게시물 선택',
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
            handleSelect(row);
          }}
        >
          선택
        </button>
      ),
    }*/
  ];

  useEffect(() => {
    const loadCommonCodes = async () => {
      try {
        const commonCodes = await fetchAndConvertCommonCodes(['BBS_TYPE_CD']);
        setBbsTypeCdList(commonCodes?.BBS_TYPE_CD || []);
      } catch (error) {
        console.error('공통코드 조회 실패:', error);
      }
    };

    loadCommonCodes();
  }, []);

  useEffect(() => {
    fetchBbsList(null, true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!observerRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNext && !loading) {
          fetchBbsList(cursor, false);
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
        <h2>게시판 선택</h2>
        <ul className="onbreadcrumb">
          <li>시스템 관리</li>
          <li>시스템 설정</li>
          <li>게시물 관리</li>
          <li className="on">게시판 선택</li>
        </ul>
      </div>

      <div className="oncontents">
        <div className="oncontent">
          <div className="onselect-form open" style={{ minHeight: 'auto' }}>
            <div className="onparagraph">
              <MenuInputBox
                menuType="input"
                menuName="게시판 ID"
                menuSize="150px"
                value={searchParams.bbsNo}
                onChange={(e) => handleInputChange('bbsNo', e.target.value)}
                onKeyDown={handleSearchKeyDown}
              />
              <MenuInputBox
                menuType="input"
                menuName="게시판 명"
                menuSize="150px"
                value={searchParams.bbsNm}
                onChange={(e) => handleInputChange('bbsNm', e.target.value)}
                onKeyDown={handleSearchKeyDown}
              />
              <MenuInputBox
                menuType="select"
                menuName="게시판 유형"
                options={bbsTypeCdList}
                showAllOption={true}
                menuSize="100px"
                value={searchParams.bbsTypeCd}
                onChange={(e) => handleInputChange('bbsTypeCd', e.target.value)}
              />
              <MenuInputBox
                menuType="input"
                menuName="게시판 소개글"
                menuSize="300px"
                value={searchParams.bbsExplnCn}
                onChange={(e) => handleInputChange('bbsExplnCn', e.target.value)}
                onKeyDown={handleSearchKeyDown}
              />
              <MenuInputBox
                menuType="select"
                menuName="사용여부"
                options={[
                  { value: 'Y', label: '사용' },
                  { value: 'N', label: '미사용' },
                ]}
                showAllOption={true}
                menuSize="100px"
                value={searchParams.useYn}
                onChange={(e) => handleInputChange('useYn', e.target.value)}
              />

              <div className="onbtn" style={{ marginLeft: 'auto' }}>
                <Button
                  btnType="menuSearch"
                  btnNames="검색"
                  onClick={() => fetchBbsList(null, true)}
                />
              </div>
            </div>
          </div>

          <div className="ontable-legend">
            <span>
              총 <b>{totalCount}</b>건
            </span>
          </div>

          <div className="ongrid-tableform" style={{ scrollbarGutter: 'stable' }}>
            <GridTable
              data={bbsData}
              columns={bbsColumns}
            />
            <div ref={observerRef} style={{ height: 40 }} />
            <div
              className="loading"
              style={{ minHeight: 20, visibility: loading ? 'visible' : 'hidden' }}
            >
              데이터를 불러오는 중...
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
