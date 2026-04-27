import Button from '@components/ui/Button.jsx';
import GridTable from '@components/ui/GridTable.jsx';
import http from '@lib/http.js';
import { formatDate } from '@utils/stringUtils.js';
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';

const EMPTY_VALUE = '-';

function formatValue(value) {
  if (value === null || value === undefined || value === '') {
    return EMPTY_VALUE;
  }

  return value;
}

function formatTimestamp(value) {
  return value ? formatDate(value, 'yyyy-MM-dd HH:mm:ss') : EMPTY_VALUE;
}

function formatUseYn(value) {
  if (value === 'Y') return '사용';
  if (value === 'N') return '사용안함';
  return EMPTY_VALUE;
}

function resolvePayload(response) {
  if (Array.isArray(response)) {
    return response;
  }

  if (response && typeof response === 'object') {
    const responseData = response.data;

    if (Array.isArray(responseData)) {
      return responseData;
    }

    if (
      responseData &&
      typeof responseData === 'object' &&
      !Array.isArray(responseData)
    ) {
      return responseData.data ?? responseData;
    }
  }

  return response ?? [];
}

function normalizeHistoryRows(rows) {
  return rows.map((row, rowIndex) => ({
    ...row,
    id: `${row?.mbrNo || 'member'}-${row?.hstryDt || rowIndex}`,
    no: rowIndex + 1,
  }));
}

const PERSONAL_HISTORY_COLUMNS = [
  { id: 'no', header: '순번', width: 42 },
  {
    id: 'mbrNm',
    header: '이름',
    width: 54,
    dataAlign: 'left',
    cell: ({ row }) => formatValue(row?.mbrNm),
  },
  {
    id: 'indvGnrlTelno',
    header: '전화번호',
    width: 100,
    cell: ({ row }) => formatValue(row?.indvGnrlTelno),
  },
  {
    id: 'indvMblTelno',
    header: '휴대 전화번호',
    width: 130,
    cell: ({ row }) => formatValue(row?.indvMblTelno),
  },
  {
    id: 'indvEmlAddr',
    header: '이메일',
    width: 190,
    dataAlign: 'left',
    cell: ({ row }) => formatValue(row?.indvEmlAddr),
  },
  {
    id: 'hstryDt',
    header: '변경일시',
    width: 170,
    cell: ({ row }) => formatTimestamp(row?.hstryDt),
  },
  {
    id: 'mdfrId',
    header: '수정자',
    width: 100,
    cell: ({ row }) => formatValue(row?.mdfrId),
  },
  {
    id: 'mbrSttsCdNm',
    header: '상태',
    width: 100,
    cell: ({ row }) => formatValue(row?.mbrSttsCdNm),
  },
];

const ENTERPRISE_HISTORY_COLUMNS = [
  { id: 'no', header: '순번', width: 60 },
  {
    id: 'mbrNm',
    header: '기업명',
    width: 150,
    dataAlign: 'left',
    cell: ({ row }) => formatValue(row?.mbrNm),
  },
  {
    id: 'rprsvNm',
    header: '대표자명',
    width: 100,
    cell: ({ row }) => formatValue(row?.rprsvNm),
  },
  {
    id: 'brno',
    header: '사업자번호',
    width: 120,
    cell: ({ row }) => formatValue(row?.brno),
  },
  {
    id: 'rprsTelno',
    header: '대표 전화번호',
    width: 130,
    cell: ({ row }) => formatValue(row?.rprsTelno),
  },
  {
    id: 'rprsFxno',
    header: '대표 팩스번호',
    width: 130,
    cell: ({ row }) => formatValue(row?.rprsFxno),
  },
  {
    id: 'mdfcnDt',
    header: '수정일시',
    width: 170,
    cell: ({ row }) => formatTimestamp(row?.mdfcnDt),
  },
  {
    id: 'mdfrId',
    header: '수정자',
    width: 100,
    cell: ({ row }) => formatValue(row?.mdfrId),
  },
  {
    id: 'mbrSttsCdNm',
    header: '상태',
    width: 100,
    cell: ({ row }) => formatValue(row?.mbrSttsCdNm),
  },
];

function renderRows(rows) {
  return rows.map(([label, value]) => (
    <tr key={label}>
      <td>{label}</td>
      <td>{formatValue(value)}</td>
    </tr>
  ));
}

function buildPersonalRows(member) {
  // 수신동의/최종로그인 원천은 이번 1차 범위에서 보류돼 있어 가짜 값을 표시하지 않는다.
  return [
    ['아이디', member.lgnId],
    ['상태', member.mbrSttsCdNm],
    ['이름', member.mbrNm],
    ['전화번호', member.indvMblTelno || member.telno],
    ['유선번호', member.indvGnrlTelno],
    ['이메일', member.indvEmlAddr],
    ['이메일 수신동의 여부', EMPTY_VALUE],
    ['SMS 수신동의 여부', EMPTY_VALUE],
    ['최종 수정일시', formatTimestamp(member.mdfcnDt)],
    ['생성일시', formatTimestamp(member.regDt)],
    ['최종 로그인 일시', EMPTY_VALUE],
  ];
}

