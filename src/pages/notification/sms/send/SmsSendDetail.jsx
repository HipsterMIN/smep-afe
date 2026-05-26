import Button from '@components/ui/Button.jsx';
import GridTable from '@components/ui/GridTable.jsx';
import MenuInputBox from '@components/ui/MenuInputBox.jsx';
import http from '@lib/http.js';
import { useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

export default function SmsSendDetail() {
  const navigate = useNavigate();
  const { mSeq } = useParams();

  // API 전체 응답 데이터 구조 상태 관리
  const [detailData, setDetailData] = useState({
    master: null,
    receivers: [],
    totalCount: 0,
  });

  // 하단 검색 폼 필터 상태 관리
  const [searchParams, setSearchParams] = useState({
    mrReceiveNm: '',
    mrReceiveNo: '',
    resultStatus: '전체',
  });

  // 로딩 상태
  const [isLoading, setIsLoading] = useState(true);

  /**
   * 백엔드 API 호출 함수 (http.get)
   */
  const fetchSmsDetail = useCallback(async () => {
    if (!mSeq) return;

    setIsLoading(true);
    try {
      const queryParams = new URLSearchParams({
        mSeq: mSeq,
        mrReceiveNm: searchParams.mrReceiveNm,
        mrReceiveNo: searchParams.mrReceiveNo,
        resultStatus:
          searchParams.resultStatus === '전체' ? '' : searchParams.resultStatus,
      });

      const response = await http.get(
        `/api/v1/notification/sms/detail?${queryParams.toString()}`
      );

      if (response && response.data) {
        const result = response.data.data || response.data;

        const formattedReceivers = (result.receivers || []).map(
          (row, index) => ({
            ...row,
            id: row.mrReceiveNo || `receiver-${index}`,
            rowNum: index + 1,
          })
        );

        setDetailData({
          master: result.master || null,
          receivers: formattedReceivers,
          totalCount: result.totalCount || 0,
        });
      }
    } catch (error) {
      console.error('SMS 상세 내역 조회 실패:', error);
      alert('상세 정보를 불러오는 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  }, [
    mSeq,
    searchParams.mrReceiveNm,
    searchParams.mrReceiveNo,
    searchParams.resultStatus,
  ]);

  // 화면 최초 진입 시 데이터 호출
  useEffect(() => {
    fetchSmsDetail();
  }, [mSeq]);

  /**
   * 검색 버튼 클릭 이벤트
   */
  const handleSearch = () => {
    fetchSmsDetail();
  };

  /**
   * 검색 조건 입력 변경 핸들러
   */
  const handleInputChange = (key, value) => {
    setSearchParams((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  // 데이터 로딩 중 방어 코드
  if (isLoading && !detailData.master) {
    return <div className="oncontentbox full">데이터를 로딩 중입니다...</div>;
  }

  const { master, receivers } = detailData;

  return (
    <div className="oncontentbox full">
      <div className="oncontentTitle">
        <h2>SMS 발송 상세</h2>
        <ul className="onbreadcrumb">
          <li>정보제공</li>
          <li>고객지원 관리</li>
          <li>SMS 관리</li>
          <li className="on">SMS 발송 상세</li>
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
                  <td>{master?.mSenderNm || '-'}</td>
                  <td>발신번호</td>
                  <td>{master?.mSenderNo || '-'}</td>
                </tr>
                <tr>
                  <td>메시지 구분</td>
                  <td>
                    <strong style={{ fontWeight: 600 }}>
                      {master?.meKind || 'SMS'}
                    </strong>
                  </td>
                  <td>제목</td>
                  <td>{master?.mTitle || '-'}</td>
                </tr>
                <tr>
                  <td>발송유형</td>
                  <td>
                    {master?.mSendType === 'R'
                      ? '예약발송'
                      : master?.mSendType === 'T'
                        ? '테스트발송'
                        : '즉시발송'}
                  </td>
                  <td rowSpan={4}>메시지</td>
                  <td
                    rowSpan={4}
                    style={{ whiteSpace: 'pre-wrap', verticalAlign: 'top' }}
                  >
                    {master?.mContents || '-'}
                  </td>
                </tr>
                <tr>
                  <td>발송일시</td>
                  <td>{master?.mRegDate || '-'}</td>
                </tr>
                <tr>
                  <td>발송상태</td>
                  <td>
                    <span
                      className={`badge ${master?.sendStatus === '발송중' ? 'ing' : 'complete'}`}
                    >
                      {master?.sendStatus || '-'}
                    </span>
                  </td>
                </tr>
                <tr>
                  <td>발송 총건수</td>
                  <td>{master?.tmsTotal?.toLocaleString() || 0} 건</td>
                </tr>
                <tr>
                  <td>실패건수</td>
                  <td>{master?.tmsFail?.toLocaleString() || 0} 건</td>
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
                value={searchParams.mrReceiveNm}
                onChange={(e) =>
                  handleInputChange('mrReceiveNm', e.target.value)
                }
              />
              <MenuInputBox
                menuType="input"
                menuName="수신번호"
                menuSize="150px"
                value={searchParams.mrReceiveNo}
                onChange={(e) =>
                  handleInputChange('mrReceiveNo', e.target.value)
                }
              />
              <MenuInputBox
                menuType="select"
                menuName="결과"
                value={searchParams.resultStatus}
                options={[
                  { value: '성공', label: '성공' },
                  { value: '대기', label: '대기' },
                  { value: '실패', label: '실패' },
                ]}
                onChange={(e) =>
                  handleInputChange('resultStatus', e.target.value)
                }
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
            <GridTable
              data={receivers}
              columns={[
                { header: '번호', id: 'rowNum', width: 60 },
                { header: '수신자명', id: 'mrReceiveNm', flexgrow: 1 },
                { header: '수신번호', id: 'mrReceiveNo', flexgrow: 1 },
                { header: '발송결과', id: 'resultStatus', flexgrow: 1 },
              ]}
            />
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
    </div>
  );
}
