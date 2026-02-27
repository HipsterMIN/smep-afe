import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import Button  from "../../components/ui/Button.jsx";
import DatepickerBox  from "../../components/ui/DatepickerBox.jsx";
import GridTable from '../../components/ui/GridTable';
import MenuInputBox from "../../components/ui/MenuInputBox.jsx";
import http from '../../lib/http.js';

export default function SurveyList() {
  const navigate = useNavigate();
  const [surveys, setSurveys] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(false);

  // 검색 필터 상태
  const [searchStatus, setSearchStatus] = useState('');
  const [searchKeyword, setSearchKeyword] = useState('');
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  const fetchSurveys = async () => {
    setLoading(true);
    try {
      const params = {
        q: searchKeyword,
        page: 0,
        size: 100, 
      };
      if (searchStatus) {
        params.status = searchStatus;
      }
      const res = await http.get('/api/v1/surveys', { 
        params,
        headers: {
          'X-Member-No': '10001'
        }
      });
      // API 응답 형식이 SurveyListItem[] 라면 바로 설정, 
      // 만약 { data, total } 형태라면 그에 맞게 수정 필요.
      const data = res.data?.data || res.data || [];
      setSurveys(data);
      setTotalCount(data.length);
    } catch (error) {
      console.error('설문 목록 조회 실패:', error);
      // 에러 처리 (토스트 등)
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSurveys();
  }, []);

  const handleSearch = () => {
    fetchSurveys();
  };

  const handleRegister = () => {
    navigate('/survey-manage');
  };

  const formatDate = (date) => {
    if (!date) return '';
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const columns = [
    { id: 'srvyNo', header: '번호', width: 80 },
    { 
      id: 'srvyTtl', 
      header: '제목', 
      flexgrow: 1,
      cell: ({ row }) => (
        <span 
          style={{ cursor: 'pointer', color: '#007bff', textDecoration: 'underline' }}
          onClick={() => navigate(`${row.srvyNo}`)}
        >
          {row.srvyTtl}
        </span>
      )
    },
    { 
      id: 'period', 
      header: '설문기간', 
      width: 200,
      cell: ({ row }) => {
        const start = row.bgngYmd || row.bgngDt || row.srvy_bgng_ymd || '-';
        const end = row.endYmd || row.endDt || row.srvy_end_ymd || '-';
        return `${start} ~ ${end}`;
      }
    },
    { 
      id: 'sttusCd', 
      header: '진행상태', 
      width: 100,
      cell: ({ row: obj }) => {
        const statusCode = obj.sttusCd || obj.sttus_cd;
        if (statusCode) {
          const mapping = {
            'DRAFT': '임시저장',
            'PUBLISHED': '게시',
            'CLOSED': '마감'
          };
          return mapping[statusCode] || statusCode;
        }
        
        // sttusCd가 없을 경우 날짜와 useYn으로 계산 (Spec 3.1 호환)
        const active = obj.useYn || obj.use_yn;
        if (active === 'N') return '미사용';
        
        const todayStr = formatDate(new Date()); // YYYY-MM-DD
        const bgng = obj.bgngYmd || obj.bgngDt || obj.srvy_bgng_ymd || '';
        const end = obj.endYmd || obj.endDt || obj.srvy_end_ymd || '';
        
        if (bgng && todayStr < bgng) return '대기';
        if (end && todayStr > end) return '마감';
        return '진행중';
      }
    },
    { 
      id: 'manage', 
      header: '관리', 
      width: 120,
      cell: ({ row }) => {
        return (
          <div style={{ display: 'flex', gap: '4px', alignItems: 'center', height: '100%' }}>
            <button 
              onClick={(e) => { e.stopPropagation(); navigate(`/survey-result?srvyNo=${row.srvyNo}`); }}
              style={{ padding: '2px 4px', fontSize: '11px', cursor: 'pointer' }}
            >
              결과
            </button>
            <button 
              onClick={(e) => { e.stopPropagation(); navigate(`${row.srvyNo}`); }}
              style={{ padding: '2px 4px', fontSize: '11px', cursor: 'pointer' }}
            >
              수정
            </button>
          </div>
        );
      }
    }
  ];

  return (
     <div className="oncontentbox full">
      <div className="oncontentTitle">
        <h2>설문 목록</h2>
        <ul className="onbreadcrumb">
          <li>정보제공</li>
          <li>고객지원 관리</li>
          <li>설문관리</li>
          <li className="on">설문 목록</li>
        </ul>
      </div>

      <div className="oncontents">
        <div className="oncontent">
          <div className="onselect-form open" style={{ minHeight : 'auto' }}>
            <div className="onparagraph">
              <MenuInputBox 
                menuType="select" 
                menuName="진행여부" 
                value={searchStatus}
                onChange={(e) => setSearchStatus(e.target.value)}
                options={[
                  { label: '전체', value: '' },
                  { label: '진행중 (ONGOING)', value: 'ONGOING' },
                  { label: '대기 (UPCOMING)', value: 'UPCOMING' },
                  { label: '마감 (CLOSED)', value: 'CLOSED' },
                ]}
              />
              <MenuInputBox 
                menuType="input" 
                menuName="제목" 
                menuSize="300px" 
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
                placeholder="검색어를 입력하세요."
              />

              <div className="ondatepickerbox">
                <DatepickerBox 
                  menuName="설문기간" 
                  value={startDate}
                  onChange={setStartDate}
                />
                <span className="onunit">~</span>
                <DatepickerBox 
                  value={endDate}
                  onChange={setEndDate}
                />
              </div>

              <div className="onbtn"  style={{ marginLeft: 'auto' }}>
                <Button btnType="menuSearch" btnNames="검색" onClick={handleSearch} />
              </div>
            </div>
          </div>

          <div className="ontable-legend">
            <span>
              총 <b>{totalCount}</b>건
            </span>
            <Button btnType="add" btnNames="등록" onClick={handleRegister} />
          </div>

          <div className="ongrid-tableform">
            <GridTable data={surveys} columns={columns} />
          </div>
        </div>
      </div>
    </div>
    );
}