function buildEnterpriseRows(member) {
  // 기업 담당자 정보는 현재 상세 응답에 없으므로 대표자 정보로 임의 대체하지 않는다.
  return [
    ['아이디', member.lgnId],
    ['상태', member.mbrSttsCdNm],
    ['이름', member.mbrNm],
    ['법인 등록번호', member.crno],
    ['대표 전화번호', member.rprsTelno || member.telno],
    ['대표 팩스번호', member.rprsFxno],
    ['대표 이메일 주소', member.emlAddr],
    ['홈페이지 주소', member.hmpgAddr],
    ['기업 기본주소', member.entAddr],
    ['기업 상세주소', member.entDaddr],
    ['기업 관리자 명', EMPTY_VALUE],
    ['기업 관리자 휴대전화', EMPTY_VALUE],
    ['기업 관리자 유선번호', EMPTY_VALUE],
    ['기업관리자 이메일', EMPTY_VALUE],
    ['SMS 수신동의 여부', EMPTY_VALUE],
    ['이메일 수신동의 여부', EMPTY_VALUE],
    ['생성일시', formatTimestamp(member.regDt)],
    ['최종 수정일시', formatTimestamp(member.mdfcnDt)],
    ['최종 로그인 일시', EMPTY_VALUE],
  ];
}

export default function MemberDetailPanel({
  member,
  loading,
  error,
  panelStyle,
  onEdit,
}) {
  const [historyRows, setHistoryRows] = useState([]);
  const [historyMemberNo, setHistoryMemberNo] = useState('');
  const [historyLoading, setHistoryLoading] = useState(false);
  const [historyError, setHistoryError] = useState('');
  const memberNo = member?.mbrNo;
  const memberModifiedAt = member?.mdfcnDt;

  useEffect(() => {
    if (!memberNo) {
      setHistoryRows([]);
      setHistoryMemberNo('');
      setHistoryError('');
      setHistoryLoading(false);
      return undefined;
    }

    let ignore = false;

    async function fetchHistoryRows() {
      try {
        setHistoryLoading(true);
        setHistoryRows([]);
        setHistoryMemberNo(memberNo);
        setHistoryError('');
        const response = await http.get(
          `/api/v1/member/${encodeURIComponent(memberNo)}/history`
        );
        const data = resolvePayload(response);

        if (ignore) return;
        setHistoryRows(normalizeHistoryRows(Array.isArray(data) ? data : []));
      } catch (fetchError) {
        if (ignore) return;

        console.error(
          '[MemberDetailPanel] 회원정보 변경이력 조회 실패',
          fetchError
        );
        setHistoryRows([]);
        setHistoryError('변경이력을 불러오는데 실패했습니다.');
      } finally {
        if (!ignore) {
          setHistoryLoading(false);
        }
      }
    }

    // 선택 회원을 빠르게 바꾸면 이전 history 응답이 늦게 도착할 수 있어 cleanup guard로 무시한다.
    void fetchHistoryRows();

    return () => {
      ignore = true;
    };
  }, [memberNo, memberModifiedAt]);

  if (loading) {
    return (
      <div className="oncontent ontable-form" style={panelStyle}>
        <h4>회원정보 상세조회</h4>
        <p>회원 정보를 불러오는 중입니다.</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="oncontent ontable-form" style={panelStyle}>
        <h4>회원정보 상세조회</h4>
        <p>{error}</p>
      </div>
    );
  }

  if (!member) {
    return (
      <div className="oncontent ontable-form" style={panelStyle}>
        <h4>회원정보 상세조회</h4>
        <p>좌측 목록에서 이름을 선택하면 상세 정보가 표시됩니다.</p>
      </div>
    );
  }

  const isEnterprise = member.mbrTypeCd === 'ENT';
  const rows = isEnterprise
    ? buildEnterpriseRows(member)
    : buildPersonalRows(member);
  const title = isEnterprise
    ? '회원정보 상세조회(기업)'
    : '회원정보 상세조회(개인)';
  const historyColumns = isEnterprise
    ? ENTERPRISE_HISTORY_COLUMNS
    : PERSONAL_HISTORY_COLUMNS;
  const isHistoryCurrent = historyMemberNo === memberNo;
  const visibleHistoryRows = isHistoryCurrent ? historyRows : [];
  const historyStatusText =
    historyLoading || !isHistoryCurrent
      ? '변경이력을 불러오는 중입니다.'
      : historyError ||
        (visibleHistoryRows.length === 0 ? '조회된 데이터가 없습니다.' : '');

  return (
    <div className="oncontent ontable-form" style={panelStyle}>
      <h4>{title}</h4>
      <div className="ontableBox">
        <table>
          <colgroup>
            <col style={{ width: '150px' }} />
            <col style={{ width: 'auto' }} />
          </colgroup>
          <tbody>
            {renderRows(rows)}
            <tr>
              <td>스마트 알림 사용 여부</td>
              <td>
                <div className="onflexrow">
                  <span>{formatUseYn(member.smntUseYn)}</span>
                  <Button btnType="search" btnNames="관심분야조회" disabled />
                </div>
              </td>
            </tr>
            {isEnterprise ? (
              <tr>
                <td>증명(확인서) 신청 권한</td>
                <td>{EMPTY_VALUE}</td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>

      <div className="onflexbtns">
        <div style={{ marginLeft: 'auto' }}>
          <Button
            btnType="edit"
            btnNames="수정"
            onClick={() => onEdit(member)}
          />
        </div>
      </div>

      {!isEnterprise ? (
        <>
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
                      <span>0 건</span>
                      <Button btnType="search" btnNames="상세보기" disabled />
                    </div>
                  </td>
                </tr>
                <tr>
                  <td>알림 수신</td>
                  <td>
                    <div className="onflexrow">
                      <span>0 건</span>
                      <Button btnType="search" btnNames="상세보기" disabled />
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </>
      ) : null}

      <h4>회원정보 변경이력</h4>
      {historyStatusText ? <p>{historyStatusText}</p> : null}
      <div className="ongrid-tableform">
        <GridTable data={visibleHistoryRows} columns={historyColumns} />
      </div>
    </div>
  );
}

MemberDetailPanel.propTypes = {
  member: PropTypes.object,
  loading: PropTypes.bool,
  error: PropTypes.string,
  panelStyle: PropTypes.object,
  onEdit: PropTypes.func.isRequired,
};
