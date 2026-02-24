import ButtonCell from '@components/custom/ButtonCell.jsx';
import Button from '@components/ui/Button';
import DatepickerBox from '@components/ui/DatepickerBox.jsx';
import GridTable from '@components/ui/GridTable.jsx';
import MenuInputBox from '@components/ui/MenuInputBox.jsx';
import http from '@lib/http.js';
import { fetchCommonCodes } from '@utils/commonUtils.js';
import { formatDate } from '@utils/stringUtils.js';
import { useEffect, useRef, useState } from 'react';

export default function MemberList() {
  const PAGE_SIZE = 20;
  const [gridMemberList, setGridMemberList] = useState([]);
  const [mbrSttscdList, setMbrSttscdList] = useState([]);
  const [mbrTypecdList, setMbrTypecdList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [cursor, setCursor] = useState(null);
  const [hasNext, setHasNext] = useState(true);
  const observerRef = useRef(null);
  const listScrollRef = useRef(null);

  const appliedSearchParamsRef = useRef({
    mbrTypeCd: '',
    mbrSttsCd: '',
    mbrNm: '',
    joinStartDt: null,
    endJoinDt: null,
    startRegDt: null,
    endRegDt: null,
  });

  const getFallbackCursorFromRows = (rows) => {
    if (!rows?.length) return null;
    const lastRow = rows[rows.length - 1];
    return lastRow?.mbrNo || lastRow?.lgnId || null;
  };

  const parseNextCursor = (data, rows) => {
    const cursorCandidates = [
      data?.nextCursor,
      data?.cursor,
      data?.next,
      data?.cursorPageResponse?.nextCursor,
      data?.page?.nextCursor,
      getFallbackCursorFromRows(rows),
    ];

    const validCursor = cursorCandidates.find(
      (value) => value !== undefined && value !== null && value !== ''
    );

    return validCursor ?? null;
  };

  const parseHasNext = (data, rows, nextCursorValue) => {
    const raw =
      data?.hasNext ??
      data?.cursorPageResponse?.hasNext ??
      data?.page?.hasNext;

    if (typeof raw === 'boolean') return raw;
    if (raw === 'Y') return true;
    if (raw === 'N') return false;

    return rows.length >= PAGE_SIZE && Boolean(nextCursorValue);
  };

  //검색 파라미터 state
  const [searchParams, setSearchParams] = useState({
    mbrTypeCd: '', // 회원유형코드
    mbrSttsCd: '', // 회원상태코드
    mbrNm: '', // 회원명
    joinStartDt: null,
    endJoinDt: null,
    startRegDt: null,
    endRegDt: null,
  });

  //from route handle

  //공통코드 조회
  useEffect(() => {
    const fetchCommonCode = async () => {
      try {
        const response = await fetchCommonCodes(['MBR_TYPE_CD', 'MBR_STTS_CD']);

        // MBR_TYPE_CD를 MenuInputBox options 형식으로 변환
        // comCd → value, comCdNm → label
        const mbrTypeOptions = (response.MBR_TYPE_CD || []).map((item) => ({
          value: item.comCd,
          label: item.comCdNm,
        }));

        // MBR_STTS_CD를 MenuInputBox options 형식으로 변환
        const mbrSttsOptions = (response.MBR_STTS_CD || []).map((item) => ({
          value: item.comCd,
          label: item.comCdNm,
        }));

        setMbrTypecdList(mbrTypeOptions);
        setMbrSttscdList(mbrSttsOptions);
      } catch (error) {
        console.error('공통코드 조회 실패:', error);
      }
    };
    fetchCommonCode();
  }, []);

  //조회
  const fetchMemberList = async (nextCursor = null, reset = false) => {
    if (loading) return;
    if (!hasNext && !reset) return;

    setLoading(true);
    if (reset) {
      appliedSearchParamsRef.current = { ...searchParams };
    }

    try {
      const params = reset ? searchParams : appliedSearchParamsRef.current;
      const response = await http.post('/api/v1/member/search', {
        cursorPageRequest: {
          size: 20,
          cursor: nextCursor,
        },
        ...params,
      });
      const data = response?.data || {};
      const memberList = data?.data || [];

      setGridMemberList((prev) => {
        const merged = reset ? memberList : [...prev, ...memberList];
        const uniqueRows = [];
        const seen = new Set();

        merged.forEach((row, rowIndex) => {
          const key =
            row?.mbrNo || row?.lgnId || `${row?.mbrNm || 'member'}-${rowIndex}`;
          if (seen.has(key)) return;
          seen.add(key);
          uniqueRows.push(row);
        });

        return uniqueRows.map((row, rowIndex) => ({
          ...row,
          index: rowIndex + 1,
        }));
      });

      const resolvedNextCursor = parseNextCursor(data, memberList);
      const resolvedHasNext = parseHasNext(
        data,
        memberList,
        resolvedNextCursor
      );

      setCursor(resolvedNextCursor);
      setHasNext(resolvedHasNext);
    } catch (error) {
      console.error('회원 목록 조회 실패:', error);
      alert('회원 목록을 불러오는데 실패했습니다.');
      if (reset) {
        setGridMemberList([]);
      }
      setHasNext(false);
      setCursor(null);
    } finally {
      setLoading(false);
    }
  };

  const handleScrollLoadMore = (target) => {
    if (!target || loading || !hasNext) return;

    const bottomOffset =
      target.scrollHeight - target.scrollTop - target.clientHeight;
    if (bottomOffset <= 24) {
      const fallbackCursor = cursor ?? getFallbackCursorFromRows(gridMemberList);
      fetchMemberList(fallbackCursor, false);
    }
  };

  useEffect(() => {
    fetchMemberList(null, true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!observerRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNext && !loading) {
          const fallbackCursor =
            cursor ?? getFallbackCursorFromRows(gridMemberList);
          fetchMemberList(fallbackCursor, false);
        }
      },
      { threshold: 1 }
    );

    observer.observe(observerRef.current);
    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cursor, hasNext, loading, gridMemberList]);

  useEffect(() => {
    const listScrollElement = listScrollRef.current;
    if (!listScrollElement) return;

    const gridScrollElement = listScrollElement.querySelector('.wx-scroll');
    if (!gridScrollElement) return;

    const onGridScroll = () => handleScrollLoadMore(gridScrollElement);
    gridScrollElement.addEventListener('scroll', onGridScroll, { passive: true });

    return () => {
      gridScrollElement.removeEventListener('scroll', onGridScroll);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cursor, hasNext, loading, gridMemberList.length]);

  //그리드 컬럼 정의
  const defaultColumns = [
    { id: 'index', header: '순번', width: 42 },
    { id: 'mbrTypeCdNm', header: '유형', flexgrow: 1 },
    { id: 'lgnId', header: 'ID', flexgrow: 1 },
    { id: 'mbrNm', header: '성명', flexgrow: 0.5 },
    { id: 'telno', header: '전화번호', width: 110 },
    { id: 'emlAddr', header: '이메일', flexgrow: 1 },
    { id: 'mbrSttsCdNm', header: '상태', flexgrow: 0.5 },
    {
      id: 'regDt',
      flexgrow: 2,
      header: '등록일시',
      template: (value) => formatDate(value, 'yyyy-MM-dd HH:mm:ss'),
    },
    { cell: ButtonCell, id: 'management', header: '관리', width: 76 },
  ];

  return (
    <div className="oncontentbox">
      <div className="oncontentTitle">
        <h2>회원 관리</h2>
        <ul className="onbreadcrumb">
          <li>시스템 관리</li>
          <li>회원/권한 관리</li>
          <li className="on">회원 목록</li>
        </ul>
      </div>

      <div
        className="oncontents space ondivide"
        style={{ alignItems: 'flex-start' }}
      >
        <div className="oncontent">
          <div className="ongrid-form">
            <h4>회원 목록</h4>
            <div className="onselect-form open" style={{ minHeight: 'auto' }}>
              {' '}
              <div className="onparagraph">
                <MenuInputBox
                  menuType="select"
                  menuName="회원유형"
                  inputId="mbrTypeCd"
                  options={mbrTypecdList} // [{ value: 'IND', label: '개인회원' }, ...]
                  value={searchParams.mbrTypeCd}
                  onChange={(e) => {
                    setSearchParams({
                      ...searchParams,
                      mbrTypeCd: e.target.value,
                    });
                  }}
                />
                <MenuInputBox
                  menuType="input"
                  menuName="회원 명"
                  inputId="mbrNm"
                  menuSize="150px"
                  value={searchParams.mbrNm}
                  onChange={(e) => {
                    setSearchParams({
                      ...searchParams,
                      mbrNm: e.target.value,
                    });
                  }}
                />
                <MenuInputBox
                  menuType="select"
                  menuName="상태"
                  inputId="mbrSttsCd"
                  options={mbrSttscdList} // [{ value: 'A111', label: '정상' }, ...]
                  value={searchParams.mbrSttsCd}
                  onChange={(e) => {
                    setSearchParams({
                      ...searchParams,
                      mbrSttsCd: e.target.value,
                    });
                  }}
                />
                <div style={{ marginLeft: 'auto' }}>
                  <Button
                    btnType="menuSearch"
                    btnNames="검색"
                    onClick={() => fetchMemberList(null, true)}
                  />
                </div>
              </div>
              <div className="onparagraph middle">
                <div className="ondatepickerbox">
                  <DatepickerBox
                    menuName="가입기간"
                    value={searchParams.joinStartDt}
                    outputFormat="datetime" // 이것만 추가
                    onChange={(date) => {
                      setSearchParams({ ...searchParams, joinStartDt: date });
                    }}
                  />
                  <span className="onunit">~</span>
                  <DatepickerBox
                    value={searchParams.endJoinDt}
                    outputFormat="datetime" // 이것만 추가
                    onChange={(date) => {
                      setSearchParams({ ...searchParams, endJoinDt: date });
                    }}
                  />
                </div>
                <div className="ondatepickerbox">
                  <DatepickerBox
                    menuName="등록기간"
                    value={searchParams.startRegDt}
                    outputFormat="datetime" // 이것만 추가
                    onChange={(date) => {
                      setSearchParams({ ...searchParams, startRegDt: date });
                    }}
                  />
                  <span className="onunit">~</span>
                  <DatepickerBox
                    value={searchParams.endRegDt}
                    outputFormat="datetime" // 이것만 추가
                    onChange={(date) => {
                      setSearchParams({ ...searchParams, endRegDt: date });
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="ontable-legend">
            <span>
              총 <b>{gridMemberList.length}</b>건
            </span>
            <Button btnType="add" btnNames="등록" />
          </div>

          <div
            ref={listScrollRef}
            className="ongrid-tableform onSCrollBox"
            onScroll={(e) => handleScrollLoadMore(e.currentTarget)}
          >
            <GridTable data={gridMemberList} columns={defaultColumns} />
            <div ref={observerRef} style={{ height: 40 }} />
          </div>
        </div>

        <div className="oncontent ontable-form">
          <h4>회원정보 상세조회(개인)</h4>
          <div className="ontableBox">
            <table>
              <colgroup>
                <col style={{ width: '150px' }} />
                <col style={{ width: 'auto' }} />
              </colgroup>
              <tbody>
                <tr>
                  <td>아이디</td>
                  <td>ABC</td>
                </tr>
                <tr>
                  <td>상태</td>
                  <td>정상</td>
                </tr>
                <tr>
                  <td>이름</td>
                  <td>홍길동</td>
                </tr>
                <tr>
                  <td>전화번호</td>
                  <td>031-123-4567</td>
                </tr>
                <tr>
                  <td>유선번호</td>
                  <td>010-1234-5678</td>
                </tr>
                <tr>
                  <td>이메일</td>
                  <td>Placehloder</td>
                </tr>
                <tr>
                  <td>이메일 수신동의 여부</td>
                  <td>동의</td>
                </tr>
                <tr>
                  <td>SMS 수신동의 여부</td>
                  <td>미동의</td>
                </tr>
                <tr>
                  <td>최종 수정일시</td>
                  <td>YYYY-MM-DD HH:MM</td>
                </tr>
                <tr>
                  <td>생성일시</td>
                  <td>YYYY-MM-DD HH:MM</td>
                </tr>
                <tr>
                  <td>최종 로그인 일시</td>
                  <td>YYYY-MM-DD HH:MM</td>
                </tr>
                <tr>
                  <td>스마트 알림 사용 여부</td>
                  <td>
                    <div className="onflexrow">
                      <span>사용</span>
                      <Button btnType="search" btnNames="관심분야조회" />
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="onflexbtns">
            <div style={{ marginLeft: 'auto' }}>
              <Button btnType="edit" btnNames="수정" />
            </div>
          </div>

          <h4>활동내역</h4>
          <div className="ontableBox" style={{ marginBottom: '30px' }}>
            <table>
              <colgroup>
                <col style={{ width: '150px' }} />
                <col style={{ width: 'auto' }} />
              </colgroup>
              <tbody>
                <tr>
                  <td>스크랩</td>
                  <td>
                    <div className="onflexrow">
                      <span>999 건</span>
                      <Button btnType="search" btnNames="상세보기" />
                    </div>
                  </td>
                </tr>
                <tr>
                  <td>알림 수신</td>
                  <td>
                    <div className="onflexrow">
                      <span>999 건</span>
                      <Button btnType="search" btnNames="상세보기" />
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <h4>회원정보 변경이력</h4>
          <div className="ongrid-tableform">
            <GridTable />
          </div>
        </div>
      </div>
    </div>
  );
}
