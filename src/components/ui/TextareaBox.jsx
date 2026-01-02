// 관리자 화면 - 커스텀 인풋(메뉴) 컴포넌트
export default function MenuInputBox({
  inputId,
  menuName,
  menuSize,
  placeholder,
  height = '200px'
}) {
  return (
    <>
        <div className={`onmenubox${menuSize === '100%' ? ' fullSize' : ''}`}>
          {menuName ? <span className="onmenunames">{menuName}</span> : null}
          <textarea
            placeholder={placeholder}
            style={{ width: menuSize, height }}
          />
        </div>
    </>
  );
}
