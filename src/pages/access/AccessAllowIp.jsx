import Button from '@components/ui/Button.jsx';
import DatepickerBox from '@components/ui/DatepickerBox.jsx';
import MenuInputBox from '@components/ui/MenuInputBox.jsx';
import http from '@lib/http.js';
import AccessAllowIpAddModal from '@pages/access/AccessAllowIpAddModal.jsx';
import AccessAllowIpGrid from '@pages/access/AccessAllowIpGrid.jsx';
import { useEffect, useRef, useState } from 'react';

const createSearchParams = () => ({
  ipAddr: '',
  memoCn: '',
  useYn: '',
  rgtrId: '',
  startRegDt: null,
  endRegDt: null,
  mdfrId: '',
  startMdfcnDt: null,
  endMdfcnDt: null,
});

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

export default function AccessAllowIp() {
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasNext, setHasNext] = useState(true);
  const [cursor, setCursor] = useState(null);
  const observerRef = useRef(null);
  const [totalCount, setTotalCount] = useState(0);

  const appliedSearchParamsRef = useRef(createSearchParams());
  const [searchParams, setSearchParams] = useState(createSearchParams());

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

  const fetchCount = async (paramsToApply) => {
    try {
      const res = await http.get('/api/v1/access-allowIp/count', {
        params: buildParams(paramsToApply),
      });
      const value =
        typeof res?.data === 'number'
          ? res.data
          : typeof res === 'number'
            ? res
            : 0;
      setTotalCount(value);
    } catch (error) {
      setTotalCount(0);
    }
  };

  useEffect(() => {
    fetchAccessAllowIps(null, true);
    fetchCount(searchParams);
  }, []);

  useEffect(() => {
    if (!observerRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNext && !loading) {
          fetchAccessAllowIps(cursor, false);
        }
      },
      { threshold: 1 }
    );

    observer.observe(observerRef.current);
    return () => observer.disconnect();
  }, [cursor, hasNext, loading]);

  //접속허용 IP 목록 조회
  const fetchAccessAllowIps = async (nextCursor = null, reset = false) => {
    if (loading) return;
    if (!hasNext && !reset) return;

    setLoading(true);

    if (reset) {
      appliedSearchParamsRef.current = { ...searchParams };
    }
    try {
      const params = reset ? searchParams : appliedSearchParamsRef.current;
      const apiParams = buildParams(params);
      if (nextCursor) {
        apiParams.cursor = nextCursor;
      }
      const response = await http.get(`/api/v1/access-allowIp`, {
        params: apiParams,
      });

      const page = response?.data ?? response ?? {};
      const list = Array.isArray(page?.data) ? page.data : [];
      const withCount = list.map((item) => ({
        ...item,
        mngrPrmIpNo: Number(item?.mngrPrmIpNo ?? 0),
      }));

      setRows((prev) => {
        const merged = reset ? withCount : [...prev, ...withCount];
        const unique = [];
        const seen = new Set();

        merged.forEach((row) => {
          const key = row?.mngrPrmIpNo;
          if (!key || seen.has(key)) return;
          seen.add(key);
          unique.push(row);
        });

        return unique.map((row, idx) => ({
          ...row,
          _rowIndex: idx + 1,
        }));
      });

      setCursor(page?.nextCursor ?? null);
      setHasNext(Boolean(page?.hasNext));
    } catch (error) {
      console.error('접속 허용 IP 조회 실패:', error);
      if (reset) {
        setRows([]);
      }
      setHasNext(false);
      setCursor(null);
    } finally {
      setLoading(false);
    }
  };

  const handleAccessAllowIpSearch = () => {
    setCursor(null);
    setHasNext(true);
    fetchAccessAllowIps(null, true);
    fetchCount(searchParams);
  };

  const handleAccessAllowIpDelete = async (row) => {
    try {
      await http.patch(`/api/v1/access-allowIp/${row.mngrPrmIpNo}`);

      fetchAccessAllowIps(null, true);
      fetchCount(searchParams);
    } catch (error) {
      console.error('접속 허용 IP 조회 실패:', error);
    }
  };

  const handleSave = async (formData) => {
    try {
      await http.post(
        `/api/v1/access-allowIp/${formData.mngrPrmIpNo}/ips`,
        formData
      );
      alert('접속 허용 IP가 등록되었습니다.');

      setIsAddOpen(false);
      fetchAccessAllowIps(null, true);
      fetchCount(searchParams);
    } catch (error) {
      console.error('접속 허용 IP 저장 실패:', error);

      const errorMessage =
        error.response?.data?.message || '접속 허용 IP 저장에 실패했습니다.';
      alert(errorMessage);
    }
  };

  const handleInputChange = (key, valueOrEvent) => {
    const value = valueOrEvent?.target
      ? valueOrEvent.target.value
      : valueOrEvent;
    setSearchParams((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleAdd = () => {
    setIsAddOpen(true);
  };

  return (
    <div className="oncontentbox full">
      <div className="oncontentTitle">
        <h2>접속허용 IP 관리</h2>
        <ul className="onbreadcrumb">
          <li>시스템 관리</li>
          <li>시스템 설정</li>
          <li className="on">접속허용 IP 관리</li>
        </ul>
      </div>
      <div className="oncontents">
        <div className="oncontent">
          <div className="onselect-form open" style={{ minHeight: 'auto' }}>
            <div className="onparagraph">
              <MenuInputBox
                menuType="input"
                menuName="IP"
                menuSize="150px"
                value={searchParams.ipAddr}
                onChange={(e) => handleInputChange('ipAddr', e.target.value)}
              />
              <MenuInputBox
                menuType="input"
                menuName="메모"
                menuSize="300px"
                value={searchParams.memoCn}
                onChange={(e) => handleInputChange('memoCn', e.target.value)}
              />
              <MenuInputBox
                menuType="select"
                menuName="사용여부"
                menuSize="100px"
                value={searchParams.useYn}
                onChange={(e) => handleInputChange('useYn', e.target.value)}
                options={[
                  { value: 'Y', label: '사용' },
                  { value: 'N', label: '미사용' },
                ]}
              />

              <div style={{ marginLeft: 'auto' }}>
                <Button
                  btnType="menuSearch"
                  btnNames="검색"
                  onClick={handleAccessAllowIpSearch}
                />
              </div>
            </div>
            <div className="onparagraph middle">
              <MenuInputBox
                menuType="input"
                menuName="등록자"
                menuSize="100px"
                value={searchParams.rgtrId}
                onChange={(e) => handleInputChange('rgtrId', e.target.value)}
              />
              <div className="ondatepickerbox">
                <DatepickerBox
                  menuName="등록일"
                  value={searchParams.startRegDt}
                  outputFormat="datetime"
                  onChange={(date) => handleInputChange('startRegDt', date)}
                />
                <span className="onunit">~</span>
                <DatepickerBox
                  value={searchParams.endRegDt}
                  outputFormat="datetime"
                  onChange={(date) => handleInputChange('endRegDt', date)}
                />
              </div>
              <MenuInputBox
                menuType="input"
                menuName="삭제자"
                menuSize="100px"
                value={searchParams.mdfrId}
                onChange={(e) => handleInputChange('mdfrId', e.target.value)}
              />
              <div className="ondatepickerbox">
                <DatepickerBox
                  menuName="삭제일"
                  value={searchParams.startMdfcnDt}
                  outputFormat="datetime"
                  onChange={(date) => handleInputChange('startMdfcnDt', date)}
                />
                <span className="onunit">~</span>
                <DatepickerBox
                  value={searchParams.endMdfcnDt}
                  outputFormat="datetime"
                  onChange={(date) => handleInputChange('endMdfcnDt', date)}
                />
              </div>
            </div>
          </div>
          <div className="ontable-legend">
            <span>
              총 <b>{totalCount}</b>건
            </span>
            <div className="onbtns">
              <Button btnType="add" btnNames="추가" onClick={handleAdd} />
            </div>
          </div>

          {isAddOpen && (
            <AccessAllowIpAddModal
              onClose={() => {
                setIsAddOpen(false);
              }}
              onSave={handleSave}
              data={rows}
              mode={'create'}
            />
          )}
          <div className="ongrid-tableform onSCrollBox">
            <AccessAllowIpGrid
              data={rows}
              onDelete={handleAccessAllowIpDelete}
            />
            <div ref={observerRef} style={{ height: '20px' }} />
          </div>
        </div>
      </div>
    </div>
  );
}
