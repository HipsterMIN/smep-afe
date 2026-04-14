import Button from '@components/ui/Button.jsx';
import GridTable from '@components/ui/GridTable.jsx';
import http from '@lib/http.js';
import { Willow } from '@svar-ui/react-grid';
import { fetchAndConvertCommonCodes } from '@utils/commonUtils.js';
import { formatDate } from '@utils/stringUtils.js';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const MANAGER_USE_STATUS_GROUP = 'MNG_MBR_USE_STTS_CD';
const MANAGER_APPROVAL_STATUS_GROUP = 'MNG_MBR_APRV_STTS_CD';
const DEFAULT_TEXT = '-';
const PAGE_VIEWPORT_HEIGHT = 'calc(100vh - 100px)';
const GRID_VIEWPORT_HEIGHT = 'max(320px, calc(100dvh - 580px))';

function resolvePayload(response) {
  if (response && typeof response === 'object' && !Array.isArray(response)) {
    const responseData = response.data;

    if (
      responseData &&
      typeof responseData === 'object' &&
      !Array.isArray(responseData)
    ) {
      return responseData.data ?? responseData;
    }

    return responseData ?? response ?? {};
  }

  return response ?? {};
}

function normalizeDisplayText(value) {
  if (value === null || value === undefined) {
    return DEFAULT_TEXT;
  }

  const trimmed = String(value).trim();
  return trimmed ? trimmed : DEFAULT_TEXT;
}

function formatTimestamp(value) {
  return value ? formatDate(value, 'yyyy-MM-dd HH:mm:ss') : DEFAULT_TEXT;
}

function resolveCodeLabel(options, value) {
  if (!value) {
    return DEFAULT_TEXT;
  }

  const matched = options.find((option) => option.value === value);
  return matched?.label ?? value;
}

function normalizeHistoryRow(item, index) {
  return {
    id: item?.hstryDt ?? `history-${index}`,
    no: index + 1,
    mngrAcntUseSttsCdNm: normalizeDisplayText(item?.mngrAcntUseSttsCdNm),
    prcsRsnCn: normalizeDisplayText(item?.prcsRsnCn),
    excptnMttrCn: normalizeDisplayText(item?.excptnMttrCn),
    hstryDt: item?.hstryDt ?? null,
    mdfrId: normalizeDisplayText(item?.mdfrId),
  };
}

