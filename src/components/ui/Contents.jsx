import { useState } from 'react';

import Button from './Button';
import CheckBox from './CheckBox';
import GridTable from './GridTable';
import MenuInputBox from './MenuInputBox';
import RadioButton from './RadioButton';
import SearchBox from './SearchBox';

// 관리자 - 컨텐츠 영역
export default function Contents({ contentType }) {
  const [selectedValue, setSelectedValue] = useState(null); // radio button 분기변수

  return (
    <>
      {contentType === 'type1' ? (
        <div className="oncontentbox">
          <div className="oncontentTitle">
            <h2>공통코드 관리</h2>
            <ul className="onbreadcrumb">
              <li>시스템 관리</li>
              <li>시스템 설정</li>
              <li className="on">공통코드 관리</li>
            </ul>
          </div>

          <div className="oncontents space">
            <div className="oncontent">
              <div className="ongrid-form">
                <h4>그룹코드 구분</h4>
                <div className="ongrid-btnbox">
                  <SearchBox
                    inputId="searchFormGroup"
                    placeholder="검색어를 입력하세요."
                  />
                  <Button btnType="search" btnNames="검색" />
                  <Button btnType="add" btnNames="추가" />
                </div>
              </div>
              <div className="ongrid-tableform mask">
                <GridTable />
              </div>
            </div>

            <div className="oncontent">
              <div className="ongrid-form">
                <h4>하위코드 구분</h4>
                <div className="ongrid-btnbox">
                  <SearchBox
                    inputId="searchFormChild"
                    placeholder="검색어를 입력하세요."
                  />
                  <Button btnType="search" btnNames="검색" />
                  <Button btnType="add" btnNames="추가" />
                </div>
              </div>
              <div className="ongrid-tableform">
                <GridTable />
              </div>
            </div>
          </div>
        </div>
      ) : contentType === 'type2' ? (
        <div className="oncontentbox">
          <div className="oncontentTitle">
            <h2>권한 관리</h2>
            <ul className="onbreadcrumb">
              <li>시스템 관리</li>
              <li>회원/권한 관리</li>
              <li className="on">권한 관리</li>
            </ul>
          </div>

          <div className="oncontents space">
            <div className="oncontent">
              <div className="ongrid-form">
                <h4>권한그룹</h4>
                <div className="ongrid-btnbox">
                  <SearchBox
                    inputId="searchFormGroup"
                    placeholder="검색어를 입력하세요."
                  />
                  <Button btnType="search" btnNames="검색" />
                  <Button btnType="add" btnNames="추가" />
                </div>
              </div>
              <div className="ongrid-tableform mask">
                <GridTable />
              </div>
            </div>

            <div className="oncontent">
              <div className="ongrid-form">
                <h4>소속인원</h4>
                <div className="ongrid-btnbox">
                  <SearchBox
                    inputId="searchFormChild"
                    placeholder="검색어를 입력하세요."
                  />
                  <Button btnType="search" btnNames="검색" />
                  <Button btnType="del" btnNames="삭제" />
                  <Button btnType="add" btnNames="추가" />
                </div>
              </div>
              <div className="ongrid-tableform">
                <GridTable />
              </div>
            </div>
          </div>
        </div>
      ) : contentType === 'type3' ? (
        <div className="oncontentbox full">
          <div className="oncontentTitle">
            <h2>관리자 메뉴 관리</h2>
            <ul className="onbreadcrumb">
              <li>시스템 관리</li>
              <li>시스템 설정</li>
              <li className="on">관리자 메뉴 관리</li>
            </ul>
          </div>
          <div className="oncontents">
            <div className="oncontent">
              <div className="onselect-form">
                <div className="onparagraph">
                  <MenuInputBox
                    menuType="input"
                    menuName="메뉴ID"
                    placeholder="ID 입력"
                  />
                  <MenuInputBox
                    menuType="input"
                    menuSize="200px"
                    menuName="메뉴명"
                    placeholder="검색어를 입력하세요."
                  />
                  <MenuInputBox
                    menuType="input"
                    menuSize="200px"
                    menuName="상위메뉴"
                    placeholder="000000"
                  />
                  <MenuInputBox
                    menuType="input"
                    menuSize="300px"
                    menuName="URL"
                    placeholder="검색어를 입력하세요."
                  />
                  <MenuInputBox
                    menuType="select"
                    menuName="유형"
                    selectOption="Y"
                  />
                  <MenuInputBox
                    menuType="select"
                    menuName="사용여부"
                    selectOption="전체"
                  />
                  <div className="onbtn" style={{ marginLeft: 'auto' }}>
                    <Button btnType="menuSearch" btnNames="검색" />
                  </div>
                </div>
              </div>
              <div className="ontable-legend">
                <span>
                  총 <b>468</b>개
                </span>
                <div className="onbtns">
                  <button className="onallopen-ico" />
                  <button className="onallclose-ico" />
                </div>
              </div>

              <div className="ongrid-tableform mask">
                <GridTable />
              </div>
            </div>
          </div>
        </div>
      ) : contentType === 'type4' ? (
        <div className="oncontentbox full">
          <div className="oncontentTitle">
            <h2>게시판 관리</h2>
            <ul className="onbreadcrumb">
              <li>시스템 관리</li>
              <li>시스템 설정</li>
              <li className="on">게시판 관리</li>
            </ul>
          </div>
          <div className="oncontents">
            <div className="oncontent">
              <div className="onselect-form">
                <div className="onparagraph">
                  <MenuInputBox
                    menuType="input"
                    menuName="게시판 ID"
                    placeholder="ID 입력"
                  />
                  <MenuInputBox
                    menuType="input"
                    menuSize="200px"
                    menuName="게시판 명"
                    placeholder="게시판 명을 입력하세요."
                  />
                  <MenuInputBox
                    menuType="select"
                    menuSize="80px"
                    menuName="유형"
                    selectOption="Y"
                  />
                  <MenuInputBox
                    menuType="input"
                    menuSize="300px"
                    menuName="소개글"
                    placeholder="소개글을 입력하세요."
                  />
                  <MenuInputBox
                    menuType="select"
                    menuName="공개여부"
                    selectOption="Y"
                  />
                  <MenuInputBox
                    menuType="select"
                    menuName="사용여부"
                    selectOption="Y"
                  />
                  <div className="onbtn" style={{ marginLeft: 'auto' }}>
                    <Button btnType="menuSearch" btnNames="검색" />
                  </div>
                </div>
              </div>
              <div className="ontable-legend">
                <span>
                  총 <b>468</b>개
                </span>
                <Button btnType="add" btnNames="등록" />
              </div>

              <div className="ongrid-tableform mask">
                <GridTable />
              </div>
            </div>
          </div>
        </div>
      ) : contentType === 'type5' ? (
        <div className="oncontentbox full">
          <div className="oncontentTitle">
            <h2>사업정보 관리</h2>
            <ul className="onbreadcrumb">
              <li>지원사업 관리</li>
              <li>사업공고 관리</li>
              <li className="on">사업정보 관리</li>
            </ul>
          </div>
          <div className="oncontents">
            <div className="oncontent">
              <div className="onselect-form open">
                {' '}
                {/** open 클래스로 동작, 펼치기/접기 */}
                <div className="onparagraph dashed">
                  <MenuInputBox
                    menuType="select"
                    menuName="사업년도"
                    selectOption="2025"
                  />
                  <MenuInputBox
                    menuType="input"
                    menuSize="380px"
                    menuName="사업명"
                    placeholder="사업명을 입력하세요."
                  />
                  <div style={{ marginLeft: 'auto' }}>
                    <Button btnType="detail" btnNames="상세조건 접기" />
                  </div>
                  <div className="onbtn">
                    <Button btnType="menuSearch" btnNames="검색" />
                  </div>
                </div>
                <div className="onparagraph column">
                  <dl>
                    <dt>사업유형</dt>
                    <dd>
                      <CheckBox chkId="1_1" chkName="전체" />
                    </dd>
                    <dd>
                      <CheckBox chkId="1_2" chkName="금융" />
                    </dd>
                    <dd>
                      <CheckBox chkId="1_3" chkName="기술" />
                    </dd>
                    <dd>
                      <CheckBox chkId="1_4" chkName="인력" />
                    </dd>
                    <dd>
                      <CheckBox chkId="1_5" chkName="수출" />
                    </dd>
                    <dd>
                      <CheckBox chkId="1_6" chkName="내수" />
                    </dd>
                    <dd>
                      <CheckBox chkId="1_7" chkName="창업" />
                    </dd>
                    <dd>
                      <CheckBox chkId="1_8" chkName="경영" />
                    </dd>
                    <dd>
                      <CheckBox chkId="1_9" chkName="소상공인" />
                    </dd>
                    <dd>
                      <CheckBox chkId="1_10" chkName="중견" />
                    </dd>
                    <dd>
                      <CheckBox chkId="1_11" chkName="기타" />
                    </dd>
                  </dl>
                  <dl>
                    <dt>지원기관</dt>
                    <dd>
                      <CheckBox chkId="2_1" chkName="전체" />
                    </dd>
                    <dd>
                      <CheckBox chkId="2_2" chkName="중소벤처기업부" />
                    </dd>
                    <dd>
                      <CheckBox chkId="2_3" chkName="중소벤처기업진흥공단" />
                    </dd>
                    <dd>
                      <CheckBox chkId="2_4" chkName="중소기업기술정보진흥원" />
                    </dd>
                    <dd>
                      <CheckBox chkId="2_5" chkName="한국산업은행" />
                    </dd>
                    <dd>
                      <CheckBox chkId="2_6" chkName="한국수출입은행" />
                    </dd>
                  </dl>
                  <dl>
                    <dt>기업구분</dt>
                    <dd>
                      <CheckBox chkId="3_1" chkName="전체" />
                    </dd>
                    <dd>
                      <CheckBox chkId="3_2" chkName="중소벤처기업" />
                    </dd>
                    <dd>
                      <CheckBox chkId="3_3" chkName="소상공인" />
                    </dd>
                  </dl>
                </div>
              </div>

              <div className="ontable-legend">
                <span>
                  총 <b>468</b>개
                </span>
                <Button btnType="add" btnNames="등록" />
              </div>

              <div className="ongrid-tableform mask">
                <GridTable />
              </div>
            </div>
          </div>
        </div>
      ) : contentType === 'type6' ? (
        <div className="oncontentbox full">
          <div className="oncontentTitle">
            <h2>사업정보 등록/수정</h2>
            <ul className="onbreadcrumb">
              <li>지원사업 관리</li>
              <li>사업공고 관리</li>
              <li className="on">사업정보 관리</li>
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
                      <td>사업ID</td>
                      <td>ABC1234</td>
                      <td>스크랩수</td>
                      <td>2</td>
                    </tr>
                    <tr>
                      <td>사업년도</td>
                      <td>
                        <MenuInputBox menuType="select" selectOption="2025" />
                      </td>
                      <td>공개여부</td>
                      <td>
                        <div className="onradioBox">
                          <RadioButton
                            groupId="1"
                            radioGroup="group1"
                            radioValue="A"
                            radioName="공개"
                            selectedValue={selectedValue}
                            onChange={setSelectedValue}
                          />
                          <RadioButton
                            groupId="2"
                            radioGroup="group1"
                            radioValue="B"
                            radioName="비공개"
                            selectedValue={selectedValue}
                            onChange={setSelectedValue}
                          />
                          <RadioButton
                            groupId="3"
                            radioGroup="group2"
                            radioValue="disable"
                            radioName="미사용"
                            disabled={true}
                          />
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <td>등록일시</td>
                      <td>2025-03-26 14:32:35</td>
                      <td>최종수정일시</td>
                      <td>2025-03-26 14:32:35</td>
                    </tr>
                    <tr>
                      <td>사업유형(정책분류)</td>
                      <td>
                        <MenuInputBox
                          menuType="select"
                          menuSize="150px"
                          selectOption="2025"
                        />
                      </td>
                      <td>지원기관</td>
                      <td>
                        <MenuInputBox
                          menuType="select"
                          menuSize="150px"
                          selectOption="중소벤처기업부"
                        />
                      </td>
                    </tr>
                    <tr>
                      <td>기업구분</td>
                      <td colSpan={3}>
                        <MenuInputBox
                          menuType="select"
                          menuSize="150px"
                          selectOption="2025"
                        />
                      </td>
                    </tr>
                    <tr>
                      <td>순번</td>
                      <td colSpan={3}>
                        <MenuInputBox
                          menuType="input"
                          menuSize="380px"
                          placeholder="검색어를 입력하세요."
                        />
                        <span className="onsubinfo">
                          ※ 엑셀파일의 POLICY_INDEX를 입력해 주세요.
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <h4 className="ontableTitle">사업정보</h4>
              <div className="ontableBox">
                <table>
                  <colgroup>
                    <col style={{ width: '180px' }} />
                    <col style={{ width: 'auto' }} />
                    <col style={{ width: 'auto' }} />
                  </colgroup>
                  <tbody>
                    <tr>
                      <td>사업ID</td>
                      <td className="br-right">ABC1234</td>
                      <td className="noneBg">2</td>
                    </tr>
                    <tr>
                      <td>콘텐츠</td>
                      <td colSpan={2}>
                        <div className="oneditcontent" />
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            <div className="onflexbtns">
              <div style={{ marginRight: 'auto' }}>
                <Button btnType="list" btnNames="목록" />
              </div>
              <Button btnType="del" btnNames="삭제" />
              <Button btnType="edit" btnNames="수정" />
              <Button btnType="add" btnNames="등록" />
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
