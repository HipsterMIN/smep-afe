import { useState } from 'react';

// 관리자 화면 - checkbox 컴포넌트
export default function CheckBox({
                                   chkId,
                                   chkName,
                                   value,
                                   checked = false,
                                   onChange,
                                 }) {
  const handleChange = (e) => {
    if (onChange) {
      onChange({
        value,
        checked: e.target.checked,
        event: e
      });
    }
  };

  return (
      <label htmlFor={chkId} className={`onchkLabel ${checked ? 'checked' : ''}`}>
        <input
            id={chkId}
            type="checkbox"
            value={value}
            checked={checked}
            onChange={handleChange}
        />
        {chkName && <span className="onchkName">{chkName}</span>}
      </label>
  );
}
