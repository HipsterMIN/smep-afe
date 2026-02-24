import Button from '@components/ui/Button';
import React, { useState } from 'react';

export default function PolicyFinanceDetail() {
  const onClickDownload = (e) => {
    e.preventDefault();
  };
  return (
    <div className="oncontentbox full">
      <div className="oncontentTitle">
        <h2>정책금융 상세조회</h2>
        <ul className="onbreadcrumb">
          <li>지원사업 관리</li>
          <li>사업공고 관리</li>
          <li>정책금융 관리</li>
          <li>정책금융 목록</li>
          <li className="on">정책금융 상세조회</li>
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
                  <td>승인여부</td>
                  <td></td>
                  <td>접수상황</td>
                  <td></td>
                </tr>
                <tr>
                  <td>사업수행기관</td>
                  <td></td>
                  <td>상품명</td>
                  <td></td>
                </tr>
                <tr>
                  <td>상품목적</td>
                  <td colSpan={3}></td>
                </tr>
                <tr>
                  <td>지원대상</td>
                  <td colSpan={3}></td>
                </tr>
                <tr>
                  <td>우대조건</td>
                  <td></td>
                  <td>보증한도</td>
                  <td></td>
                </tr>
                <tr>
                  <td>우대조건</td>
                  <td></td>
                  <td>보증한도</td>
                  <td></td>
                </tr>
                <tr>
                  <td>보증비율</td>
                  <td></td>
                  <td>보증료율 감면</td>
                  <td></td>
                </tr>
                <tr>
                  <td>지원대상자금</td>
                  <td></td>
                  <td>신청방식</td>
                  <td></td>
                </tr>
                <tr>
                  <td>보증제한대상</td>
                  <td colSpan={3}></td>
                </tr>
                <tr>
                  <td>관할지역</td>
                  <td colSpan={3}></td>
                </tr>
                <tr>
                  <td>문의</td>
                  <td colSpan={3}></td>
                </tr>
                <tr>
                  <td>신청기간(일시)</td>
                  <td colSpan={3}></td>
                </tr>
                <tr>
                  <td>상세URL</td>
                  <td colSpan={3}></td>
                </tr>
                <tr>
                  <td>문의URL</td>
                  <td colSpan={3}></td>
                </tr>
                <tr>
                  <td>신청URL</td>
                  <td colSpan={3}></td>
                </tr>
                <tr>
                  <td>첨부파일URL</td>
                  <td colSpan={3}></td>
                </tr>
                <tr>
                  <td>해시태그</td>
                  <td colSpan={3}></td>
                </tr>
                <tr>
                  <td>기업규모</td>
                  <td></td>
                  <td>업종</td>
                  <td></td>
                </tr>
                <tr>
                  <td>우대기업 유형</td>
                  <td></td>
                  <td>상품종류</td>
                  <td></td>
                </tr>
                <tr>
                  <td>기업규모요약</td>
                  <td></td>
                  <td>지원대상자금(용도)요약</td>
                  <td></td>
                </tr>
                <tr>
                  <td>보증비율요약코드</td>
                  <td></td>
                  <td>보증비율요약</td>
                  <td></td>
                </tr>
                <tr>
                  <td>등록자</td>
                  <td></td>
                  <td>등록일시</td>
                  <td></td>
                </tr>
                <tr>
                  <td>수정자</td>
                  <td></td>
                  <td>최종 수정일시</td>
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
