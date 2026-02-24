import Button from '@components/ui/Button';
import CheckBox from "@components/ui/CheckBox.jsx";
import DatepickerBox from '@components/ui/DatepickerBox.jsx';
import DatepickerTimeBox from '@components/ui/DatepickerTimeBox.jsx';
import GridTable from '@components/ui/GridTable';
import MenuInputBox from "@components/ui/MenuInputBox.jsx";
import http from '@lib/http.js';
import React, {useEffect, useRef, useState} from 'react';
import {useNavigate} from "react-router-dom";

export default function PublicAnnouncement() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  const [rows, setRows] = useState([]);
  const [cursor, setCursor] = useState(null);
  const [hasNext, setHasNext] = useState(true);
  const [isDetailOpen, setIsDetailOpen] = useState(true);
  const observerRef = useRef(null);

  const apiRef = useRef(null);

  const [params, setParams] = useState({
    bizPbancLinkInstCd: '',
    bizPbancRlsSttsCd: '',
    linkInstBizPbancRlsSttsCd: '',
    pbancYmd: '',
    bizPbancNm: '',
    bizPbancClsfCd: [],
    bizPbancSprtTypeCd: [],
    bizPbancSprtInstCd: [],
  });

  const columns = [
    { id: 'rowNumber', header: '번호', width: 60, cell: (props) => RownumberCell(props) },
    { id: 'bizPbancNm', header: '공고명', resize: true, width: 540 },
    { id: 'bizPbancClsfCdNm', header: '사업유형', resize: true, width: 100 },
    { id: 'bizPbancSprtTypeCdNm', header: '지원유형', resize: true, width: 100 },
    { id: 'bizPbancSprtInstCdNm', header: '지원기관', resize: true, width: 100 },
    { id: 'bizAplyPrdCn',
      header: '신청기간',
      resize: true,
      width: 200,
      cell: ({ row }) => {
        const formatDate = (dateStr) => {
          if (!dateStr || dateStr.length !== 8) return '';
          return `${dateStr.slice(0,4)}-${dateStr.slice(4,6)}-${dateStr.slice(6,8)}`;
        };
        if (row.bizAplyPrdCn) {
          return row.bizAplyPrdCn;
        }
        if (row.bizAplyBgngYmd && row.bizAplyDdlnYmd) {
          return `${formatDate(row.bizAplyBgngYmd)} ~ ${formatDate(row.bizAplyDdlnYmd)}`;
        }
        return '';
      }
    },
    { id: 'pbancYmdNm', header: '진행상태', resize: true, width: 80 },
    { id: 'bizPbancRlsSttsCdNm', header: '공개여부', resize: true, width: 80 },
    { id: 'regDt',
      header: '등록일',
      resize: true,
      width: 110,
      cell: ({ row }) => {
        const date = row.regDt;
        if (!date) return '';
        return date.slice(0, 10);
      }
    },
    { id: 'mdfcnDt',
      header: '수정일',
      resize: true,
      width: 110,
      cell: ({ row }) => {
        const date = row.mdfcnDt;
        if (!date) return '';
        return date.slice(0, 10);
      }
    },
    { id: 'management', header: '관리', width: 80, cell: (props) => ManagementCell(props) },
  ];

  const handleToggleDetail = () => {
    setIsDetailOpen(!isDetailOpen);
  };

  const RownumberCell = ({ row, data }) => {
    return (
        <div>
          {Number.isFinite(totalCount) && Number.isFinite(row?._rowIndex)
              ? totalCount - (row._rowIndex - 1)
              : ''}
        </div>
    );
  }
  const ManagementCell = ({row, data}) => {
    const item = row || data || {};
    return (
        <button
            type="button"
            className="defaultbutton edit"
            data-action="ignore-click"
            onMouseDown={(e) => e.stopPropagation()}
            onPointerDown={(e) => e.stopPropagation()}
            onClick={(e) => {e.stopPropagation();handleEdit(item);}}
        >
          수정
        </button>
    );
  };

  const extractVal = (v) => (v && v.target !== undefined ? v.target.value : v);

  const handleParamInputChange = (key, value) => {
    setParams((prev) => ({ ...prev, [key]: extractVal(value) }));
  };

  const handleMultiCheck = (key, value, checked) => {
    setParams(prev => ({
      ...prev,
      [key]: checked
          ? [...prev[key], value]
          : prev[key].filter(v => v !== value)
    }));
  };

  const fetchCount = async () => {
    try {
      const res = await http.get('/api/v1/public-announcement/count', { params });
      setTotalCount(res.data);
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
          ...params
        }
      });

      const page = res.data;

      setRows(prev => {
        const merged = reset ? page?.data : [...prev, ...page?.data];

        return merged.map((row, idx) => ({
          ...row,
          _rowIndex: idx + 1
        }));
      });
      setCursor(page?.nextCursor);
      setHasNext(page?.hasNext);
    } catch (err) {
      alert('공고 목록을 불러오는 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (item) => {
    console.log(item.bizPbancNo);
    navigate(`${item.bizPbancNo}`);
  };

  useEffect(() => {
    fetchList(null, true);
    fetchCount();
  }, []);

  useEffect(() => {
    if (!observerRef.current) return;

    const observer = new IntersectionObserver(
        entries => {
          if (entries[0].isIntersecting && hasNext && !loading) {
            fetchList(cursor);
          }
        },
        { threshold: 1 }
    );

    observer.observe(observerRef.current);
    return () => observer.disconnect();

  }, [cursor, hasNext, loading]);

  useEffect(() => {
    const handler = (e) => {
      const grid = document.querySelector('[role="grid"]');
      if (!grid) return;

      if (grid.contains(e.target)) {
        if (document.activeElement) {
          document.activeElement.blur();
        }
      }
    };

    document.addEventListener('pointerdown', handler, true); // ⭐ capture 단계
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
              {/** open 클래스로 동작, 펼치기/접기 */}
              <div className="onparagraph">
                <MenuInputBox
                    menuType="select"
                    menuName="연계시스템"
                    menuSize='150px'
                    value={params.bizPbancLinkInstCd}
                    onChange={e => handleParamInputChange('bizPbancLinkInstCd', e)}
                    options={[
                      { value: 'BI01', label: 'SMTECH' },
                      { value: 'BI02', label: 'K-STARTUP' },
                      { value: 'BI03', label: '스마트공장' },
                      { value: 'BI04', label: '소상공인24' },
                      { value: 'BI05', label: '중소기업 벤처진흥공단' },
                      { value: 'BI06', label: '기술보증기금' },
                      { value: 'BI07', label: '판판대로' },
                      { value: 'BI08', label: '기술보호울타리' },
                      { value: 'BI09', label: '중소기업인력지원사업종합관리시스템' },
                      { value: 'BI10', label: '중소기업해외전시포탈' },
                      { value: 'BI11', label: '협업정보시스템' },
                      { value: 'BI12', label: '중소기업수출지원센터' },
                      { value: 'BI13', label: 'IRIS' },
                      { value: 'BI14', label: '소셜벤처스퀘어' },
                      { value: 'BI15', label: '무역24' },
                      { value: 'BI16', label: '기업마당' },
                      { value: 'BI90', label: '기타' },
                    ]}
                />
                <MenuInputBox
                    menuType="select"
                    menuName="공개여부"
                    menuSize='150px'
                    value={params.linkInstBizPbancRlsSttsCd}
                    onChange={e => handleParamInputChange('linkInstBizPbancRlsSttsCd', e)}
                    options={[
                      { value: 'BS01', label: '공개' },
                      { value: 'BS02', label: '비공개' },
                      { value: 'BS03', label: '마감' },
                    ]}
                />
                <MenuInputBox
                    menuType="select"
                    menuName="진행상태"
                    menuSize='150px'
                    value={params.pbancYmd}
                    onChange={e => handleParamInputChange('pbancYmd', e)}
                    options={[
                      { value: 'ING', label: '신청가능' },
                      { value: 'PLAN', label: '진행예정' },
                      { value: 'DONE', label: '신청마감' },
                    ]}
                />
                <MenuInputBox
                    menuType="select"
                    menuName="통합플랫폼공개여부"
                    menuSize='150px'
                    value={params.bizPbancRlsSttsCd}
                    onChange={e => handleParamInputChange('bizPbancRlsSttsCd', e)}
                    options={[
                      { value: 'BS01', label: '공개' },
                      { value: 'BS02', label: '비공개' },
                    ]}
                />
                <div style={{marginLeft: 'auto'}}>
                  <Button
                      btnType="detail"
                      btnNames={isDetailOpen ? "상세조건 접기" : "상세조건 펼치기"}
                      onClick={handleToggleDetail}
                  />
                </div>
                <div className="onbtn">
                  <Button
                      btnType="menuSearch"
                      btnNames="검색"
                      onClick={()=>{
                        fetchList(null, true);
                        fetchCount();}
                      }
                  />
                </div>
              </div>
              <div className="onparagraph middle dashed">
                <MenuInputBox
                    menuType="input"
                    menuName="공고명"
                    menuSize='300px'
                    value={params.bizPbancNm}
                    onChange={(v) => handleParamInputChange('bizPbancNm', v)}
                />
                {/*<div className="ondatepickerbox">*/}
                {/*  <DatepickerBox menuName="신청기간"/>*/}
                {/*  <span className="onunit">~</span>*/}
                {/*  <DatepickerBox/>*/}
                {/*</div>*/}
              </div>
              <div className="onparagraph column">
                <dl>
                  <dt>사업유형</dt>
                  <dd>
                    <CheckBox
                        chkId="bizPbancClsfCd_PC10"
                        chkName="금융"
                        value="PC10"
                        checked={params.bizPbancClsfCd.includes('PC10')}
                        onChange={({ value, checked }) =>
                            handleMultiCheck('bizPbancClsfCd', value, checked)
                        }
                    />
                  </dd>
                  <dd>
                    <CheckBox
                        chkId="bizPbancClsfCd_PC20"
                        chkName="기술"
                        value="PC20"
                        checked={params.bizPbancClsfCd.includes('PC20')}
                        onChange={({ value, checked }) =>
                            handleMultiCheck('bizPbancClsfCd', value, checked)
                        }
                    />
                  </dd>
                  <dd>
                    <CheckBox
                        chkId="bizPbancClsfCd_PC30"
                        chkName="인력"
                        value="PC30"
                        checked={params.bizPbancClsfCd.includes('PC30')}
                        onChange={({ value, checked }) =>
                            handleMultiCheck('bizPbancClsfCd', value, checked)
                        }
                    />
                  </dd>
                  <dd>
                    <CheckBox
                        chkId="bizPbancClsfCd_PC40"
                        chkName="수출"
                        value="PC40"
                        checked={params.bizPbancClsfCd.includes('PC40')}
                        onChange={({ value, checked }) =>
                            handleMultiCheck('bizPbancClsfCd', value, checked)
                        }
                    />
                  </dd>
                  <dd>
                    <CheckBox
                        chkId="bizPbancClsfCd_PC50"
                        chkName="내수"
                        value="PC50"
                        checked={params.bizPbancClsfCd.includes('PC50')}
                        onChange={({ value, checked }) =>
                            handleMultiCheck('bizPbancClsfCd', value, checked)
                        }
                    />
                  </dd>
                  <dd>
                    <CheckBox
                        chkId="bizPbancClsfCd_PC60"
                        chkName="창업"
                        value="PC60"
                        checked={params.bizPbancClsfCd.includes('PC60')}
                        onChange={({ value, checked }) =>
                            handleMultiCheck('bizPbancClsfCd', value, checked)
                        }
                    />
                  </dd>
                  <dd>
                    <CheckBox
                        chkId="bizPbancClsfCd_PC70"
                        chkName="경영"
                        value="PC70"
                        checked={params.bizPbancClsfCd.includes('PC70')}
                        onChange={({ value, checked }) =>
                            handleMultiCheck('bizPbancClsfCd', value, checked)
                        }
                    />
                  </dd>
                  <dd>
                    <CheckBox
                        chkId="bizPbancClsfCd_PC80"
                        chkName="소상공인"
                        value="PC80"
                        checked={params.bizPbancClsfCd.includes('PC80')}
                        onChange={({ value, checked }) =>
                            handleMultiCheck('bizPbancClsfCd', value, checked)
                        }
                    />
                  </dd>
                  <dd>
                    <CheckBox
                        chkId="bizPbancClsfCd_PC12"
                        chkName="중견"
                        value="PC12"
                        checked={params.bizPbancClsfCd.includes('PC12')}
                        onChange={({ value, checked }) =>
                            handleMultiCheck('bizPbancClsfCd', value, checked)
                        }
                    />
                  </dd>
                  <dd>
                    <CheckBox
                        chkId="bizPbancClsfCd_PC99"
                        chkName="기타"
                        value="PC99"
                        checked={params.bizPbancClsfCd.includes('PC99')}
                        onChange={({ value, checked }) =>
                            handleMultiCheck('bizPbancClsfCd', value, checked)
                        }
                    />
                  </dd>
                </dl>
                <dl>
                  <dt>지원유형</dt>
                  <dd>
                    <CheckBox
                        chkId="bizPbancSprtTypeCd_RT01"
                        chkName="창업"
                        value="RT01"
                        checked={params.bizPbancSprtTypeCd.includes('RT01')}
                        onChange={({value, checked}) =>
                            handleMultiCheck('bizPbancSprtTypeCd', value, checked)
                        }
                    />
                  </dd>
                  <dd>
                    <CheckBox
                        chkId="bizPbancSprtTypeCd_RT02"
                        chkName="기술개발"
                        value="RT02"
                        checked={params.bizPbancSprtTypeCd.includes('RT02')}
                        onChange={({value, checked}) =>
                            handleMultiCheck('bizPbancSprtTypeCd', value, checked)
                        }
                    />
                  </dd>
                  <dd>
                    <CheckBox
                        chkId="bizPbancSprtTypeCd_RT03"
                        chkName="정책자금"
                        value="RT03"
                        checked={params.bizPbancSprtTypeCd.includes('RT03')}
                        onChange={({value, checked}) =>
                            handleMultiCheck('bizPbancSprtTypeCd', value, checked)
                        }
                    />
                  </dd>
                  <dd>
                    <CheckBox
                        chkId="bizPbancSprtTypeCd_RT04"
                        chkName="기술보증"
                        value="RT04"
                        checked={params.bizPbancSprtTypeCd.includes('RT04')}
                        onChange={({value, checked}) =>
                            handleMultiCheck('bizPbancSprtTypeCd', value, checked)
                        }
                    />
                  </dd>
                  <dd>
                    <CheckBox
                        chkId="bizPbancSprtTypeCd_RT05"
                        chkName="스마트공장"
                        value="RT05"
                        checked={params.bizPbancSprtTypeCd.includes('RT05')}
                        onChange={({value, checked}) =>
                            handleMultiCheck('bizPbancSprtTypeCd', value, checked)
                        }
                    />
                  </dd>
                  <dd>
                    <CheckBox
                        chkId="bizPbancSprtTypeCd_RT06"
                        chkName="소상공인"
                        value="RT06"
                        checked={params.bizPbancSprtTypeCd.includes('RT06')}
                        onChange={({value, checked}) =>
                            handleMultiCheck('bizPbancSprtTypeCd', value, checked)
                        }
                    />
                  </dd>
                  <dd>
                    <CheckBox
                        chkId="bizPbancSprtTypeCd_RT07"
                        chkName="인력지원"
                        value="RT07"
                        checked={params.bizPbancSprtTypeCd.includes('RT07')}
                        onChange={({value, checked}) =>
                            handleMultiCheck('bizPbancSprtTypeCd', value, checked)
                        }
                    />
                  </dd>
                  <dd>
                    <CheckBox
                        chkId="bizPbancSprtTypeCd_RT08"
                        chkName="수출지원"
                        value="RT08"
                        checked={params.bizPbancSprtTypeCd.includes('RT08')}
                        onChange={({value, checked}) =>
                            handleMultiCheck('bizPbancSprtTypeCd', value, checked)
                        }
                    />
                  </dd>
                  <dd>
                    <CheckBox
                        chkId="bizPbancSprtTypeCd_RT09"
                        chkName="기업지원"
                        value="RT09"
                        checked={params.bizPbancSprtTypeCd.includes('RT09')}
                        onChange={({value, checked}) =>
                            handleMultiCheck('bizPbancSprtTypeCd', value, checked)
                        }
                    />
                  </dd>
                  <dd>
                    <CheckBox
                        chkId="bizPbancSprtTypeCd_RT10"
                        chkName="정보"
                        value="RT10"
                        checked={params.bizPbancSprtTypeCd.includes('RT10')}
                        onChange={({value, checked}) =>
                            handleMultiCheck('bizPbancSprtTypeCd', value, checked)
                        }
                    />
                  </dd>
                </dl>
                <dl>
                  <dt>지원기관</dt>
                  <dd>
                    <CheckBox
                        chkId="bizPbancSprtInstCd_SP16"
                        chkName="중소벤처기업부"
                        value="SP16"
                        checked={params.bizPbancSprtInstCd.includes('SP16')}
                        onChange={({value, checked}) =>
                            handleMultiCheck('bizPbancSprtInstCd', value, checked)
                        }
                    />
                  </dd>
                  <dd>
                    <CheckBox
                        chkId="bizPbancSprtInstCd_SP01"
                        chkName="중소벤처기업진흥공단"
                        value="SP01"
                        checked={params.bizPbancSprtInstCd.includes('SP01')}
                        onChange={({value, checked}) =>
                            handleMultiCheck('bizPbancSprtInstCd', value, checked)
                        }
                    />
                  </dd>
                  <dd>
                    <CheckBox
                        chkId="bizPbancSprtInstCd_SP02"
                        chkName="중소기업기술정보진흥원"
                        value="SP02"
                        checked={params.bizPbancSprtInstCd.includes('SP02')}
                        onChange={({value, checked}) =>
                            handleMultiCheck('bizPbancSprtInstCd', value, checked)
                        }
                    />
                  </dd>
                  <dd>
                    <CheckBox
                        chkId="bizPbancSprtInstCd_SP03"
                        chkName="한국중소벤처기업유통원"
                        value="SP03"
                        checked={params.bizPbancSprtInstCd.includes('SP03')}
                        onChange={({value, checked}) =>
                            handleMultiCheck('bizPbancSprtInstCd', value, checked)
                        }
                    />
                  </dd>
                  <dd>
                    <CheckBox
                        chkId="bizPbancSprtInstCd_SP04"
                        chkName="창업진흥원"
                        value="SP04"
                        checked={params.bizPbancSprtInstCd.includes('SP04')}
                        onChange={({value, checked}) =>
                            handleMultiCheck('bizPbancSprtInstCd', value, checked)
                        }
                    />
                  </dd>
                  <dd>
                    <CheckBox
                        chkId="bizPbancSprtInstCd_SP05"
                        chkName="소상공인시장진흥공단"
                        value="SP05"
                        checked={params.bizPbancSprtInstCd.includes('SP05')}
                        onChange={({value, checked}) =>
                            handleMultiCheck('bizPbancSprtInstCd', value, checked)
                        }
                    />
                  </dd>
                  <dd>
                    <CheckBox
                        chkId="bizPbancSprtInstCd_SP06"
                        chkName="기술보증기금"
                        value="SP06"
                        checked={params.bizPbancSprtInstCd.includes('SP06')}
                        onChange={({value, checked}) =>
                            handleMultiCheck('bizPbancSprtInstCd', value, checked)
                        }
                    />
                  </dd>
                  <dd>
                    <CheckBox
                        chkId="bizPbancSprtInstCd_SP15"
                        chkName="지역신용보증재단"
                        value="SP15"
                        checked={params.bizPbancSprtInstCd.includes('SP15')}
                        onChange={({value, checked}) =>
                            handleMultiCheck('bizPbancSprtInstCd', value, checked)
                        }
                    />
                  </dd>
                  <dd>
                    <CheckBox
                        chkId="bizPbancSprtInstCd_SP10"
                        chkName="대.중소기업.농어업협력재단"
                        value="SP10"
                        checked={params.bizPbancSprtInstCd.includes('SP10')}
                        onChange={({value, checked}) =>
                            handleMultiCheck('bizPbancSprtInstCd', value, checked)
                        }
                    />
                  </dd>
                  <dd>
                    <CheckBox
                        chkId="bizPbancSprtInstCd_SP12"
                        chkName="여성기업종합지원포털"
                        value="SP12"
                        checked={params.bizPbancSprtInstCd.includes('SP12')}
                        onChange={({value, checked}) =>
                            handleMultiCheck('bizPbancSprtInstCd', value, checked)
                        }
                    />
                  </dd>
                  <dd>
                    <CheckBox
                        chkId="bizPbancSprtInstCd_SP13"
                        chkName="장애인기업종합지원센터"
                        value="SP13"
                        checked={params.bizPbancSprtInstCd.includes('SP13')}
                        onChange={({value, checked}) =>
                            handleMultiCheck('bizPbancSprtInstCd', value, checked)
                        }
                    />
                  </dd>
                  <dd>
                    <CheckBox
                        chkId="bizPbancSprtInstCd_SP14"
                        chkName="한국산업기술진흥원"
                        value="SP14"
                        checked={params.bizPbancSprtInstCd.includes('SP14')}
                        onChange={({value, checked}) =>
                            handleMultiCheck('bizPbancSprtInstCd', value, checked)
                        }
                    />
                  </dd>
                  <dd>
                    <CheckBox
                        chkId="bizPbancSprtInstCd_SP17"
                        chkName="중소기업중앙회"
                        value="SP17"
                        checked={params.bizPbancSprtInstCd.includes('SP17')}
                        onChange={({value, checked}) =>
                            handleMultiCheck('bizPbancSprtInstCd', value, checked)
                        }
                    />
                  </dd>
                  <dd>
                    <CheckBox
                        chkId="bizPbancSprtInstCd_SP18"
                        chkName="중소기업융합중앙회"
                        value="SP18"
                        checked={params.bizPbancSprtInstCd.includes('SP18')}
                        onChange={({value, checked}) =>
                            handleMultiCheck('bizPbancSprtInstCd', value, checked)
                        }
                    />
                  </dd>
                  <dd>
                    <CheckBox
                        chkId="bizPbancSprtInstCd_SP19"
                        chkName="한국창업보육협회"
                        value="SP19"
                        checked={params.bizPbancSprtInstCd.includes('SP19')}
                        onChange={({value, checked}) =>
                            handleMultiCheck('bizPbancSprtInstCd', value, checked)
                        }
                    />
                  </dd>
                  <dd>
                    <CheckBox
                        chkId="bizPbancSprtInstCd_SP20"
                        chkName="이노비즈협회"
                        value="SP20"
                        checked={params.bizPbancSprtInstCd.includes('SP20')}
                        onChange={({value, checked}) =>
                            handleMultiCheck('bizPbancSprtInstCd', value, checked)
                        }
                    />
                  </dd>
                  <dd>
                    <CheckBox
                        chkId="bizPbancSprtInstCd_SP21"
                        chkName="한국경영혁신중소기업협회"
                        value="SP21"
                        checked={params.bizPbancSprtInstCd.includes('SP21')}
                        onChange={({value, checked}) =>
                            handleMultiCheck('bizPbancSprtInstCd', value, checked)
                        }
                    />
                  </dd>
                  <dd>
                    <CheckBox
                        chkId="bizPbancSprtInstCd_SP22"
                        chkName="대한무역투자진흥공사"
                        value="SP22"
                        checked={params.bizPbancSprtInstCd.includes('SP22')}
                        onChange={({value, checked}) =>
                            handleMultiCheck('bizPbancSprtInstCd', value, checked)
                        }
                    />
                  </dd>
                  <dd>
                    <CheckBox
                        chkId="bizPbancSprtInstCd_SP23"
                        chkName="기업은행"
                        value="SP23"
                        checked={params.bizPbancSprtInstCd.includes('SP23')}
                        onChange={({value, checked}) =>
                            handleMultiCheck('bizPbancSprtInstCd', value, checked)
                        }
                    />
                  </dd>
                  <dd>
                    <CheckBox
                        chkId="bizPbancSprtInstCd_SP24"
                        chkName="대한상공회의소"
                        value="SP24"
                        checked={params.bizPbancSprtInstCd.includes('SP24')}
                        onChange={({value, checked}) =>
                            handleMultiCheck('bizPbancSprtInstCd', value, checked)
                        }
                    />
                  </dd>
                  <dd>
                    <CheckBox
                        chkId="bizPbancSprtInstCd_SP25"
                        chkName="신용보증기금"
                        value="SP25"
                        checked={params.bizPbancSprtInstCd.includes('SP25')}
                        onChange={({value, checked}) =>
                            handleMultiCheck('bizPbancSprtInstCd', value, checked)
                        }
                    />
                  </dd>
                  <dd>
                    <CheckBox
                        chkId="bizPbancSprtInstCd_SP26"
                        chkName="신용보증재단중앙회"
                        value="SP26"
                        checked={params.bizPbancSprtInstCd.includes('SP26')}
                        onChange={({value, checked}) =>
                            handleMultiCheck('bizPbancSprtInstCd', value, checked)
                        }
                    />
                  </dd>
                  <dd>
                    <CheckBox
                        chkId="bizPbancSprtInstCd_SP27"
                        chkName="한국경제인협회중소기업협력센터"
                        value="SP27"
                        checked={params.bizPbancSprtInstCd.includes('SP27')}
                        onChange={({value, checked}) =>
                            handleMultiCheck('bizPbancSprtInstCd', value, checked)
                        }
                    />
                  </dd>
                  <dd>
                    <CheckBox
                        chkId="bizPbancSprtInstCd_SP28"
                        chkName="한국무역보험공사"
                        value="SP28"
                        checked={params.bizPbancSprtInstCd.includes('SP28')}
                        onChange={({value, checked}) =>
                            handleMultiCheck('bizPbancSprtInstCd', value, checked)
                        }
                    />
                  </dd>
                  <dd>
                    <CheckBox
                        chkId="bizPbancSprtInstCd_SP29"
                        chkName="한국무역협회"
                        value="SP29"
                        checked={params.bizPbancSprtInstCd.includes('SP29')}
                        onChange={({value, checked}) =>
                            handleMultiCheck('bizPbancSprtInstCd', value, checked)
                        }
                    />
                  </dd>
                  <dd>
                    <CheckBox
                        chkId="bizPbancSprtInstCd_SP30"
                        chkName="한국산업은행"
                        value="SP30"
                        checked={params.bizPbancSprtInstCd.includes('SP30')}
                        onChange={({value, checked}) =>
                            handleMultiCheck('bizPbancSprtInstCd', value, checked)
                        }
                    />
                  </dd>
                  <dd>
                    <CheckBox
                        chkId="bizPbancSprtInstCd_SP31"
                        chkName="한국수출입은행"
                        value="SP31"
                        checked={params.bizPbancSprtInstCd.includes('SP31')}
                        onChange={({value, checked}) =>
                            handleMultiCheck('bizPbancSprtInstCd', value, checked)
                        }
                    />
                  </dd>
                </dl>

              </div>
            </div>

            <div className="ontable-legend">
            <span>
              총 <b>{totalCount.toLocaleString()}</b>개
            </span>
              <Button btnType="add" btnNames="등록" onClick={() => navigate('create')}/>
            </div>

            <div className="ongrid-tableform">
              <GridTable columns={columns} data={rows}/>
              <div ref={observerRef} style={{height: 40}}/>
            </div>
          </div>
        </div>
      </div>
  );
}
