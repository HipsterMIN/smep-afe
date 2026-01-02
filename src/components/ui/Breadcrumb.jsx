// 관리자 화면 - Breadcrumb 컴포넌트
export default function Breadcrumb({
  path1,
  path2,
  path3,
  active
}) {
  return (
    <ul className="onbreadcrumb">
      <li>{ path1 }</li>
      <li>{ path2 }</li>
      <li className={active && 'on'}>{ path3 }</li>
    </ul>
  )
}
