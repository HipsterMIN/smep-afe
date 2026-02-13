import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

import Button from '../../components/ui/Button';
import MenuInputBox from "../../components/ui/MenuInputBox.jsx";
import DatepickerBox  from "../../components/ui/DatepickerBox.jsx";
import GridTable from '../../components/ui/GridTable';
import http from '../../lib/http.js';

export default function SurveyResult() {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const srvyNo = queryParams.get('srvyNo');

  const [surveyDetail, setSurveyDetail] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (srvyNo) {
      fetchSurveyDetail();
    }
  }, [srvyNo]);

  const fetchSurveyDetail = async () => {
    setLoading(true);
    try {
      const res = await http.get(`/api/v1/surveys/${srvyNo}`, {
        headers: {
          'X-Member-No': '10001'
        }
      });
      setSurveyDetail(res.data?.data);
    } catch (error) {
      console.error('설문 상세 조회 실패:', error);
    } finally {
      setLoading(false);
    }
  };

  const qstnColumns = [
    { id: 'sortSeq', header: '순번', width: 60 },
    { 
      id: 'qstnCn', 
      header: '질문내용', 
      flexgrow: 1,
      cell: ({ row: obj }) => (
        <div>
          <div style={{ fontWeight: 'bold', marginBottom: obj.items?.length ? '8px' : '0' }}>{obj.qstnCn}</div>
          {obj.items?.length > 0 && (
            <ul style={{ marginLeft: '20px', fontSize: '12px', color: '#666' }}>
              {obj.items.map((item, i) => (
                <li key={i}>
                  - {item.qitemNm} {item.qitemExpln ? `(${item.qitemExpln})` : ''} 
                  <span style={{ marginLeft: '8px', color: '#999' }}>[배점: {item.scorScr}]</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      )
    },
    { 
      id: 'qstnAnsTypeCd', 
      header: '유형', 
      width: 100,
      template: (obj) => {
        const mapping = {
          'SING': '단일선택',
          'MULT': '다중선택',
          'TEXT': '주관식',
          'SCAL': '척도형'
        };
        return mapping[obj.qstnAnsTypeCd] || obj.qstnAnsTypeCd;
      }
    },
    { 
      id: 'ansEsntlYn', 
      header: '필수', 
      width: 60,
      template: (obj) => obj.ansEsntlYn === 'Y' ? 'O' : 'X'
    },
    { 
      id: 'scorScr', 
      header: '배점', 
      width: 60 
    }
  ];

  return (
    <div className="oncontentbox full">
      <div className="oncontentTitle">
        <h2>설문 결과 보기</h2>
        <ul className="onbreadcrumb">
          <li>정보제공</li>
          <li>고객지원 관리</li>
          <li className="on">설문결과 보기</li>
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
                  <td>설문 제목</td>
                  <td colSpan={3}>{surveyDetail?.srvyTtl || surveyDetail?.srvyNm || surveyDetail?.srvy_ttl || '제목을 불러오는 중...'}</td>
                </tr>
                <tr>
                  <td>설문 설명</td>
                  <td colSpan={3}>{surveyDetail?.srvyExpln || surveyDetail?.srvy_expln || '설명 없음'}</td>
                </tr>
                <tr>
                  <td>설문 기간</td>
                  <td>
                    {surveyDetail 
                      ? `${surveyDetail.bgngYmd || surveyDetail.bgngDt || surveyDetail.srvy_bgng_ymd || '-'} ~ ${surveyDetail.endYmd || surveyDetail.endDt || surveyDetail.srvy_end_ymd || '-'}` 
                      : '기간 정보 없음'}
                  </td>
                  <td>사용 여부</td>
                  <td>{(surveyDetail?.useYn || surveyDetail?.use_yn) === 'Y' ? '사용' : '미사용'}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="ontable-legend">
            <h2 className="onsubtitle">설문 문항 구성</h2>
          </div>

          <div className="ongrid-tableform mask" style={{ marginBottom: '30px' }}>
            <GridTable data={surveyDetail?.questions || []} columns={qstnColumns} />
          </div>

          <div className="onselect-form open" style={{ minHeight : 'auto' }}>
            {' '}
            {/** open 클래스로 동작, 펼치기/접기 */}
            <div className="onparagraph">
              <MenuInputBox menuType="input" menuName="응답자" menuSize="150px" />
              <MenuInputBox menuType="select" menuName="질문유형" selectOption="전체" />
              <MenuInputBox menuType="input" menuName="질문내용" menuSize="150px" />

              <div className="ondatepickerbox">
                <DatepickerBox menuName="응답일" />
                <span className="onunit">~</span>
                <DatepickerBox />
              </div>
              
              <div className="onbtn"  style={{ marginLeft: 'auto' }}>
                <Button btnType="menuSearch" btnNames="검색" />
              </div>
            </div>
          </div>

          <div className="ongrid-tableform mask">
            <GridTable />
          </div>
        </div>
      </div>
    </div>
  );
}
