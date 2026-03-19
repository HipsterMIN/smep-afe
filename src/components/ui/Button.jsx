// 관리자 화면 - Button 컴포넌트 변경 전
// export default function Button({ btnType, btnNames, onClick, size }) {
//   return <button className={`defaultbutton ${btnType}${size ? ` ${size}` : ''}`} onClick={onClick}>{btnNames}</button>;
// }


// 관리자 화면 - Button 컴포넌트 변경 후
export default function Button({
  btnType, // 기존 (삭제 필요)
  size, // 기존 (삭제 필요)
  btnNames,
  onClick,
  btnSize,
  bgColor,
  max,
  disabled,
  onStyle
}) {
  return (
    <button
      className={[
        'defaultbutton', // 기존 (삭제 필요)
        btnType, // 기존 (삭제 필요)
        size, // 기존 (삭제 필요)
        'btn',
        btnSize,
        bgColor,
        max,
        disabled && 'disabled'
      ].filter(Boolean).join(' ')}
      onClick={onClick}
      disabled={disabled}
      style={onStyle}
    >
      {btnNames}
    </button>
  );
}