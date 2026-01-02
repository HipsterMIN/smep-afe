import React, { useState } from 'react';

import Button from '../components/ui/Button';
import FileUpload2 from '../components/ui/FileUpload2';

export default function CommonCode() {
  const onClickDownload = (e) => {
    e.preventDefault();
  }
  return (
    <div className="oncontentbox full">
      <div className="oncontentTitle">
        <h2>증명서 정보 상세조회</h2>
        <ul className="onbreadcrumb">
          <li>증명서 발급 관리</li>
          <li>증명서 정보 관리</li>
          <li>증명서 정보 목록</li>
          <li className="on">증명서 정보 상세조회</li>
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
                  <td>증명서 명</td>
                  <td></td>
                  <td>공개여부</td>
                  <td></td>
                </tr>
                <tr>
                  <td>소관기관</td>
                  <td></td>
                  <td>발급기관</td>
                  <td></td>
                </tr>
                <tr>
                  <td>등록일시</td>
                  <td>2025-03-26 14:32:35</td>
                  <td>최종수정일시</td>
                  <td>2025-03-26 14:32:35</td>
                </tr>
                <tr>
                  <td>직접발급 여부</td>
                  <td></td>
                  <td>전자증명서 대상 여부</td>
                  <td></td>
                </tr>
                <tr>
                  <td>타서비스 링크</td>
                  <td colSpan={3}>
                    <div class="onmenuspace"><span class="onmenunames">서비스명</span><span>XXX</span><span class="onmenunames">링크</span><span>XXX</span></div>
                  </td>
                </tr>
                 <tr>
                  <td>내용(PC)</td>
                  <td colSpan={3}></td>
                </tr>
                 <tr>
                  <td>내용(모바일)</td>
                  <td colSpan={3}></td>
                </tr>
                 <tr>
                  <td>안내문구</td>
                  <td colSpan={3}></td>
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
