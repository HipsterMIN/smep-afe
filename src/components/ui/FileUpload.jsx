import React, { useState } from 'react';
import Button from './Button';

export default function FileUpload({ mode = 'view' }) {
    const onClickDownload = (e) => {
      e.preventDefault();
    }
    const onClickDelete = () => {

    }
    return (
      <div className="ondownloadlinkbox">
        <a href="#" className="ondownloadlink" onClick={onClickDownload}>
          <i className="onicon clip"></i>
          별첨파일.hwp(23 KB, 다운로드 0회)
        </a>
        <Button btnType="edit" btnNames="미리보기" />
        {
          mode === "edit" 
          ? <button onClick={onClickDelete}><i className="onicon close"></i> <span className='sr-only'>파일삭제</span></button>
          : null
        }
      </div>
    );
}