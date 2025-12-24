import './Button.css';

import React from 'react';

/**
 * 공공기관 표준 버튼 컴포넌트
 *
 * @param {string} label - 버튼에 표시될 텍스트
 * @param {string} [ariaLabel] - 화면에 텍스트가 없거나 부족할 때 스크린 리더가 읽을 텍스트
 * @param {string} [variant='primary'] - 버튼 스타일 변형 ('primary' | 'secondary')
 * @param {boolean} [disabled=false] - 비활성화 여부
 * @param {function} onClick - 클릭 핸들러
 */
const Button = ({ 
  label, 
  ariaLabel, 
  variant = 'primary', 
  type = 'button', 
  className = '', 
  ...props 
}) => {
  return (
    <button
      type={type}
      className={`ui-button ui-button--${variant} ${className}`}
      aria-label={ariaLabel || label} // aria-label이 없으면 label을 기본값으로 사용
      {...props}
    >
      {label}
    </button>
  );
};

export default Button;