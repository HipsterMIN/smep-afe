import Button from '@components/ui/Button.jsx';
import GridTable from '@components/ui/GridTable.jsx';
import MenuInputBox from '@components/ui/MenuInputBox.jsx';
import Popup from '@components/ui/Popup.jsx';
import http from '@lib/http.js';
import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const toDisplayText = (value) => {
  if (value === null || value === undefined || value === '') return '-';
  return value;
};

const formatDateTime = (dateTime) => {
  if (!dateTime || dateTime === '-') return '-';

  const cleaned = String(dateTime).replace(/\D/g, '');

  if (cleaned.length >= 12) {
    return `${cleaned.substring(0, 4)}-${cleaned.substring(4, 6)}-${cleaned.substring(6, 8)} ${cleaned.substring(8, 10)}:${cleaned.substring(10, 12)}`;
  }

  return dateTime;
};

const getSendTypeLabel = (sendType, sendDate) => {
  if (sendType === 'R') {
    return `예약발송 (${formatDateTime(sendDate)})`;
  }
  if (sendType === 'D') return '즉시발송';
  if (sendType === 'T') return '테스트';
  return toDisplayText(sendType);
};

const getSendStatusLabel = (sendStatus) => {
  if (sendStatus === 'C') return '발송완료';
  if (sendStatus === 'F') return '발송실패';
  if (sendStatus === 'P') return '발송중';
  return toDisplayText(sendStatus);
};

const getResultLabel = (resultCd) => {
  if (resultCd === 'S') return '성공';
  if (resultCd === 'F') return '실패';
  if (resultCd === 'P') return '처리중';
  return toDisplayText(resultCd);
};

const getReadYnLabel = (readYn) => {
  if (readYn === 'Y') return '수신 확인';
  if (readYn === 'N') return '미확인';
  return toDisplayText(readYn);
};

const DETAIL_COLUMNS = [
  {
    id: 'rowNo',
    header: '번호',
    width: 70,
    dataAlign: 'center',
  },
  {
    id: 'rcvNm',
    header: '수신자',
    width: 140,
    dataAlign: 'center',
  },
  {
    id: 'rcvMail',
    header: '이메일',
    flexgrow: 1,
    dataAlign: 'left',
  },
  {
    id: 'resultCd',
    header: '결과',
    width: 100,
    dataAlign: 'center',
    cell: ({ row }) => getResultLabel(row?.resultCd),
  },
  {
    id: 'readYn',
    header: '수신여부',
    width: 120,
    dataAlign: 'center',
    cell: ({ row }) => getReadYnLabel(row?.readYn),
  },
  {
    id: 'failReason',
    header: '실패사유',
    flexgrow: 1,
    dataAlign: 'left',
    cell: ({ row }) => toDisplayText(row?.failReason),
  },
];