export default function ManagerChangedHistoryDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const mbrNo = id ? decodeURIComponent(id) : '';

  const [loading, setLoading] = useState(true);
  const [managerDetail, setManagerDetail] = useState(null);
  const [historyRows, setHistoryRows] = useState([]);
  const [managerUseStatusOptions, setManagerUseStatusOptions] = useState([]);
  const [managerApprovalStatusOptions, setManagerApprovalStatusOptions] =
    useState([]);

  function handleGoList() {
    navigate('..', { relative: 'path' });
  }

  useEffect(() => {
    async function fetchPageData() {
      if (!mbrNo) {
        alert('조회 대상 관리자 번호가 없습니다.');
        navigate('..', { relative: 'path' });
        return;
      }

      setLoading(true);

      try {
        const [codeResult, detailResult, historyResult] =
          await Promise.allSettled([
            fetchAndConvertCommonCodes([
              MANAGER_USE_STATUS_GROUP,
              MANAGER_APPROVAL_STATUS_GROUP,
            ]),
            http.get(`/api/v1/managers/${encodeURIComponent(mbrNo)}`),
            http.get(`/api/v1/managers/history/${encodeURIComponent(mbrNo)}`),
          ]);

        if (codeResult.status === 'fulfilled') {
          setManagerUseStatusOptions(
            codeResult.value?.[MANAGER_USE_STATUS_GROUP] ?? []
          );
          setManagerApprovalStatusOptions(
            codeResult.value?.[MANAGER_APPROVAL_STATUS_GROUP] ?? []
          );
        } else {
          console.error(
            '[ManagerChangedHistoryDetail] 관리자 상태 공통코드 조회 실패',
            codeResult.reason
          );
          setManagerUseStatusOptions([]);
          setManagerApprovalStatusOptions([]);
        }

        if (detailResult.status !== 'fulfilled') {
          console.error(
            '[ManagerChangedHistoryDetail] 관리자 상세 조회 실패',
            detailResult.reason
          );
          alert('관리자 상세 정보를 불러오는데 실패했습니다.');
          navigate('..', { relative: 'path' });
          return;
        }

        setManagerDetail(resolvePayload(detailResult.value));

        if (historyResult.status === 'fulfilled') {
          const payload = resolvePayload(historyResult.value);
          const sourceList = Array.isArray(payload) ? payload : [];
          setHistoryRows(sourceList.map(normalizeHistoryRow));
        } else {
          console.error(
            '[ManagerChangedHistoryDetail] 관리자 이력 목록 조회 실패',
            historyResult.reason
          );
          setHistoryRows([]);
        }
      } finally {
        setLoading(false);
      }
    }

    // 상단은 current snapshot, 하단은 같은 사용자의 history list를 분리해서 읽는다.
    // ManagerForm에서 제거한 latest-history replay 열람 책임은 이 상세 화면이 이어받는다.
    void fetchPageData();
  }, [mbrNo, navigate]);

  if (loading) {
    return <div>로딩 중...</div>;
  }

  const columns = [
    {
      id: 'no',
      header: '순번',
      width: 60,
    },
    {
      id: 'mngrAcntUseSttsCdNm',
      header: '처리결과',
      width: 140,
    },
    {
      id: 'prcsRsnCn',
      header: '처리사유',
      width: 626,
      resize: true,
      dataAlign: 'left',
    },
    {
      id: 'excptnMttrCn',
      header: '특이사항',
      width: 440,
      resize: true,
      dataAlign: 'left',
    },
    {
      id: 'hstryDt',
      header: '수정일시',
      width: 180,
      cell: ({ row }) => formatTimestamp(row?.hstryDt),
    },
    {
      id: 'mdfrId',
      header: '변경자',
      width: 120,
    },
  ];

  return (
    <div className="oncontentbox full">
      <div className="oncontentTitle">
        <h2>관리자 권한 변경 이력 상세조회</h2>
        <ul className="onbreadcrumb">
          <li>시스템 관리</li>
          <li>회원/권한 관리</li>
          <li>관리자 관리</li>
          <li>관리자 계정 관리</li>
          <li>관리자 권한 변경 이력</li>
          <li className="on">관리자 권한 변경 이력 상세조회</li>
        </ul>
      </div>
      <div
        className="oncontents"
        style={{ height: PAGE_VIEWPORT_HEIGHT, overflowY: 'auto' }}
      >
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
                  <td>권한그룹</td>
                  <td>{normalizeDisplayText(managerDetail?.roleNm)}</td>
                  <td>아이디</td>
                  <td>{normalizeDisplayText(managerDetail?.lgnId)}</td>
                </tr>
                <tr>
                  <td>기관</td>
                  <td>{DEFAULT_TEXT}</td>
                  <td>이름</td>
                  <td>{normalizeDisplayText(managerDetail?.mbrNm)}</td>
                </tr>
                <tr>
                  <td>휴대폰번호</td>
                  <td>{normalizeDisplayText(managerDetail?.mngrMblTelno)}</td>
                  <td>승인여부</td>
                  <td>
                    {resolveCodeLabel(
                      managerApprovalStatusOptions,
                      managerDetail?.mngrAcntAprvSttsCd
                    )}
                  </td>
                </tr>
                <tr>
                  <td>사용여부</td>
                  <td>
                    {resolveCodeLabel(
                      managerUseStatusOptions,
                      managerDetail?.mngrAcntUseSttsCd
                    )}
                  </td>
                  <td>등록일</td>
                  <td>{formatTimestamp(managerDetail?.regDt)}</td>
                </tr>
                <tr>
                  <td>만료일</td>
                  <td colSpan={3}>
                    {formatTimestamp(managerDetail?.mngrAcntExpryDt)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="ontable-legend">
            <Button btnType="list" btnNames="목록" onClick={handleGoList} />
          </div>

          <div className="ongrid-tableform">
            <Willow>
              {/* 페이지 영역 높이와 grid viewport 높이를 분리해, 화면별 체감에 맞춰 각각 독립적으로 조절할 수 있게 한다. */}
              <div style={{ height: GRID_VIEWPORT_HEIGHT, overflow: 'hidden' }}>
                <GridTable
                  columns={columns}
                  data={historyRows}
                  useWillow={false}
                />
              </div>
            </Willow>
          </div>
        </div>
      </div>
    </div>
  );
}
