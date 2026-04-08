import { useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import Button from '../../components/ui/Button.jsx';
import DatepickerBox from '../../components/ui/DatepickerBox.jsx';
import GridTable from '../../components/ui/GridTable.jsx';
import MenuInputBox from '../../components/ui/MenuInputBox.jsx';
import http from '../../lib/http.js';

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

export default function SurveyResult() {
  const navigate = useNavigate();
  const { surveyNo } = useParams();

  const [summary, setSummary] = useState(null);
  const [rows, setRows] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const [mbrNm, setMbrNm] = useState('');
  const [qstnAnsTypeCd, setQstnAnsTypeCd] = useState('');
  const [qstnCn, setQstnCn] = useState('');
  const [ansFrom, setAnsFrom] = useState('');
  const [ansTo, setAnsTo] = useState('');
  const [searchParams, setSearchParams] = useState({
    mbrNm: '',
    qstnAnsTypeCd: '',
    qstnCn: '',
    ansFrom: '',
    ansTo: '',
  });

  const fetchSummary = useCallback(async () => {
    try {
      const response = await http.get(
        `/api/v1/admin/surveys/${surveyNo}/results/summary`
      );
      setSummary(unwrapApiResponse(response));
    } catch (error) {
      console.error('설문 결과 요약 조회 실패', error);
      alert('설문 결과 요약을 불러오지 못했습니다.');
    }
  }, [surveyNo]);

  const fetchResults = useCallback(async () => {
    setIsLoading(true);
    try {
      const params = {
        size: 300,
      };

      if (searchParams.mbrNm?.trim()) params.mbrNm = searchParams.mbrNm.trim();
      if (searchParams.qstnAnsTypeCd) {
        params.qstnAnsTypeCd = searchParams.qstnAnsTypeCd;
      }
      if (searchParams.qstnCn?.trim()) params.qstnCn = searchParams.qstnCn.trim();
      if (searchParams.ansFrom) params.ansFrom = searchParams.ansFrom;
      if (searchParams.ansTo) params.ansTo = searchParams.ansTo;

      const response = await http.get(
        `/api/v1/admin/surveys/${surveyNo}/results`,
        {
          params,
        }
      );

      const page = unwrapApiResponse(response);
      const data = Array.isArray(page?.data) ? page.data : [];
      const nextTotal =
        typeof page?.totalCount === 'number' ? page.totalCount : data.length;

      setTotalCount(nextTotal);
      setRows(
        data.map((item, index) => ({
          ...item,
          no: nextTotal - index,
        }))
      );
    } catch (error) {
      console.error('설문 결과 목록 조회 실패', error);
      setRows([]);
      setTotalCount(0);
      alert('설문 결과 목록을 조회하지 못했습니다.');
    } finally {
      setIsLoading(false);
    }
  }, [searchParams, surveyNo]);

  useEffect(() => {
    fetchSummary();
  }, [fetchSummary]);

  useEffect(() => {
    fetchResults();
  }, [fetchResults]);

  const handleSearch = useCallback(() => {
    setSearchParams({
      mbrNm,
      qstnAnsTypeCd,
      qstnCn,
      ansFrom,
      ansTo,
    });
  }, [ansFrom, ansTo, mbrNm, qstnAnsTypeCd, qstnCn]);

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

  const columns = [
    { id: 'no', header: '번호', width: 70, dataAlign: 'right' },
    { id: 'mbrNm', header: '응답자', width: 120, dataAlign: 'left' },
    {
      id: 'qstnAnsTypeNm',
      header: '질문유형',
      width: 110,
      cell: ({ row }) => row.qstnAnsTypeNm || row.qstnAnsTypeCd || '-',
    },
    { id: 'qstnCn', header: '질문내용', flexgrow: 1, dataAlign: 'left' },
    { id: 'ansCn', header: '응답내용', width: 240, dataAlign: 'left' },
    {
      id: 'ansDt',
      header: '응답일시',
      width: 170,
      cell: ({ row }) => formatDateTime(row.ansDt),
    },
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
                  <td>설문제목</td>
                  <td colSpan={3}>{summary?.srvyTtl || '-'}</td>
                </tr>
                <tr>
                  <td>설문기간</td>
                  <td>
                    {summary
                      ? `${summary.srvyBgngYmd || '-'} ~ ${summary.srvyEndYmd || '-'}`
                      : '-'}
                  </td>
                  <td>설문 응답자</td>
                  <td>{formatNumber(summary?.respondentCount)}명</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="onselect-form open" style={{ minHeight: 'auto' }}>
            <div className="onparagraph" onKeyDown={handleSearchKeyDown}>
              <MenuInputBox
                menuType="input"
                menuName="응답자"
                menuSize="150px"
                value={mbrNm}
                onChange={(event) => setMbrNm(event.target.value)}
              />

              <MenuInputBox
                menuType="select"
                menuName="질문유형"
                value={qstnAnsTypeCd}
                options={[
                  { label: '객관식', value: 'MLCH' },
                  { label: '주관식', value: 'SBJV' },
                ]}
                onChange={(event) => setQstnAnsTypeCd(event.target.value)}
              />

              <MenuInputBox
                menuType="input"
                menuName="질문내용"
                menuSize="150px"
                value={qstnCn}
                onChange={(event) => setQstnCn(event.target.value)}
              />

              <div className="ondatepickerbox">
                <DatepickerBox
                  menuName="응답일"
                  outputFormat="dash"
                  value={ansFrom}
                  onChange={setAnsFrom}
                />
                <span className="onunit">~</span>
                <DatepickerBox
                  outputFormat="dash"
                  value={ansTo}
                  onChange={setAnsTo}
                />
              </div>

              <div
                className="onbtn"
                style={{ marginLeft: 'auto', display: 'flex', gap: '8px' }}
              >
                <Button
                  btnType="menuSearch"
                  btnNames="검색"
                  onClick={handleSearch}
                />
                <Button
                  btnType="list"
                  btnNames="문항보기"
                  onClick={() => navigate('..')}
                />
              </div>
            </div>
          </div>

          <div className="ontable-legend">
            <span>
              총 <b>{formatNumber(totalCount)}</b>건
            </span>
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
