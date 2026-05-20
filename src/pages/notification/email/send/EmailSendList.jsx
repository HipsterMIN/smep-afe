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
const formatDateTime = (dateTime) => {
  if (!dateTime || dateTime === '-') return '-';
  // 문자열에서 숫자만 추출 (예: 20260405123247 -> 2026-04-05 12:32)
  const cleaned = String(dateTime).replace(/\D/g, '');
  if (cleaned.length >= 12) {
    return `${cleaned.substring(0, 4)}-${cleaned.substring(4, 6)}-${cleaned.substring(6, 8)} ${cleaned.substring(8, 10)}:${cleaned.substring(10, 12)}`;
  }
  return dateTime;
};

const getProgressRate = (row) => {
  const total = row.totCnt || row.mSendCount || 0;
  const success = row.succCnt || row.tmsSendSucc || 0;
  const fail = row.failCnt || row.tmsFail || 0;

  if (total === 0) return '0.0';

  const rate = ((success + fail) / total) * 100;
  // 소수점 첫째 자리까지 반올림 (JSP의 pattern=".0"과 동일)
  return Math.min(rate, 100).toFixed(1);
};

// 2. 오른쪽 식: 순수 성공률
const getSuccessRate = (row) => {
  const total = row.totCnt || row.mSendCount || 0;
  const success = row.succCnt || row.tmsSendSucc || 0;

  if (total === 0) return '0.0';

  const rate = (success / total) * 100;
  return Math.min(rate, 100).toFixed(1);
};
const EMAIL_SEND_COLUMNS = (navigate, totalCount) => [
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
    id: 'rcvNm',
    header: '수신자',
    width: 130,
    cell: ({ row }) => {
      return toDisplayText(row?.rcvNm);
    },
  },
  {
    id: 'emsTitle',
    header: '제목',
    resize: true,
    flexgrow: 1,
    dataAlign: 'left',
    cell: ({ row }) => {
      const text = toDisplayText(row?.emsTitle);
      return (
        <span
          title={text === '-' ? '' : String(text)}
          onClick={() => navigate(`detail/${row.msgId}`)}
          style={{ cursor: 'pointer', textDecoration: 'underline' }}
        >
          {text}
        </span>
      );
    },
  },
  {
    id: 'sendType',
    header: '발송유형',
    width: 100,
    cell: ({ row }) => {
      const typeCode = row?.sendType;
      if (typeCode === 'R') return '예약발송';
      if (typeCode === 'D') return '즉시발송';
      if (typeCode === 'T') return '테스트';
      return toDisplayText(typeCode);
    },
  },
  {
    id: 'sendStatus',
    header: '발송상태',
    width: 100,
    cell: ({ row }) => {
      const statusCode = row?.sendStatus;
      if (statusCode === 'C') return '발송완료';
      if (statusCode === 'F') return '발송실패';
      if (statusCode === 'P') return '발송중';
      return toDisplayText(statusCode);
    },
  },
  {
    id: 'senderNm',
    header: '발신자',
    width: 110,
  },
  {
    id: 'sendDate',
    header: '발송일시',
    width: 150,
    cell: ({ row }) => {
      return formatDateTime(row?.sendDate);
    },
  },
  {
    id: 'totCnt',
    header: '발송 총 건수',
    width: 100,
  },
  {
    id: 'actualProgressRate',
    header: '진행률 / 성공률(%)',
    width: 130,
    cell: ({ row }) => {
      // row가 안전하게 존재할 때만 함수를 호출하도록 방어벽을 쳐줍니다.
      const progress = row ? getProgressRate(row) : '0.0';
      const success = row ? getSuccessRate(row) : '0.0';
      return `${progress} / ${success}`;
    },
  },
];

