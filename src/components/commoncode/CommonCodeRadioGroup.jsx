import RadioButton from '@components/ui/RadioButton.jsx';
import { fetchAndConvertCommonCodes } from '@utils/commonUtils.js';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';

/**
 * 공통코드를 조회하여 RadioButton 그룹을 렌더링하는 컴포넌트
 *
 * @param {string} codeGroup - 조회할 공통코드 그룹 (예: 'BBS_TYPE_CD')
 * @param {string} radioGroup - RadioButton 그룹명 (같은 그룹끼리 단일 선택)
 * @param {string} selectedValue - 선택된 값
 * @param {function} onChange - 값 변경 시 호출되는 콜백 함수
 * @param {boolean} disabled - 비활성화 여부, 기본값: false
 * @param {string} className - 추가 CSS 클래스
 */
export default function CommonCodeRadioGroup({
  codeGroup,
  radioGroup,
  selectedValue,
  onChange,
  disabled = false,
  className = '',
}) {
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadCommonCode = async () => {
      try {
        setLoading(true);
        setError(null);
        const codes = await fetchAndConvertCommonCodes([codeGroup]);
        setOptions(codes[codeGroup] || []);
      } catch (err) {
        console.error(`공통코드 조회 실패 (${codeGroup}):`, err);
        setError(`공통코드를 불러오는데 실패했습니다.`);
        setOptions([]);
      } finally {
        setLoading(false);
      }
    };

    if (codeGroup) {
      loadCommonCode();
    }
  }, [codeGroup]);

  if (loading) {
    return (
      <div className={`onradioBox ${className}`}>
        <span style={{ color: '#999' }}>로딩 중...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`onradioBox ${className}`}>
        <span style={{ color: '#ff0000' }}>{error}</span>
      </div>
    );
  }

  if (options.length === 0) {
    return (
      <div className={`onradioBox ${className}`}>
        <span style={{ color: '#999' }}>공통코드가 없습니다.</span>
      </div>
    );
  }

  return (
    <div className={`onradioBox ${className}`}>
      {options.map((option, index) => (
        <RadioButton
          key={option.value}
          groupId={`${radioGroup}_${index}`}
          radioGroup={radioGroup}
          radioValue={option.value}
          radioName={option.label}
          selectedValue={selectedValue}
          onChange={onChange}
          disabled={disabled}
        />
      ))}
    </div>
  );
}

CommonCodeRadioGroup.propTypes = {
  codeGroup: PropTypes.string.isRequired,
  radioGroup: PropTypes.string.isRequired,
  selectedValue: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
  className: PropTypes.string,
};
