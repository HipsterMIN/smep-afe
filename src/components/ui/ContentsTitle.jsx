
// 관리자 화면 - contents Title 컴포넌트
export default function ContentsTitle({ title, children }) {
  return (
    <div className="oncontentTitle">
      <h2>{ title }</h2>
      { children }
    </div>
  )
}
