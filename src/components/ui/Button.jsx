// 관리자 화면 - Button 컴포넌트
export default function Button({ btnType, btnNames, onClick }) {
  return <button className={`defaultbutton ${btnType}`} onClick={onClick}>{btnNames}</button>;
}
