// 관리자 화면 - 검색어 입력 컴포넌트
export default function SearchBox({
  inputId, // input의 id 속성
  placeholder, // 플레이스홀더 텍스트
  value, // controlled component 현재 값
  onChange, // 값 변경 시 호출될 핸들러
  onKeyDown, // 키 입력 이벤트 핸들러 (엔터키 처리용)
}) {
  return (
    <input
      type="text"
      className="searchBox"
      id={inputId}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      onKeyDown={onKeyDown}
    />
  );
}
