import Button from '@components/ui/Button.jsx';
import DatepickerBox from '@components/ui/DatepickerBox.jsx';
import GridTable from '@components/ui/GridTable.jsx';
import MenuInputBox from '@components/ui/MenuInputBox.jsx';
import http from '@lib/http.js';
import { useMenuStore } from '@store/useMenuStore';
import { fetchAndConvertCommonCodes } from '@utils/commonUtils.js';
import { formatDate } from '@utils/stringUtils.js';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useLocation, useMatches, useNavigate, useParams } from 'react-router-dom';

const formatYmd = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}${month}${day}`;
};

const getOffsetYmd = (offsetDays = 0) => {
  const date = new Date();
  date.setDate(date.getDate() + offsetDays);
  return formatYmd(date);
};

const createDefaultSearchParams = () => ({
  pstNo: '',
  pstTtl: '',
  ctgryNo: '',
  pstgBgngYmd: getOffsetYmd(-30),
  pstgEndYmd: getOffsetYmd(0),
  useYn: '',
});

const stripHtmlTags = (value = '') =>
  String(value)
    .replace(/<[^>]*>/g, ' ')
    .replace(/&nbsp;/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim();

const toNullableNumber = (value) => {
  if (value === '' || value === null || value === undefined) return null;
  const converted = Number(value);
  return Number.isNaN(converted) ? null : converted;
};

export default function PstList() {
  const location = useLocation();
  const navigate = useNavigate();
  const matches = useMatches();
  const flatMenuMap = useMenuStore((state) => state.flatMenuMap);
  const { bbsNo: bbsNoFromParams } = useParams();
  const refreshListAt = location.state?.refreshListAt;

  const currentMenuId = useMemo(() => {
    const matchWithHandle = [...matches]
      .reverse()
      .find((match) => match.handle?.menuId);
    return matchWithHandle?.handle?.menuId || null;
  }, [matches]);

  const bbsNo = useMemo(() => {
    if (bbsNoFromParams) return bbsNoFromParams;

    if (!currentMenuId) return '';

    const mappedBbsNo = flatMenuMap?.[currentMenuId]?.bbsNo;

    if (
      mappedBbsNo === null ||
      mappedBbsNo === undefined ||
      mappedBbsNo === ''
    ) {
      return '';
    }

    return String(mappedBbsNo);
  }, [bbsNoFromParams, currentMenuId, flatMenuMap]);
  const canShowBackToBoardListButton = Boolean(bbsNoFromParams);

  const [bbsInfo, setBbsInfo] = useState(null);
  const [pstData, setPstData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  const [cursor, setCursor] = useState(null);
  const [hasNext, setHasNext] = useState(true);
  const [searchParams, setSearchParams] = useState(() =>
    createDefaultSearchParams()
  );
  const [bbsTypeCdList, setBbsTypeCdList] = useState([]);
  const [categoryOptions, setCategoryOptions] = useState([]);
  const observerRef = useRef(null);
  const appliedSearchParamsRef = useRef(createDefaultSearchParams());
  const clearBoardState = useCallback(() => {
    const resetSearchParams = createDefaultSearchParams();
    setBbsInfo(null);
    setCategoryOptions([]);
    setPstData([]);
    setCursor(null);
    setHasNext(false);
    setTotalCount(0);
    setSearchParams(resetSearchParams);
    appliedSearchParamsRef.current = resetSearchParams;
  }, []);

  const categoryLabelMap = useMemo(() => {
    return categoryOptions.reduce((acc, option) => {
      acc[option.value] = option.label;
      return acc;
    }, {});
  }, [categoryOptions]);

  const bbsTypeLabel = useMemo(() => {
    const code = bbsInfo?.bbsTypeCd;
    if (!code) return '-';
    const matched = bbsTypeCdList.find((item) => item?.value === code);
    return matched?.label || code;
  }, [bbsInfo, bbsTypeCdList]);

  const getCategoryLabel = (value) => {
    if (value === null || value === undefined || value === '') return '-';
    const key = String(value);
    return categoryLabelMap[key] || key;
  };

  const handleInputChange = (name, value) => {
    setSearchParams((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSearchKeyDown = (e) => {
    if (e.key !== 'Enter') return;
    e.preventDefault();
    fetchPstList(null, true);
  };

  const fetchPstList = async (
    nextCursor = null,
    reset = false,
    forcedSearchParams = null
  ) => {
    if (!bbsNo) return;
    if (loading) return;
    if (!hasNext && !reset) return;

    setLoading(true);
    const currentSearchParams = forcedSearchParams || searchParams;
    if (reset) {
      appliedSearchParamsRef.current = { ...currentSearchParams };
    }

    try {
      const params = reset
        ? currentSearchParams
        : appliedSearchParamsRef.current;
      const parsedBbsNo = toNullableNumber(bbsNo);
      if (parsedBbsNo === null) {
        throw new Error('Invalid bbsNo');
      }

      const response = await http.post('/api/v1/board/pst/search', {
        cursorPageRequest: {
          size: 20,
          cursor: nextCursor,
        },
        bbsNo: parsedBbsNo,
        pstNo: toNullableNumber(params.pstNo),
        ctgryNo: toNullableNumber(params.ctgryNo),
        pstTtl: params.pstTtl,
        pstgBgngYmd: params.pstgBgngYmd,
        pstgEndYmd: params.pstgEndYmd,
        useYn: params.useYn,
      });

      const data = response?.data || {};
      const list = data?.data || [];
      const formattedData = list.map((item, index) => ({
        id: `${item?.bbsNo || bbsNo}-${item?.pstNo || `${nextCursor || 'first'}-${index}`}`,
        no: 0,
        bbsNo: item?.bbsNo || bbsNo || '',
        pstNo: item?.pstNo || '',
        pstTtl: item?.pstTtl || '',
        pstCn: stripHtmlTags(item?.pstCn || ''),
        ctgryNo: item?.ctgryNo ?? '',
        answerYn: item?.pstAnsCn?.trim() ? 'Y' : 'N',
        pstRgtrNm: item?.pstRgtrNm || '-',
        pstRegDt: item?.pstRegDt || item?.regDt || '',
        management: '수정',
      }));

      setPstData((prev) => {
        const merged = reset ? formattedData : [...prev, ...formattedData];
        const uniqueRows = [];
        const seen = new Set();

        merged.forEach((row) => {
          const key = `${row?.bbsNo || ''}-${row?.pstNo || row?.id}`;
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
      console.error('게시물 목록 조회 실패:', error);
      alert('게시물 목록을 불러오는데 실패했습니다.');
      if (reset) {
        setPstData([]);
        setTotalCount(0);
      }
      setHasNext(false);
      setCursor(null);
    } finally {
      setLoading(false);
    }
  };

  const handleMoveToCreate = () => {
    navigate(`create?bbsNo=${encodeURIComponent(bbsNo)}`);
  };

  const handleMoveToEdit = (pstNoValue, rowBbsNo) => {
    if (!pstNoValue) {
      alert('게시물 번호가 없습니다.');
      return;
    }
    const targetBbsNo = rowBbsNo || bbsNo;
    if (!targetBbsNo) {
      alert('게시판 번호가 없습니다.');
      return;
    }
    navigate(
      `${pstNoValue}?bbsNo=${encodeURIComponent(String(targetBbsNo))}`
    );
  };

  const handleGoToList = () => {
    navigate('..');
  };

  const pstColumns = [
    { id: 'no', width: 40, header: 'No' },
    { id: 'pstNo', width: 110, header: '게시물 ID' },
    { id: 'pstTtl', width: 220, header: '게시물 제목', dataAlign: 'left' },
    { id: 'pstCn', flexgrow: 1, header: '게시물 내용', dataAlign: 'left' },
    {
      id: 'ctgryNo',
      width: 160,
      header: '카테고리',
      template: (value) => getCategoryLabel(value),
    },
    {
      id: 'answerYn',
      width: 100,
      header: '답글유무',
      template: (value) => (value === 'Y' ? '있음' : '없음'),
    },
    { id: 'pstRgtrNm', width: 120, header: '작성자' },
    {
      id: 'pstRegDt',
      width: 180,
      header: '작성일',
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
            handleMoveToEdit(row?.pstNo, row?.bbsNo);
          }}
        >
          수정
        </button>
      ),
    },
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
    const loadBoardInfo = async () => {
      if (!bbsNo) {
        clearBoardState();
        return;
      }

      try {
        const response = await http.get(`/api/v1/board/bbs/${bbsNo}`);
        const board = response?.data || {};
        setBbsInfo(board);

        const categories = Array.isArray(board?.categories)
          ? board.categories
              .filter((category) => (category?.useYn || 'Y') !== 'N')
              .map((category) => ({
                value: String(category?.ctgryNo),
                label: category?.ctgryNm || String(category?.ctgryNo),
              }))
          : [];
        setCategoryOptions(categories);
      } catch (error) {
        console.error('게시판 상세 조회 실패:', error);
      }
    };

    loadBoardInfo();
  }, [bbsNo, clearBoardState]);

  useEffect(() => {
    if (!bbsNo) {
      clearBoardState();
      return;
    }
    const resetSearchParams = createDefaultSearchParams();
    setPstData([]);
    setCursor(null);
    setHasNext(true);
    setTotalCount(0);
    setSearchParams(resetSearchParams);
    appliedSearchParamsRef.current = resetSearchParams;
    fetchPstList(null, true, resetSearchParams);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bbsNo, clearBoardState, refreshListAt]);

  useEffect(() => {
    if (!observerRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNext && !loading) {
          fetchPstList(cursor, false);
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
        <h2>게시물 목록</h2>
        <ul className="onbreadcrumb">
          <li>시스템 관리</li>
          <li>시스템 설정</li>
          <li>게시물 관리</li>
          <li>게시판 선택</li>
          <li className="on">게시물 목록</li>
        </ul>
      </div>

      <div className="oncontents">
        <div className="oncontent ontable-form">
          <div className="ontableBox onbgtable">
            <table>
              <colgroup>
                <col style={{ width: '150px' }} />
                <col style={{ width: '150px' }} />
                <col style={{ width: '150px' }} />
                <col style={{ width: 'auto' }} />
              </colgroup>
              <tbody>
                <tr>
                  <td className="onbgtxtcenter">게시판 ID</td>
                  <td className="br-right ontxtbold">게시판 명</td>
                  <td className="onbgtxtcenter">게시판 유형</td>
                  <td className="ontxtbold">게시판 소개글</td>
                </tr>
                <tr>
                  <td className="ontxtcenter ontxtnormal">
                    {bbsInfo?.bbsNo || bbsNo || '-'}
                  </td>
                  <td className="br-right ontxtnormal">
                    {bbsInfo?.bbsNm || '-'}
                  </td>
                  <td className="ontxtcenter ontxtnormal">{bbsTypeLabel}</td>
                  <td className="ontxtnormal">
                    {stripHtmlTags(bbsInfo?.bbsExplnCn || '') || '-'}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="onflexbtns">
            {canShowBackToBoardListButton && (
              <div style={{ marginRight: 'auto' }}>
                <Button
                  btnType="list"
                  btnNames="목록"
                  onClick={handleGoToList}
                />
              </div>
            )}
          </div>
        </div>
        <div className="oncontent">
          <div className="onselect-form open" style={{ minHeight: 'auto' }}>
            <div className="onparagraph">
              <MenuInputBox
                menuType="input"
                menuName="게시물 ID"
                menuSize="120px"
                value={searchParams.pstNo}
                onChange={(e) => handleInputChange('pstNo', e.target.value)}
                onKeyDown={handleSearchKeyDown}
              />
              <MenuInputBox
                menuType="input"
                menuName="게시물 제목"
                menuSize="180px"
                value={searchParams.pstTtl}
                onChange={(e) => handleInputChange('pstTtl', e.target.value)}
                onKeyDown={handleSearchKeyDown}
              />
              <MenuInputBox
                menuType="select"
                menuName="카테고리"
                options={categoryOptions}
                showAllOption={true}
                menuSize="140px"
                value={searchParams.ctgryNo}
                onChange={(e) => handleInputChange('ctgryNo', e.target.value)}
              />
              <MenuInputBox
                menuType="select"
                menuName="사용여부"
                options={[
                  { value: 'Y', label: '사용' },
                  { value: 'N', label: '미사용' },
                ]}
                showAllOption={true}
                menuSize="120px"
                value={searchParams.useYn}
                onChange={(e) => handleInputChange('useYn', e.target.value)}
              />
              <div className="ondatepickerbox">
                <DatepickerBox
                  menuName="게시기간"
                  value={searchParams.pstgBgngYmd}
                  outputFormat="ymd"
                  onChange={(value) => handleInputChange('pstgBgngYmd', value)}
                />
                <span className="onunit">~</span>
                <DatepickerBox
                  value={searchParams.pstgEndYmd}
                  outputFormat="ymd"
                  onChange={(value) => handleInputChange('pstgEndYmd', value)}
                />
              </div>

              <div className="onbtn" style={{ marginLeft: 'auto' }}>
                <Button
                  btnType="menuSearch"
                  btnNames="검색"
                  onClick={() => fetchPstList(null, true)}
                />
              </div>
            </div>
          </div>

          <div className="ontable-legend">
            <span>
              총 <b>{totalCount}</b>건
            </span>
            <Button
              btnType="add"
              btnNames="등록"
              onClick={handleMoveToCreate}
            />
          </div>

          <div
            className="ongrid-tableform"
            style={{ scrollbarGutter: 'stable' }}
          >
            <GridTable
              data={pstData}
              columns={pstColumns}
              gridProps={{
                selection: true,
                autoHeight: true,
              }}
            />
            <div ref={observerRef} style={{ height: 40 }} />
            <div
              className="loading"
              style={{
                minHeight: 20,
                visibility: loading ? 'visible' : 'hidden',
              }}
            >
              데이터를 불러오는 중...
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
