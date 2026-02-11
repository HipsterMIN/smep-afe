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
  const observerRef = useRef(null);

  const apiRef = useRef(null);

  const [params, setParams] = useState({
    bizPbancLinkInstCd: '',
    bizPbancRlsSttsCd: '',
    linkInstBizPbancRlsSttsCd: '',
    pbancYmd: '',
    bizPbancNm: '',
    bizPbancClsfCd: '',
    bizPbancSprtTypeCd: '',
    bizPbancSprtInstCd: '',
  });

  const columns = [
    { id: 'rowNumber', header: '번호', width: 60, cell: (props) => RownumberCell(props) },
    { id: 'bizPbancNm', header: '공고명', resize: true, width: 450 },
    { id: 'bizPbancClsfCdNm', header: '사업유형', resize: true, width: 100 },
    { id: 'bizPbancSprtTypeCdNm', header: '지원유형', resize: true, width: 100 },
    { id: 'bizPbancSprtInstCdNm', header: '지원기관', resize: true, width: 100 },
    { id: 'bizAplyPrdCn', header: '신청기간', resize: true, width: 190 },
    { id: 'pbancYmdNm', header: '진행상태', resize: true, width: 80 },
    { id: 'bizPbancRlsSttsCdNm', header: '공개여부', resize: true, width: 80 },
    { id: 'regDt', header: '등록일', resize: true, width: 160 },
    { id: 'mdfcnDt', header: '수정일', resize: true, width: 160 },
    { id: 'management', header: '관리', width: 80, cell: (props) => ManagementCell(props) },
  ];

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
        <Button btnType="edit" btnNames="수정" onClick={() => handleEdit(item)} />
    );
  };

  const extractVal = (v) => (v && v.target !== undefined ? v.target.value : v);

  const handleParamInputChange = (key, value) => {
    setParams((prev) => ({ ...prev, [key]: extractVal(value) }));
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
            <div className="onselect-form open">
              {/** open 클래스로 동작, 펼치기/접기 */}
              <div className="onparagraph">
                <MenuInputBox
                    menuType="select"
                    menuName="연계시스템"
                    selectOption="2025"
                    menuSize='150px'
                />
                <MenuInputBox
                    menuType="select"
                    menuName="공개여부"
                    selectOption=""
                    menuSize='150px'
                />
                <MenuInputBox
                    menuType="select"
                    menuName="진행상태"
                    selectOption=""
                    menuSize='150px'
                />
                <MenuInputBox
                    menuType="select"
                    menuName="공개구분"
                    selectOption=""
                    menuSize='150px'
                />
                <div style={{marginLeft: 'auto'}}>
                  <Button btnType="detail" btnNames="상세조건 접기"/>
                </div>
                <div className="onbtn">
                  <Button btnType="menuSearch" btnNames="검색"/>
                </div>
              </div>
              <div className="onparagraph middle dashed">
                <MenuInputBox
                    menuType="input"
                    menuName="공고명"
                    menuSize='300px'
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
                    <CheckBox chkId="1_1" chkName="전체"/>
                  </dd>
                  <dd>
                    <CheckBox chkId="1_2" chkName="금융"/>
                  </dd>
                  <dd>
                    <CheckBox chkId="1_3" chkName="기술"/>
                  </dd>
                  <dd>
                    <CheckBox chkId="1_4" chkName="인력"/>
                  </dd>
                  <dd>
                    <CheckBox chkId="1_5" chkName="수출"/>
                  </dd>
                  <dd>
                    <CheckBox chkId="1_6" chkName="내수"/>
                  </dd>
                  <dd>
                    <CheckBox chkId="1_7" chkName="창업"/>
                  </dd>
                  <dd>
                    <CheckBox chkId="1_8" chkName="경영"/>
                  </dd>
                  <dd>
                    <CheckBox chkId="1_9" chkName="소상공인"/>
                  </dd>
                  <dd>
                    <CheckBox chkId="1_10" chkName="중견"/>
                  </dd>
                  <dd>
                    <CheckBox chkId="1_11" chkName="기타"/>
                  </dd>
                </dl>
                <dl>
                  <dt>지원유형</dt>
                  <dd>
                    <CheckBox chkId="2_1" chkName="전체"/>
                  </dd>
                  <dd>
                    <CheckBox chkId="2_2" chkName="창업"/>
                  </dd>
                  <dd>
                    <CheckBox chkId="2_3" chkName="기술개발"/>
                  </dd>
                  <dd>
                    <CheckBox chkId="2_3" chkName="정책자금"/>
                  </dd>
                </dl>
                <dl>
                  <dt>지원기관</dt>
                  <dd>
                    <CheckBox chkId="3_1" chkName="전체"/>
                  </dd>
                  <dd>
                    <CheckBox chkId="3_2" chkName="중소벤처기업부"/>
                  </dd>
                  <dd>
                    <CheckBox chkId="3_3" chkName="중소벤처기업진흥공단"/>
                  </dd>
                  <dd>
                    <CheckBox chkId="3_4" chkName="중소기업기술정보진흥원"/>
                  </dd>
                  <dd>
                    <CheckBox chkId="3_5" chkName="한국산업은행"/>
                  </dd>
                  <dd>
                    <CheckBox chkId="3_6" chkName="한국수출입은행"/>
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
              <GridTable columns={columns} data={rows} />
              <div ref={observerRef} style={{height: 40}}/>
            </div>
          </div>
        </div>
      </div>
  );
}
