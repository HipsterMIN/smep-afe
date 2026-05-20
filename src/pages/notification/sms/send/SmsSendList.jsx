import Button from '@components/ui/Button.jsx';
import DatepickerBox from '@components/ui/DatepickerBox.jsx';
import GridTable from '@components/ui/GridTable.jsx';
import MenuInputBox from '@components/ui/MenuInputBox.jsx';
import http from '@lib/http.js';
import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const toDisplayText = (value) => {
  if (value === null || value === undefined || value === '') return '-';
  return value;
};

// 이메일 양식을 참고하여 기획된 SMS 컬럼 명세 구조
const SMS_LOG_COLUMNS = (navigate, totalCount) => [
  {
    id: 'rowNo',
    header: '번호',
    width: 70,
    dataAlign: 'right',
    cell: ({ row }) => {
      return Number.isFinite(totalCount) && Number.isFinite(row?._rowIndex)
        ? totalCount - (row._rowIndex - 1)
        : '-';
    },
  },
  {
    id: 'meKind',
    header: '메시지 구분',
    width: 100,
    cell: ({ row }) => {
      return toDisplayText(row?.meKind);
    },
  },
  {
    id: 'mtitle',
    header: '제목',
    resize: true,
    flexgrow: 1,
    dataAlign: 'left',
    cell: ({ row }) => {
      const text = toDisplayText(row?.mtitle);
      return (
        <span
          title={text === '-' ? '' : String(text)}
          onClick={() => navigate(`detail/${row.mseq}`)}
          style={{ cursor: 'pointer', textDecoration: 'underline' }}
        >
          {text}
        </span>
      );
    },
  },
  {
    id: 'msendType',
    header: '발송상태',
    width: 100,
    cell: ({ row }) => {
      const statusCode = row?.msendType;
      if (statusCode === '1') return '발송완료';
      if (statusCode === '0') return '발송실패';
      if (statusCode === '2') return '발송중';
      return toDisplayText(statusCode);
    },
  },
  {
    id: 'msenderId',
    header: '발신자',
    width: 110,
    cell: ({ row }) => {
      return toDisplayText(row?.msenderId);
    },
  },
  {
    id: 'mregDate',
    header: '발송일시',
    width: 160,
    cell: ({ row }) => {
      // ISO 포맷(2026-05-20T17:59:17)에서 T 문자를 공백으로 치환하여 보기 편하게 노출
      if (!row?.mregDate) return '-';
      return row.mregDate.replace('T', ' ').substring(0, 19);
    },
  },
  {
    id: 'msendCount',
    header: '발송 총 건수',
    width: 100,
    cell: ({ row }) => {
      return toDisplayText(row?.msendCount);
    },
  },
  {
    id: 'tmsFail',
    header: '실패건수',
    width: 90,
    cell: ({ row }) => {
      return toDisplayText(row?.tmsFail);
    },
  },
];

export default function SmsSendList() {
  const navigate = useNavigate();

  const [rows, setRows] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(false);

  // 이메일 예제를 참고해 초기 검색값을 공백('')으로 통일
  const [searchParams, setSearchParams] = useState({
    meKind: '',
    mSendType: '',
    mSenderId: '',
    mTitle: '',
    startDate: '',
    endDate: '',
  });

  const handleInputChange = (key, val) => {
    setSearchParams((prev) => ({ ...prev, [key]: val }));
  };

  const fetchSmsLogList = async () => {
    try {
      setLoading(true);

      // 빈 값 검색 파라미터 제외 프로세스 추가
      const apiParams = {};
      Object.entries(searchParams).forEach(([key, value]) => {
        if (value !== null && value !== undefined && value !== '') {
          apiParams[key] = value;
        }
      });

      const response = await http.get('/api/v1/notification/sms/list', {
        params: apiParams,
      });

      if (response.data) {
        // 실제 데이터 배열은 response.data.data에 존재하므로 우선 접근
        const rawList =
          response.data.data ||
          (Array.isArray(response.data) ? response.data : []);

        // 가상 행 번호를 위한 _rowIndex 매핑 연산 적용
        const mappedList = rawList.map((row, idx) => ({
          ...row,
          _rowIndex: idx + 1,
        }));

        setRows(mappedList);
        setTotalCount(response.data.totalCount || rawList.length || 0);
      }
    } catch (error) {
      console.error('SMS 발송 목록 조회 실패:', error);
      alert('데이터를 가져오는 데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSmsLogList();
  }, []);

  // 이메일과 동일하게 columns를 useMemo로 정의 및 인자 전달 처리
  const columns = useMemo(
    () => SMS_LOG_COLUMNS(navigate, totalCount),
    [navigate, totalCount]
  );

  const handleMoveToCreate = () => navigate('create');

  return (
    <div className="oncontentbox full">
      <div className="oncontentTitle">
        <h2>SMS 발송 목록</h2>
        <ul className="onbreadcrumb">
          <li>정보제공</li>
          <li>고객지원 관리</li>
          <li className="on">SMS 관리</li>
        </ul>
      </div>

      <div className="oncontents">
        <div className="oncontent">
          {/* 검색 폼 구역 */}
          <div className="onselect-form open" style={{ minHeight: 'auto' }}>
            <div className="onparagraph">
              <MenuInputBox
                menuType="select"
                menuName="메시지 구분"
                menuSize="150px"
                options={[
                  { value: 'SMS', label: 'SMS' },
                  { value: 'LMS', label: 'LMS' },
                ]}
                value={searchParams.meKind}
                onChange={(e) => handleInputChange('meKind', e.target.value)}
              />
              <MenuInputBox
                menuType="select"
                menuName="발송상태"
                menuSize="150px"
                options={[
                  { value: '2', label: '발송중' },
                  { value: '1', label: '발송완료' },
                  { value: '0', label: '발송실패' },
                ]}
                value={searchParams.mSendType}
                onChange={(e) => handleInputChange('mSendType', e.target.value)}
              />
              <div className="onbtn" style={{ marginLeft: 'auto' }}>
                <Button
                  btnType="menuSearch"
                  btnNames="검색"
                  onClick={fetchSmsLogList}
                />
              </div>
            </div>
            <div className="onparagraph middle">
              <MenuInputBox
                menuType="input"
                menuName="발신자"
                menuSize="150px"
                value={searchParams.mSenderId}
                onChange={(e) => handleInputChange('mSenderId', e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && fetchSmsLogList()}
              />
              <MenuInputBox
                menuType="input"
                menuName="제목"
                menuSize="300px"
                value={searchParams.mTitle}
                onChange={(e) => handleInputChange('mTitle', e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && fetchSmsLogList()}
              />
              <div className="ondatepickerbox">
                <DatepickerBox
                  menuName="발송일"
                  value={searchParams.startDate}
                  onChange={(date) => handleInputChange('startDate', date)}
                  outputFormat="dash"
                />
                <span className="onunit">~</span>
                <DatepickerBox
                  value={searchParams.endDate}
                  onChange={(date) => handleInputChange('endDate', date)}
                  outputFormat="dash"
                />
              </div>
            </div>
          </div>

          {/* 목록 상단 툴바 */}
          <div className="ontable-legend">
            <span>
              총 <b>{totalCount}</b>건
            </span>
            <Button
              btnType="add"
              btnNames="메시지 작성"
              onClick={handleMoveToCreate}
            />
          </div>

          {/* 데이터 그리드 영역 */}
          <div className="ongrid-tableform">
            {loading ? (
              <div style={{ textAlign: 'center', padding: '40px' }}>
                데이터 로딩 중...
              </div>
            ) : (
              <GridTable data={rows} columns={columns} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
