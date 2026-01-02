import React, { useState } from 'react';

import MenuInputBox from "../components/ui/MenuInputBox.jsx";
import RadioButton  from "../components/ui/RadioButton.jsx";
import Button  from "../components/ui/Button.jsx";
import FileUpload2  from "../components/ui/FileUpload2.jsx";
import CheckBox  from "../components/ui/CheckBox.jsx";
import DatepickerBox  from "../components/ui/DatepickerBox.jsx";
import GridTable from '../components/ui/GridTable.jsx';
import SearchBox from '../components/ui/SearchBox.jsx';

export default function CommonCode() {
  const [selectedValue, setSelectedValue] = useState(null); // radio button 분기변수

  return (
    <div className="oncontentbox full">
              <div className="oncontentTitle">
                <h2>주택특별공급 사업공고 상세조회</h2>
                <ul className="onbreadcrumb">
                  <li>지원사업 관리</li>
                  <li>사업공고 관리</li>
                  <li>주택특별공급 사업공고 관리</li>
                  <li>주택특별공급 사업공고 목록</li>
                  <li className="on">주택특별공급 사업공고 상세조회</li>
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
                          <td>진행중</td>
                          <td>공개여부</td>
                          <td></td>
                        </tr>
                        <tr>
                          <td>사업유형</td>
                          <td></td>
                          <td>통합플랫폼공개여부</td>
                          <td></td>
                        </tr>
                        <tr>
                          <td>지원유형</td>
                          <td></td>
                          <td>지원기관</td>
                          <td>
                          </td>
                        </tr>
                        <tr>
                          <td>전문기관</td>
                          <td>
                          </td>
                          <td>연계시스템</td>
                          <td>
                          </td>
                        </tr>
                        <tr>
                          <td>스크랩수</td>
                          <td colSpan={3}>
                            109
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
                          <td>세부사업명</td>
                          <td colSpan={3}>
                          </td>
                        </tr>
                        <tr>
                          <td>공고명</td>
                          <td colSpan={3}>
                            
                          </td>
                        </tr>
                        <tr>
                          <td>사업개요</td>
                          <td colSpan={3}>
                            
                          </td>
                        </tr>
                        <tr>
                          <td>사업개요(모바일)</td>
                          <td colSpan={3}>
                            
                          </td>
                        </tr>
                        <tr>
                          <td>지원규모</td>
                          <td colSpan={3}>
                            
                          </td>
                        </tr>
                        <tr>
                          <td>지원규모(모바일)</td>
                          <td colSpan={3}>
                            
                          </td>
                        </tr>
                        <tr>
                          <td>지원금액</td>
                          <td colSpan={3}>
                            <div className="onmenuspace">
                              <span class="onmenunames">최소지원금액</span>
                              <span>999,999,999</span>
                              <span class="onmenunames">최대지원금액</span>
                              <span>999,999,999</span>
                            </div>
                          </td>
                        </tr>
                        <tr>
                          <td>지원이율</td>
                          <td colSpan={3}>
                            <div className="onmenuspace">
                              <span class="onmenunames">최소이율</span>
                              <span>99.99%</span>
                              <span class="onmenunames">최대이율</span>
                              <span>99.99%</span>
                            </div>
                          </td>
                        </tr>
                        <tr>
                          <td>지원내용</td>
                          <td colSpan={3}>
                          </td>
                        </tr>
                        <tr>
                          <td>지원내용(모바일)</td>
                          <td colSpan={3}>
                          </td>
                        </tr>
                        <tr>
                          <td>지원대상</td>
                          <td colSpan={3}>
                          </td>
                        </tr>
                        <tr>
                          <td>지원대상(모바일)</td>
                          <td colSpan={3}>
                          </td>
                        </tr>
                        <tr>
                          <td>기간내용</td>
                          <td>
                          </td>
                          <td>최대지원금액</td>
                          <td>
                          </td>
                        </tr>
                        <tr>
                          <td>시작일</td>
                          <td></td>
                          <td>마감일</td>
                          <td></td>
                        </tr>
                         <tr>
                          <td>신청방법</td>
                          <td colSpan={3}>
                          </td>
                        </tr>
                         <tr>
                          <td>신청방법(모바일)</td>
                          <td colSpan={3}>
                          </td>
                        </tr>
                        <tr>
                          <td>문의처</td>
                          <td colSpan={3}>
                          </td>
                        </tr>
                        <tr>
                          <td>문의처 홈페이지</td>
                          <td colSpan={3}>
                          </td>
                        </tr>
                        <tr>
                          <td>문의처 담당부서</td>
                          <td>
                          </td>
                          <td>문의처 전화번호</td>
                          <td>
                          </td>
                        </tr>
                        <tr>
                          <td>문의처(모바일)</td>
                          <td colSpan={3}>
                          </td>
                        </tr>
                        <tr>
                          <td>공고일</td>
                          <td colSpan={3}>
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
                          <td>문의처</td>
                          <td>
                            <div className="oneditcontent" />
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
                          <td>기업규모</td>
                          <td>
                            <div className="oncheckBox">
                              <CheckBox chkId="1_1" chkName="전체" />
                              <CheckBox chkId="1_2" chkName="중소기업" />
                              <CheckBox chkId="1_3" chkName="소상공인" />
                            </div>
                          </td>
                        </tr>
                        <tr>
                          <td>업력</td>
                          <td>
                            <div className="oncheckBox">
                              <CheckBox chkId="1_1" chkName="전체" />
                              <CheckBox chkId="1_2" chkName="중소기업" />
                              <CheckBox chkId="1_3" chkName="소상공인" />
                            </div>
                          </td>
                        </tr>
                        <tr>
                          <td>종업원수</td>
                          <td>
                            <div className="oncheckBox">
                              <CheckBox chkId="1_1" chkName="전체" />
                              <CheckBox chkId="1_2" chkName="중소기업" />
                              <CheckBox chkId="1_3" chkName="소상공인" />
                            </div>
                          </td>
                        </tr>
                        <tr>
                          <td>매출액</td>
                          <td>
                            <div className="oncheckBox">
                              <CheckBox chkId="1_1" chkName="전체" />
                              <CheckBox chkId="1_2" chkName="중소기업" />
                              <CheckBox chkId="1_3" chkName="소상공인" />
                            </div>
                             <div className="onmenuspace">
                              <span class="onmenunames">최소 매출액</span>
                              <span>999,999,999</span>
                              <span class="onmenunames">최대 매출액</span>
                              <span>999,999,999</span>
                            </div>
                          </td>
                        </tr>
                        <tr>
                          <td>대표자연령</td>
                          <td>
                            <div className="onmenuspace">
                              <span class="onmenunames">최소 대표자 연령</span>
                              <span>999,999,999</span>
                              <span class="onmenunames">최대 대표자 연령</span>
                              <span>999,999,999</span>
                            </div>
                          </td>
                        </tr>
                        <tr>
                          <td>인증</td>
                          <td>
                            <div className="oncheckBox">
                              <CheckBox chkId="1_1" chkName="전체" />
                              <CheckBox chkId="1_2" chkName="중소기업" />
                              <CheckBox chkId="1_3" chkName="소상공인" />
                            </div>
                          </td>
                        </tr>
                        <tr>
                          <td>지역</td>
                          <td>
                            <div className="oncheckBox">
                              <CheckBox chkId="1_1" chkName="전체" />
                              <CheckBox chkId="1_2" chkName="중소기업" />
                              <CheckBox chkId="1_3" chkName="소상공인" />
                            </div>
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
                          </td>
                        </tr>
                        <tr>
                          <td>신청경로</td>
                          <td>
                          </td>
                        </tr>
                        <tr>
                          <td>상세정보 경로</td>
                          <td>
                          </td>
                        </tr>
                        <tr>
                          <td>공고문</td>
                          <td>
                            <div className="onflex onflexcolumn">
                              <FileUpload2/>
                            </div>
                          </td>
                        </tr>
                        <tr>
                          <td>특성문</td>
                          <td>
                            <div className="onflex onflexcolumn">
                              <FileUpload2/>
                            </div>
                          </td>
                        </tr>
                        <tr>
                          <td>첨부파일 주소</td>
                          <td>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  <h4 className="ontableTitle">관련사업</h4>
                  <div className="ongrid-form">
                    <h4></h4>
                    <div className="ongrid-btnbox">
                      <Button btnType="search" btnNames="자동검색" />
                      <Button btnType="add" btnNames="직접추가" />
                      <Button btnType="del" btnNames="삭제" />
                    </div>
                  </div>
                  <div className="ongrid-tableform mask">
                    <GridTable />
                  </div>
                </div>
                <div className="onflexbtns">
                  <div style={{ marginRight: 'auto' }}>
                    <Button btnType="list" btnNames="목록" />
                  </div>
                  <Button btnType="edit" btnNames="수정" />
                </div>
              </div>
            </div>
  );
}
