// 관리자 화면 - 커스텀 인풋(메뉴) 컴포넌트
export default function MenuInputBox({
  menuType,
  inputId,
  menuName,
  menuSize = '100px',
  selectOption,
  placeholder,
  value,
  onChange,
  className,
}) {
  return (
    <>
      {menuType === 'input' ? (
        <div className={`onmenubox${menuSize === '100%' ? ' fullSize' : ''}`}>
          {menuName ? <span className="onmenunames">{menuName}</span> : null}
          <input
            type="text"
            placeholder={placeholder}
            style={{ width: menuSize }}
            value={value}
            onChange={onChange}
            className={className}
          />
        </div>
      ) : menuType === 'select' ? (
        <div className={`onmenubox${menuSize === '100%' ? ' fullSize' : ''}`}>
          {menuName ? <span className="onmenunames">{menuName}</span> : null}
          <select name="select" id="" style={{ width: menuSize }}>
            <option value="전체">전체</option>
            <option value={selectOption}>{selectOption}</option>
          </select>
        </div>
      ) : null}
    </>
  );
}
