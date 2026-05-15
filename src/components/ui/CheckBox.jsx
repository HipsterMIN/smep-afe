import PropTypes from 'prop-types';

// 관리자 화면 - checkbox 컴포넌트
export default function CheckBox({
                                   chkId,
                                   chkName,
                                   value,
                                   checked = false,
                                   disabled = false,
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
            disabled={disabled}
            onChange={handleChange}
        />
        {chkName && <span className="onchkName">{chkName}</span>}
      </label>
  );
}

CheckBox.propTypes = {
  chkId: PropTypes.string.isRequired,
  chkName: PropTypes.string,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  checked: PropTypes.bool,
  disabled: PropTypes.bool,
  onChange: PropTypes.func,
};
