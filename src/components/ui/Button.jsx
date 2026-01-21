// 관리자 화면 - Button 컴포넌트
export default function Button({ btnType, btnNames, onClick, size }) {
  return <button className={`defaultbutton ${btnType}${size ? ` ${size}` : ''}`} onClick={onClick}>{btnNames}</button>;
}
