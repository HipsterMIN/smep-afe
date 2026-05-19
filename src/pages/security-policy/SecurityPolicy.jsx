import Button from '@components/ui/Button.jsx';
import GridTable from '@components/ui/GridTable.jsx';
import http from '@lib/http.js';
import React, { useEffect, useMemo, useRef, useState } from 'react';

import MenuInputBox from '../../components/ui/MenuInputBox.jsx';

const toApiValue = (value) => {
  if (Array.isArray(value)) {
    return value
      .map((item) => String(item).trim())
      .filter(Boolean)
      .join(',');
  }
  if (value === null || value === undefined) return '';
  return String(value).trim();
};

const createSecurityPolicyParams = () => ({
  certPrmIpAddr: '',
  lgnMinCycDayCnt: '',
  scrtyPlcyNm: '',
  dpcnLgnChckCycMncnt: '',
  pswdExpiryWarnPrdDayCnt: '',
  pswdFailPrmNmtm: '',
  pswdVldPrdDayCnt: '',
  sessVldHrCnt: '',
  scrtyPlcyCd: '',
});

export default function SecurityPolicy() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasNext, setHasNext] = useState(true);
  const [cursor, setCursor] = useState(null);
  const observerRef = useRef(null);
  // const [totalCount, setTotalCount] = useState(0);

  const [createParams, setCreateParams] = useState(
    createSecurityPolicyParams()
  );

  const appliedParamsRef = useRef(createSecurityPolicyParams());

  const buildParams = (baseParams) => {
    const params = {
      size: 20,
      ...baseParams,
    };

    const filtered = {};
    Object.entries(params).forEach(([key, value]) => {
      const normalized = toApiValue(value);
      if (normalized !== '') filtered[key] = normalized;
    });

    return filtered;
  };

  useEffect(() => {
    fetchSecurityPolicys(null, true);
  }, []);

  useEffect(() => {
    if (!observerRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNext && !loading) {
          fetchSecurityPolicys(cursor, false);
        }
      },
      { threshold: 1 }
    );

    observer.observe(observerRef.current);
    return () => observer.disconnect();
  }, [cursor, hasNext, loading]);

  const fetchSecurityPolicys = async (nextCursor = null, reset = false) => {
    if (loading) return;
    if (!hasNext && !reset) return;

    setLoading(true);

    try {
      const params = reset ? createParams : appliedParamsRef.current;
      const apiParams = buildParams(params);
      if (nextCursor) apiParams.cursor = nextCursor;

      const response = await http.get(`/api/v1/security-policies`, {
        params: apiParams,
      });

      const result = response?.data ?? {};
      const list = Array.isArray(result?.data) ? result.data : [];

      setRows((prev) => {
        const merged = reset ? list : [...prev, ...list];
        return merged.map((row, idx) => ({
          ...row,
          rowNumber: merged.length - idx,
        }));
      });

      if (reset && list.length > 0) {
        // 활성 정책 찾기
        const activePolicy = list.find((item) => item.useYn === 'Y');

        if (activePolicy) {
          setCreateParams({
            certPrmIpAddr: activePolicy.certPrmIpAddr || '',
            lgnMinCycDayCnt: activePolicy.lgnMinCycDayCnt || '',
            scrtyPlcyNm: activePolicy.scrtyPlcyNm || '',
            dpcnLgnChckCycMncnt: activePolicy.dpcnLgnChckCycMncnt || '',
            pswdExpiryWarnPrdDayCnt: activePolicy.pswdExpiryWarnPrdDayCnt || '',
            pswdFailPrmNmtm: activePolicy.pswdFailPrmNmtm || '',
            pswdVldPrdDayCnt: activePolicy.pswdVldPrdDayCnt || '',
            sessVldHrCnt: activePolicy.sessVldHrCnt || '',
            scrtyPlcyCd: activePolicy.scrtyPlcyCd, // 번호만 다음 번호로 준비
          });
        }
      }

      setCursor(result?.nextCursor ?? null);
      setHasNext(Boolean(result?.hasNext));
    } catch (error) {
      console.error('조회 실패:', error);
      if (reset) setRows([]);
      setHasNext(false);
    } finally {
      setLoading(false);
    }
  };

  const columns = useMemo(
    () => [
      { id: 'rowNumber', width: 70, header: '순번', dataAlign: 'center' },
      { id: 'certPrmIpAddr', flexgrow: 1, header: '인증허용\nIP주소' },
      { id: 'lgnMinCycDayCnt', width: 100, header: '로그인\n최소주기일' },
      { id: 'scrtyPlcyNm', flexgrow: 2, header: '이용자\n보안정책명' },
      { id: 'dpcnLgnChckCycMncnt', width: 100, header: '중복로그인체크주기' },
      {
        id: 'pswdExpiryWarnPrdDayCnt',
        width: 80,
        header: '비밀번호만료경고기간',
      },
      { id: 'pswdFailPrmNmtm', width: 80, header: '비밀번호실패허용개수' },
      { id: 'pswdVldPrdDayCnt', width: 80, header: '비밀번호유효기간' },
      { id: 'sessVldHrCnt', width: 100, header: '세션유효시간' },
      { id: 'scrtyPlcyCd', flexgrow: 1.5, header: '이용자보안정책코드' },
      { id: 'mdfrId', width: 80, header: '변경자' },
      {
        id: 'mdfcnDt',
        width: 140,
        header: '변경일시',
        cell: (props) => props.row.mdfcnDt?.replace('T', ' ').substring(0, 16),
      },
      {
        id: 'management',
        width: 100,
        header: '관리',
        dataAlign: 'center',
        cell: (props) => (
          <Button
            btnType="edit"
            btnNames="적용"
            onClick={() => handleActivate(props.row)}
          />
        ),
      },
    ],
    []
  );

  const handleSave = async () => {
    // 1. 보안정책명 (VARCHAR 100)
    if (!createParams.scrtyPlcyNm?.trim()) {
      alert('보안정책명은 필수입니다.');
      return;
    }
    if (createParams.scrtyPlcyNm.length > 100) {
      alert('보안정책명은 최대 100자까지 입력 가능합니다.');
      return;
    }

    // 2. 인증허용 IP 주소 (VARCHAR 40)
    if (createParams.certPrmIpAddr && createParams.certPrmIpAddr.length > 40) {
      alert('인증허용 IP 주소는 최대 40자까지 입력 가능합니다.');
      return;
    }

    // 숫자형 필드 체크 함수 (NUMERIC 길이 제한용)
    const isInvalidNumeric = (val, maxLen) => {
      if (val === undefined || val === null || String(val).trim() === '')
        return true;
      const num = Number(val);
      const maxVal = Math.pow(10, maxLen) - 1; // 예: 2 -> 99, 4 -> 9999
      return isNaN(num) || num < 0 || num > maxVal;
    };

    // 3. 세션유효시간수 (NUMERIC 2)
    if (isInvalidNumeric(createParams.sessVldHrCnt, 2)) {
      alert('세션 유효시간은 0~99 사이의 숫자로 입력해주세요.');
      return;
    }

    // 4. 로그인최소주기일수 (NUMERIC 4)
    if (isInvalidNumeric(createParams.lgnMinCycDayCnt, 4)) {
      alert('로그인 최소 주기 일수는 0~9999 사이의 숫자로 입력해주세요.');
      return;
    }

    // 5. 중복로그인점검주기분수 (NUMERIC 3)
    if (isInvalidNumeric(createParams.dpcnLgnChckCycMncnt, 3)) {
      alert('중복 로그인 점검 주기는 0~999 사이의 숫자로 입력해주세요.');
      return;
    }

    // 6. 비밀번호실패허용횟수 (NUMERIC 2)
    if (isInvalidNumeric(createParams.pswdFailPrmNmtm, 2)) {
      alert('비밀번호 실패 허용 횟수는 0~99 사이의 숫자로 입력해주세요.');
      return;
    }

    // 7. 비밀번호만료경고기간일수 (NUMERIC 2)
    if (isInvalidNumeric(createParams.pswdExpiryWarnPrdDayCnt, 2)) {
      alert('비밀번호 만료 경고 기간은 0~99 사이의 숫자로 입력해주세요.');
      return;
    }

    // 8. 비밀번호유효기간일수 (NUMERIC 4)
    if (isInvalidNumeric(createParams.pswdVldPrdDayCnt, 4)) {
      alert('비밀번호 유효 기간은 0~9999 사이의 숫자로 입력해주세요.');
      return;
    }

    // 모든 검사 통과 시 저장 로직 실행
    try {
      setLoading(true);

      const payload = {
        ...createParams,
        useYn: 'Y',
        lgnMinCycDayCnt: Number(createParams.lgnMinCycDayCnt) || 0,
        dpcnLgnChckCycMncnt: Number(createParams.dpcnLgnChckCycMncnt) || 0,
        pswdExpiryWarnPrdDayCnt:
          Number(createParams.pswdExpiryWarnPrdDayCnt) || 0,
        pswdFailPrmNmtm: Number(createParams.pswdFailPrmNmtm) || 0,
        pswdVldPrdDayCnt: Number(createParams.pswdVldPrdDayCnt) || 0,
        sessVldHrCnt: Number(createParams.sessVldHrCnt) || 0,
      };

      await http.post('/api/v1/security-policies', payload);

      alert('보안정책이 성공적으로 저장되었습니다.');

      fetchSecurityPolicys(null, true);
    } catch (error) {
      console.error('저장 실패:', error);
      alert('저장에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleActivate = async (rowData) => {
    const { scrtyPlcyCd } = rowData;

    if (!scrtyPlcyCd) {
      alert('정책 코드가 없습니다.');
      return;
    }

    if (
      !confirm(
        `[${scrtyPlcyCd}] 정책을 활성화하시겠습니까?\n다른 정책은 자동으로 비활성화됩니다.`
      )
    ) {
      return;
    }

    try {
      setLoading(true);
      await http.post(`/api/v1/security-policies/update/${scrtyPlcyCd}/activate`);
      alert('보안정책이 활성화되었습니다.');

      fetchSecurityPolicys(null, true);
    } catch (error) {
      console.error('활성화 실패:', error);
      alert('정책 활성화에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (key, valueOrEvent) => {
    const value = valueOrEvent?.target
      ? valueOrEvent.target.value
      : valueOrEvent;
    setCreateParams((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  return (
    <div className="oncontentbox full">
      <div className="oncontentTitle">
        <h2>보안정책 설정</h2>
        <ul className="onbreadcrumb">
          <li>시스템 관리</li>
          <li>시스템 설정</li>
          <li className="on">보안정책 설정</li>
        </ul>
      </div>
      <div className="oncontents">
        <div className="oncontent ontable-form">
          <h4 className="ontableTitle">보안정책</h4>
          <div className="ontableBox">
            <table>
              <colgroup>
                <col style={{ width: '400px' }} />
                <col style={{ width: 'auto' }} />
                <col style={{ width: '180px' }} />
                <col style={{ width: 'auto' }} />
              </colgroup>
              <tbody>
                <tr>
                  <td className="onbgtxtleft">인증 허용 IP 주소</td>
                  <td>
                    <MenuInputBox
                      menuType="input"
                      menuSize="280px"
                      value={createParams.certPrmIpAddr}
                      onChange={(e) =>
                        handleInputChange('certPrmIpAddr', e.target.value)
                      }
                      placeholder="XXXXXXXXXXXXXX"
                    />
                  </td>
                  <td className="onbgtxtleft">로그인 최소 주기</td>
                  <td>
                    <MenuInputBox
                      menuType="input"
                      menuSize="280px"
                      value={createParams.lgnMinCycDayCnt}
                      onChange={(e) =>
                        handleInputChange('lgnMinCycDayCnt', e.target.value)
                      }
                      placeholder="XXXXXXXXXXXXXX"
                    />
                  </td>
                </tr>
                <tr>
                  <td className="onbgtxtleft">이용자 보안정책 명</td>
                  <td>
                    <MenuInputBox
                      menuType="input"
                      menuSize="280px"
                      value={createParams.scrtyPlcyNm}
                      onChange={(e) =>
                        handleInputChange('scrtyPlcyNm', e.target.value)
                      }
                      placeholder="XXXXXXXXXXXXXX"
                      readOnly={true}
                    />
                  </td>
                  <td className="onbgtxtleft">중복로그인 체크 주기</td>
                  <td>
                    <MenuInputBox
                      menuType="input"
                      menuSize="280px"
                      value={createParams.dpcnLgnChckCycMncnt}
                      onChange={(e) =>
                        handleInputChange('dpcnLgnChckCycMncnt', e.target.value)
                      }
                      placeholder="XXXXXXXXXXXXXX"
                    />
                  </td>
                </tr>
                <tr>
                  <td className="onbgtxtleft">
                    비밀번호 만료 경고 기간 (만료일로부터 몇일전) (단위:일)
                  </td>
                  <td>
                    <MenuInputBox
                      menuType="input"
                      menuSize="280px"
                      value={createParams.pswdExpiryWarnPrdDayCnt}
                      onChange={(e) =>
                        handleInputChange(
                          'pswdExpiryWarnPrdDayCnt',
                          e.target.value
                        )
                      }
                      placeholder="XXXXXXXXXXXXXX"
                    />
                  </td>
                  <td className="onbgtxtleft">비밀번호 실패 허용 개수</td>
                  <td>
                    <MenuInputBox
                      menuType="input"
                      menuSize="280px"
                      value={createParams.pswdFailPrmNmtm}
                      onChange={(e) =>
                        handleInputChange('pswdFailPrmNmtm', e.target.value)
                      }
                      placeholder="XXXXXXXXXXXXXX"
                    />
                  </td>
                </tr>
                <tr>
                  <td className="onbgtxtleft">비밀번호 유효기간 (단위:일)</td>
                  <td>
                    <MenuInputBox
                      menuType="input"
                      menuSize="280px"
                      value={createParams.pswdVldPrdDayCnt}
                      onChange={(e) =>
                        handleInputChange('pswdVldPrdDayCnt', e.target.value)
                      }
                      placeholder="XXXXXXXXXXXXXX"
                    />
                  </td>
                  <td className="onbgtxtleft">세션 유효시간</td>
                  <td>
                    <MenuInputBox
                      menuType="input"
                      menuSize="280px"
                      value={createParams.sessVldHrCnt}
                      onChange={(e) =>
                        handleInputChange('sessVldHrCnt', e.target.value)
                      }
                      placeholder="XXXXXXXXXXXXXX"
                    />
                  </td>
                </tr>
                <tr>
                  <td className="onbgtxtleft">이용자 보안정책 코드</td>
                  <td>
                    <MenuInputBox
                      menuType="input"
                      menuSize="280px"
                      value={createParams.scrtyPlcyCd}
                      onChange={(e) =>
                        handleInputChange('scrtyPlcyCd', e.target.value)
                      }
                      placeholder="XXXXXXXXXXXXXX"
                      disabled={true}
                    />
                  </td>
                  <td></td>
                  <td></td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="ontable-legend flexEnd" style={{ gap: '8px' }}>
            <Button btnType="add" btnNames="변경 저장" onClick={handleSave} />
          </div>

          <h4 className="ontableTitle">개정 이력</h4>
          <div className="ongrid-tableform">
            <GridTable data={rows} columns={columns} />
            <div ref={observerRef} style={{ height: '20px' }} />
          </div>
        </div>
      </div>
    </div>
  );
}
