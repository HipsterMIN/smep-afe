// 관리자 화면 - 커스텀 textarea 컴포넌트
export default function TextareaBox({
  inputId,          // textarea id
  menuName,         // 라벨명
  menuSize = '100%',// width
  height = '200px', // height
  placeholder,      // placeholder
  value,            // controlled value
  onChange,         // 변경 핸들러
  maxLength,        // 최대 글자수 (선택)
  disabled = false, // 비활성화 여부
}) {
  const handleChange = (e) => {
    if (onChange) onChange(e);
  };
  return (
    <div className={`onmenubox${menuSize === '100%' ? ' fullSize' : ''}`}>
      {menuName ? (
          <span className="onmenunames">{menuName}</span>
      ) : null}
      <textarea
          id={inputId}
          name={inputId}
          placeholder={placeholder}
          style={{width: menuSize, height}}
          value={value ?? ''}          // controlled 보장
          onChange={handleChange}
          maxLength={maxLength}
          disabled={disabled}
      />
    </div>
  );
}
