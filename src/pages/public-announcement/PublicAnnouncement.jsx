import Button from '@components/ui/Button';
import CheckBox from '@components/ui/CheckBox.jsx';
import GridTable from '@components/ui/GridTable';
import MenuInputBox from '@components/ui/MenuInputBox.jsx';
import http from '@lib/http.js';
import { fetchAndConvertCommonCodes } from '@utils/commonUtils.js';
import PropTypes from 'prop-types';
import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { PUBLIC_ANNOUNCEMENT_TYPE } from './publicAnnouncementType.js';

const COMMON_CODE_GROUPS = [
  'BIZ_PBANC_LINK_INST_CD',
  'BIZ_PBANC_RLS_STTS_CD',
  'BIZ_PBANC_CLSF_CD',
  'BIZ_PBANC_SPRT_TYPE_CD',
  'BIZ_PBANC_SPRT_INST_CD',
];

export default function PublicAnnouncement({
  bizPbancTypeCd = PUBLIC_ANNOUNCEMENT_TYPE.BUSINESS,
}) {
  const navigate = useNavigate();
  const observerRef = useRef(null);

  const [loading, setLoading] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  const [rows, setRows] = useState([]);
  const [cursor, setCursor] = useState(null);
  const [hasNext, setHasNext] = useState(true);
  const [isDetailOpen, setIsDetailOpen] = useState(true);
  const [commonCodeOptions, setCommonCodeOptions] = useState({});

  const [params, setParams] = useState({
    bizPbancTypeCd,
    bizPbancLinkInstCd: '',
    bizPbancRlsSttsCd: '',
    linkInstBizPbancRlsSttsCd: '',
    pbancYmd: '',
    bizPbancNm: '',
    bizPbancClsfCd: [],
    bizPbancSprtTypeCd: [],
    bizPbancSprtInstCd: [],
  });

  const linkInstOptions = commonCodeOptions.BIZ_PBANC_LINK_INST_CD || [];
  const releaseStatusOptions = commonCodeOptions.BIZ_PBANC_RLS_STTS_CD || [];
  const bizTypeOptions = commonCodeOptions.BIZ_PBANC_CLSF_CD || [];
  const supportTypeOptions = commonCodeOptions.BIZ_PBANC_SPRT_TYPE_CD || [];
  const supportInstOptions = commonCodeOptions.BIZ_PBANC_SPRT_INST_CD || [];

  const columns = [
    {
      id: 'rowNumber',
      header: '번호',
      width: 60,
      cell: ({ row }) =>
        Number.isFinite(totalCount) && Number.isFinite(row?._rowIndex)
          ? totalCount - (row._rowIndex - 1)
          : '',
    },
    { id: 'bizPbancNm', header: '공고명', resize: true, width: 540 },
    { id: 'bizPbancClsfCdNm', header: '사업유형', resize: true, width: 100 },
    {
      id: 'bizPbancSprtTypeCdNm',
      header: '지원유형',
      resize: true,
      width: 100,
    },
    {
      id: 'bizPbancSprtInstCdNm',
      header: '지원기관',
      resize: true,
      width: 100,
    },
    {
      id: 'bizAplyPrdCn',
      header: '신청기간',
      resize: true,
      width: 200,
      cell: ({ row }) => {
        const formatDate = (dateStr) => {
          if (!dateStr || dateStr.length !== 8) return '';
          return `${dateStr.slice(0, 4)}-${dateStr.slice(4, 6)}-${dateStr.slice(6, 8)}`;
        };
        if (row.bizAplyPrdCn) return row.bizAplyPrdCn;
        if (row.bizAplyBgngYmd && row.bizAplyDdlnYmd) {
          return `${formatDate(row.bizAplyBgngYmd)} ~ ${formatDate(row.bizAplyDdlnYmd)}`;
        }
        return '';
      },
    },
    { id: 'pbancYmdNm', header: '진행상태', resize: true, width: 80 },
    { id: 'bizPbancRlsSttsCdNm', header: '공개여부', resize: true, width: 80 },
    {
      id: 'regDt',
      header: '등록일',
      resize: true,
      width: 110,
      cell: ({ row }) => (row?.regDt ? row.regDt.slice(0, 10) : ''),
    },
    {
      id: 'mdfcnDt',
      header: '수정일',
      resize: true,
      width: 110,
      cell: ({ row }) => (row?.mdfcnDt ? row.mdfcnDt.slice(0, 10) : ''),
    },
    {
      id: 'management',
      header: '관리',
      width: 80,
      cell: ({ row }) => (
        <button
          type="button"
          className="defaultbutton edit"
          data-action="ignore-click"
          onMouseDown={(e) => e.stopPropagation()}
          onPointerDown={(e) => e.stopPropagation()}
          onClick={(e) => {
            e.stopPropagation();
            if (!row?.bizPbancNo) return;
            navigate(`${row.bizPbancNo}`);
          }}
        >
          수정
        </button>
      ),
    },
  ];

  const extractVal = (v) => (v && v.target !== undefined ? v.target.value : v);

  const handleParamInputChange = (key, value) => {
    setParams((prev) => ({ ...prev, [key]: extractVal(value) }));
  };

  const handleMultiCheck = (key, value, checked) => {
    setParams((prev) => ({
      ...prev,
      [key]: checked
        ? prev[key].includes(value)
          ? prev[key]
          : [...prev[key], value]
        : prev[key].filter((v) => v !== value),
    }));
  };

  const fetchCount = async () => {
    try {
      const res = await http.get('/api/v1/public-announcement/count', { params });
      setTotalCount(res?.data ?? 0);
    } catch (err) {
      setTotalCount(0);
    }
  };

  const fetchList = async (nextCursor = null, reset = false) => {
    if (loading) return;
    if (!hasNext && !reset) return;

    setLoading(true);
    try {
      const res = await http.get('/api/v1/public-announcement', {
        params: {
          cursor: nextCursor,
          size: 20,
          ...params,
        },
      });

      const page = res?.data ?? {};
      const list = Array.isArray(page?.data) ? page.data : [];

      setRows((prev) => {
        const merged = reset ? list : [...prev, ...list];
        return merged.map((row, idx) => ({
          ...row,
          _rowIndex: idx + 1,
        }));
      });
      setCursor(page?.nextCursor ?? null);
      setHasNext(Boolean(page?.hasNext));
    } catch (err) {
      setHasNext(false);
      alert('공고 목록을 불러오는 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const loadCommonCodes = async () => {
      try {
        const codes = await fetchAndConvertCommonCodes(COMMON_CODE_GROUPS);
        setCommonCodeOptions(codes || {});
      } catch (error) {
        console.error('공통코드 조회 실패:', error);
        setCommonCodeOptions({});
      }
    };

    loadCommonCodes();
  }, []);

  useEffect(() => {
    fetchList(null, true);
    fetchCount();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!observerRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNext && !loading) {
          fetchList(cursor);
        }
      },
      { threshold: 1 }
    );

    observer.observe(observerRef.current);
    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cursor, hasNext, loading]);

  useEffect(() => {
    const handler = (e) => {
      const grid = document.querySelector('[role="grid"]');
      if (!grid) return;

      if (grid.contains(e.target) && document.activeElement) {
        document.activeElement.blur();
      }
    };

    document.addEventListener('pointerdown', handler, true);
    return () => document.removeEventListener('pointerdown', handler, true);
  }, []);

  return (
    <div className="oncontentbox full">
      <div className="oncontentTitle">
        <h2>지원사업 공고 목록</h2>
        <ul className="onbreadcrumb">
          <li>지원사업 관리</li>
          <li>사업공고 관리</li>
          <li>지원사업 공고관리</li>
          <li className="on">지원사업공고 목록</li>
        </ul>
      </div>
      <div className="oncontents">
        <div className="oncontent">
          <div className={`onselect-form ${isDetailOpen ? 'open' : ''}`}>
            <div className="onparagraph">
              <MenuInputBox
                menuType="select"
                menuName="연계시스템"
                menuSize="150px"
                value={params.bizPbancLinkInstCd}
                onChange={(e) => handleParamInputChange('bizPbancLinkInstCd', e)}
                options={linkInstOptions}
              />
              <MenuInputBox
                menuType="select"
                menuName="공개여부"
                menuSize="150px"
                value={params.linkInstBizPbancRlsSttsCd}
                onChange={(e) =>
                  handleParamInputChange('linkInstBizPbancRlsSttsCd', e)
                }
                options={releaseStatusOptions}
              />
              <MenuInputBox
                menuType="select"
                menuName="진행상태"
                menuSize="150px"
                value={params.pbancYmd}
                onChange={(e) => handleParamInputChange('pbancYmd', e)}
                options={[
                  { value: 'ING', label: '신청가능' },
                  { value: 'PLAN', label: '진행예정' },
                  { value: 'DONE', label: '신청마감' },
                ]}
              />
              <MenuInputBox
                menuType="select"
                menuName="통합플랫폼공개여부"
                menuSize="150px"
                value={params.bizPbancRlsSttsCd}
                onChange={(e) => handleParamInputChange('bizPbancRlsSttsCd', e)}
                options={releaseStatusOptions}
              />
              <div style={{ marginLeft: 'auto' }}>
                <Button
                  btnType="detail"
                  btnNames={isDetailOpen ? '상세조건 접기' : '상세조건 펼치기'}
                  onClick={() => setIsDetailOpen((prev) => !prev)}
                />
              </div>
              <div className="onbtn">
                <Button
                  btnType="menuSearch"
                  btnNames="검색"
                  onClick={() => {
                    setCursor(null);
                    setHasNext(true);
                    fetchList(null, true);
                    fetchCount();
                  }}
                />
              </div>
            </div>
            <div className="onparagraph middle dashed">
              <MenuInputBox
                menuType="input"
                menuName="공고명"
                menuSize="300px"
                value={params.bizPbancNm}
                onChange={(v) => handleParamInputChange('bizPbancNm', v)}
              />
            </div>
            <div className="onparagraph column">
              <dl>
                <dt>사업유형</dt>
                {bizTypeOptions.map((option) => (
                  <dd key={option.value}>
                    <CheckBox
                      chkId={`bizPbancClsfCd_${option.value}`}
                      chkName={option.label}
                      value={option.value}
                      checked={params.bizPbancClsfCd.includes(option.value)}
                      onChange={({ value, checked }) =>
                        handleMultiCheck('bizPbancClsfCd', value, checked)
                      }
                    />
                  </dd>
                ))}
              </dl>
              <dl>
                <dt>지원유형</dt>
                {supportTypeOptions.map((option) => (
                  <dd key={option.value}>
                    <CheckBox
                      chkId={`bizPbancSprtTypeCd_${option.value}`}
                      chkName={option.label}
                      value={option.value}
                      checked={params.bizPbancSprtTypeCd.includes(option.value)}
                      onChange={({ value, checked }) =>
                        handleMultiCheck('bizPbancSprtTypeCd', value, checked)
                      }
                    />
                  </dd>
                ))}
              </dl>
              <dl>
                <dt>지원기관</dt>
                {supportInstOptions.map((option) => (
                  <dd key={option.value}>
                    <CheckBox
                      chkId={`bizPbancSprtInstCd_${option.value}`}
                      chkName={option.label}
                      value={option.value}
                      checked={params.bizPbancSprtInstCd.includes(option.value)}
                      onChange={({ value, checked }) =>
                        handleMultiCheck('bizPbancSprtInstCd', value, checked)
                      }
                    />
                  </dd>
                ))}
              </dl>
            </div>
          </div>

          <div className="ontable-legend">
            <span>
              총 <b>{totalCount.toLocaleString()}</b>건
            </span>
            <Button btnType="add" btnNames="등록" onClick={() => navigate('create')} />
          </div>

          <div className="ongrid-tableform">
            <GridTable columns={columns} data={rows} />
            <div ref={observerRef} style={{ height: 40 }} />
          </div>
        </div>
      </div>
    </div>
  );
}

PublicAnnouncement.propTypes = {
  bizPbancTypeCd: PropTypes.string,
};
