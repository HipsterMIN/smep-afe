import Breadcrumb from '@components/ui/Breadcrumb.jsx';
import Button from '@components/ui/Button.jsx';
import GridTable from '@components/ui/GridTable.jsx';
import http from '@lib/http.js';
import React, { useCallback, useEffect, useState } from 'react';
import { useMatches, useNavigate } from 'react-router-dom';

export default function IntegrationLoginSiteSort() {
  const navigate = useNavigate();
  const [indRows, setIndRows] = useState([]);
  const [entRows, setEntRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const toGridRows = (list = [], targetType = 'IND') =>
    list.map((item, index) => ({
      id: `${targetType}-${item.linkSiteCd}-${index}`,
      no: index + 1,
      linkSiteCd: item.linkSiteCd || '-',
      siteNm: item.siteNm || '-',
      useYnNm: item.useYn === 'Y' ? '사용' : '미사용',
      scrnIndctSeq: Number(item.scrnIndctSeq) || index + 1,
    }));

  const loadSortData = useCallback(async () => {
    setLoading(true);
    try {
      const [indResponse, entResponse] = await Promise.all([
        http.get('/api/v1/linksite/screen-indicator/ind'),
        http.get('/api/v1/linksite/screen-indicator/ent'),
      ]);

      const indList = Array.isArray(indResponse)
        ? indResponse
        : indResponse?.data || [];
      const entList = Array.isArray(entResponse)
        ? entResponse
        : entResponse?.data || [];

      setIndRows(toGridRows(indList, 'IND'));
      setEntRows(toGridRows(entList, 'ENT'));
    } catch (error) {
      console.error('통합로그인 사이트 순서 조회 실패:', error);
      alert('통합로그인 사이트 순서 조회에 실패했습니다.');
      setIndRows([]);
      setEntRows([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadSortData();
  }, [loadSortData]);

  const moveByDirection = (rows, rowId, direction) => {
    const currentIndex = rows.findIndex((row) => row.id === rowId);
    if (currentIndex < 0) return rows;

    const targetIndex = currentIndex + direction;
    if (targetIndex < 0 || targetIndex >= rows.length) return rows;

    const nextRows = [...rows];
    [nextRows[currentIndex], nextRows[targetIndex]] = [
      nextRows[targetIndex],
      nextRows[currentIndex],
    ];

    return nextRows.map((row, index) => ({
      ...row,
      no: index + 1,
      scrnIndctSeq: index + 1,
    }));
  };

  const handleMoveRow = (type, rowId, direction) => {
    if (type === 'IND') {
      setIndRows((prev) => moveByDirection(prev, rowId, direction));
      return;
    }
    setEntRows((prev) => moveByDirection(prev, rowId, direction));
  };

  const saveTargetType = async (type, rows) => {
    if (!rows.length) return;

    const sequences = rows.map((row) => ({
      linkSiteCd: row.linkSiteCd,
      scrnIndctSeq: Number(row.scrnIndctSeq),
    }));

    await http.put(`/api/v1/linksite/screen-indicator/${type}/sequences`, {
      sequences,
    });
  };

  const handleSave = async () => {
    if (saving) return;
    if (!window.confirm('저장하시겠습니까?')) return;

    setSaving(true);
    try {
      await Promise.all([
        saveTargetType('IND', indRows),
        saveTargetType('ENT', entRows),
      ]);
      alert('저장되었습니다.');
      await loadSortData();
    } catch (error) {
      console.error('통합로그인 사이트 순서 저장 실패:', error);
      alert(error?.response?.data?.message || '저장에 실패했습니다.');
    } finally {
      setSaving(false);
    }
  };

  const createColumns = (type, rows) => [
    { id: 'no', header: '순번', width: 52 },
    { id: 'linkSiteCd', header: '사이트코드', width: 150 },
    { id: 'siteNm', header: '사이트명', flexgrow: 1 },
    { id: 'useYnNm', header: '사용여부', width: 90 },
    { id: 'scrnIndctSeq', header: '화면표시순서', width: 110 },
    {
      id: 'move',
      header: '이동',
      width: 120,
      cell: ({ row }) => {
        const currentIndex = rows.findIndex((item) => item.id === row?.id);
        const isFirst = currentIndex <= 0;
        const isLast = currentIndex === rows.length - 1;

        return (
          <div
            style={{ display: 'flex', gap: '4px' }}
            data-action="ignore-click"
          >
            <button
              type="button"
              className="defaultbutton edit small"
              onMouseDown={(e) => e.stopPropagation()}
              onPointerDown={(e) => e.stopPropagation()}
              onClick={(e) => {
                e.stopPropagation();
                if (isFirst) return;
                handleMoveRow(type, row.id, -1);
              }}
              style={isFirst ? { opacity: 0.4, cursor: 'default' } : {}}
            >
              ▲
            </button>
            <button
              type="button"
              className="defaultbutton edit small"
              onMouseDown={(e) => e.stopPropagation()}
              onPointerDown={(e) => e.stopPropagation()}
              onClick={(e) => {
                e.stopPropagation();
                if (isLast) return;
                handleMoveRow(type, row.id, 1);
              }}
              style={isLast ? { opacity: 0.4, cursor: 'default' } : {}}
            >
              ▼
            </button>
          </div>
        );
      },
    },
  ];

  const indColumns = createColumns('IND', indRows);
  const entColumns = createColumns('ENT', entRows);
  const matches = useMatches();
  const routeMenuName =
    [...matches]
      .reverse()
      .map((match) => match?.handle?.menuNm)
      .find((menuNm) => typeof menuNm === 'string' && menuNm.trim()) || '';
  const pageTitle = '통합로그인 사이트 순서변경' || routeMenuName;

  return (
    <div className="oncontentbox">
      <div className="oncontentTitle">
        <h2>{pageTitle}</h2>
        <Breadcrumb pageTitle={pageTitle} />
      </div>

      <div
        className="oncontents space ondivide"
        style={{ alignItems: 'flex-start' }}
      >
        <div className="oncontent ontable-form">
          <div className="ontable-legend">
            <div>
              <Button
                btnType="list"
                btnNames="목록"
                onClick={() => navigate('..')}
              />
            </div>
          </div>
          <h4>개인</h4>
          <div className="ongrid-tableform">
            <GridTable data={indRows} columns={indColumns} />
          </div>
        </div>

        <div className="oncontent ontable-form">
          <div className="ontable-legend">
            <div style={{ marginLeft: 'auto' }}>
              <Button
                btnType="add"
                btnNames={saving ? '저장중...' : '저장'}
                onClick={handleSave}
              />
            </div>
          </div>
          <h4>기업</h4>

          <div className="ongrid-tableform">
            <GridTable data={entRows} columns={entColumns} />
            {loading && (
              <div
                style={{
                  padding: '12px 0',
                  textAlign: 'center',
                  color: '#666',
                }}
              >
                조회 중입니다...
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
