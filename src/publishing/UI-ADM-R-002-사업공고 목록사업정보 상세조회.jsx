import React, { useState } from 'react';

import Button from '../components/ui/Button';

export default function CommonCode() {
  const onClickDownload = (e) => {
    e.preventDefault();
  }
  return (
    <div className="oncontentbox full">
      <div className="oncontentTitle">
        <h2>사업정보 상세조회</h2>
        <ul className="onbreadcrumb">
          <li>지원사업 관리</li>
          <li>사업공고 관리</li>
          <li>사업정보 관리</li>
          <li>사업정보 목록</li>
          <li className="on">사업정보 상세조회</li>
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
                  <td>2025</td>
                  <td>공개여부</td>
                  <td>비공개</td>
                </tr>
                <tr>
                  <td>등록일시</td>
                  <td>2025-03-26 14:32:35</td>
                  <td>최종수정일시</td>
                  <td>2025-03-26 14:32:35</td>
                </tr>
                <tr>
                  <td>사업유형(정책분류)</td>
                  <td></td>
                  <td>지원기관</td>
                  <td>중소벤처기업부</td>
                </tr>
                <tr>
                  <td>기업구분</td>
                  <td colSpan={3}>중소기업</td>
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
              </colgroup>
              <tbody>
                <tr>
                  <td>사업명</td>
                  <td></td>
                </tr>
                <tr>
                  <td>사업개요</td>
                  <td></td>
                </tr>
              </tbody>
            </table>
          </div>

          <h4 className="ontableTitle">사업개요</h4>
          <div className="ontableBox">
            <table>
              <colgroup>
                <col style={{ width: '180px' }} />
                <col style={{ width: 'auto' }} />
              </colgroup>
              <tbody>
                <tr>
                  <td>지원규모</td>
                  <td></td>
                </tr>
                <tr>
                  <td>지원대상</td>
                  <td></td>
                </tr>
                <tr>
                  <td>비지원대상</td>
                  <td></td>
                </tr>
                <tr>
                  <td>지원내용</td>
                  <td></td>
                </tr>
              </tbody>
            </table>
          </div>

          <h4 className="ontableTitle">신청 절차</h4>
          <div className="ontableBox">
            <table>
              <colgroup>
                <col style={{ width: '180px' }} />
                <col style={{ width: 'auto' }} />
              </colgroup>
              <tbody>
                <tr>
                  <td>신청접수</td>
                  <td></td>
                </tr>
                <tr>
                  <td>신청시기</td>
                  <td></td>
                </tr>
                <tr>
                  <td>제출서류</td>
                  <td></td>
                </tr>
                <tr>
                  <td>처리절차</td>
                  <td></td>
                </tr>
                <tr>
                  <td>심사평가내용</td>
                  <td></td>
                </tr>
                <tr>
                  <td>첨부파일</td>
                  <td>
                    <div className="onflex onflexcolumn">
                      <div className="ondownloadlinkbox">
                        <a href="#" className="ondownloadlink" onClick={onClickDownload}>별첨파일.hwp(23 KB, 다운로드 0회)</a>
                        <Button btnType="edit" btnNames="미리보기" />          
                      </div>
                      <div className="ondownloadlinkbox">
                        <a href="#" className="ondownloadlink" onClick={onClickDownload}>별첨파일.hwp(23 KB, 다운로드 0회)</a>
                        <Button btnType="edit" btnNames="미리보기" />          
                      </div>
                      <div className="ondownloadlinkbox">
                        <a href="#" className="ondownloadlink" onClick={onClickDownload}>별첨파일.hwp(23 KB, 다운로드 0회)</a>
                        <Button btnType="edit" btnNames="미리보기" />          
                      </div>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <h4 className="ontableTitle">문의처</h4>
          <div className="ontableBox">
            <table>
              <colgroup>
                <col style={{ width: '180px' }} />
                <col style={{ width: 'auto' }} />
              </colgroup>
              <tbody>
                <tr>
                  <td>문의처</td>
                  <td></td>
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
                  <td></td>
                </tr>
                <tr>
                  <td>업력</td>
                  <td></td>
                </tr>
                <tr>
                  <td>근로자 수</td>
                  <td></td>
                </tr>
                <tr>
                  <td>매출액</td>
                  <td></td>
                </tr>
                <tr>
                  <td>인증</td>
                  <td></td>
                </tr>
                <tr>
                  <td>기업소재지</td>
                  <td></td>
                </tr>
              </tbody>
            </table>
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