export default function EmailSendDetail() {
  const navigate = useNavigate();
  const { msgId } = useParams();

  const [loading, setLoading] = useState(false);
  const [detailLoading, setDetailLoading] = useState(false);

  const [detail, setDetail] = useState({
    msgId: '',
    emsTitle: '',
    emsContent: '',
    senderNm: '',
    senderMail: '',
    categoryId: '',
    sendType: '',
    sendStatus: '',
    totCnt: 0,
    succCnt: 0,
    failCnt: 0,
    readCnt: 0,
    sendDate: '',
    memo: '',
  });

  const [rows, setRows] = useState([]);
  const [isContentPopupOpen, setIsContentPopupOpen] = useState(false);

  const [searchParams, setSearchParams] = useState({
    rcvNm: '',
    rcvMail: '',
    resultCd: '',
  });

  const fetchDetail = async () => {
    try {
      setDetailLoading(true);

      const response = await http.get(`/api/v1/notification/email/${msgId}`);
      const payload = response?.data?.data ?? response?.data ?? response ?? {};

      setDetail({
        msgId: payload?.msgId ?? '',
        emsTitle: payload?.emsTitle ?? '',
        emsContent: payload?.emsContent ?? '',
        senderNm: payload?.senderNm ?? '',
        senderMail: payload?.senderMail ?? '',
        categoryId: payload?.categoryId ?? '',
        sendType: payload?.sendType ?? '',
        sendStatus: payload?.sendStatus ?? '',
        totCnt: payload?.totCnt ?? 0,
        succCnt: payload?.succCnt ?? 0,
        failCnt: payload?.failCnt ?? 0,
        readCnt: payload?.readCnt ?? 0,
        sendDate: payload?.sendDate ?? '',
        memo: payload?.memo ?? '',
      });
    } catch (error) {
      console.error(
        '이메일 발송 상세를 불러오는 중 오류가 발생했습니다.',
        error
      );
      alert('이메일 발송 상세 정보를 가져오는 데 실패했습니다.');
    } finally {
      setDetailLoading(false);
    }
  };

  const fetchDetailItems = async () => {
    try {
      setLoading(true);

      const apiParams = {};
      Object.entries(searchParams).forEach(([key, value]) => {
        if (value !== null && value !== undefined && value !== '') {
          apiParams[key] = value;
        }
      });

      const response = await http.get(
        `/api/v1/notification/email/${msgId}/details`,
        { params: apiParams }
      );

      const payload = response?.data?.data ?? response?.data ?? response ?? {};
      const rawList = Array.isArray(payload)
        ? payload
        : Array.isArray(payload?.list)
          ? payload.list
          : [];

      setRows(rawList);
    } catch (error) {
      console.error(
        '이메일 발송 상세 내역을 불러오는 중 오류가 발생했습니다.',
        error
      );
      alert('이메일 발송 상세 내역을 가져오는 데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!msgId) return;
    fetchDetail();
    fetchDetailItems();
  }, [msgId]);

  const handleInputChange = (key, value) => {
    setSearchParams((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleSearch = () => {
    fetchDetailItems();
  };

  const columns = useMemo(() => DETAIL_COLUMNS, []);

  return (
    <div className="oncontentbox full">
      <div className="oncontentTitle">
        <h2>이메일 발송 상세</h2>
        <ul className="onbreadcrumb">
          <li>정보제공</li>
          <li>고객지원 관리</li>
          <li>이메일 관리</li>
          <li className="on">이메일 발송 상세</li>
        </ul>
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
                  <td>발신자</td>
                  <td>{toDisplayText(detail.senderNm)}</td>
                  <td>발신이메일</td>
                  <td>{toDisplayText(detail.senderMail)}</td>
                </tr>
                <tr>
                  <td>구분</td>
                  <td>{toDisplayText(detail.categoryId)}</td>
                  <td>제목</td>
                  <td>{toDisplayText(detail.emsTitle)}</td>
                </tr>
                <tr>
                  <td>발송유형</td>
                  <td>{getSendTypeLabel(detail.sendType, detail.sendDate)}</td>
                  <td>메일내용</td>
                  <td>
                    <Button
                      btnType="edit"
                      btnNames="내용보기"
                      onClick={() => setIsContentPopupOpen(true)}
                    />
                  </td>
                </tr>
                <tr>
                  <td>발송일시</td>
                  <td>{formatDateTime(detail.sendDate)}</td>
                  <td rowSpan={3}>설명</td>
                  <td rowSpan={3}>{toDisplayText(detail.memo)}</td>
                </tr>
                <tr>
                  <td>발송상태</td>
                  <td>{getSendStatusLabel(detail.sendStatus)}</td>
                </tr>
                <tr></tr>
                <tr>
                  <td>발송 총건수</td>
                  <td>{toDisplayText(detail.totCnt)}</td>
                  <td rowSpan={3}>첨부파일</td>
                  <td rowSpan={3}>-</td>
                </tr>
                <tr>
                  <td>실패건수</td>
                  <td>{toDisplayText(detail.failCnt)}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <h4 className="ontableTitle">발송 상세 내역</h4>
          <div className="onselect-form open" style={{ minHeight: 'auto' }}>
            <div className="onparagraph">
              <MenuInputBox
                menuType="input"
                menuName="수신자"
                menuSize="150px"
                value={searchParams.rcvNm}
                onChange={(e) => handleInputChange('rcvNm', e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              />
              <MenuInputBox
                menuType="input"
                menuName="이메일"
                menuSize="200px"
                value={searchParams.rcvMail}
                onChange={(e) => handleInputChange('rcvMail', e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              />
              <MenuInputBox
                menuType="select"
                menuName="결과"
                menuSize="140px"
                options={[
                  { value: 'S', label: '성공' },
                  { value: 'F', label: '실패' },
                  { value: 'P', label: '처리중' },
                ]}
                value={searchParams.resultCd}
                onChange={(e) => handleInputChange('resultCd', e.target.value)}
              />
              <div className="onbtn" style={{ marginLeft: 'auto' }}>
                <Button
                  btnType="menuSearch"
                  btnNames="검색"
                  onClick={handleSearch}
                />
              </div>
            </div>
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

        <div className="onflexbtns">
          <div style={{ marginRight: 'auto' }}>
            <Button
              btnType="list"
              btnNames="목록"
              onClick={() => navigate('..')}
            />
          </div>
        </div>
      </div>

      {isContentPopupOpen && (
        <Popup
          title="메일 내용"
          autoHeight={true}
          onClose={() => setIsContentPopupOpen(false)}
        >
          <div className="oncontent" style={{ minWidth: '800px' }}>
            <div
              style={{
                minHeight: '300px',
                maxHeight: '500px',
                overflowY: 'auto',
                padding: '16px',
                border: '1px solid #E1E1E1',
                backgroundColor: '#fff',
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-word',
              }}
            >
              {detailLoading ? (
                <div>메일 내용을 불러오는 중입니다...</div>
              ) : detail.emsContent ? (
                <div dangerouslySetInnerHTML={{ __html: detail.emsContent }} />
              ) : (
                <div>표시할 메일 내용이 없습니다.</div>
              )}
            </div>
          </div>
        </Popup>
      )}
    </div>
  );
}
