import Breadcrumb from '@components/ui/Breadcrumb.jsx';
import Button from '@components/ui/Button.jsx';
import GridTable from '@components/ui/GridTable.jsx';
import http from '@lib/http.js';
import { Willow } from '@svar-ui/react-grid';
import React, { useCallback, useEffect, useState } from 'react';
import { useMatches, useNavigate } from 'react-router-dom';

export default function IntegrationLoginSiteSort() {
  const panelScrollStyle = {
    minHeight: 0,
  };

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

  const saveTargetType = async (type, rows) => {
    if (!rows.length) return;

    const sequences = rows.map((row) => ({
      linkSiteCd: row.linkSiteCd,
      scrnIndctSeq: Number(row.scrnIndctSeq),
    }));

    await http.post(`/api/v1/linksite/screen-indicator/update/${type}/sequences`, {
      sequences,
    });
  };

  const getDuplicateSequences = (rows = []) => {
    const sequenceCountMap = rows.reduce((accumulator, row) => {
      const sequence = Number(row.scrnIndctSeq);
      if (!sequence) return accumulator;
      accumulator[sequence] = (accumulator[sequence] || 0) + 1;
      return accumulator;
    }, {});

    return Object.entries(sequenceCountMap)
      .filter(([, count]) => count > 1)
      .map(([sequence]) => Number(sequence))
      .sort((a, b) => a - b);
  };

  const handleSave = async () => {
    if (saving) return;

    const indDuplicateSequences = getDuplicateSequences(indRows);
    const entDuplicateSequences = getDuplicateSequences(entRows);

    if (indDuplicateSequences.length || entDuplicateSequences.length) {
      const duplicateMessages = [];

      if (indDuplicateSequences.length) {
        duplicateMessages.push(`개인: ${indDuplicateSequences.join(', ')}`);
      }

      if (entDuplicateSequences.length) {
        duplicateMessages.push(`기업: ${entDuplicateSequences.join(', ')}`);
      }

      alert(
        `화면표시순서가 중복되었습니다.\n중복 번호를 확인하세요.\n${duplicateMessages.join('\n')}`
      );
      return;
    }

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

  const handleSequenceChange = useCallback((type, rowId, value) => {
    const nextSequence = Number(value) || 1;
    const updateRows = (prevRows) =>
      prevRows.map((row) =>
        row.id === rowId ? { ...row, scrnIndctSeq: nextSequence } : row
      );

    if (type === 'IND') {
      setIndRows(updateRows);
      return;
    }

    setEntRows(updateRows);
  }, []);

  const createSequenceOptions = (rows) => {
    const maxCurrentSequence = rows.reduce(
      (maxValue, row) => Math.max(maxValue, Number(row.scrnIndctSeq) || 0),
      0
    );
    const maxSequence = Math.max(rows.length + 20, maxCurrentSequence, 1);

    return Array.from({ length: maxSequence }, (_, index) => {
      const sequence = index + 1;
      return { id: sequence, label: String(sequence) };
    });
  };

  const createColumns = (rows) => [
    { id: 'no', header: '순번', width: 52 },
    { id: 'linkSiteCd', header: '사이트코드', width: 150 },
    { id: 'siteNm', header: '사이트명', flexgrow: 2 },
    { id: 'useYnNm', header: '사용여부', width: 90 },
    {
      id: 'scrnIndctSeq',
      header: '화면표시순서',
      width: 110,
      editor: 'richselect',
      css: 'onmenu-select',
      options: createSequenceOptions(rows),
    },
  ];

  const initIndGrid = useCallback(
    (api) => {
      api.on('update-cell', (event) => {
        if (event.column !== 'scrnIndctSeq') return;
        handleSequenceChange('IND', event.id, event.value);
      });
    },
    [handleSequenceChange]
  );

  const initEntGrid = useCallback(
    (api) => {
      api.on('update-cell', (event) => {
        if (event.column !== 'scrnIndctSeq') return;
        handleSequenceChange('ENT', event.id, event.value);
      });
    },
    [handleSequenceChange]
  );

  const indColumns = createColumns(indRows);
  const entColumns = createColumns(entRows);
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
        <div className="oncontent ontable-form" style={panelScrollStyle}>
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
            <Willow>
              <div
                style={{
                  height: 'max(420px, calc(100dvh - 330px))',
                  overflow: 'hidden',
                }}
              >
                <GridTable
                  data={indRows}
                  columns={indColumns}
                  gridProps={{ init: initIndGrid }}
                  useWillow={false}
                />
              </div>
            </Willow>
          </div>
        </div>

        <div className="oncontent ontable-form" style={panelScrollStyle}>
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
            <Willow>
              <div
                style={{
                  height: 'max(420px, calc(100dvh - 330px))',
                  overflow: 'hidden',
                }}
              >
                <GridTable
                  data={entRows}
                  columns={entColumns}
                  gridProps={{ init: initEntGrid }}
                  useWillow={false}
                />
              </div>
            </Willow>
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
