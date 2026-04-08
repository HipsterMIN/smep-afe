import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import Button from '../../components/ui/Button.jsx';
import { createGridValueActionCell } from '../../components/ui/createGridValueActionCell.jsx';
import DatepickerBox from '../../components/ui/DatepickerBox.jsx';
import GridTable from '../../components/ui/GridTable.jsx';
import MenuInputBox from '../../components/ui/MenuInputBox.jsx';
import http from '../../lib/http.js';

const STATUS_LABELS = {
  UPCOMING: '진행예정',
  ONGOING: '진행중',
  COMPLETED: '완료',
};

const normalizeProgressStatus = (value) => {
  const raw = String(value ?? '')
    .trim()
    .toUpperCase();
  if (!raw) return '';

  const compact = raw.replace(/[^A-Z]/g, '');
  if (compact === 'INPROGRESS') return 'ONGOING';
  if (compact === 'PLANNED') return 'UPCOMING';
  if (compact === 'DONE' || compact === 'CLOSED') return 'COMPLETED';
  return compact;
};

const unwrapApiResponse = (payload) => {
  if (
    payload &&
    typeof payload === 'object' &&
    Object.prototype.hasOwnProperty.call(payload, 'success') &&
    Object.prototype.hasOwnProperty.call(payload, 'data')
  ) {
    return payload.data;
  }
  return payload;
};

const formatDateTime = (value) => {
  if (!value) return '-';
  return String(value).replace('T', ' ').slice(0, 16);
};

const formatNumber = (value) => {
  if (value == null) return '0';
  return Number(value).toLocaleString();
};

const withDisplayNo = (data = []) =>
  data.map((item, index) => ({
    ...item,
    progressStatus: normalizeProgressStatus(item.progressStatus),
    no: index + 1,
  }));