export default function EmailSendList() {
  const navigate = useNavigate();

  const [rows, setRows] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(false);

  // 1. 초기값을 '전체'에서 빈 문자열('')로 수정 (options의 value와 매치)
  const [searchParams, setSearchParams] = useState({
    category: '',
    sendType: '',
    sendStatus: '',
    senderNm: '',
    emsTitle: '',
    startDate: '',
    endDate: '',
  });

  const fetchEmailList = async () => {
    try {
      setLoading(true);

      // 백엔드로 보낼 파라미터 중 빈 값은 제외하고 깔끔하게 쿼리스트링 생성
      const apiParams = {};
      Object.entries(searchParams).forEach(([key, value]) => {
        if (value !== null && value !== undefined && value !== '') {
          apiParams[key] = value;
        }
      });

      const response = await http.get('/api/v1/notification/email/list', {
        params: apiParams,
      });

      if (response.data) {
        const rawList =
          response.data.list ||
          (Array.isArray(response.data) ? response.data : []);

        const mappedList = rawList.map((row, idx) => ({
          ...row,
          _rowIndex: idx + 1,
        }));

        setRows(mappedList);
        setTotalCount(response.data.totalCount || rawList.length || 0);
      }
    } catch (error) {
      console.error('이메일 목록을 불러오는 중 오류가 발생했습니다.', error);
      alert('데이터를 가져오는 데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmailList();
  }, []);

  const columns = useMemo(
    () => EMAIL_SEND_COLUMNS(navigate, totalCount),
    [navigate, totalCount]
  );

  const handleInputChange = (key, val) => {
    setSearchParams((prev) => ({ ...prev, [key]: val }));
  };

  return (
    <div className="oncontentbox full">
      <div className="oncontentTitle">
        <h2>이메일 발송 목록</h2>
        <ul className="onbreadcrumb">
          <li>정보제공</li>
          <li>고객지원 관리</li>
          <li className="on">이메일 관리</li>
        </ul>
      </div>

      <div className="oncontents">
        <div className="oncontent">
          <div className="onselect-form open" style={{ minHeight: 'auto' }}>
            <div className="onparagraph">
              <MenuInputBox
                menuType="select"
                menuName="분류"
                menuSize="150px"
                options={[
                  { value: 'NOTICE', label: '공지사항' },
                  { value: 'GUIDE', label: '안내' },
                  { value: 'MARKETING', label: '홍보/마케팅' },
                ]}
                value={searchParams.category}
                onChange={(e) => handleInputChange('category', e.target.value)}
              />
              <MenuInputBox
                menuType="select"
                menuName="발송유형"
                menuSize="150px"
                options={[
                  { value: 'D', label: '즉시발송' },
                  { value: 'R', label: '예약발송' },
                  { value: 'T', label: '테스트' },
                ]}
                value={searchParams.sendType}
                onChange={(e) => handleInputChange('sendType', e.target.value)}
              />
              <MenuInputBox
                menuType="select"
                menuName="발송상태"
                menuSize="150px"
                options={[
                  { value: 'P', label: '발송중' },
                  { value: 'C', label: '발송완료' },
                  { value: 'F', label: '발송실패' },
                ]}
                value={searchParams.sendStatus}
                onChange={(e) =>
                  handleInputChange('sendStatus', e.target.value)
                }
              />
              <div className="onbtn" style={{ marginLeft: 'auto' }}>
                <Button
                  btnType="menuSearch"
                  btnNames="검색"
                  onClick={fetchEmailList}
                />
              </div>
            </div>
            <div className="onparagraph middle">
              {/* handleInputChange로 핸들러 통일 및 엔터 검색 지원 */}
              <MenuInputBox
                menuType="input"
                menuName="발신자"
                menuSize="150px"
                value={searchParams.senderNm}
                onChange={(e) => handleInputChange('senderNm', e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && fetchEmailList()}
              />
              <MenuInputBox
                menuType="input"
                menuName="제목"
                menuSize="300px"
                value={searchParams.emsTitle}
                onChange={(e) => handleInputChange('emsTitle', e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && fetchEmailList()}
              />
              {/* DatepickerBox에 value 속성 명시 및 handleInputChange 연동 */}
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

          <div className="ontable-legend">
            <span>
              총 <b>{totalCount}</b>건
            </span>
            <Button
              btnType="add"
              btnNames="이메일 작성"
              onClick={() => navigate('create')}
            />
          </div>

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
