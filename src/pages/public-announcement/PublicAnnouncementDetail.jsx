import Button  from "@components/ui/Button.jsx";
import CheckBox  from "@components/ui/CheckBox.jsx";
import DatepickerBox  from "@components/ui/DatepickerBox.jsx";
import FileUpload  from "@components/ui/FileUpload.jsx";
import GridTable from '@components/ui/GridTable.jsx';
import MenuInputBox from "@components/ui/MenuInputBox.jsx";
import RadioButton  from "@components/ui/RadioButton.jsx";
import RichEditor from "@components/ui/RichEditor.jsx";
import SearchBox from '@components/ui/SearchBox.jsx';
import TextareaBox from "@components/ui/TextareaBox.jsx";
import http from "@lib/http.js";
import React, {useEffect, useState} from 'react';
import {useParams} from "react-router-dom";

export default function PublicAnnouncementDetail() {
  const [loading, setLoading] = useState(false);
  const { bizPbancNo } = useParams();
  const isEdit = !!bizPbancNo;

  const [form, setForm] = useState({
      bizPbancInqCnt: 0,
    //상세영역start
    pbancYmdNm: '', //진행상태
    linkInstBizPbancRlsSttsCd: 'BS01', //공개여부
    bizPbancClsfCd: '', //사업유형
    bizPbancRlsSttsCd: 'BS01', //통합플랫폼공개여부
    bizPbancSprtTypeCd: '', //지원유형
    bizPbancSprtInstCd: '', //지원기관
    bizSprvsnInstNm: '', //주관기관
    bizPbancLinkInstCd: '', //연계시스템
    scrapCnt: '', //스크랩수
    mdfcnDt: '', //최종수정일시
    //상세영역end
    //공고정보start
    bizPbancNm: '', //공고명
    bizPbancOtln: '', //사업개요
    bizSprtSclCn: '', //지원규모
    bizSprtCn: '', //지원내용
    bizSprtTrgtCn: '', //지원대상
    bizAplyPrdCn: '', //기간내용
    bizAplyBgngYmd: '', //시작일
    bizAplyDdlnYmd: '', //마감일
    bizAplyMthdCn: '', //신청방법
    bizPbancInqplCn: '', //문의처
    bizPbancInqplHmpgUrlAddr: '', //문의처 홈페이지
    bizPbancInqplTkcgDeptNm: '', //문의처 담당부서
    bizPbancInqplTelnoCn: '', //문의처 전화번호
    //공고정보end
    //제한조건start
    bizSprtQlfcRqmtCn: '', //자격요건
    bizAplyExclTrgtCn: '', //제외대상
    bizAplySbmsnDcmntCn: '', //제출서류
    sprtQlfcEntSclNm: '', //지원자격기업규모
    sprtQlfcEntTypeCn: '', //지원자격기업유형
    bizPbancPrtrtMttrCn: '', //우대사항
    bizPbancSprtAmtCn: '', //지원금액
    //제한조건end
    //신청정보start
    //todo 몰루겠음 첨부파일추가필요
    //신청정보end
  });

  const extractVal = (v) => (v && v.target !== undefined ? v.target.value : v);

  const handleInputChange = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: extractVal(value) }));
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await http.get(`/api/v1/public-announcement/${bizPbancNo}`);
      console.log('상세 데이터 조회:', res.data);
      setForm(res.data);
    } catch (error) {
      console.error('상세 조회 실패:', error);
    } finally {
      setLoading(false);
    }
  }

    const handleSave = async () => {
        // validation
        if (!form.bizPbancNm) {
            alert('공고명을 입력하세요.');
            return;
        }
        console.log(form);
        if (!window.confirm('저장하시겠습니까?')) return;

        if (bizPbancNo) {
            const res = await http.put(`/api/v1/public-announcement/${bizPbancNo}`, form);
            if (res?.success) {
                alert('수정되었습니다.');
            } else {
                alert('수정에 실패했습니다.');
            }
        } else {
            const res = await http.post(`/api/v1/public-announcement`, form);
            if (res?.success) {
                alert('등록되었습니다.');
            } else {
                alert('등록에 실패했습니다.');
            }
        }
    };

  // 상세조회
  useEffect(() => {
    if (isEdit) {
        fetchData();
    }
  }, [bizPbancNo]);

  return (
    <div className="oncontentbox full">
              <div className="oncontentTitle">
                <h2>지원사업공고 등록</h2>
                <ul className="onbreadcrumb">
                  <li>지원사업 관리</li>
                  <li>사업공고 관리</li>
                  <li>지원사업 공고관리</li>
                  <li>지원사업 공고목록</li>
                  <li className="on">지원사업공고 등록</li>
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
                          <td>진행상태</td>
                          <td>{form.pbancYmdNm}</td>
                          <td>공개여부</td>
                          <td>
                              <div className="onradioBox">
                              <RadioButton
                                groupId="linkInstBizPbancRlsSttsCd_1"
                                radioGroup="linkInstBizPbancRlsSttsCd"
                                radioValue="BS01"
                                radioName="공개"
                                selectedValue={form.linkInstBizPbancRlsSttsCd}
                                onChange={(v) => handleInputChange('linkInstBizPbancRlsSttsCd', v)}
                              />
                              <RadioButton
                                groupId="linkInstBizPbancRlsSttsCd_2"
                                radioGroup="linkInstBizPbancRlsSttsCd"
                                radioValue="BS02"
                                radioName="비공개"
                                selectedValue={form.linkInstBizPbancRlsSttsCd}
                                onChange={(v) => handleInputChange('linkInstBizPbancRlsSttsCd', v)}
                              />
                              <RadioButton
                                groupId="linkInstBizPbancRlsSttsCd_3"
                                radioGroup="linkInstBizPbancRlsSttsCd"
                                radioValue="BS03"
                                radioName="마감"
                                selectedValue={form.linkInstBizPbancRlsSttsCd}
                                onChange={(v) => handleInputChange('linkInstBizPbancRlsSttsCd', v)}
                              />
                            </div>
                          </td>
                        </tr>
                        <tr>
                          <td>사업유형</td>
                          <td>
                            <MenuInputBox
                                menuType="select"
                                menuSize='100%'
                                value={form.bizPbancClsfCd}
                                onChange={e => handleInputChange('bizPbancClsfCd', e)}
                                options={[
                                  { value: 'PC10', label: '금융' },
                                  { value: 'PC20', label: '기술' },
                                  { value: 'PC30', label: '인력' },
                                  { value: 'PC40', label: '수출' },
                                  { value: 'PC50', label: '내수' },
                                  { value: 'PC60', label: '창업' },
                                  { value: 'PC70', label: '경영' },
                                  { value: 'PC80', label: '소상공인' },
                                  { value: 'PC12', label: '중견' },
                                  { value: 'PC99', label: '기타' },
                                ]}
                            />
                          </td>
                          <td>통합플랫폼공개여부</td>
                          <td>
                              <div className="onradioBox">
                              <RadioButton
                                groupId="bizPbancRlsSttsCd_1"
                                radioGroup="bizPbancRlsSttsCd"
                                radioValue="BS01"
                                radioName="공개"
                                selectedValue={form.bizPbancRlsSttsCd}
                                onChange={(v) => handleInputChange('bizPbancRlsSttsCd', v)}
                              />
                              <RadioButton
                                groupId="bizPbancRlsSttsCd_2"
                                radioGroup="bizPbancRlsSttsCd"
                                radioValue="BS02"
                                radioName="비공개"
                                selectedValue={form.bizPbancRlsSttsCd}
                                onChange={(v) => handleInputChange('bizPbancRlsSttsCd', v)}
                              />
                            </div>
                          </td>
                        </tr>
                        <tr>
                          <td>지원유형</td>
                          <td>
                            <MenuInputBox
                                menuType="select"
                                menuSize='100%'
                                value={form.bizPbancSprtTypeCd}
                                onChange={e => handleInputChange('bizPbancSprtTypeCd', e)}
                                options={[
                                  { value: 'RT01', label: '창업' },
                                  { value: 'RT02', label: '기술개발' },
                                  { value: 'RT03', label: '정책자금' },
                                  { value: 'RT04', label: '기술보증' },
                                  { value: 'RT05', label: '스마트공장' },
                                  { value: 'RT06', label: '소상공인' },
                                  { value: 'RT07', label: '인력지원' },
                                  { value: 'RT08', label: '수출지원' },
                                  { value: 'RT09', label: '기업지원' },
                                  { value: 'RT10', label: '정보' },
                                ]}
                            />
                          </td>
                          <td>지원기관</td>
                          <td>
                            <MenuInputBox
                                menuType="select"
                                menuSize='100%'
                                value={form.bizPbancSprtInstCd}
                                onChange={e => handleInputChange('bizPbancSprtInstCd', e)}
                                options={[
                                  { value: 'SP16', label: '중소벤처기업부' },
                                  { value: 'SP01', label: '중소벤처기업진흥공단' },
                                  { value: 'SP02', label: '중소기업기술정보진흥원' },
                                  { value: 'SP03', label: '한국중소벤처기업유통원' },
                                  { value: 'SP04', label: '창업진흥원' },
                                  { value: 'SP05', label: '소상공인시장진흥공단' },
                                  { value: 'SP06', label: '기술보증기금' },
                                  { value: 'SP15', label: '지역신용보증재단' },
                                  { value: 'SP10', label: '대.중소기업.농어업협력재단' },
                                  { value: 'SP12', label: '여성기업종합지원포털' },
                                  { value: 'SP13', label: '장애인기업종합지원센터' },
                                  { value: 'SP14', label: '한국산업기술진흥원' },
                                  { value: 'SP17', label: '중소기업중앙회' },
                                  { value: 'SP18', label: '중소기업융합중앙회' },
                                  { value: 'SP19', label: '한국창업보육협회' },
                                  { value: 'SP20', label: '이노비즈협회' },
                                  { value: 'SP21', label: '한국경영혁신중소기업협회' },
                                  { value: 'SP22', label: '대한무역투자진흥공사' },
                                  { value: 'SP23', label: '기업은행' },
                                  { value: 'SP24', label: '대한상공회의소' },
                                  { value: 'SP25', label: '신용보증기금' },
                                  { value: 'SP26', label: '신용보증재단중앙회' },
                                  { value: 'SP27', label: '한국경제인협회중소기업협력센터' },
                                  { value: 'SP28', label: '한국무역보험공사' },
                                  { value: 'SP29', label: '한국무역협회' },
                                  { value: 'SP30', label: '한국산업은행' },
                                  { value: 'SP31', label: '한국수출입은행' },
                                ]}
                            />
                          </td>
                        </tr>
                        <tr>
                          <td>주관기관</td>
                          <td>
                            <MenuInputBox
                                menuType="input"
                                menuSize='100%'
                                value={form.bizSprvsnInstNm}
                                onChange={(v) => handleInputChange('bizSprvsnInstNm', v)}
                            />
                          </td>
                          <td>연계시스템</td>
                          <td>
                            <MenuInputBox
                                menuType="select"
                                menuSize='100%'
                                value={form.bizPbancLinkInstCd}
                                onChange={e => handleInputChange('bizPbancLinkInstCd', e)}
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
                          </td>
                        </tr>
                        <tr>
                          <td>스크랩수</td>
                          <td>
                            {form.scrapCnt}
                          </td>
                          <td>최종수정일시</td>
                          <td>
                            {form.mdfcnDt}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
    
                  <h4 className="ontableTitle">공고정보</h4>
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
                          <td>공고명</td>
                          <td colSpan={3}>
                            <MenuInputBox
                                menuType="input"
                                menuSize="100%"
                                value={form.bizPbancNm}
                                onChange={(v) => handleInputChange('bizPbancNm', v)}
                            />
                          </td>
                        </tr>
                        <tr>
                          <td>사업개요</td>
                          <td colSpan={3}>
                            <RichEditor
                                theme={"light"}
                                value={form.bizPbancOtln}
                                onChange={(v) => handleInputChange('bizPbancOtln', v)}
                            />
                          </td>
                        </tr>
                        <tr>
                          <td>지원규모</td>
                          <td colSpan={3}>
                            <RichEditor
                                theme={"light"}
                                value={form.bizSprtSclCn}
                                onChange={(v) => handleInputChange('bizSprtSclCn', v)}
                            />
                          </td>
                        </tr>
                        <tr>
                          <td>지원내용</td>
                          <td colSpan={3}>
                            <RichEditor
                                theme={"light"}
                                value={form.bizSprtCn}
                                onChange={(v) => handleInputChange('bizSprtCn', v)}
                            />
                          </td>
                        </tr>
                        <tr>
                          <td>지원대상</td>
                          <td colSpan={3}>
                            <RichEditor
                                theme={"light"}
                                value={form.bizSprtTrgtCn}
                                onChange={(v) => handleInputChange('bizSprtTrgtCn', v)}
                            />
                          </td>
                        </tr>
                        <tr>
                          <td>기간내용</td>
                          <td colSpan={3}>
                            <MenuInputBox
                                menuType="input"
                                menuSize="100%"
                                value={form.bizAplyPrdCn}
                                onChange={(v) => handleInputChange('bizAplyPrdCn', v)}
                            />
                          </td>
                        </tr>
                        <tr>
                          <td>시작일</td>
                          <td>
                              <DatepickerBox
                                  value={form.bizAplyBgngYmd}
                                  outputFormat="ymd"
                                  onChange={(v) => handleInputChange('bizAplyBgngYmd', v)}
                              />
                          </td>
                          <td>마감일</td>
                          <td>
                              <DatepickerBox
                                  value={form.bizAplyDdlnYmd}
                                  outputFormat="ymd"
                                  onChange={(v) => handleInputChange('bizAplyDdlnYmd', v)}
                              />
                          </td>
                        </tr>
                         <tr>
                          <td>신청방법</td>
                          <td colSpan={3}>
                             <RichEditor
                                theme={"light"}
                                value={form.bizAplyMthdCn}
                                onChange={(v) => handleInputChange('bizAplyMthdCn', v)}
                             />
                          </td>
                        </tr>
                        <tr>
                          <td>문의처</td>
                          <td colSpan={3}>
                             <RichEditor
                                theme={"light"}
                                value={form.bizPbancInqplCn}
                                onChange={(v) => handleInputChange('bizPbancInqplCn', v)}
                             />
                          </td>
                        </tr>
                        <tr>
                          <td>문의처 홈페이지</td>
                          <td colSpan={3}>
                            <MenuInputBox
                                menuType="input"
                                menuSize="100%"
                                value={form.bizPbancInqplHmpgUrlAddr}
                                onChange={(v) => handleInputChange('bizPbancInqplHmpgUrlAddr', v)}
                            />
                          </td>
                        </tr>
                        <tr>
                          <td>문의처 담당부서</td>
                          <td>
                            <MenuInputBox
                                menuType="input"
                                menuSize="300px"
                                value={form.bizPbancInqplTkcgDeptNm}
                                onChange={(v) => handleInputChange('bizPbancInqplTkcgDeptNm', v)}
                            />
                          </td>
                          <td>문의처 전화번호</td>
                          <td>
                            <MenuInputBox
                                menuType="input"
                                menuSize="300px"
                                value={form.bizPbancInqplTelnoCn}
                                onChange={(v) => handleInputChange('bizPbancInqplTelnoCn', v)}
                            />
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  <h4 className="ontableTitle">제한조건</h4>
                  <div className="ontableBox">
                    <table>
                      <colgroup>
                        <col style={{ width: '180px' }} />
                        <col style={{ width: 'auto' }} />
                      </colgroup>
                      <tbody>
                      <tr>
                        <td>자격요건</td>
                        <td>
                          <TextareaBox
                              value={form.bizSprtQlfcRqmtCn}
                              onChange={(v) => handleInputChange('bizSprtQlfcRqmtCn', v)}
                          />
                        </td>
                      </tr>
                      <tr>
                        <td>제외대상</td>
                        <td>
                          <TextareaBox
                                value={form.bizAplyExclTrgtCn}
                                onChange={(v) => handleInputChange('bizAplyExclTrgtCn', v)}
                          />
                        </td>
                      </tr>
                      <tr>
                        <td>제출서류</td>
                        <td>
                          <TextareaBox
                                value={form.bizAplySbmsnDcmntCn}
                                onChange={(v) => handleInputChange('bizAplySbmsnDcmntCn', v)}
                          />
                        </td>
                      </tr>
                      <tr>
                        <td>지원자격기업규모</td>
                        <td>
                          <TextareaBox
                                value={form.sprtQlfcEntSclNm}
                                onChange={(v) => handleInputChange('sprtQlfcEntSclNm', v)}
                          />
                        </td>
                      </tr>
                      <tr>
                        <td>지원자격기업유형</td>
                        <td>
                          <TextareaBox
                                value={form.sprtQlfcEntTypeCn}
                                onChange={(v) => handleInputChange('sprtQlfcEntTypeCn', v)}
                          />
                        </td>
                      </tr>
                      <tr>
                        <td>우대사항</td>
                        <td>
                          <TextareaBox
                                value={form.bizPbancPrtrtMttrCn}
                                onChange={(v) => handleInputChange('bizPbancPrtrtMttrCn', v)}
                          />
                        </td>
                      </tr>
                      <tr>
                        <td>지원금액</td>
                        <td>
                          <TextareaBox
                                value={form.bizPbancSprtAmtCn}
                                onChange={(v) => handleInputChange('bizPbancSprtAmtCn', v)}
                          />
                        </td>
                      </tr>
                      </tbody>
                    </table>
                  </div>

                  <h4 className="ontableTitle">신청정보</h4>
                  <div className="ontableBox">
                    <table>
                      <colgroup>
                        <col style={{ width: '180px' }} />
                        <col style={{ width: 'auto' }} />
                      </colgroup>
                      <tbody>
                        <tr>
                          <td>신청사이트</td>
                          <td>
                            <MenuInputBox menuType="input" menuSize="100%" />
                          </td>
                        </tr>
                        <tr>
                          <td>신청경로</td>
                          <td>
                            <MenuInputBox menuType="input" menuSize="100%" />
                          </td>
                        </tr>
                        <tr>
                          <td>상세정보 경로</td>
                          <td>
                            <MenuInputBox menuType="input" menuSize="100%" />
                          </td>
                        </tr>
                        <tr>
                          <td>공고문</td>
                          <td>
                           <Button btnType="addfile" btnNames="파일 선택"/>
                            <input type="file" />
                            <div className="onflex onflexcolumn">
                              <FileUpload mode="edit"/>
                            </div>
                          </td>
                        </tr>
                        <tr>
                          <td>첨부파일 주소</td>
                          <td>
                            <MenuInputBox menuType="input" menuSize="100%" />
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
                <div className="onflexbtns">
                  <div style={{ marginRight: 'auto' }}>
                    <Button btnType="list" btnNames="목록"/>
                  </div>
                  <Button btnType="del" btnNames="삭제" />
                  <Button btnType="add" btnNames="저장" onClick={() => {handleSave()}}/>
                </div>
              </div>
            </div>
  );
}