export default function SurveyList() {
  const navigate = useNavigate();

  const [rows, setRows] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const [progressStatus, setProgressStatus] = useState('');
  const [title, setTitle] = useState('');
  const [fromYmd, setFromYmd] = useState('');
  const [toYmd, setToYmd] = useState('');
  const [searchParams, setSearchParams] = useState({
    progressStatus: '',
    title: '',
    fromYmd: '',
    toYmd: '',
  });

  const fetchSurveys = useCallback(async () => {
    setIsLoading(true);
    try {
      const params = {
        size: 200,
      };

      if (searchParams.progressStatus) {
        params.progressStatus = searchParams.progressStatus;
      }
      if (searchParams.title?.trim()) params.title = searchParams.title.trim();
      if (searchParams.fromYmd) params.fromYmd = searchParams.fromYmd;
      if (searchParams.toYmd) params.toYmd = searchParams.toYmd;

      const response = await http.get('/api/v1/admin/surveys', { params });
      const page = unwrapApiResponse(response);
      const data = Array.isArray(page?.data) ? page.data : [];

      setRows(withDisplayNo(data));
      setTotalCount(
        typeof page?.totalCount === 'number' ? page.totalCount : data.length
      );
    } catch (error) {
      console.error('설문 목록 조회 실패', error);
      setRows([]);
      setTotalCount(0);
      alert('설문 목록을 조회하지 못했습니다.');
    } finally {
      setIsLoading(false);
    }
  }, [searchParams]);

  useEffect(() => {
    fetchSurveys();
  }, [fetchSurveys]);

  const handleSearch = useCallback(() => {
    setSearchParams({
      progressStatus,
      title,
      fromYmd,
      toYmd,
    });
  }, [fromYmd, progressStatus, title, toYmd]);

  const handleSearchKeyDown = useCallback(
    (event) => {
      if (event.key !== 'Enter' || event.nativeEvent?.isComposing) {
        return;
      }
      event.preventDefault();
      handleSearch();
    },
    [handleSearch]
  );

  const surveyTitleActionCell = createGridValueActionCell({
    valueKey: 'srvyTtl',
    fallback: '-',
    onClick: (row) => {
      if (!row?.srvyNo) return;
      navigate(`${row.srvyNo}`);
    },
    variant: 'link',
    style: { textAlign: 'left' },
    buttonProps: {
      title: '설문지 관리 이동',
    },
  });

  const questionManageActionCell = createGridValueActionCell({
    getValue: () => '보기',
    fallback: '보기',
    onClick: (row) => {
      if (!row?.srvyNo) return;
      navigate(`${row.srvyNo}`);
    },
    variant: 'button',
    className: 'defaultbutton edit',
    buttonProps: {
      title: '설문문항 보기',
    },
  });

  const resultManageActionCell = createGridValueActionCell({
    getValue: () => '보기',
    fallback: '보기',
    onClick: (row) => {
      if (!row?.srvyNo) return;
      navigate(`${row.srvyNo}/results`);
    },
    variant: 'button',
    className: 'defaultbutton edit',
    buttonProps: {
      title: '설문결과 보기',
    },
  });

  const columns = [
    { id: 'no', header: '번호', width: 80 },
    {
      id: 'srvyTtl',
      header: '설문 제목',
      flexgrow: 1,
      dataAlign: 'left',
      cell: surveyTitleActionCell,
    },
    {
      id: 'progressStatus',
      header: '진행여부',
      width: 110,
      cell: ({ row }) =>
        STATUS_LABELS[normalizeProgressStatus(row.progressStatus)] || '-',
    },
    {
      id: 'period',
      header: '설문 기간',
      width: 210,
      cell: ({ row }) => `${row.srvyBgngYmd || '-'} ~ ${row.srvyEndYmd || '-'}`,
    },
    {
      id: 'respondentCount',
      header: '설문 응답자',
      width: 120,
      cell: ({ row }) => formatNumber(row.respondentCount),
    },
    {
      id: 'management',
      header: '설문문항',
      width: 90,
      cell: questionManageActionCell,
    },
    {
      id: 'edit',
      header: '설문 결과',
      width: 90,
      cell: resultManageActionCell,
    },
    { id: 'rgtrId', header: '등록자', width: 100 },
    {
      id: 'regDt',
      header: '등록일시',
      width: 150,
      cell: ({ row }) => formatDateTime(row.regDt),
    },
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
          <div className="onselect-form open" style={{ minHeight: 'auto' }}>
            <div className="onparagraph" onKeyDown={handleSearchKeyDown}>
              <MenuInputBox
                menuType="select"
                menuName="진행여부"
                value={progressStatus}
                onChange={(event) => setProgressStatus(event.target.value)}
                options={[
                  { label: '진행중', value: 'ONGOING' },
                  { label: '진행예정', value: 'UPCOMING' },
                  { label: '완료', value: 'COMPLETED' },
                ]}
              />

              <MenuInputBox
                menuType="input"
                menuName="제목"
                menuSize="300px"
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                placeholder="설문 제목을 입력하세요"
              />

              <div className="ondatepickerbox">
                <DatepickerBox
                  menuName="설문기간"
                  outputFormat="dash"
                  value={fromYmd}
                  onChange={setFromYmd}
                />
                <span className="onunit">~</span>
                <DatepickerBox
                  outputFormat="dash"
                  value={toYmd}
                  onChange={setToYmd}
                />
              </div>

              <div className="onbtn" style={{ marginLeft: 'auto' }}>
                <Button
                  btnType="menuSearch"
                  btnNames="검색"
                  onClick={handleSearch}
                />
              </div>
            </div>
          </div>

          <div className="ontable-legend">
            <span>
              총 <b>{formatNumber(totalCount)}</b>건
            </span>
            <Button
              btnType="add"
              btnNames="등록"
              onClick={() => navigate('create')}
            />
          </div>

          <div className="ongrid-tableform">
            <GridTable data={rows} columns={columns} />
          </div>

          {isLoading && (
            <div style={{ marginTop: '12px' }}>조회 중입니다...</div>
          )}
        </div>
      </div>
    </div>
  );
}
