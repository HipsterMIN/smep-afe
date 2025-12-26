// 관리자 화면 - 검색어 입력 컴포넌트
export default function SearchBox({ inputId, placeholder }) {
  return (
    <input
      type="text"
      className="searchBox"
      id={inputId}
      placeholder={placeholder}
    />
  );
}
