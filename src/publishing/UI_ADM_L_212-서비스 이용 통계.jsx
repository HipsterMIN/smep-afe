import { useState } from 'react';

export default function CommonCode() {

  return (
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
       컨텐츠
      </div>
    </div>
  );
}
